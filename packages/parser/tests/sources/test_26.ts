export const test_26 = `
<template>

<div>
 <template v-for="n in 10">
  <span> {{ n }}</span>
  <span> {{ n }}</span
  </template>

</div>


</template>

<script>
import { defineComponent, reactive, computed } from 'vue';
import { useProvider } from '@vtj/renderer';


export default defineComponent({
  name: 'AlarmCenter',
  components: {

  },
  setup(props) {
    const provider = useProvider({ id: '16md6lw5', version: '1750073937957' });
    const state = reactive({
     
    });
    return { state, props, provider };
  }
});
</script>

<style lang="scss" scoped>

</style>
`;
