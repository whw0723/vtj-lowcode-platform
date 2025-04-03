<template>
  <div class="v-ai-widget-new-chat">
    <div class="v-ai-widget-new-chat__welcome">
      <h3>嗨！我是您的智能助手</h3>
      <div>我可以帮你开发低代码页面，请把你的任务交给我吧~</div>
    </div>

    <div v-if="!disabledType" class="v-ai-widget-new-chat__options">
      <ElSegmented
        :disabled="disabledType"
        v-model="currentOption"
        :options="options"
        size="small"
        :block="false"></ElSegmented>
    </div>
    <ChatInput :min-rows="5" @send="onSend"></ChatInput>

    <ElDivider content-position="left">热门需求</ElDivider>
    <div>
      <Item
        v-for="(item, index) in 5"
        :index="index + 1"
        title="制作一个用户登录页面，表单字段包含用户名和密码，需要对输入进行校验。"
        :model-value="item"
        :nowrap="false"
        background
        @click="onTopicClick">
      </Item>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { ElSegmented, ElDivider } from 'element-plus';
  import ChatInput from './chat-input.vue';
  import { Item } from '../../shared';
  import { useOpenApi } from '../../hooks';

  export interface Props {
    type: 'new' | 'edit';
  }

  const emit = defineEmits(['send']);

  const { engine } = useOpenApi();

  const options = [
    {
      label: '重置',
      value: 'new'
    },
    {
      label: '迭代',
      value: 'edit'
    }
  ];

  // 如果是空白页面，只能是新增，不能为迭代选项
  const disabledType = computed(() => {
    return !engine.current.value?.nodes.length;
  });

  const currentOption = ref(disabledType.value ? 'new' : 'edit');

  const onTopicClick = () => {
    console.log('click topic');
  };

  const onSend = (text: string) => {
    emit('send', { type: currentOption.value, content: text });
  };
</script>
