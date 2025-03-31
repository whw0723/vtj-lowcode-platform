<template>
  <div class="v-ai-widget-input">
    <ElInput
      v-model="value"
      type="textarea"
      :autosize="{ minRows: props.minRows, maxRows: 20 }"
      placeholder="请描述您的需求"></ElInput>
    <ElButton :icon="Promotion" type="primary">发送</ElButton>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { ElInput, ElButton } from 'element-plus';
  import { Promotion } from '@vtj/icons';

  export interface Props {
    minRows?: number;
  }

  const props = withDefaults(defineProps<Props>(), {
    minRows: 2
  });

  const value = ref('');
</script>
