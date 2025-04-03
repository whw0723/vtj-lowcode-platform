<template>
  <div class="v-ai-widget-bubble" :class="classes">
    <ElAvatar
      v-if="props.type === 'ai'"
      class="v-ai-widget-bubble__avatar"
      :size="24"
      :icon="VtjIconAi"></ElAvatar>
    <Avatar v-if="props.type === 'user'"></Avatar>
    <div class="v-ai-widget-bubble__main">
      <div class="v-ai-widget-bubble__content">
        <slot></slot>
      </div>
      <!-- <div class="v-ai-widget-bubble__detail">
        以下是一个VTJ低代码引擎的现代化着陆页HTML代码，包含响应式设计和关键产品信息展示：
      </div>-->
      <div v-if="props.type === 'ai'" class="v-ai-widget-bubble__tools">
        <XActionBar
          :items="actions"
          size="small"
          mode="icon"
          type="primary"
          @click="onActionClick"></XActionBar>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { computed } from 'vue';
  import { ElAvatar } from 'element-plus';
  import { VtjIconAi, Refresh, View, Download } from '@vtj/icons';
  import { XActionBar, type ActionBarItems } from '@vtj/ui';
  import Avatar from './avatar.vue';

  export interface Props {
    type: 'user' | 'ai';
  }

  const props = withDefaults(defineProps<Props>(), {
    type: 'user'
  });

  const emit = defineEmits(['refresh', 'view', 'download']);

  const actions: ActionBarItems = [
    {
      name: 'refresh',
      tooltip: '重新生成',
      icon: Refresh
    },
    {
      name: 'view',
      tooltip: '查看生成内容',
      icon: View
    },
    {
      name: 'download',
      tooltip: '重新应用到页面',
      icon: Download
    }
  ];

  const classes = computed(() => {
    return {
      'is-user': props.type === 'user',
      'is-ai': props.type === 'ai'
    };
  });

  const onActionClick = (e: any) => {
    emit(e.name, e);
  };
</script>
