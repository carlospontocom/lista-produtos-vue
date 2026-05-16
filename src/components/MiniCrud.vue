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
          <input type="number" v-model="preco" placeholder="R$">
          <span class="error">{{ erroPreco }}</span>
        </div>

        <div class="group-input">
          <label>URL Imagem</label>
          <input type="text" v-model="imagem" placeholder="url">
          <span class="error">{{ erroImagem }}</span>
        </div>

        <div class="group-textarea">
          <label>Descrição</label>
          <textarea v-model="descricao" placeholder="Descrição"></textarea>
          <span class="error-textarea">{{ erroDescricao }}</span>
        </div>

        <button type="submit" class="btn-send-register">
          Cadastrar
        </button>

      </form>

      <!-- INFO -->
      <p v-if="!totalCadastros">Nada cadastrado</p>
      <p v-else>Total de produtos: {{ totalCadastros }}</p>

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

          <img :src="produto.imagem" alt="produto.titulo">

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
import { ref, watch, onMounted, computed } from 'vue';

/* LISTA */
const listaProdutos = ref([]);

/* FORM */
const titulo = ref('');
const preco = ref('');
const imagem = ref('');
const descricao = ref('');

/* ERROS */
const erroTitulo = ref('');
const erroPreco = ref('');
const erroImagem = ref('');
const erroDescricao = ref('');

/* CONTAGEM AUTOMÁTICA */
const totalCadastros = computed(() => listaProdutos.value.length);

/* VALIDAR */
const validateDatas = () => {

  let isValido = true;

  erroTitulo.value = "";
  erroPreco.value = "";
  erroImagem.value = "";
  erroDescricao.value = "";

  if (!titulo.value.trim()) {
    erroTitulo.value = "Campo obrigatório";
    isValido = false;
  }

  if (!preco.value) {
    erroPreco.value = "Campo obrigatório";
    isValido = false;
  }

  if (!imagem.value.trim()) {
    erroImagem.value = "Campo obrigatório";
    isValido = false;
  }

  if (!descricao.value.trim()) {
    erroDescricao.value = "Campo obrigatório";
    isValido = false;
  }

  if (isValido) {
    listaProdutos.value.push({
      id: Date.now(),
      titulo: titulo.value,
      preco: parseFloat(preco.value.replace(',', '.')),
      imagem: imagem.value,
      descricao: descricao.value
    });

    salveLocal();
    limparCampos();
  }
};

/* LOCALSTORAGE SAVE */
const salveLocal = () => {
  localStorage.setItem(
    'listaProdutos',
    JSON.stringify(listaProdutos.value)
  );
};

/* LOAD */
onMounted(() => {
  const dados = localStorage.getItem('listaProdutos');

  listaProdutos.value = dados
    ? JSON.parse(dados)
    : [];
});

/* DELETE */
const excluir = (id) => {
  if (confirm("Deseja realmente excluir?")) {
    listaProdutos.value = listaProdutos.value.filter(
      item => item.id !== id
    );

    salveLocal();
  }
};

/* LIMPAR FORM */
const limparCampos = () => {
  titulo.value = "";
  preco.value = "";
  imagem.value = "";
  descricao.value = "";
};

/* LIMPAR ERROS AO DIGITAR */
watch([titulo, preco, imagem, descricao], () => {
  erroTitulo.value = "";
  erroPreco.value = "";
  erroImagem.value = "";
  erroDescricao.value = "";
});

/* MOEDA BR */
const moedaBrasil = (valor) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};

</script>