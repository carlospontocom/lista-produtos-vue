import { createRouter, createWebHistory } from 'vue-router';
import type {RouteRecordRaw} from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ListaUsuariosView   from '../views/ListaUsuariosView.vue';
import LoginView from '../views/LoginView.vue';
import CadastroView from '../views/CadastroView.vue';
import LandingVieww from '../views/LandingVieww.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/listaUsuarios',
    name: 'listaUsuarios',
    component: ListaUsuariosView
  },
  {
    path: '/landing',
    name: 'landing',
    component: LandingVieww
  }, 
  
  {
    path: '/login',
    name: 'login',
     component: LoginView
  },
  {
    path: '/cadastro',
    name: 'cadastro',
    component: CadastroView
  }

];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;