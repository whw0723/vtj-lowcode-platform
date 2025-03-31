<template>
  <div class="v-ai-widget-bubble" :class="classes">
    <ElAvatar
      v-if="props.type === 'ai'"
      class="v-ai-widget-bubble__avatar"
      :size="20"
      :icon="VtjIconAi"></ElAvatar>
    <div class="v-ai-widget-bubble__main">
      <div class="v-ai-widget-bubble__content">
        <slot></slot>
      </div>
      <!-- <div class="v-ai-widget-bubble__detail">
        以下是一个VTJ低代码引擎的现代化着陆页HTML代码，包含响应式设计和关键产品信息展示：
      </div>-->
      <div v-if="props.type === 'ai'" class="v-ai-widget-bubble__tools">
        <XActionBar :items="actions" size="small" mode="icon"></XActionBar>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { computed } from 'vue';
  import { ElAvatar } from 'element-plus';
  import { VtjIconAi, Refresh, CopyDocument, View } from '@vtj/icons';
  import { XActionBar, type ActionBarItems } from '@vtj/ui';

  export interface Props {
    type: 'user' | 'ai';
  }

  const props = withDefaults(defineProps<Props>(), {
    type: 'user'
  });

  const actions: ActionBarItems = [
    {
      name: 'CopyDocument',
      tooltip: '复制',
      icon: CopyDocument
    },
    {
      name: 'Refresh',
      tooltip: '重新生成',
      icon: Refresh
    },
    {
      name: 'View',
      tooltip: '查看源码',
      icon: View
    }
  ];

  const classes = computed(() => {
    return {
      'is-user': props.type === 'user',
      'is-ai': props.type === 'ai'
    };
  });
</script>
