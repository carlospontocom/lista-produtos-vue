<template>
  <h3>Projetos</h3>
  <p class="tema">
    Criando sistemas com Vue e React, principais projetos em desenvolvimento
  </p>

  <div class="projetos-grid">
      <div class="card" v-for="p in projetos" :key="p.id">
        <p><img :src="p.icon" alt="" /></p>

      </div>
  </div>
</template>

<script setup>

import loginIcon from "../assets/projeto-chat.png"
import chatIcon from "../assets/projeto-login.png"
import financasIcon from "../assets/projeto-financas.png"


const projetos = [
    { id: "p02", nome: "Chat real", icon: chatIcon },
    { id: "p01", nome: "Sitema de login", icon: loginIcon },
    { id: "p03", nome: "Gestão de finanças", icon: financasIcon }
];

</script>

<style scoped lang="scss">
h3 {
  font-size: clamp(4rem, 5vw, 10rem);
  text-align: center;
  padding-top: 3rem;
}
.tema {
  padding: 0 0 1rem 0;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.projetos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.card{
    background: white;
    border: 2px solid #f2f2f2;
    border-radius: 10px;
    display: flex;
    justify-content: center;
}

img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
