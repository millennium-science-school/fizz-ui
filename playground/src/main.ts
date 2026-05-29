import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import '@fizz/el-plus/styles'
import '@fizz/theme/styles'
import './styles/element-overrides.css'
import 'virtual:uno.css'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('./views/HomePage.vue'),
    },
    {
      path: '/crud',
      component: () => import('./views/CrudPage.vue'),
    },
    {
      path: '/comps-lab',
      component: () => import('./views/CompsLabPage.vue'),
    },
    {
      path: '/resource-layout',
      component: () => import('./views/ResourceLayoutPage.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('./views/NotFound.vue'),
    },
  ],
})

createApp(App)
  .use(router)
  .mount('#app')
