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

<script>
import axios from 'axios';

export default {
  name: 'CadastroUsuario',
  data() {
    return {
      usuario: {
        nome: '',
        email: '',
        senha: '',
        data_nascimento: ''
      },
      carregando: false,
      mensagemErro: '',
      mensagemSucesso: ''
    };
  },
  methods: {
    async handleCadastro() {
      this.carregando = true;
      this.mensagemErro = '';
      this.mensagemSucesso = '';

      try {
        // Envia os dados direto para a rota do seu Node.js
        // O Node vai se encargar de criar no Firebase e salvar no TiDB
        const resposta = await axios.post('http://localhost:5000/usuarios', this.usuario);

        if (resposta.status === 201) {
          this.mensagemSucesso = 'Cadastro realizado com sucesso!';
          // Limpa o formulário após o sucesso
          this.usuario = { nome: '', email: '', senha: '', data_nascimento: '' };
        }
      } catch (error) {
        // Pega o erro retornado pelo Node (ex: "email already in use")
        this.mensagemErro = error.response?.data?.error || 'Erro ao realizar o cadastro. Tente novamente.';
      } finally {
        this.carregando = false;
      }
    }
  }
};
</script>

<style scoped>
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
.erro { color: red; margin-top: 10px; }
.sucesso { color: green; margin-top: 10px; }
</style>