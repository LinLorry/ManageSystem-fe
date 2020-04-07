<template>
  <van-cell-group title="提交申请信息">
    <van-form @submit="submitInfo">
      <van-field
        v-model="name"
        label="真实姓名"
        :rules="[{ required: true, message: '请填写真实姓名' }]"
      />

      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">
          提交申请
        </van-button>
      </div>
    </van-form>
  </van-cell-group>
</template>

<script>
export default {
  name: 'WechatInfo',
  data() {
    const wechatUserInfo = JSON.parse(localStorage.getItem('wechatUserInfo'));
    let name = '';
    if (wechatUserInfo.name) {
      name = wechatUserInfo.name;
    }
    return {
      name,
      show: false
    };
  },
  created() {
    let _this = this;
    const data = {
      code: this.$route.query.code,
      name: decodeURI(this.$route.query.name)
    };

    if (data.code) {
      this.axios.post('/api/wechat/info', data).then(res => {
        localStorage.setItem('wechatUserInfo', JSON.stringify(res.data.data));
        _this.name = res.data.data.name;
      });
    }
  },
  methods: {
    submitInfo() {
      location.href =
        'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx8eb0addaf4641342&redirect_uri=' +
        encodeURI(location.href + '?name=' + this.name) +
        '&response_type=code&scope=snsapi_userinfo#wechat_redirect';
    }
  }
};
</script>
