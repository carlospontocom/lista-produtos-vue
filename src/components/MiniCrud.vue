<template>
  <section>
    <div class="container">
      <h1>Novo produto</h1>
      <p class="lema">
        Adicione novo produto à sua vitrine e mostre aos seus clientes o que há de melhor
      </p>

      <!-- FORM -->
      <form class="form" @submit.prevent="validateDatas">
        <div class="group-input">
          <label>Produto</label>
          <input type="text" v-model="titulo" placeholder="Produto">
          <span class="error">{{ erroTitulo }}</span>
        </div>

        <div class="group-input">
          <label>Valor R$</label>
          <input type="number" step="0.01" v-model="preco" placeholder="R$">
          <span class="error">{{ erroPreco }}</span>
        </div>

        <div class="group-input">
          <label>URL Imagem</label>
          <input type="text" v-model="imagem" placeholder="https://exemplo.com/imagem.jpg">
          <span class="error">{{ erroImagem }}</span>
        </div>

        <div class="group-textarea">
          <label>Descrição</label>
          <textarea v-model="descricao" placeholder="Descrição do produto"></textarea>
          <span class="error-textarea">{{ erroDescricao }}</span>
        </div>

        <button type="submit" class="btn-send-register">
          Cadastrar
        </button>
      </form>

      <!-- INFO -->
      <p v-if="!totalCadastros" class="info-text">Nada cadastrado</p>
      <p v-else class="total-text">Total de produtos: {{ totalCadastros }}</p>

      <!-- CARDS -->
      <div class="cards">
        <div class="card" v-for="produto in listaProdutos" :key="produto.id">
          <button
            type="button"
            class="card-btn-delete"
            aria-label="Remover produto"
            @click="excluir(produto.id)"
          >
            <span class="material-symbols-outlined" aria-hidden="true">
              close
            </span>
          </button>

          <img :src="produto.imagem" :alt="produto.titulo" @error="handleImageError(produto)">

          <div class="card-body">
            <h4>{{ produto.titulo }}</h4>
            <h5>{{ moedaBrasil(produto.preco) }}</h5>
            <p>{{ produto.descricao }}</p>
          </div>

          <button class="card-btn">Mais detalhes</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// LISTA
const listaProdutos = ref([])

// FORM
const titulo = ref('')
const preco = ref('')
const imagem = ref('')
const descricao = ref('')

// ERROS
const erroTitulo = ref('')
const erroPreco = ref('')
const erroImagem = ref('')
const erroDescricao = ref('')

// CONTAGEM AUTOMÁTICA
const totalCadastros = computed(() => listaProdutos.value.length)

// VALIDAR
const validateDatas = () => {
  let isValido = true

  erroTitulo.value = ""
  erroPreco.value = ""
  erroImagem.value = ""
  erroDescricao.value = ""

  if (!titulo.value.trim()) {
    erroTitulo.value = "Campo obrigatório"
    isValido = false
  } else if (titulo.value.trim().length < 3) {
    erroTitulo.value = "Mínimo 3 caracteres"
    isValido = false
  }

  if (!preco.value) {
    erroPreco.value = "Campo obrigatório"
    isValido = false
  } else if (preco.value <= 0) {
    erroPreco.value = "Valor deve ser maior que zero"
    isValido = false
  }

  if (!imagem.value.trim()) {
    erroImagem.value = "Campo obrigatório"
    isValido = false
  } else if (!isValidUrl(imagem.value.trim())) {
    erroImagem.value = "URL inválida"
    isValido = false
  }

  if (!descricao.value.trim()) {
    erroDescricao.value = "Campo obrigatório"
    isValido = false
  } else if (descricao.value.trim().length < 10) {
    erroDescricao.value = "Mínimo 10 caracteres"
    isValido = false
  }

  if (isValido) {
    listaProdutos.value.push({
      id: Date.now(),
      titulo: titulo.value.trim(),
      preco: parseFloat(preco.value),
      imagem: imagem.value.trim(),
      descricao: descricao.value.trim()
    })

    salveLocal()
    limparCampos()
  }
}

// VALIDAR URL
const isValidUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// TRATAR ERRO DE IMAGEM
const handleImageError = (produto) => {
  produto.imagem = 'https://via.placeholder.com/350x350?text=Imagem+Indisponível'
}

// LOCALSTORAGE SAVE
const salveLocal = () => {
  localStorage.setItem(
    'listaProdutos',
    JSON.stringify(listaProdutos.value)
  )
}

// LOAD
onMounted(() => {
  const dados = localStorage.getItem('listaProdutos')
  listaProdutos.value = dados ? JSON.parse(dados) : []
})

// DELETE
const excluir = (id) => {
  if (confirm("Deseja realmente excluir?")) {
    listaProdutos.value = listaProdutos.value.filter(
      item => item.id !== id
    )
    salveLocal()
  }
}

// LIMPAR FORM
const limparCampos = () => {
  titulo.value = ""
  preco.value = ""
  imagem.value = ""
  descricao.value = ""
}

// MOEDA BR
const moedaBrasil = (valor) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
}
</script>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

html {
  font-family: Arial, Helvetica, sans-serif;
}

:root {
  --color-primary: seagreen;
  --color-light: white;
  --color-dark: #000000;
  --shadow: 0 0 10px #00000040;
  --padding-b: 1rem;
  --padding-b3: 3rem;
  --rounded: 6px;
}

.container {
  margin: 0 auto;
  padding: 0 var(--padding-b);
  max-width: 1200px;
}

h1 {
  color: var(--color-primary);
  font-size: var(--padding-b3);
  text-align: center;
  margin: 0;
}

p.lema {
  max-width: 400px;
  margin: 0 auto;
  padding: var(--padding-b) var(--padding-b) 3rem;
  text-align: center;
}

section {
  min-height: 100vh;
  padding: 60px 0;
}

.form {
  border-radius: var(--rounded);
  padding: var(--padding-b);
  box-shadow: 0 0 10px #00000080;
  margin: 0 auto;
  max-width: 450px;
}

.group-input {
  position: relative;
  margin: 2.5rem 0;
}

.group-input input {
  border-radius: var(--rounded);
  border: 1px solid gray;
  width: 100%;
  padding: 13px 6px;
}

.group-textarea textarea {
  height: 120px;
  width: 100%;
  padding: var(--padding-b);
  resize: none;
  border-radius: var(--rounded);
  border: 1px solid gray;
}

.group-textarea {
  position: relative;
  margin: 1.9rem 0;
}

.error-textarea {
  color: brown;
  font-size: 13px;
  position: absolute;
  left: 3px;
  top: 140px;
}

.btn-send-register {
  background-color: var(--color-primary);
  color: var(--color-light);
  border: 1px solid var(--color-primary);
  cursor: pointer;
  border-radius: var(--rounded);
  padding: 10px 20px;
  width: 100%;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.btn-send-register:hover {
  background-color: var(--color-dark);
  border-color: var(--color-dark);
}

label {
  color: #00000080;
  display: block;
  font-size: .8rem;
  font-weight: 500;
  padding-bottom: 2px;
}

.error {
  display: block;
  color: brown;
  font-size: 13px;
  position: absolute;
  left: 3px;
  top: 62px;
}

.info-text, .total-text {
  text-align: center;
  margin-top: 2rem;
  font-size: 1.1rem;
}

.total-text {
  color: var(--color-primary);
  font-weight: bold;
}

/* CARDS */
.cards {
  padding: 60px 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  border: 2px solid rgb(227, 222, 222);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow);
  position: relative;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.card-btn-delete {
  border: 0;
  border-radius: 50%;
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: red;
  color: white;
  cursor: pointer;
  font-size: 2rem;
  position: absolute;
  top: .6rem;
  right: .6rem;
  z-index: 1;
  transition: all 0.3s ease;
}

.card-btn-delete:hover {
  background-color: darkred;
  transform: scale(1.05);
}

.card img {
  height: 280px;
  width: 100%;
  object-fit: cover;
}

.card-body {
  padding: 1rem;
}

.card h4 {
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
}

.card h5 {
  font-size: 1.5rem;
  padding: 0.5rem 0;
  color: var(--color-primary);
}

.card p {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 25px;
  font-size: 13px;
}

.card-btn {
  background-color: var(--color-primary);
  margin-top: auto;
  color: var(--color-light);
  border: 1px solid var(--color-primary);
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.card-btn:hover {
  background-color: var(--color-dark);
  border-color: var(--color-dark);
}

/* Responsividade */
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .cards {
    grid-template-columns: 1fr;
    padding: 40px 0;
    gap: 1.5rem;
  }
  
  .form {
    margin: 0 0.5rem;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .card img {
    height: 220px;
  }
  
  .card h4 {
    font-size: 1.2rem;
  }
  
  .card h5 {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  section {
    padding: 30px 0;
  }
  
  .cards {
    padding: 30px 0;
  }
  
  .group-input {
    margin: 1.5rem 0;
  }
}
</style>