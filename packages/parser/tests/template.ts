export const source = `
<template>
  <div>
    <ElInput
      v-model:modelValue="state.value"
      class="ElInput_sz3ep4zvw">
    <template #prefix="{row,index}">
      <span> http://</span>
    </template>
    <template #append="scope_45tvs3h3q">
      <ElButton type="primary"> 按钮</ElButton>
    </template>
      </ElInput>
    <ElButton type="primary" @click="show"> 按钮</ElButton>
  </div>
  <div class="div_1lbywfn73x">{{count}}</div>
  <span>Text</span>
</template>
<script lang="ts">
  // @ts-nocheck
  import { defineComponent, reactive } from 'vue';
  import { ElInput, ElButton } from 'element-plus';
  import { Search } from '@vtj/icons';
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
      },
      count(val, old) {
        console.log(val,old);
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

export const template1 = `
<template>
  <div>
    <span v-for="(item, index) in 10" class="span_t3h8lxwn">
      内联容器文本内容示例</span
    >
      <slot :data="{}"></slot>
  </div>
</template>
<script lang="ts">
  // @ts-nocheck
  import { defineComponent, reactive } from 'vue';
  import { useProvider } from '@vtj/renderer';
  export default defineComponent({
    name: 'Bbb',
    props: {
      a1: {
        type: String,
        required:true,
        default:'ABC'
      },
       a2: {
        type: [String],
        default:'ABC'
      },
         a3: {
        type: [String,Object,Array],
        default: ()=>[]
      }
    },
    setup(props) {
      const provider = useProvider({ id: '13dbje0g', version: '1743235696452' });
      const state = reactive({ title: 'Title', test:null, prop: [] });
      return { state, props, provider };
    },
    computed: {
      length() {
        return this.state.title.length;
      },
      watcher_203h9w2vf() {
        return this.state.title;
      }
    },
    methods: {
      say(msg) {
        console.log(msg);
      },
      async asyncSay(msg,abc) {
        console.log(msg);
      }  
    },
    watch: {
      watcher_203h9w2vf: {
        deep: false,
        immediate: false,
        handler(val) {
          console.log('change', val);
        }
      },
      length(val, old) {
         console.log(val,old)
      },
      'state.dd': {
        deep:true,
        handler(val, old) {
         console.log(val,old)
        }
      }

    },
    mounted() {
      this.say('hello');
    }
  });
</script>
<style lang="scss" scoped>
  .span_t3h8lxwn {
    display: block;
  }
</style>

`;
