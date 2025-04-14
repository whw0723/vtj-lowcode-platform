<template>
  <div ref="container" class="markdown-container" v-html="htmlContent"></div>
</template>
<script lang="ts" setup>
  import { ref, type Ref, watch, nextTick } from 'vue';
  import { marked } from 'marked';
  import hljs from 'highlight.js/lib/core';
  import 'highlight.js/styles/atom-one-dark.css';
  import xml from 'highlight.js/lib/languages/xml';
  import javascript from 'highlight.js/lib/languages/javascript';
  import css from 'highlight.js/lib/languages/css';

  const props = defineProps<{
    content?: string;
  }>();

  hljs.registerLanguage('vue', xml);
  hljs.registerLanguage('javascript', javascript);
  hljs.registerLanguage('css', css);

  marked.setOptions({
    breaks: true,
    async: true
  });

  const container: Ref<HTMLElement | undefined> = ref();
  const htmlContent = ref('');

  // 更新内容并触发高亮
  const updateContent = async () => {
    htmlContent.value = await marked(props.content || '');
    await nextTick();
    container.value?.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  };

  watch(() => props.content, updateContent, { immediate: true });
</script>
<style lang="scss" scoped>
  .markdown-container {
    line-height: 1.5em;
    .language-vue {
      border-radius: 4px;
      margin: 5px 0;
    }
  }

  .markdown-container pre {
    overflow-x: auto;
  }
</style>
