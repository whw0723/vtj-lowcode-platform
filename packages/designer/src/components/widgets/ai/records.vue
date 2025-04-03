<template>
  <div class="v-ai-widget-record">
    <ElButton
      class="new-btn"
      round
      plain
      type="primary"
      :icon="VtjIconNewChat"
      @click="onNewChat">
      开启新对话
    </ElButton>
    <ElDivider content-position="left" border-style="dotted">
      历史对话
    </ElDivider>
    <ElEmpty description="暂无历史对话"></ElEmpty>
    <div class="v-ai-widget-record__list">
      <Item
        v-for="(item, index) in 20"
        :index="index + 1"
        title="用户让我制作一个VTJ低代码引擎的着陆页用"
        :model-value="item"
        :active="index == 1"
        background
        :actions="['remove']"
        @click="onClickItem"
        @action="onAction">
      </Item>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { VtjIconNewChat } from '@vtj/icons';
  import { ElDivider, ElButton, ElEmpty } from 'element-plus';
  import { Item } from '../../shared';

  const emit = defineEmits(['new', 'load']);

  const onNewChat = () => {
    emit('new');
  };

  const onClickItem = () => {
    emit('load');
  };

  const onAction = (e: any) => {
    console.log(e);
  };
</script>
