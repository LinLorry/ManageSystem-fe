<template>
  <router-view />
</template>

<script>
export default {
  name: 'WechatIndex',
  created() {
    localStorage.setItem('platform', 'wechat');
  }
};
</script>
