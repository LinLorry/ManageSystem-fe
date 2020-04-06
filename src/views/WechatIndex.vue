<template>
  <div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'WechatIndex',
  created() {
    localStorage.setItem('platform', 'wechat');
  }
};
</script>

<style scoped></style>
