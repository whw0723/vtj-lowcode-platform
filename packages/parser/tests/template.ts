export const source = `
<template>
  <div>
    <ElInput
      v-model:modelValue="state.value"
      class="ElInput_sz3ep4zvw"></ElInput>
    <ElButton type="primary" @click="show"> 按钮</ElButton>
  </div>
  <div class="div_1lbywfn73x">{{count}}</div>
  <span>Text</span>
</template>
<script lang="ts">
  // @ts-nocheck
  import { defineComponent, reactive } from 'vue';
  import { ElInput, ElButton } from 'element-plus';
  import { useProvider } from '@vtj/renderer';
  export default defineComponent({
    name: 'Test',
    components: { ElInput, ElButton },
    setup(props) {
      const provider = useProvider({ id: '45tuogav2', version: '1741242535468' });
      const state = reactive<Record<string, any>>({ value: '' });
      return { state, props, provider };
    },
    computed: {
      count() {
        return \`已输入\${this.state.value.length}个字符\`;
      },
      watcher_2a58ggdzq7() {
        return this.state.value;
      }
    },
    methods: {
      show() {
        alert(this.state.value);
      }
    },
    watch: {
      watcher_2a58ggdzq7: {
        deep: false,
        immediate: false,
        handler(value) {
          console.log('change', value);
        }
      }
    },
    mounted() {
      console.log('mounted');
    }
  });
</script>
<style lang="scss" scoped>
  .ElInput_sz3ep4zvw {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .div_1lbywfn73x {
    margin-top: 10px;
  }
</style>

`;
