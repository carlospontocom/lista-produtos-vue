<template>
  <div class="login-container">
    <div class="login-box">
      <!-- Lado esquerdo - Ilustração -->
      <div class="login-left">
        <div class="hero-content">
          <div class="logo">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Logo</span>
          </div>
          <h1>Bem-vindo de volta</h1>
          <p>Entre para acessar sua conta e explorar todas as funcionalidades</p>
        </div>
      </div>

      <!-- Lado direito - Formulário -->
      <div class="login-right">
        <div class="form-wrapper">
          <div class="form-header">
            <h2>Login</h2>
            <p>Preencha seus dados para continuar</p>
          </div>

          <form @submit.prevent="handleLogin" class="login-form">
            <!-- Campo E-mail -->
            <div class="input-group">
              <div class="input-icon">
                <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M22 6L12 13L2 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="input-field">
                <input 
                  type="email" 
                  v-model="email" 
                  placeholder=" "
                  required
                />
                <label>E-mail</label>
              </div>
            </div>

            <!-- Campo Senha -->
            <div class="input-group">
              <div class="input-icon">
                <svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 17V15M8 11V7C8 4.79 9.79 3 12 3C14.21 3 16 4.79 16 7V11M6 21H18C19.1 21 20 20.1 20 19V13C20 11.9 19.1 11 18 11H6C4.9 11 4 11.9 4 13V19C4 20.1 4.9 21 6 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="input-field">
                <input 
                  :type="showPassword ? 'text' : 'password'"
                  v-model="senha" 
                  placeholder=" "
                  required
                />
                <label>Senha</label>
                <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                  <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.9 4.24C10.58 4.08 11.28 4 12 4C19 4 23 12 23 12C22.57 12.73 22.09 13.42 21.56 14.06M15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868M3 3L21 21M12 20C10.59 20 9.23 19.7 7.96 19.12M4.44 16.56C3.55 15.58 2.83 14.44 2.31 13.21L2 12C2 12 5 4 12 4C12.29 4 12.57 4.02 12.85 4.05" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Opções -->
            <div class="form-options">
              <label class="checkbox">
                <input type="checkbox" v-model="rememberMe" />
                <span>Lembrar-me</span>
              </label>
              <a href="#" class="forgot-link">Esqueceu a senha?</a>
            </div>

            <!-- Botão -->
            <button type="submit" class="submit-btn" :disabled="loading">
              <span v-if="loading">Entrando...</span>
              <span v-else>Entrar</span>
            </button>

            <!-- Cadastro -->
            <div class="register-link">
              <span>Não tem uma conta?</span>
              <a href="#" @click.prevent="goToRegister">Criar conta</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const senha = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const loading = ref(false)

const handleLogin = () => {
  loading.value = true
  
  // Simular loading
  setTimeout(() => {
    console.log('Login:', email.value, senha.value)
    loading.value = false
  }, 1500)
}

const goToRegister = () => {
  console.log('Ir para cadastro')
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-box {
  display: flex;
  max-width: 1200px;
  width: 100%;
  background: white;
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Lado esquerdo */
.login-left {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.login-left::before {
  content: '';
  position: absolute;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 1%, transparent 1%);
  background-size: 50px 50px;
  animation: moveDots 20s linear infinite;
}

@keyframes moveDots {
  from {
    transform: translate(0, 0);
  }
  to {
    transform: translate(50px, 50px);
  }
}

.hero-content {
  position: relative;
  z-index: 1;
  color: white;
  text-align: center;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 40px;
  font-size: 24px;
  font-weight: 600;
}

.logo svg {
  color: white;
}

.hero-content h1 {
  font-size: 36px;
  margin-bottom: 16px;
  font-weight: 700;
}

.hero-content p {
  font-size: 16px;
  opacity: 0.9;
  line-height: 1.6;
}

/* Lado direito */
.login-right {
  flex: 1;
  padding: 60px 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}

.form-wrapper {
  width: 100%;
  max-width: 400px;
}

.form-header {
  text-align: center;
  margin-bottom: 40px;
}

.form-header h2 {
  font-size: 32px;
  color: #1a202c;
  margin-bottom: 8px;
  font-weight: 700;
}

.form-header p {
  color: #718096;
  font-size: 14px;
}

/* Inputs modernos */
.input-group {
  margin-bottom: 28px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
}

.input-icon {
  color: #a0aec0;
  transition: color 0.3s ease;
}

.input-group:focus-within .input-icon {
  color: #667eea;
}

.input-field {
  flex: 1;
  position: relative;
}

.input-field input {
  width: 100%;
  padding: 12px 0;
  font-size: 16px;
  border: none;
  border-bottom: 2px solid #e2e8f0;
  outline: none;
  background: transparent;
  transition: all 0.3s ease;
}

.input-field input:focus {
  border-bottom-color: #667eea;
}

.input-field label {
  position: absolute;
  left: 0;
  top: 12px;
  color: #a0aec0;
  font-size: 16px;
  pointer-events: none;
  transition: all 0.3s ease;
}

.input-field input:focus ~ label,
.input-field input:not(:placeholder-shown) ~ label {
  top: -12px;
  font-size: 12px;
  color: #667eea;
}

.toggle-password {
  position: absolute;
  right: 0;
  top: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: #a0aec0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
}

.toggle-password:hover {
  color: #667eea;
}

/* Opções */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  font-size: 14px;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #4a5568;
}

.checkbox input {
  cursor: pointer;
}

.forgot-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: #764ba2;
}

/* Botão submit */
.submit-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.submit-btn:hover::before {
  width: 300px;
  height: 300px;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Link de cadastro */
.register-link {
  text-align: center;
  margin-top: 28px;
  padding-top: 28px;
  border-top: 1px solid #e2e8f0;
  color: #4a5568;
  font-size: 14px;
}

.register-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  margin-left: 8px;
  transition: color 0.3s ease;
}

.register-link a:hover {
  color: #764ba2;
}

/* Responsivo */
@media (max-width: 968px) {
  .login-box {
    flex-direction: column;
    max-width: 500px;
  }
  
  .login-left {
    padding: 40px;
  }
  
  .hero-content h1 {
    font-size: 28px;
  }
  
  .login-right {
    padding: 40px 30px;
  }
}

@media (max-width: 480px) {
  .login-right {
    padding: 30px 20px;
  }
  
  .form-header h2 {
    font-size: 28px;
  }
}
</style>