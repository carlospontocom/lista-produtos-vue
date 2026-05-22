  <template>
   
   <Navbar />
    <router-view :key="$route.fullPath" />


</template>

<script setup lang="ts">
  // import MiniCrud from './components/MiniCrud.vue'
  import Navbar from './components/Navbar.vue'
 
</script>
