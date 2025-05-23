<template>
  <div>
    <component :is="renderer"></component>
    <div v-pin:[arg].modifiers="true">abc</div>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, ref } from 'vue';

  import {
    createRenderer,
    type BlockSchema,
    type NodeDirective
  } from '@vtj/pro';
  import { XAction } from '@vtj/web';
  import { uid } from '@vtj/utils';

  const vPin = {
    mounted(el: any, binding: any) {
      el.innerHTML = JSON.stringify(binding);
    },
    updated() {
      /* ... */
    }
  };

  const arg = ref('top');

  const dsl: BlockSchema = reactive({
    name: 'Test',
    id: uid(),
    props: [
      {
        name: 'title',
        type: ['String', 'Number'],
        default: {
          type: 'JSExpression',
          value: '123'
        }
      }
    ],
    nodes: [
      {
        name: 'XAction',
        props: {
          label: 'ABC'
        },
        directives: [
          {
            name: 'vIf',
            value: {
              type: 'JSExpression',
              value: 'true'
            }
          },
          {
            name: 'loading',
            value: {
              type: 'JSExpression',
              value: 'true'
            }
          }
        ] as NodeDirective[]
      },
      {
        name: 'div',
        children: 'Div Content',
        directives: [
          {
            name: 'vHtml',
            value: {
              type: 'JSExpression',
              value: '"<h1>aaa</h1>"'
            }
          }
        ] as NodeDirective[]
      }
    ],
    css: `
@keyframes counter-clockwise {
  0% {
    transform: rotate(0deg);
    /* 逆时针旋转角度从0度开始 */
  }

  100% {
    transform: rotate(-360deg);
    /* 逆时针旋转角度到-360度结束 */
  }
}
@media screen and (max-width: 767px) {
  .container {
    width: 100%;
  }
}
.parent {
   color:red;
}

.parent .child {
   color:red;
}
  .parent:hover :deep(.child) {
  color:red;
  } 
.gear.four .gear-inner {
  animation: counter-clockwise 6s infinite linear;
  /* 设置逆时针旋转动画 */
}
  .gear-inner .bar:nth-child(5) {
  transform: rotate(30deg);
  /* 旋转角度为30度 */
}

    `
  });

  const { renderer } = createRenderer({ dsl, components: { XAction } });

  console.log(renderer);

  setTimeout(() => {
    // dsl.nodes[0].children.value = '"abc"';
  }, 1000);
</script>
