<template>
  <Auth v-if="remote" :remote="remote"></Auth>
</template>
<script lang="ts" setup>
  import { LocalService, Auth } from '../../src';
  const service = new LocalService();
  const config = await service.getExtension().catch(() => null);

  const remote = config?.remote;
</script>
