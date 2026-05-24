<template>
  <div class="container">
    <div class="card">
      <h1>Cadastrar Usuário</h1>

      <div class="campo">
        <label>Nome</label>
        <input
          type="text"
          v-model="form.nome"
          @blur="validarCampo('nome')"
          :class="{ erro: erros.nome }"
          placeholder="Digite seu nome completo"
        />
        <span class="msg-erro" v-if="erros.nome">{{ erros.nome }}</span>
      </div>

      <div class="campo">
        <label>Email</label>
        <input
          type="email"
          v-model="form.email"
          @blur="validarCampo('email')"
          :class="{ erro: erros.email }"
          placeholder="Digite seu email"
        />
        <span class="msg-erro" v-if="erros.email">{{ erros.email }}</span>
      </div>

      <div class="campo">
        <label>Data de Nascimento</label>
        <input
          type="date"
          v-model="form.data_nascimento"
          @blur="validarCampo('data_nascimento')"
          :class="{ erro: erros.data_nascimento }"
        />
        <span class="msg-erro" v-if="erros.data_nascimento">{{ erros.data_nascimento }}</span>
      </div>

      <div class="campo">
        <label>Senha</label>
        <input
          type="password"
          v-model="form.senha"
          @blur="validarCampo('senha')"
          :class="{ erro: erros.senha }"
          placeholder="Mínimo 6 caracteres"
        />
        <span class="msg-erro" v-if="erros.senha">{{ erros.senha }}</span>
      </div>

      <div class="campo">
        <label>Confirmar Senha</label>
        <input
          type="password"
          v-model="form.confirmarSenha"
          @blur="validarCampo('confirmarSenha')"
          :class="{ erro: erros.confirmarSenha }"
          placeholder="Repita a senha"
        />
        <span class="msg-erro" v-if="erros.confirmarSenha">{{ erros.confirmarSenha }}</span>
      </div>

      <div class="msg-sucesso" v-if="sucesso">
        ✅ Usuário cadastrado com sucesso!
      </div>

      <button @click="cadastrar" :disabled="carregando">
        {{ carregando ? 'Cadastrando...' : 'Cadastrar' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const carregando = ref(false);
const sucesso = ref(false);

const form = ref({
  nome: '',
  email: '',
  data_nascimento: '',
  senha: '',
  confirmarSenha: ''
});

const erros = ref({
  nome: '',
  email: '',
  data_nascimento: '',
  senha: '',
  confirmarSenha: ''
});

const validarCampo = (campo) => {
  erros.value[campo] = '';

  if (campo === 'nome') {
    if (!form.value.nome.trim())
      erros.value.nome = 'Nome é obrigatório.'
    else if (form.value.nome.trim().length < 3)
      erros.value.nome = 'Nome deve ter pelo menos 3 caracteres.'
  }

  if (campo === 'email') {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!form.value.email.trim())
      erros.value.email = 'Email é obrigatório.'
    else if (!regex.test(form.value.email))
      erros.value.email = 'Email inválido.'
  }

  if (campo === 'data_nascimento') {
    if (!form.value.data_nascimento)
      erros.value.data_nascimento = 'Data de nascimento é obrigatória.'
    else {
      const hoje = new Date()
      const nascimento = new Date(form.value.data_nascimento)
      const idade = hoje.getFullYear() - nascimento.getFullYear()
      if (idade < 18)
        erros.value.data_nascimento = 'Você deve ter pelo menos 18 anos.'
    }
  }

  if (campo === 'senha') {
    if (!form.value.senha)
      erros.value.senha = 'Senha é obrigatória.'
    else if (form.value.senha.length < 6)
      erros.value.senha = 'Senha deve ter pelo menos 6 caracteres.'
  }

  if (campo === 'confirmarSenha') {
    if (!form.value.confirmarSenha)
      erros.value.confirmarSenha = 'Confirmação de senha é obrigatória.'
    else if (form.value.confirmarSenha !== form.value.senha)
      erros.value.confirmarSenha = 'As senhas não coincidem.'
  }
};

const validarTudo = () => {
  ['nome', 'email', 'data_nascimento', 'senha', 'confirmarSenha'].forEach(validarCampo)
  return !Object.values(erros.value).some(e => e !== '')
}

const limparFormulario = () => {
  form.value = { nome: '', email: '', data_nascimento: '', senha: '', confirmarSenha: '' }
  erros.value = { nome: '', email: '', data_nascimento: '', senha: '', confirmarSenha: '' }
}

const cadastrar = async () => {
  sucesso.value = false
  if (!validarTudo()) return

  carregando.value = true
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/usuarios`, {
      nome: form.value.nome,
      email: form.value.email,
      data_nascimento: form.value.data_nascimento,
      senha: form.value.senha
    })
    sucesso.value = true
    limparFormulario()
  } catch (e) {
    erros.value.email = 'Erro ao cadastrar. Tente novamente.'
  } finally {
    carregando.value = false
  }
};
</script>

<style scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }

.container {
  font-family: 'Segoe UI', sans-serif;
  min-height: 100vh;
  background: #f4f6f9;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
}

h1 {
  font-size: 1.5rem;
  color: #2c3e50;
  border-left: 4px solid #4fc08d;
  padding-left: 12px;
  margin-bottom: 1.5rem;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 1rem;
}

label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #444;
}

input {
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #4fc08d;
}

input.erro {
  border-color: #e74c3c;
}

.msg-erro {
  font-size: 0.78rem;
  color: #e74c3c;
}

.msg-sucesso {
  font-size: 0.9rem;
  color: #27ae60;
  background: #eafaf1;
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 1rem;
}

button {
  width: 100%;
  padding: 12px;
  background: #4fc08d;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 0.5rem;
}

button:hover:not(:disabled) {
  background: #3da876;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>