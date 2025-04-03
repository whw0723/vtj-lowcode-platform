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
          :icon="recordsIcon"
          background="hover"
          title="对话历史"
          @click="showChatRecored"></XAction>
      </template>

      <LoginTip v-if="!logined"></LoginTip>
      <NoFileTip v-if="isNoFile"></NoFileTip>
      <NewTopic v-if="isNoFile || isNewChat" @send="onSend"></NewTopic>

      <div v-if="!isNewChat" class="v-ai-widget__bubble-list">
        <Bubble type="user">
          制作一个用户登录页面，表单字段包含用户名和密码，需要对输入进行校验。</Bubble
        >

        <Bubble
          type="ai"
          v-for="i in 1"
          :key="i"
          @download="onApply"
          @view="onView">
          以下是一个VTJ低代码引擎的现代化着陆页HTML代码，包含响应式设计和关键产品信息展示：
          以下是一个VTJ低代码引擎的现代化着陆页HTML代码，包含响应式设计和关键产品信息展示：
        </Bubble>
        <Bubble type="user">
          制作一个用户登录页面，表单字段包含用户名和密码，需要对输入进行校验。</Bubble
        >
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
          <ChatInput></ChatInput>
          <div class="footer">内容由 AI 生成，请仔细甄别</div>
        </div>
      </template>

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
        <ChatRecords @new="onNewChat" @load="onRecordLoad"></ChatRecords>
      </ElDrawer>
      <Detial v-model="showDetail"></Detial>
    </Panel>
  </XContainer>
</template>
<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { VtjIconChatRecord, VtjIconClose, VtjIconNewChat } from '@vtj/icons';
  import { XAction, XContainer } from '@vtj/ui';
  import { ElDrawer, ElButton } from 'element-plus';
  import { useOpenApi } from '../../hooks';
  import { Panel } from '../../shared';
  import { message } from '../../../utils';
  import ChatRecords from './records.vue';
  import ChatInput from './chat-input.vue';
  import Bubble from './bubble.vue';
  import LoginTip from './login-tip.vue';
  import NewTopic from './new-topic.vue';
  import NoFileTip from './no-file-tip.vue';
  import Detial from './detail.vue';

  const { isLogined, engine } = useOpenApi();

  const logined = ref(true);
  const panelRef = ref();
  const showDrawer = ref(false);
  const isNewChat = ref(true);
  const showDetail = ref(false);

  const isNoFile = computed(() => !engine.current.value);

  const bodyOverflow = computed(() => {
    return !logined.value || isNoFile.value ? 'hidden' : 'auto';
  });

  onMounted(async () => {
    logined.value = await isLogined();
  });

  const recordsIcon = computed(() => {
    return showDrawer.value ? VtjIconClose : VtjIconChatRecord;
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

  const onSend = () => {
    isNewChat.value = false;
  };

  const onRecordLoad = () => {
    showDrawer.value = false;
    isNewChat.value = false;
  };

  const onApply = (e: any) => {
    console.log('apply', e);
  };

  const onView = () => {
    showDetail.value = true;
  };

  defineOptions({
    name: 'AIWidget'
  });
</script>
