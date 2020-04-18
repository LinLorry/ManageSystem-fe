<template>
  <div class="index">
    <el-container style="height: 100% !important;border: 1px solid #eee">
      <el-header class="header">
        <span>管理系统</span>

        <el-dropdown @command="dropDownCommand">
          <span style="color: white">
            <strong> {{ userInfo.username }} </strong>
          </span>
          <el-dropdown-menu>
            <el-dropdown-item command="changePassword">
              修改密码
            </el-dropdown-item>
            <el-dropdown-item command="logout">
              退出系统
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main class="main">
        <IndexMenu />
        <router-view class="content" />
      </el-main>
    </el-container>
    <ChangePassword
      :show="changePasswordDialogFormVisible"
      @close="changePasswordDialogFormVisible = false"
    />
  </div>
</template>

<script>
import IndexMenu from '@/components/IndexMenu.vue';
import ChangePassword from '@/components/ChangePassword';

export default {
  name: 'index',
  components: {
    IndexMenu,
    ChangePassword
  },
  data() {
    this.getProfile();
    return {
      userInfo: {},
      changePasswordDialogFormVisible: false
    };
  },
  methods: {
    getProfile() {
      const _this = this;
      this.axios.get('/api/user/profile').then(res => {
        localStorage.setItem('userInfo', JSON.stringify(res.data.data));
        _this.userInfo = res.data.data;
      });
    },
    dropDownCommand(command) {
      switch (command) {
        case 'changePassword':
          this.changePasswordDialogFormVisible = true;
          break;
        case 'logout':
          localStorage.clear();
          this.$message({
            type: 'info',
            message: '退出登陆成功',
            showClose: true,
            center: true
          });
          this.$router.replace('/login');
          break;
      }
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
