<template>
  <van-tabbar route fixed placeholder>
    <van-tabbar-item icon="apps-o" to="/wechat/home">工作台</van-tabbar-item>
    <van-tabbar-item icon="orders-o" to="/wechat/product">订单</van-tabbar-item>
    <van-tabbar-item icon="user-o" to="/wechat/profile"
      >个人信息</van-tabbar-item
    >
  </van-tabbar>
</template>

<script>
export default {
  name: 'IndexTabbar'
};
</script>

<style></style>
