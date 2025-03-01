<template>
  <div class="v-ai-widget-bubble" :class="classes">
    <ElAvatar
      v-if="props.type === 'ai'"
      class="v-ai-widget-bubble__avatar"
      :size="30"
      :icon="VtjIconAi"></ElAvatar>
    <div class="v-ai-widget-bubble__main">
      <div class="v-ai-widget-bubble__content">
        <slot></slot>
      </div>
      <!-- <div class="v-ai-widget-bubble__detail">
        以下是一个VTJ低代码引擎的现代化着陆页HTML代码，包含响应式设计和关键产品信息展示：
      </div>
      <div class="v-ai-widget-bubble__tools"></div> -->
    </div>
  </div>
</template>
<script setup lang="ts">
  import { computed } from 'vue';
  import { ElAvatar } from 'element-plus';
  import { VtjIconAi } from '@vtj/icons';

  export interface Props {
    type: 'user' | 'ai';
  }

  const props = withDefaults(defineProps<Props>(), {
    type: 'user'
  });

  const classes = computed(() => {
    return {
      'is-user': props.type === 'user',
      'is-ai': props.type === 'ai'
    };
  });
</script>
