<template>
  <div class="v-ai-widget-bubble" :class="classes">
    <ElAvatar
      v-if="isAi"
      class="v-ai-widget-bubble__avatar"
      :size="24"
      :icon="VtjIconAi"></ElAvatar>
    <Avatar v-if="props.type === 'user'"></Avatar>
    <div class="v-ai-widget-bubble__main">
      <div class="v-ai-widget-bubble__content" :class="statusClass">
        <template v-if="isAi">
          <div
            v-if="!!props.data.reasoning"
            class="v-ai-widget-bubble__reasoning">
            <ElTag
              v-if="!isPending"
              class="v-ai-widget-bubble__toggle"
              size="small"
              type="info"
              @click="onToggleCollaspe">
              已经深度思考 (用时 {{ Math.ceil(props.data.thinking / 1000) }} 秒)
              <XIcon :icon="collaspedIcon"></XIcon>
            </ElTag>
            <div v-show="!collasped">
              <pre>{{ props.data.reasoning }}</pre>
            </div>
          </div>
          <div v-if="props.data.content" class="v-ai-widget-bubble__detail">
            <StreamMarkdown :content="props.data.content"></StreamMarkdown>
          </div>
          <div
            v-if="props.data.message"
            class="v-ai-widget-bubble__message"
            :closable="false"
            type="error">
            {{ props.data.message }}
          </div>
          <ElButton
            v-if="isPending"
            class="v-ai-widget-bubble__loading"
            loading
            size="default"
            text
            circle></ElButton>
        </template>
        <div v-else>
          <pre>{{ props.data.prompt }}</pre>
        </div>
      </div>
      <div v-if="isAi && isCompleted" class="v-ai-widget-bubble__tools">
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
  import { computed, ref } from 'vue';
  import { ElAvatar, ElButton, ElTag } from 'element-plus';
  import Avatar from './avatar.vue';
  import {
    VtjIconAi,
    Refresh,
    View,
    Download,
    ArrowUpBold,
    ArrowDownBold
  } from '@vtj/icons';
  import { XActionBar, XIcon, type ActionBarItems } from '@vtj/ui';
  import StreamMarkdown from './stream-markdown.vue';
  import { type AIChat } from '../../hooks';
  export interface Props {
    type: 'user' | 'ai';
    data: AIChat;
  }

  const props = withDefaults(defineProps<Props>(), {
    type: 'user'
  });

  const emit = defineEmits(['refresh', 'view', 'download']);
  const isAi = computed(() => props.type === 'ai');
  const isCompleted = computed(() => props.data.status === 'Success');
  const isPending = computed(() => props.data.status === 'Pending');
  const collasped = ref(false);
  const collaspedIcon = computed(() =>
    collasped.value ? ArrowUpBold : ArrowDownBold
  );
  const statusClass = computed(() => {
    return {
      [`is-${props.data.status}`]: props.type === 'ai'
    };
  });
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
      name: 'apply',
      tooltip: '应用到页面',
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

  const onToggleCollaspe = () => {
    collasped.value = !collasped.value;
  };
</script>
