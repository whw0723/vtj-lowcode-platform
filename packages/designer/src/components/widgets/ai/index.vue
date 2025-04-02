<template>
  <XContainer class="v-ai-widget__wrapper" direction="column" fit>
    <Panel class="v-ai-widget" title="AI助手" ref="panelRef">
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

      <!-- <ElAlert
        v-if="isNewChat"
        title="当前设计视图无任何文件，请新建或打开文件后再使用AI助手"
        type="warning"
        :closable="false"></ElAlert> -->

      <div v-if="isNewChat" class="v-ai-widget-new-chat">
        <div class="v-ai-widget-new-chat__welcome">
          <h3>嗨！我是您的智能助手</h3>
          <div>我可以帮你开发低代码页面，请把你的任务交给我吧~</div>
        </div>
        <div class="v-ai-widget-new-chat__options">
          <ElSegmented
            v-model="currentOption"
            :options="options"
            size="small"
            :block="false"></ElSegmented>
        </div>
        <ChatInput :min-rows="5"></ChatInput>
      </div>

      <div v-if="!isNewChat && !showDrawer" class="v-ai-widget__bubble-list">
        <Bubble type="user">制作一个vtj低代码引擎着陆页</Bubble>
        <Bubble type="ai" v-for="i in 20" :key="i">
          以下是一个VTJ低代码引擎的现代化着陆页HTML代码，包含响应式设计和关键产品信息展示：
          以下是一个VTJ低代码引擎的现代化着陆页HTML代码，包含响应式设计和关键产品信息展示：
        </Bubble>
      </div>

      <template v-if="!isNewChat && !showDrawer" #footer>
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
        <ChatRecords></ChatRecords>
      </ElDrawer>
    </Panel>
  </XContainer>
</template>
<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { VtjIconChatRecord, VtjIconClose, VtjIconNewChat } from '@vtj/icons';
  import { XAction, XContainer } from '@vtj/ui';
  import { ElDrawer, ElButton, ElSegmented } from 'element-plus';
  import { useOpenApi } from '../../hooks';
  import { Panel } from '../../shared';
  import ChatRecords from './records.vue';
  import ChatInput from './chat-input.vue';
  import Bubble from './bubble.vue';
  import LoginTip from './login-tip.vue';

  const { isLogined } = useOpenApi();

  const logined = ref(true);
  const panelRef = ref();
  const showDrawer = ref(false);
  const isNewChat = ref(true);

  onMounted(async () => {
    logined.value = await isLogined();
  });

  const options = [
    {
      label: '新建',
      value: 'new'
    },
    {
      label: '迭代',
      value: 'edit'
    }
  ];

  const currentOption = ref(options[0].value);

  const recordsIcon = computed(() => {
    return showDrawer.value ? VtjIconClose : VtjIconChatRecord;
  });

  const showChatRecored = () => {
    showDrawer.value = !showDrawer.value;
  };

  const onNewChat = () => {
    isNewChat.value = true;
  };

  defineOptions({
    name: 'AIWidget'
  });
</script>
