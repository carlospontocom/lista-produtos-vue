<template>
  <div class="container">
    <div class="card">
      <h1>Cadastrar Usuário</h1>

      <div v-if="erroServidor" class="msg-erro-servidor" style="color: red; background: #fdf2f2; padding: 10px; margin-bottom: 15px; border-radius: 5px;">
        <p><strong>❌ Erro no Servidor:</strong></p>
        <p style="font-family: monospace;">{{ erroServidor }}</p>
      </div>

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

      <div class="msg-sucesso" v-if="sucesso" style="color: green;">
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
const erroServidor = ref(''); // Armazena o erro real do back-end

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
  erroServidor.value = ''
}

const cadastrar = async () => {
  sucesso.value = false
  erroServidor.value = ''
  
  if (!validarTudo()) return

  carregando.value = true
  try {
   // Substitua a linha do axios.post por essa (com a sua URL real):
await axios.post(`https://lista-produtos-vue.onrender.com/usuarios`, {
  nome: form.value.nome,
  email: form.value.email,
  data_nascimento: form.value.data_nascimento,
  senha: form.value.senha
})
    sucesso.value = true
    limparFormulario()
  } catch (e) {
    // Captura a resposta detalhada criada na rota POST do Express
    if (e.response && e.response.data) {
      const data = e.response.data;
      erroServidor.value = data.mensagemReal || data.error || JSON.stringify(data);
    } else {
      erroServidor.value = `Não foi possível conectar ao servidor: ${e.message}`;
    }
    console.error("Log completo do erro:", e.response?.data || e);
  } finally {
    carregando.value = false
  }
};
</script>