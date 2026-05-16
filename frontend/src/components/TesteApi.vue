<template>
  <div>
    <h1>Produtos</h1>
    <ul>
      <li v-for="product in products" :key="product.id">
        <!-- {{ product.title }} - ${{ product.price }} -->
 
      </li>

      <div class="card">
        <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHRlY2h8ZW58MHx8MHx8fDA%3D" class="card-img" alt="tecnologia">
        <div class="card-content">
            <div class="cart-title">Tecnologia</div>
            <div class="card-description">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores dolorem obcaecati molestias, sit officiis unde voluptate! Incidunt, fugiat
            </div>
            <div class="card-price">
                R$ 100,00
            </div>
            <div class="card-actions">
                <button class="btn btn-primary">Comprar</button>
                <button class="btn btn-secondary">Adicionar ao carrinho</button>
            </div>
        </div>
      </div>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const products = ref([]);

onMounted(async () => {
  try {
    const response = await axios.get('https://fakestoreapi.com/products');
    products.value = response.data;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
  }
});
</script>

<style lang="scss" scoped>
    @use '../styles/testeApi.scss';
</style>