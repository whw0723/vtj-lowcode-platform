export const template1 = `
<template>
  <XPanel
    v-for="(item, index) in 3"
    header="标题"
    @click.stop="(...args: any[]) => click_13mntm28({ item, index }, args)">
    <div class="my-div div_193l8saav">
      <span> {{ item }}</span>
    </div></XPanel
  >
  <ElButton type="primary" @click="click_13mph5o7"> 按钮</ElButton>
</template>
<script lang="ts">
  // @ts-nocheck
  import { defineComponent, reactive } from 'vue';
  import { XPanel } from '@vtj/ui';
  import { ElButton } from 'element-plus';
  import { useProvider } from '@vtj/renderer';
  export default defineComponent({
    name: 'Bbb',
    components: { XPanel, ElButton },
    setup(props) {
      const provider = useProvider({ id: '13dbje0g', version: '1743564663400' });
      const state = reactive({});
      return { state, props, provider };
    },
    methods: {
      click_13mntm28({ item, index }, args) {
        return (() => {
          console.log('click panel!', item);
        }).apply(this, args);
      },
      click_13mph5o7(e) {
        console.log('click button!', e);
      }
    }
  })
</script>
<style lang="scss" scoped></style>


`;
