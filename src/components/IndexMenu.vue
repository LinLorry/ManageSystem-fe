<template>
  <el-aside>
    <el-menu
      class="index-menu"
      router
      unique-opened
      default-active="home"
      active-text-color="#ffd04b"
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
  </el-aside>
</template>

<script>
export default {
  name: 'indexMenu',
  data() {
    return {
      menus: []
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
      for (const i in menus) {
        menus[i].children.sort((first, second) => {
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
.el-menu-item.is-active {
  color: #409eff !important;
}
</style>
