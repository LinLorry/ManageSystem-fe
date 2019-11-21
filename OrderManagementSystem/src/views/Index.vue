<template>
  <div class="index">
    <!-- <h1>后端首页</h1>
    <div>{{ $store.state.userinfo }}</div> -->
    <el-container style="height: 500px; border: 1px solid #eee">
      <!-- 左侧导航 -->
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu
          default-active="/"
          router
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <!-- 默认目录首页 -->
          <el-menu-item class="title-name" index="/" style="background: #333;">
            <i class="el-icon-setting"></i>
            订单管理系统
          </el-menu-item>

          <el-submenu index="1">
            <template slot="title"
              ><i class="el-icon-message"></i>账号管理</template
            >
            <el-menu-item index="userlist">账号列表</el-menu-item>
            <el-menu-item index="VIPuser">VIP账号</el-menu-item>
            <el-menu-item index="passwordedit">修改密码</el-menu-item>
          </el-submenu>

          <el-submenu index="2">
            <template slot="title"
              ><i class="el-icon-menu"></i>生产管理</template
            >
            <el-menu-item index="procedureManagement">工序管理</el-menu-item>
            <el-menu-item index="processManagement">生产流程管理</el-menu-item>
            <el-menu-item index="procedureConfiguration"
              >流程工序配置</el-menu-item
            >
          </el-submenu>

          <el-submenu index="3">
            <template slot="title"
              ><i class="el-icon-setting"></i>订单管理</template
            >
            <el-menu-item index="createOrder">创建订单</el-menu-item>
            <el-menu-item index="orderView">订单查看</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 右侧内容 -->
      <el-container>
        <!-- 路由出口 -->
        <router-view></router-view>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [
        {
          date: '2019-05-02',
          name: 'XXX',
          address: 'XXX'
        }
      ]
    }
  },
  methods: {}
}
</script>

<style>
html,
body,
#app,
.index {
  height: 100%;
}

.el-container {
  height: 100% !important;
}

.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  background-color: #545c64 !important;
}

.el-menu {
  border-right: 0;
}

.title-name {
  height: 60px;
  font-size: 18px;
}
.el-menu-item.is-active {
  color: #409eff !important;
}
</style>
