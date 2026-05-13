import ElementPlus from 'element-plus'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'

// Element Plus 基础样式
import 'element-plus/dist/index.css'

// fizz 主题层：仅声明 Fizz-owned CSS 变量
import '@fizz/theme/styles'

// UnoCSS 注入（由 vite.config.ts 的 UnoCSS 插件处理）
import 'virtual:uno.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('./views/HomePage.vue'),
    },
    {
      path: '/colors',
      component: () => import('./views/ColorsPage.vue'),
    },
    {
      path: '/components',
      component: () => import('./views/ComponentsPage.vue'),
    },
  ],
})

createApp(App)
  .use(router)
  .use(ElementPlus)
  .mount('#app')
