<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Acessar o Sistema</h2>
      <p class="subtitle">Insira suas credenciais para continuar</p>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">E-mail</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            placeholder="seu@email.com"
            :class="{ 'input-error': emailError }"
            @input="validateEmail"
          />
          <span v-if="emailError" class="error-message">{{ emailError }}</span>
        </div>

        <div class="form-group">
          <label for="password">Senha</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            placeholder="Sua senha"
            :class="{ 'input-error': passwordError }"
            @input="validatePassword"
          />
          <span v-if="passwordError" class="error-message">{{ passwordError }}</span>
        </div>

        <div v-if="firebaseError" class="alert-error">
          {{ firebaseError }}
        </div>

        <button type="submit" :disabled="isLoading || hasErrors">
          <span v-if="isLoading">Carregando...</span>
          <span v-else>Entrar</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

import { auth } from '../firebase/firebase.js';

const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)

// Estados dos campos
const email = ref('')
const password = ref('')
const isLoading = ref(false)

// Estados de erro
const emailError = ref('')
const passwordError = ref('')
const firebaseError = ref('')

// const router = useRouter() // Instância do router

// Validação em tempo real (Frontend)
const validateEmail = () => {
  firebaseError.value = '' // Limpa erro global ao digitar
  if (!email.value) {
    emailError.value = 'O e-mail é obrigatório.'
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    emailError.value = 'Insira um e-mail válido.'
  } else {
    emailError.value = ''
  }
}

const validatePassword = () => {
  firebaseError.value = '' // Limpa erro global ao digitar
  if (!password.value) {
    passwordError.value = 'A senha é obrigatória.'
  } else if (password.value.length < 6) {
    passwordError.value = 'A senha deve ter pelo menos 6 caracteres.'
  } else {
    passwordError.value = ''
  }
}

// Bloqueia o botão se houver erros pendentes ou campos vazios
const hasErrors = computed(() => {
  return !!emailError.value || !!passwordError.value || !email.value || !password.value
})

// Função que dispara o Login no Firebase
const handleLogin = async () => {
  // Força uma última validação antes de enviar
  validateEmail()
  validatePassword()

  if (hasErrors.value) return

  isLoading.value = true
  firebaseError.value = ''

  const auth = getAuth()

  try {
    // Comunicação com o Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user

    // Pega o Token JWT gerado para mandar para a sua API Node.js
    const token = await user.getIdToken()
    console.log('Token JWT pronto para a sua API:', token)
    
    // Salve o token onde preferir (ex: localStorage, Pinia store, ou cookies)
    localStorage.setItem('token', token)

    alert('Login efetuado com sucesso!')
    // router.push('/dashboard') // Redireciona o usuário para a tela interna

  } catch (error) {
    console.error('Erro Firebase:', error.code)
    
    // Tratamento amigável de erros do Firebase
    switch (error.code) {
      case 'auth/invalid-credential':
        firebaseError.value = 'E-mail ou senha incorretos.'
        break
      case 'auth/user-not-found':
        firebaseError.value = 'Usuário não cadastrado.'
        break
      case 'auth/wrong-password':
        firebaseError.value = 'Senha incorreta.'
        break
      case 'auth/too-many-requests':
        firebaseError.value = 'Acesso bloqueado temporariamente por excesso de tentativas.'
        break
      default:
        firebaseError.value = 'Ocorreu um erro ao tentar fazer login. Tente novamente.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fb;
  font-family: sans-serif;
}

.login-card {
  background: #ffffff;
  padding: 2.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  margin-bottom: 0.5rem;
  color: #333;
  text-align: center;
}

.subtitle {
  color: #666;
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
}

label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #444;
  margin-bottom: 0.5rem;
}

input {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #3b82f6;
}

.input-error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.4rem;
}

.alert-error {
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
  margin-bottom: 1.5rem;
  text-align: center;
  border: 1px solid #fca5a5;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover:not(:disabled) {
  background-color: #2563eb;
}

button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}
</style>