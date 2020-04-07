<template> <div></div></template>

<script>
export default {
  created() {
    const code = this.$route.query.code;

    if (code) {
      this.$loginFlag = false;
      const _this = this;
      this.axios('/api/wechat/login?code=' + code).then(res => {
        const token = res.data.token;
        localStorage.setItem('wechatUserInfo', JSON.stringify(res.data.data));
        if (token) {
          localStorage.setItem('token', token);
          _this.$router.push('/wechat');
        } else {
          _this.$router.push('/wechat/info');
        }
      });
      return;
    }

    location.href =
      'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8eb0addaf4641342&redirect_uri=' +
      location.href +
      '&response_type=code&scope=snsapi_base#wechat_redirect';
  }
};
</script>
