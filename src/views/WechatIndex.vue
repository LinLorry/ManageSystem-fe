<template>
  <div>
    <router-view />
    <IndexTabbar />
  </div>
</template>

<script>
import IndexTabbar from '@/components/IndexTabbar';

export default {
  name: 'WechatIndex',
  components: {
    IndexTabbar
  },
  created() {
    localStorage.setItem('platform', 'wechat');
  }
};
</script>

<style scoped></style>
