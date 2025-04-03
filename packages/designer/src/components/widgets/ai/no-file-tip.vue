<template>
  <div class="v-ai-widget__mask"></div>
  <div class="login-tip">
    <ElAlert
      title="当前设计视图无任何文件，请新建或打开文件后再使用AI助手"
      type="warning"
      :closable="false"></ElAlert>
  </div>
</template>
<script lang="ts" setup>
  import { ElAlert } from 'element-plus';
</script>

<style lang="scss" scoped>
  .login-tip {
    position: relative;
    z-index: 11;
  }
  .login-tip__content {
    line-height: 2em;
  }
</style>
