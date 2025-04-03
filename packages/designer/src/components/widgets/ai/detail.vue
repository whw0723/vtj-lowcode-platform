<template>
  <XDialog title="生成内容" maximizable>
    <XContainer fit>
      <Editor height="100%" dark readonly lang="html"></Editor>
      <Editor height="100%" dark readonly lang="json"></Editor>
    </XContainer>
  </XDialog>
</template>
<script lang="ts" setup>
  import { XDialog, XContainer } from '@vtj/ui';
  import Editor from '../../editor/Editor.vue';
</script>
<style lang="scss" scoped></style>
