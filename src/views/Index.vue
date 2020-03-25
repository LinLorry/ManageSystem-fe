<template>
  <div class="index">
    <el-container style="height: 100% !important;border: 1px solid #eee">
      <el-header class="header">
        <span>管理系统</span>
        <span style="color: white">
          <strong> {{ userInfo.username }} </strong>
        </span>
      </el-header>
      <el-main class="main">
        <IndexMenu />
        <router-view class="content" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import IndexMenu from '@/components/IndexMenu.vue';

export default {
  name: 'index',
  components: {
    IndexMenu
  },
  data() {
    this.getProfile();
    return {
      userInfo: {}
    };
  },
  methods: {
    getProfile() {
      const _this = this;
      this.axios.get('/api/user/profile').then(res => {
        localStorage.setItem('userInfo', JSON.stringify(res.data.data));
        _this.userInfo = res.data.data;
      });
    }
  }
};
</script>

<style>
.index {
  height: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  color: white;
  background-color: #2a2f36;
  line-height: 60px;
}

.main {
  display: flex;
  padding: 0;
  background-color: #97999c;
}

.content {
  margin: 20px;
  flex-grow: 1;
  background-color: aliceblue;
  display: flex;
  flex-direction: column;
}

.query-box .el-input {
  width: 150px;
}
</style>
