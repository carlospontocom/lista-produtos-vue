<template>
  <div>
    <h1>Produtos</h1>
    <div v-if="carregando">Carregando...</div>
    <div v-if="erro" style="color: red;">Erro: {{ erro }}</div>
    <ul v-if="produtos.length">
      <li v-for="produto in produtos" :key="produto.id">
       rs
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const produtos = ref([]);
const carregando = ref(false);
const erro = ref(null);

const carregarProdutos = async () => {
  carregando.value = true;
  erro.value = null;
  
  try {
    // Usando caminho relativo - SEM a URL completa
    const response = await axios.get('https://5000-firebase-vueapi-1778871500827.cluster-lr6dwlc2lzbcctqhqorax5zmro.cloudworkstations.dev/produtos');
    produtos.value = response.data;
    console.log('Produtos:', produtos.value);
    
  } catch (error) {
    erro.value = error.message;
    console.error('Erro:', error);
  } finally {
    carregando.value = false;
  }
};

onMounted(() => {
  carregarProdutos();
});
</script>