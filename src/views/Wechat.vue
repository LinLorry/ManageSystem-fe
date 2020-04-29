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

<style>
body {
  background-color: #f7f8fa;
}
</style>
