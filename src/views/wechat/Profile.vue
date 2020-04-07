<template>
  <div>
    <van-cell-group title="个人信息">
      <van-cell title="姓名" :value="userInfo.name" />
    </van-cell-group>

    <van-cell-group v-if="processes.length !== 0" title="负责的工序">
      <van-cell v-for="item of processes" :key="item.id" :value="item.name" />
    </van-cell-group>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  data() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    let processes = JSON.parse(localStorage.getItem('userProcesses'));

    let id = 0;
    let name = '';

    if (userInfo) {
      id = userInfo.id;
      name = userInfo.name;
    }

    if (!processes) {
      processes = [];
    }

    return {
      userInfo: {
        id,
        name
      },
      processes
    };
  },
  created() {
    let _this = this;
    this.$axios('/api/user/profile').then(res => {
      Object.assign(_this.userInfo, res.data.data);
      localStorage.setItem('userInfo', JSON.stringify(res.data.data));
    });

    this.$axios('/api/user/processes').then(res => {
      res.data.data.sort((f, s) => {
        return f.id - s.id;
      });
      _this.processes.splice(0, _this.processes.length);
      _this.processes.push.apply(_this.processes, res.data.data);

      localStorage.setItem('userProcesses', JSON.stringify(res.data.data));
    });
  }
};
</script>

<style></style>
