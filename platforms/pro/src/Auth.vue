<template>
  <div class="loading">正在登录中...</div>
</template>
<script lang="ts" setup>
  import { useRoute } from 'vue-router';
  import { createAccess } from '@vtj/pro';
  import { ElMessageBox } from 'element-plus';
  import { jsonp } from '@vtj/utils';

  export interface Props {
    remote?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    remote: 'https://lcdp.vtj.top'
  });

  const access = createAccess({
    alert: ElMessageBox.alert
  });

  const route = useRoute();
  const getLoginInfo = async (token: string) => {
    const api = `${props.remote}/api/open/user/${token}`;
    const res = await jsonp(api).catch(() => null);
    if (!res || !res.success) {
      await ElMessageBox.alert('登录失败');
      return null;
    } else {
      return res.data;
    }
  };

  const token = route.query.token as string;
  const info = token ? await getLoginInfo(token) : null;
  if (info) {
    try {
      access.login(info);
      const redirect = route.query.redirect as string;
      location.href = decodeURIComponent(redirect || '/');
    } catch (e) {
      location.reload();
    }
  }
</script>

<style lang="scss" scoped>
  .loading {
    padding: 40px;
  }
</style>
