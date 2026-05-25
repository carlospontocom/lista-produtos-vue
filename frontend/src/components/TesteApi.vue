<template>
  <div class="container">
    <div class="header-search">
      <h1>Usuários</h1>
      <input
        type="text"
        placeholder="Digite nome ou email para pesquisar..."
        v-model="nomeFuncionario"
      />
    </div>

    <div v-if="carregando" class="carregando">Carregando...</div>
    <div v-if="erro" class="erro">Erro: {{ erro }}</div>

    <div
      v-if="!carregando && nomeFuncionario && usuariosFiltrados.length === 0"
      class="nao-encontrado"
    >
      Não encontrado: <strong>{{ nomeFuncionario }}</strong>
    </div>

    <div class="grid" v-if="usuariosFiltrados.length">
      <div
        class="cracha"
        v-for="usuario in usuariosFiltrados"
        :key="usuario.id"
      >
        <div class="avatar">
          {{ iniciais(usuario.nome) }}
        </div>
        <div class="info">
          <h2>{{ usuario.nome }}</h2>
          <span class="email">{{ usuario.email }}</span>
        </div>
        <div class="divider"></div>
        <div class="detalhes">
          <p><span>🎂</span> {{ formatarData(usuario.data_nascimento) }}</p>
        </div>
        <div class="badge">ID #{{ usuario.id }}</div>
        <div class="acoes">
          <button class="btn-editar" @click="editarUsuario(usuario)">
            <span class="material-symbols-outlined">edit</span>
          </button>
          <button class="btn-deletar" @click="deletarUsuario(usuario.id)">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="modalAberto" class="modal">
      <div class="modal-content">
        <h2>Editar Usuário</h2>
        <form @submit.prevent="atualizarUsuario">
          <div class="form-group">
            <label>Nome:</label>
            <input type="text" v-model="formUsuario.nome" required />
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input type="email" v-model="formUsuario.email" required />
          </div>
          <div class="form-group">
            <label>Data de Nascimento:</label>
            <input type="date" v-model="formUsuario.data_nascimento" />
          </div>
          <div class="modal-acoes">
            <button type="button" @click="fecharModal">Cancelar</button>
            <button type="submit">Salvar Alterações</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

// Estado
const nomeFuncionario = ref("");
const usuarios = ref([]);
const carregando = ref(false);
const erro = ref(null);
const modalAberto = ref(false);
const formUsuario = ref({
  id: null,
  nome: "",
  email: "",
  data_nascimento: ""
});

// Filtro de pesquisa por Nome ou Email
const usuariosFiltrados = computed(() => {
  if (!nomeFuncionario.value.trim()) return usuarios.value;
  const termo = nomeFuncionario.value.toLowerCase();
  return usuarios.value.filter((u) =>
    `${u.nome} ${u.email}`.toLowerCase().includes(termo)
  );
});

// Métodos Auxiliares de Interface
const iniciais = (nome) => {
  if (!nome) return "?";
  return nome
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

const formatarData = (data) => {
  if (!data) return "Não informado";
  const dataLocal = new Date(data);
  dataLocal.setMinutes(dataLocal.getMinutes() + dataLocal.getTimezoneOffset());
  return dataLocal.toLocaleDateString("pt-BR");
};

// Requisições à API (Node.js / Express)
const carregarUsuarios = async () => {
  carregando.value = true;
  erro.value = null;
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/usuarios`);
    usuarios.value = response.data;
  } catch (error) {
    erro.value = error.response?.data?.error || error.message;
    console.error("Erro ao carregar usuários:", error);
  } finally {
    carregando.value = false;
  }
};

const deletarUsuario = async (id) => {
  if (!confirm("Tem certeza que deseja deletar este usuário?")) return;
  
  try {
    const response = await axios.delete(`${import.meta.env.VITE_API_URL}/usuarios/${id}`);
    if (response.status === 200) {
      await carregarUsuarios();
      alert("Usuário deletado com sucesso!");
    }
  } catch (e) {
    const msgErro = e.response?.data?.error || e.message;
    alert("Erro ao deletar: " + msgErro);
  }
};

const editarUsuario = (usuario) => {
  let dataFormatada = "";
  if (usuario.data_nascimento) {
    dataFormatada = new Date(usuario.data_nascimento).toISOString().split('T')[0];
  }

  formUsuario.value = {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    data_nascimento: dataFormatada
  };
  modalAberto.value = true;
};

const atualizarUsuario = async () => {
  try {
    await axios.put(`${import.meta.env.VITE_API_URL}/usuarios/${formUsuario.value.id}`, {
      nome: formUsuario.value.nome,
      email: formUsuario.value.email
    });
    alert("Usuário atualizado com sucesso!");
    fecharModal();
    await carregarUsuarios();
  } catch (e) {
    const msgErro = e.response?.data?.mensagemReal || e.response?.data?.error || e.message;
    alert("Erro ao salvar: " + msgErro);
  }
};

const fecharModal = () => {
  modalAberto.value = false;
  formUsuario.value = {
    id: null,
    nome: "",
    email: "",
    data_nascimento: ""
  };
};

// Ciclo de Vida
onMounted(() => {
  carregarUsuarios();
});
</script>


<style scoped>
.cracha{
  border:3px solid red;
}
</style>
