export const dependencies = [
  {
    package: 'vue',
    version: 'latest',
    library: 'Vue',
    urls: ['@vtj/materials/deps/vue/vue.global.prod.js'],
    assetsLibrary: 'VueMaterial',
    required: true,
    official: true,
    enabled: true,
    platform: ['web', 'h5']
  },
  {
    package: 'vue-router',
    version: 'latest',
    library: 'VueRouter',
    urls: ['@vtj/materials/deps/vue-router/vue-router.global.prod.js'],
    assetsLibrary: 'VueRouterMaterial',
    required: true,
    official: true,
    enabled: true
  },
  {
    package: '@vtj/utils',
    version: 'latest',
    library: 'VtjUtils',
    urls: ['@vtj/materials/deps/@vtj/utils/index.umd.js'],
    required: true,
    official: true,
    enabled: true
  },
  {
    package: '@vtj/icons',
    version: 'latest',
    library: 'VtjIcons',
    urls: [
      '@vtj/materials/deps/@vtj/icons/style.css',
      '@vtj/materials/deps/@vtj/icons/index.umd.js'
    ],
    required: true,
    official: true,
    enabled: true,
    platform: ['web', 'h5']
  },
  {
    package: '@vueuse/core',
    version: 'latest',
    library: 'VueUse',
    urls: [
      '@vtj/materials/deps/@vueuse/shared/index.iife.min.js',
      '@vtj/materials/deps/@vueuse/core/index.iife.min.js'
    ],
    required: false,
    official: true,
    enabled: true,
    platform: ['web', 'h5']
  },
  {
    package: 'element-plus',
    version: 'latest',
    library: 'ElementPlus',
    localeLibrary: 'ElementPlusLocaleZhCn',
    urls: [
      '@vtj/materials/deps/element-plus/dark/css-vars.css',
      '@vtj/materials/deps/element-plus/index.css',
      '@vtj/materials/deps/element-plus/zh-cn.js',
      '@vtj/materials/deps/element-plus/index.full.min.js'
    ],
    assetsUrl: '@vtj/materials/assets/element/index.umd.js',
    assetsLibrary: 'ElementPlusMaterial',
    required: false,
    official: true,
    enabled: true,
    platform: 'web'
  },
  {
    package: '@vtj/ui',
    version: 'latest',
    library: 'VtjUI',
    urls: [
      '@vtj/materials/deps/vxe-table/style.min.css',
      '@vtj/materials/deps/@vtj/ui/style.css',
      '@vtj/materials/deps/xe-utils/xe-utils.umd.min.js',
      '@vtj/materials/deps/vxe-table/index.umd.min.js',
      '@vtj/materials/deps/@vtj/ui/index.umd.js'
    ],
    assetsUrl: '@vtj/materials/assets/ui/index.umd.js',
    assetsLibrary: 'VtjUIMaterial',
    required: false,
    official: true,
    enabled: true,
    platform: 'web'
  },
  {
    package: 'ant-design-vue',
    version: 'latest',
    library: 'antd',
    urls: [
      '@vtj/materials/deps/ant-design-vue/reset.css',
      '@vtj/materials/deps/ant-design-vue/dayjs/dayjs.min.js',
      '@vtj/materials/deps/ant-design-vue/dayjs/plugin/customParseFormat.js',
      '@vtj/materials/deps/ant-design-vue/dayjs/plugin/weekday.js',
      '@vtj/materials/deps/ant-design-vue/dayjs/plugin/localeData.js',
      '@vtj/materials/deps/ant-design-vue/dayjs/plugin/weekOfYear.js',
      '@vtj/materials/deps/ant-design-vue/dayjs/plugin/weekYear.js',
      '@vtj/materials/deps/ant-design-vue/dayjs/plugin/advancedFormat.js',
      '@vtj/materials/deps/ant-design-vue/dayjs/plugin/quarterOfYear.js',
      '@vtj/materials/deps/ant-design-vue/antd.min.js'
    ],
    assetsUrl: '@vtj/materials/assets/antdv/index.umd.js',
    assetsLibrary: 'AntdvMaterial',
    required: false,
    official: true,
    enabled: false,
    platform: ['web']
  },
  {
    package: '@vtj/charts',
    version: 'latest',
    library: 'VtjCharts',
    urls: [
      '@vtj/materials/deps/echarts/echarts.min.js',
      '@vtj/materials/deps/@vtj/charts/index.umd.js'
    ],
    assetsUrl: '@vtj/materials/assets/charts/index.umd.js',
    assetsLibrary: 'VtjChartsMaterial',
    required: false,
    official: true,
    enabled: true,
    platform: ['web', 'h5']
  },
  {
    package: 'mockjs',
    version: 'latest',
    library: 'Mock',
    urls: ['@vtj/materials/deps/mockjs/mock-min.js'],
    required: false,
    official: true,
    enabled: true
  }
];

export const template1 = `
<template>
  <XPanel
    v-for="(item, index) in 3"
    header="标题"
    @click.stop="(...args: any[]) => click_13mxuu2q({ item, index }, args)">
    <div class="my-div div_193l8saav">
      <span> {{ item }}</span>
    </div></XPanel
  >
  <ElButton type="primary" @click="click_33mxuu2q"> 按钮</ElButton>
</template>
<script lang="ts">
  // @ts-nocheck
  import { defineComponent, reactive } from 'vue';
  import { XPanel } from '@vtj/ui';
  import { ElButton } from 'element-plus';
  import { dateFormat } from '@vtj/utils';
  import { useProvider } from '@vtj/renderer';
  export default defineComponent({
    name: 'Bbb',
    components: { XPanel, ElButton },
    setup(props) {
      const provider = useProvider({ id: '13dbje0g', version: '1743578537999' });
      const state = reactive({});
      return { state, props, provider, dateFormat };
    },
    methods: {
      click_13mxuu2q({ item, index }, args) {
        return (() => {
          console.log('click panel!', item);
        }).apply(this, args);
      },
      click_33mxuu2q(e) {
        console.log('click button!', e);
        console.log(dateFormat(new Date(), 'YYYY-MM-DD'));
      }
    }
  })
</script>
<style lang="scss" scoped>
  .my-div {
    color: red;
  }

  .div_193l8saav {
    padding-top: 20px;
    padding-bottom: 20px;
    padding-left: 20px;
    padding-right: 20px;
  }
</style>


`;
