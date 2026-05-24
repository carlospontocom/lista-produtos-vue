<template>
  <div class="cadastro-container">
    <h2>Criar Nova Conta</h2>
    
    <form @submit.prevent="handleCadastro">
      <div class="form-group">
        <label>Nome Completo:</label>
        <input type="text" v-model="usuario.nome" required placeholder="Digite seu nome">
      </div>

      <div class="form-group">
        <label>E-mail:</label>
        <input type="email" v-model="usuario.email" required placeholder="seu@email.com">
      </div>

      <div class="form-group">
        <label>Data de Nascimento:</label>
        <input type="date" v-model="usuario.data_nascimento" required>
      </div>

      <div class="form-group">
        <label>Senha:</label>
        <input type="password" v-model="usuario.senha" required placeholder="Mínimo 6 caracteres">
      </div>

      <button type="submit" :disabled="carregando">
        {{ carregando ? 'Cadastrando...' : 'Cadastrar' }}
      </button>
    </form>

    <p v-if="mensagemErro" class="erro">{{ mensagemErro }}</p>
    <p v-if="mensagemSucesso" class="sucesso">{{ mensagemSucesso }}</p>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import axios from 'axios';

// Dados do formulário
const usuario = reactive({
  nome: '',
  email: '',
  senha: '',
  data_nascimento: ''
});

// Estados
const carregando = ref(false);
const mensagemErro = ref('');
const mensagemSucesso = ref('');

// URL da API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Função de cadastro
const handleCadastro = async () => {
  carregando.value = true;
  mensagemErro.value = '';
  mensagemSucesso.value = '';

  try {
    const resposta = await axios.post(`${API_URL}/usuarios`, usuario);

    if (resposta.status === 201) {
      mensagemSucesso.value = 'Cadastro realizado com sucesso!';
      
      // Limpa o formulário
      usuario.nome = '';
      usuario.email = '';
      usuario.senha = '';
      usuario.data_nascimento = '';
      
      // Limpa mensagem após 3 segundos
      setTimeout(() => {
        mensagemSucesso.value = '';
      }, 3000);
    }
  } catch (error) {
    console.error('Erro:', error);
    
    if (error.response?.status === 409) {
      mensagemErro.value = 'Este email já está cadastrado!';
    } else if (error.response?.status === 400) {
      mensagemErro.value = error.response.data.error || 'Dados inválidos. Verifique os campos.';
    } else if (error.code === 'ERR_NETWORK') {
      mensagemErro.value = 'Erro de conexão com o servidor. Verifique se o backend está rodando.';
    } else {
      mensagemErro.value = error.response?.data?.error || 'Erro ao realizar o cadastro. Tente novamente.';
    }
    
    setTimeout(() => {
      mensagemErro.value = '';
    }, 3000);
  } finally {
    carregando.value = false;
  }
};
</script>

<style scoped>
h2{
  font-size:2.4rem;
  text-align:center;
  padding: 1rem;
}
.cadastro-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}
.form-group label {
  color:#00000080;
  font-weight: normal;
  font-size:12px;
  margin: .5rem 0 0 0;
}
.form-group input {
  padding: 14px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}
button:disabled {
  background-color: #95d5b2;
}
.erro { 
  color: red; 
  margin-top: 10px; 
  font-size: 14px;
  text-align: center;
}
.sucesso { 
  color: green; 
  margin-top: 10px; 
  font-size: 14px;
  text-align: center;
}
</style>