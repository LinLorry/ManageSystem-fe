<template>
  <el-aside>
    <el-menu router default-active="/" active-text-color="#ffd04b">
      <el-submenu
        v-for="subMenu in menus"
        v-bind:key="subMenu.name"
        v-bind:index="subMenu.name"
      >
        <template slot="title">
          <i v-bind:class="subMenu.icon"></i>{{ subMenu.name }}
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
    }
  },
  created() {
    let _this = this
    this.axios.get('api/menu').then(res => {
      _this.sortMenu(res.data.data)
      _this.menus = res.data.data
    })
  },
  methods: {
    sortMenu(menus) {
      for (const i in menus) {
        menus[i].children.sort((first, second) => {
          return first.location - second.location
        })
      }
      menus.sort((first, second) => {
        return first.location - second.location
      })
    }
  }
}
</script>

<style>
.el-menu {
  border-right: 0;
}

.el-menu-item.is-active {
  color: #409eff !important;
}
</style>
