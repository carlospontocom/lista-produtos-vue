import { createRouter, createWebHistory } from 'vue-router';
import type {RouteRecordRaw} from 'vue-router';
import HomeView from '../views/HomeView.vue';
import UsuariosView from '../views/UsuariosView.vue';
 

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/usuarios',
    name: 'todosUsuarios',
    component: UsuariosView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;