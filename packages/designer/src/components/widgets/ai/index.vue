<template>
  <XContainer class="v-ai-widget__wrapper" direction="column" fit>
    <Panel
      class="v-ai-widget"
      title="AI助手"
      ref="panelRef"
      :body="{ overflow: bodyOverflow }">
      <template #actions>
        <XAction
          mode="icon"
          size="large"
          :icon="VtjIconChatRecord"
          background="hover"
          title="对话历史"
          @click="showChatRecored"></XAction>
      </template>

      <LoginTip v-if="!logined"></LoginTip>
      <NoFileTip v-if="logined && isNoFile"></NoFileTip>
      <NewTopic
        v-if="isNoFile || isNewChat"
        :models="models"
        :types="topicTypes"
        :loading="loading"
        @send="onPostTopic"></NewTopic>

      <div v-if="!isNewChat" ref="listRef" class="v-ai-widget__bubble-list">
        <template v-for="chat of chats" :key="chat.id">
          <Bubble type="user" :data="chat"></Bubble>
          <Bubble
            type="ai"
            :data="chat"
            @view="onView(chat)"
            @refresh="onRefresh(chat)"
            @apply="onApply(chat)"></Bubble>
        </template>
      </div>

      <template v-if="!isNewChat" #footer>
        <div class="v-ai-widget__input">
          <ElButton
            class="new-btn"
            round
            plain
            type="primary"
            size="small"
            :icon="VtjIconNewChat"
            @click="onNewChat">
            开启新对话
          </ElButton>
          <ChatInput
            v-if="currentTopic"
            :models="models"
            :loading="loading"
            :model="currentTopic?.model"
            lock-model
            @send="onPostChat"></ChatInput>
          <div class="footer">内容由 AI 生成，请仔细甄别</div>
        </div>
      </template>

      <Detial
        v-if="currentChat"
        v-model="showDetail"
        :chat="currentChat"></Detial>
    </Panel>
    <ElDrawer
      class="v-ai-widget__drawer"
      title="历史对话"
      size="100%"
      direction="ltr"
      :modal="false"
      :with-header="false"
      modal-class="v-ai-widget__drawer-modal"
      :append-to-body="false"
      v-model="showDrawer">
      <Panel class="v-ai-widget" title="AI助手">
        <template #actions>
          <XAction
            mode="icon"
            size="large"
            :icon="VtjIconClose"
            background="hover"
            title="对话历史"
            @click="showChatRecored"></XAction>
        </template>

        <ChatRecords
          :current="currentTopic"
          :topics="topics"
          @new="onNewChat"
          @load="onRecordLoad"
          @remove="onRemoveTopic"></ChatRecords>
      </Panel>
    </ElDrawer>
  </XContainer>
</template>
<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { VtjIconChatRecord, VtjIconClose, VtjIconNewChat } from '@vtj/icons';
  import { XAction, XContainer } from '@vtj/ui';
  import { ElDrawer, ElButton } from 'element-plus';
  import { useOpenApi, useAI, type AITopic, type AIChat } from '../../hooks';
  import { Panel } from '../../shared';
  import { message } from '../../../utils';
  import ChatRecords from './records.vue';
  import ChatInput from './chat-input.vue';
  import Bubble from './bubble.vue';
  import LoginTip from './login-tip.vue';
  import NewTopic from './new-topic.vue';
  import NoFileTip from './no-file-tip.vue';
  import Detial from './detail.vue';

  const {
    isLogined,
    engine,
    getDictOptions,
    postTopic,
    getTopics,
    getChats,
    postChat,
    removeTopic,
    chatCompletions,
    saveChat
  } = useOpenApi();

  const {
    isNewChat,
    loading,
    models,
    topicTypes,
    onPostTopic,
    chats,
    currentTopic,
    onPostChat,
    topics,
    loadChats,
    onRemoveTopic,
    getVueCode,
    onRefresh,
    onApply,
    listRef,
    panelRef
  } = useAI({
    getDictOptions,
    engine,
    postTopic,
    getTopics,
    getChats,
    postChat,
    removeTopic,
    chatCompletions,
    saveChat
  });

  const logined = ref(true);
  const showDrawer = ref(false);
  const showDetail = ref(false);
  const isNoFile = computed(() => !engine.current.value);
  const currentChat = ref();

  const bodyOverflow = computed(() => {
    return !logined.value || isNoFile.value ? 'hidden' : 'auto';
  });

  onMounted(async () => {
    logined.value = await isLogined();

    // console.log(panelRef.value.scrollToBotttom());
  });

  const showChatRecored = () => {
    if (!logined.value) {
      message(
        '使用AI助手需登录，您还没登录或登录已失效，请重新登录！',
        'warning'
      );
      return;
    }
    if (isNoFile.value) {
      message(
        '当前设计视图无任何文件，请新建或打开文件后再使用AI助',
        'warning'
      );
      return;
    }
    showDrawer.value = !showDrawer.value;
  };

  const onNewChat = () => {
    isNewChat.value = true;
    showDrawer.value = false;
  };

  const onRecordLoad = (item: AITopic) => {
    showDrawer.value = false;
    isNewChat.value = false;
    currentTopic.value = item;
    loadChats(item.id);
  };

  const onView = (chat: AIChat) => {
    chat.vue = getVueCode(chat.content);
    currentChat.value = chat;
    showDetail.value = true;
  };

  defineOptions({
    name: 'AIWidget'
  });
</script>
