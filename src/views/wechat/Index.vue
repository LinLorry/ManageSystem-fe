<template>
  <div>
    <keep-alive>
      <component :is="active" :level="level"></component>
    </keep-alive>
    <van-tabbar route fixed placeholder v-model="active">
      <van-tabbar-item icon="apps-o" name="Home">工作台</van-tabbar-item>
      <van-tabbar-item icon="user-o" name="Profile">个人信息</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import Home from './childComp/Home';
import Profile from './childComp/Profile';

export default {
  name: 'Index',
  components: { Home, Profile },
  data() {
    return {
      active: 'Home',
      level: []
    };
  },
  created() {
    let _this = this;

    this.$axios('/api/user/level').then(res => {
      _this.level.splice(0, _this.level.length);
      _this.level.push.apply(_this.level, res.data.data);
    });
  }
};
</script>

<style></style>
