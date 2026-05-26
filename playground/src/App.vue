<script setup lang="ts">
import { FeConfigProvider } from '@fizz/el-plus'
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()
const navItems = [
  { to: '/', label: '首页' },
  { to: '/crud', label: 'CRUD 示例' },
  { to: '/comps-lab', label: '组件 Lab' },
]
</script>

<template>
  <FeConfigProvider>
    <nav class="playground-nav">
      <span class="playground-nav__brand">Fizz UI</span>
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="playground-nav__link"
        :class="{ 'playground-nav__link--active': route.path === item.to }"
      >
        {{ item.label }}
      </RouterLink>
    </nav>
    <div class="playground-body">
      <RouterView />
    </div>
  </FeConfigProvider>
</template>

<style>
.playground-nav {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0 24px;
  height: 48px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  position: sticky;
  top: 0;
  z-index: 100;
}
.playground-nav__brand {
  font-weight: 600;
  font-size: 15px;
  color: #303133;
  margin-right: 24px;
  letter-spacing: 0.5px;
}
.playground-nav__link {
  display: inline-flex;
  align-items: center;
  height: 48px;
  padding: 0 16px;
  font-size: 14px;
  color: #606266;
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition:
    color 0.2s,
    border-color 0.2s;
}
.playground-nav__link:hover {
  color: #409eff;
}
.playground-nav__link--active {
  color: #409eff;
  border-bottom-color: #409eff;
}
.playground-body {
  min-height: calc(100vh - 48px);
}
</style>
