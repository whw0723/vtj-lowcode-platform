<template>
  <div class="v-ai-widget-input">
    <ElInput
      v-model="value"
      type="textarea"
      :autosize="{ minRows: props.minRows, maxRows: 20 }"
      placeholder="请描述您的需求"
      @change="onChange"></ElInput>
    <ElButton :icon="Promotion" type="primary" @click="onSend">发送</ElButton>
  </div>
</template>
<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { ElInput, ElButton } from 'element-plus';
  import { Promotion } from '@vtj/icons';
  import { message } from '../../../utils';

  export interface Props {
    minRows?: number;
    modelValue?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    minRows: 2
  });

  const emit = defineEmits<{
    'update:modelValue': [value: string];
    send: [value: string];
  }>();

  const value = ref('');

  watch(
    () => props.modelValue,
    (v) => {
      value.value = v || '';
    },
    {
      immediate: true
    }
  );

  const onChange = (v: string) => {
    emit('update:modelValue', v);
  };

  const onSend = () => {
    if (value.value.trim().length < 5) {
      message('请描述您的需求', 'warning');
      return;
    }
    emit('send', value.value);
    value.value = '';
  };
</script>
