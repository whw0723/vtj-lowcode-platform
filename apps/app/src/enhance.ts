import type { App } from 'vue';
import type { Provider } from '@vtj/renderer';
import { createPinia, defineStore } from 'pinia';
import { authService } from './services/auth';
import axios from 'axios';
import './style/global.scss';
const pinia = createPinia();
const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0
  }),
  getters: {
    doubleCount: (state) => state.count * 2
  }
});

export default function (app: App, provider: Provider) {
  app.use(pinia);
  app.provide('counter', useCounterStore());

  // 在开发环境中不设置baseURL，使用代理
  // 在生产环境中设置baseURL
  if (process.env.NODE_ENV === 'production') {
    axios.defaults.baseURL = 'http://192.168.80.79:8000';
  }

  // 初始化认证服务
  authService.autoLogin().then(success => {
    if (success) {
      console.log('认证服务初始化成功');
    } else {
      console.warn('认证服务初始化失败');
    }
  });

  provider.adapter.request.useRequest((config) => {
    // 注入认证头
    const authHeaders = authService.getAuthHeaders();
    Object.assign(config.headers, authHeaders);

    // 注入其他请求头
    config.headers.Token = '123456';
    return config;
  });

  provider.adapter.request.useResponse(async (res) => {
    // 处理认证失败的情况
    if (res.data && res.data.code === '1001') {
      console.log('VTJ请求系统检测到认证失败，尝试重新登录...');
      const success = await authService.autoLogin();
      if (success) {
        console.log('重新登录成功，请重试请求');
        // 注意：VTJ的响应拦截器不支持自动重试，需要在业务层处理
      }
    }
    return res;
  });
}
