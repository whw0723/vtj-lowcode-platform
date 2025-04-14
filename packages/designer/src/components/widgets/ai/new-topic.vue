<template>
  <div class="v-ai-widget-new-chat">
    <div class="v-ai-widget-new-chat__welcome">
      <h3>嗨！我是您的智能助手</h3>
      <div>我可以帮你开发低代码页面，请把你的任务交给我吧~</div>
    </div>

    <div class="v-ai-widget-new-chat__options">
      <ElSegmented
        :disabled="loading || disabledType"
        v-model="currentOption"
        :options="props.types"
        size="small"
        :block="false"></ElSegmented>
    </div>
    <ChatInput
      :min-rows="5"
      :models="props.models"
      :loading="props.loading"
      @send="onSend"></ChatInput>

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
  import { ref, computed, watch } from 'vue';
  import { ElSegmented, ElDivider } from 'element-plus';
  import ChatInput from './chat-input.vue';
  import { Item } from '../../shared';
  import { useOpenApi, type Dict, type AISendData } from '../../hooks';

  export interface Props {
    models?: Dict[];
    types?: Dict[];
    loading?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    models: () => [],
    types: () => []
  });

  const emit = defineEmits<{
    send: [data: AISendData];
  }>();

  const { engine } = useOpenApi();

  const disabledType = computed(() => {
    return !engine.current.value?.nodes.length;
  });

  const currentOption = ref('New');

  // 如果是空白页面，只能是新增，不能为迭代选项
  watch(
    disabledType,
    (v) => {
      currentOption.value = v ? 'New' : 'Edit';
    },
    { immediate: true }
  );

  const onTopicClick = () => {
    console.log('click topic');
  };

  const onSend = (data: AISendData) => {
    emit('send', { type: currentOption.value, ...data } as AISendData);
  };
</script>
