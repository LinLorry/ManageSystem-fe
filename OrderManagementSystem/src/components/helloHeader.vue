<template>
  <div class="helloHeader">
    <el-header style="text-align: right; font-size: 12px">
      <el-dropdown>
        <i class="el-icon-setting"
           style="margin-right: 15px"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>个人信息</el-dropdown-item>
          <el-dropdown-item>退出系统</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span class="username">
        <!-- {{$store.state.userinfo.username}} -->
        <!-- {{username}} -->
        admin
      </span>
    </el-header>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  computed: {
    username () {
      return this.$store.state.userinfo.username
    }
  }
}
</script>

<style scoped>
.helloHeader {
  width: 100%;
}

.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.username {
  font-size: 20px;
  color: #409eff;
}
</style>
