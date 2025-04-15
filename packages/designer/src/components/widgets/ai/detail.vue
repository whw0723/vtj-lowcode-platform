<template>
  <XDialog
    title="AI生成内容"
    maximizable
    submit="应用到页面"
    @submit="onSubmit">
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
  const emit = defineEmits<{
    apply: [chat: AIChat];
  }>();

  const dsl = computed(() => JSON.stringify(props.chat.dsl || {}, null, 2));

  const onSubmit = () => {
    emit('apply', props.chat);
  };
</script>
<style lang="scss" scoped></style>
