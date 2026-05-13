<script setup lang="ts">
// 组件就绪后从 @fizz/el-plus 导入并展示
// import { FeButton } from '@fizz/el-plus'

// 现阶段直接使用 Element Plus 原生组件验证桥接效果
import { ElAlert, ElButton, ElInput, ElTag } from 'element-plus'
import { ref } from 'vue'

const inputVal = ref('')
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6 text-[var(--fe-color-text-primary)]">
      组件预览
    </h1>
    <p class="text-[var(--fe-color-text-secondary)] mb-6 text-sm">
      以下展示 Element Plus 原生组件和 Fizz-owned 变量的基础预览。
      待 fizz-el-plus 就绪后，切换为 FeButton 等封装组件。
    </p>

    <!-- 按钮 -->
    <section class="mb-8">
      <h2 class="text-base font-semibold mb-3 text-[var(--fe-color-text-primary)]">
        按钮
      </h2>
      <div class="flex gap-3 flex-wrap">
        <ElButton type="primary">
          主要按钮
        </ElButton>
        <ElButton type="success">
          成功按钮
        </ElButton>
        <ElButton type="warning">
          警告按钮
        </ElButton>
        <ElButton type="danger">
          危险按钮
        </ElButton>
        <ElButton>默认按钮</ElButton>
        <ElButton disabled>
          禁用按钮
        </ElButton>
      </div>
    </section>

    <!-- 输入框 -->
    <section class="mb-8">
      <h2 class="text-base font-semibold mb-3 text-[var(--fe-color-text-primary)]">
        输入框
      </h2>
      <div class="flex gap-3 flex-wrap items-center">
        <ElInput v-model="inputVal" placeholder="请输入内容" style="width: 240px" />
        <ElInput placeholder="禁用状态" disabled style="width: 240px" />
      </div>
    </section>

    <!-- 标签 -->
    <section class="mb-8">
      <h2 class="text-base font-semibold mb-3 text-[var(--fe-color-text-primary)]">
        标签
      </h2>
      <div class="flex gap-3 flex-wrap">
        <ElTag type="primary">
          主要
        </ElTag>
        <ElTag type="success">
          成功
        </ElTag>
        <ElTag type="warning">
          警告
        </ElTag>
        <ElTag type="danger">
          危险
        </ElTag>
        <ElTag type="info">
          信息
        </ElTag>
      </div>
    </section>

    <!-- 提示 -->
    <section>
      <h2 class="text-base font-semibold mb-3 text-[var(--fe-color-text-primary)]">
        提示
      </h2>
      <div class="flex flex-col gap-3">
        <ElAlert title="主要提示" type="success" :closable="false" />
        <ElAlert title="警告提示" type="warning" :closable="false" />
        <ElAlert title="错误提示" type="error" :closable="false" />
      </div>
    </section>
  </div>
</template>
