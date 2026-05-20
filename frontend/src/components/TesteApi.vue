<template>
  <div class="container">
    <div class="header-search">
      <h1>Usuários</h1>
      <input
        type="text"
        placeholder="Digite nome ou email"
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
        <button class="">
          <span
            class="material-symbols-outlined"
            @click="deletarUsuario(usuario.id)"
            >delete</span
          >
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

const nomeFuncionario = ref("");
const usuarios = ref([]);
const carregando = ref(false);
const erro = ref(null);


const novoUsuario = ref({
  nome: "",
  email: "",
  senha: "",
});

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

const usuariosFiltrados = computed(() => {
  if (!nomeFuncionario.value.trim()) return usuarios.value;
  const termo = nomeFuncionario.value.toLowerCase();
  return usuarios.value.filter((u) =>
    `${u.nome} ${u.email}`.toLowerCase().includes(termo),
  );
});

const carregarUsuarios = async () => {
  carregando.value = true;
  erro.value = null;
  try {
    const response = await axios.get("http://localhost:5000/usuarios");
    usuarios.value = response.data;
  } catch (error) {
    erro.value = error.message;
  } finally {
    carregando.value = false;
  }
};

const deletarUsuario = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:5000/usuario/${id}`);
    if (response.status === 200) {
      usuarios.value = usuarios.value.filter((u) => u.id !== id);
    }
  } catch (e) {
    erro.value = e.message;
  }
};

const cadastrarUsuario = async () => {
  try {
    const response = await axios.post('http://localhost:5000/usuarios', {
      nome: novoUsuario.value.nome,
      email: novoUsuario.value.email,
      senha: novoUsuario.value.senha
    });
    if (response.status === 201) {
      usuarios.value.push(response.data);
      // limpa o formulário
      novoUsuario.value = { nome: '', email: '', senha: '' };
    }
  } catch (e) {
    erro.value = e.message;
  }
};

const editarUsuario = async (id) => {
 try{
   const response = await axios.get(`http://localhost:5000/usuario/${id}`);
  if (response.status === 200) {
    usuarios.value = response.data;
  }
 }catch(e){
  erro.value = e.message;
 }
}

onMounted(carregarUsuarios);
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

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
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
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  border-top: 4px solid #4fc08d;
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
</style>
