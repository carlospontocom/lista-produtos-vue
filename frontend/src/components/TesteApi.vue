<template>
  <div class="container">
    <div class="header-search">
      <h1>Usuários</h1>
      <input
        type="text"
        placeholder="Digite nome ou email"
        v-model="nomeFuncionario"
      />
      <button class="btn-novo" @click="abrirModalCadastro">+ Novo Usuário</button>
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
          <button class="btn-deletar" @click="deletarUsuario(usuario.id_firebase)">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Cadastro/Edição -->
    <div v-if="modalAberto" class="modal">
      <div class="modal-content">
        <h2>{{ modalTitulo }}</h2>
        <form @submit.prevent="salvarUsuario">
          <div class="form-group">
            <label>Nome:</label>
            <input type="text" v-model="formUsuario.nome" required />
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input type="email" v-model="formUsuario.email" required />
          </div>
          <div class="form-group" v-if="!editando">
            <label>Senha:</label>
            <input type="password" v-model="formUsuario.senha" required />
          </div>
          <div class="form-group">
            <label>Data de Nascimento:</label>
            <input type="date" v-model="formUsuario.data_nascimento" />
          </div>
          <div class="modal-acoes">
            <button type="button" @click="fecharModal">Cancelar</button>
            <button type="submit">Salvar</button>
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
const editando = ref(false);
const formUsuario = ref({
  id: null,
  id_firebase: null,
  nome: "",
  email: "",
  senha: "",
  data_nascimento: ""
});

// Computed
const modalTitulo = computed(() => editando.value ? "Editar Usuário" : "Novo Usuário");

const usuariosFiltrados = computed(() => {
  if (!nomeFuncionario.value.trim()) return usuarios.value;
  const termo = nomeFuncionario.value.toLowerCase();
  return usuarios.value.filter((u) =>
    `${u.nome} ${u.email}`.toLowerCase().includes(termo)
  );
});

// Métodos
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
  return new Date(data).toLocaleDateString("pt-BR");
};

const carregarUsuarios = async () => {
  carregando.value = true;
  erro.value = null;
  try {
    const response = await axios.get("http://localhost:5000/usuarios");
    usuarios.value = response.data;
  } catch (error) {
    erro.value = error.message;
    console.error("Erro ao carregar usuários:", error);
  } finally {
    carregando.value = false;
  }
};

const deletarUsuario = async (uid) => {
  if (!confirm("Tem certeza que deseja deletar este usuário?")) return;
  
  try {
    const token = localStorage.getItem("token"); // Pega o token do Firebase
    const response = await axios.delete(`http://localhost:5000/usuario/${uid}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (response.status === 200) {
      await carregarUsuarios(); // Recarrega a lista
      alert("Usuário deletado com sucesso!");
    }
  } catch (e) {
    erro.value = e.response?.data?.error || e.message;
    alert("Erro ao deletar: " + erro.value);
  }
};

const abrirModalCadastro = () => {
  editando.value = false;
  formUsuario.value = {
    id: null,
    id_firebase: null,
    nome: "",
    email: "",
    senha: "",
    data_nascimento: ""
  };
  modalAberto.value = true;
};

const editarUsuario = (usuario) => {
  editando.value = true;
  formUsuario.value = {
    id: usuario.id,
    id_firebase: usuario.id_firebase,
    nome: usuario.nome,
    email: usuario.email,
    senha: "",
    data_nascimento: usuario.data_nascimento || ""
  };
  modalAberto.value = true;
};

const salvarUsuario = async () => {
  try {
    if (editando.value) {
      // Atualizar usuário
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/usuario/${formUsuario.value.id_firebase}`, {
        nome: formUsuario.value.nome,
        email: formUsuario.value.email
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert("Usuário atualizado com sucesso!");
    } else {
      // Criar novo usuário
      await axios.post("http://localhost:5000/usuarios", {
        nome: formUsuario.value.nome,
        email: formUsuario.value.email,
        senha: formUsuario.value.senha,
        data_nascimento: formUsuario.value.data_nascimento
      });
      alert("Usuário cadastrado com sucesso!");
    }
    fecharModal();
    await carregarUsuarios(); // Recarrega a lista
  } catch (e) {
    erro.value = e.response?.data?.error || e.message;
    alert("Erro ao salvar: " + erro.value);
  }
};

const fecharModal = () => {
  modalAberto.value = false;
  editando.value = false;
  formUsuario.value = {
    id: null,
    id_firebase: null,
    nome: "",
    email: "",
    senha: "",
    data_nascimento: ""
  };
};

// Lifecycle
onMounted(() => {
  carregarUsuarios();
});
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.container {
  font-family: "Segoe UI", sans-serif;
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
  background: #f4f6f9;
  min-height: 100vh;
}

.header-search {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

h1 {
  font-size: 1.8rem;
  color: #2c3e50;
  border-left: 4px solid #4fc08d;
  padding-left: 12px;
}

.header-search input {
  flex: 1;
  min-width: 220px;
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
}

.header-search input:focus {
  border-color: #4fc08d;
}

.btn-novo {
  background: #4fc08d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}

.btn-novo:hover {
  background: #3da87a;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}

.cracha {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
  border-top: 4px solid #4fc08d;
  position: relative;
}

.cracha:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.13);
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #e8f8f2;
  border: 3px solid #4fc08d;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 700;
  color: #4fc08d;
  margin-bottom: 0.75rem;
}

.info h2 {
  font-size: 1rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 4px;
}

.email {
  font-size: 0.78rem;
  color: #888;
}

.divider {
  width: 100%;
  height: 1px;
  background: #f0f0f0;
  margin: 1rem 0;
}

.detalhes {
  width: 100%;
  text-align: left;
}

.detalhes p {
  font-size: 0.82rem;
  color: #555;
  display: flex;
  align-items: center;
  gap: 6px;
}

.badge {
  margin-top: 1rem;
  font-size: 0.7rem;
  font-weight: 600;
  color: #fff;
  background: #4fc08d;
  padding: 3px 10px;
  border-radius: 20px;
}

.acoes {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

.btn-editar, .btn-deletar {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  border-radius: 8px;
  transition: background 0.2s;
}

.btn-editar:hover {
  background: #e8f8f2;
}

.btn-deletar:hover {
  background: #fdecea;
}

.btn-editar span, .btn-deletar span {
  font-size: 20px;
}

.btn-editar span {
  color: #4fc08d;
}

.btn-deletar span {
  color: #e74c3c;
}

.carregando {
  text-align: center;
  color: #4fc08d;
  font-size: 1.1rem;
  padding: 2rem;
}

.erro {
  color: #e74c3c;
  background: #fdecea;
  padding: 1rem;
  border-radius: 8px;
}

.nao-encontrado {
  text-align: center;
  color: #e74c3c;
  background: #fdecea;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 1rem;
  font-size: 1rem;
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
}

.modal-content h2 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
}

.modal-acoes {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.modal-acoes button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

.modal-acoes button:first-child {
  background: #e74c3c;
  color: white;
}

.modal-acoes button:last-child {
  background: #4fc08d;
  color: white;
}
</style>