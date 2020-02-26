<template>
  <div style="height: 100%; background-color: #FFF">
    <el-menu
      class="index-menu"
      router
      unique-opened
      default-active="home"
      active-text-color="#409EFF"
      :collapse="isCollapse"
    >
      <el-menu-item index="home" route="/">
        <i class="el-icon-s-home"></i> <span slot="title">首页</span>
      </el-menu-item>
      <el-submenu
        v-for="subMenu in menus"
        v-bind:key="subMenu.name"
        v-bind:index="subMenu.name"
      >
        <template slot="title">
          <i v-bind:class="subMenu.icon"></i>
          <span slot="title">{{ subMenu.name }}</span>
        </template>
        <el-menu-item
          v-for="menu in subMenu.children"
          v-bind:index="menu.name"
          v-bind:key="menu.name"
          v-bind:route="menu.url"
        >
          {{ menu.name }}
        </el-menu-item>
      </el-submenu>
    </el-menu>
    <div class="collapse" @click="isCollapse = !isCollapse">
      <i class="el-icon-s-fold"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'indexMenu',
  data() {
    return {
      menus: [],
      isCollapse: false
    };
  },
  created() {
    let _this = this;
    this.axios.get('/api/menu').then(res => {
      _this.sortMenu(res.data.data);
      _this.menus = res.data.data;
    });
  },
  methods: {
    sortMenu(menus) {
      for (let menu of menus) {
        menu.children.sort((first, second) => {
          return first.location - second.location;
        });
      }
      menus.sort((first, second) => {
        return first.location - second.location;
      });
    }
  }
};
</script>

<style>
.index-menu:not(.el-menu--collapse) {
  width: 300px;
}

.collapse {
  cursor: pointer;
  padding: 0 20px;
  line-height: 56px;
}

.collapse i {
  width: 24px;
  text-align: center;
  font-size: 18px;
  vertical-align: middle;
  color: #909399;
}
</style>
