<template>
  <XDialog title="生成内容" maximizable submit="应用到页面">
    <XContainer fit>
      <Editor
        height="100%"
        dark
        readonly
        lang="html"
        :model-value="props.chat.vue"></Editor>
      <Editor
        height="100%"
        dark
        readonly
        lang="json"
        :model-value="dsl"></Editor>
    </XContainer>
  </XDialog>
</template>
<script lang="ts" setup>
  import { computed } from 'vue';
  import { XDialog, XContainer } from '@vtj/ui';
  import Editor from '../../editor/Editor.vue';
  import { type AIChat } from '../../hooks';

  export interface Props {
    chat: AIChat;
  }

  const props = defineProps<Props>();

  const dsl = computed(() => JSON.stringify(props.chat.dsl || {}, null, 2));
</script>
<style lang="scss" scoped></style>
