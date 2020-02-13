<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <el-button @click="createParentDialogFormVisible = true"
        >新建父菜单</el-button
      >
      <el-tree :data="menus">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <el-button type="text" size="mini">
            {{ data.label }}
          </el-button>
        </span>
      </el-tree>
    </div>
    <div>
      <ParentCreater
        :show="createParentDialogFormVisible"
        :parentMenus="menus"
        v-on:close="createParentDialogFormVisible = false"
        v-on:success="createParent($event)"
      ></ParentCreater>
    </div>
  </div>
</template>

<script>
import ParentCreater from './childComp/ParentMenuCreater'

export default {
  name: 'roleManage',
  components: {
    ParentCreater
  },
  data() {
    return {
      createParentDialogFormVisible: false,
      menus: []
    }
  },
  created() {
    const _this = this
    this.axios.get('/api/menu/parent').then(res => {
      let data = res.data.data
      _this.sortMenu(data)
      let menus = _this.menus

      for (const parentIndex in data) {
        let parent = data[parentIndex]

        menus.push(
          Object.assign(parent, {
            label: parent.name,
            isChild: false
          })
        )

        for (const childIndex in parent.children) {
          let child = parent.children[childIndex]

          Object.assign(child, {
            label: child.name,
            isChild: true
          })
        }
      }
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
    },
    createParent(data) {
      this.menus.splice(
        0,
        0,
        Object.assign(data, {
          label: data.name,
          isChild: false
        })
      )
    }
  }
}
</script>

<style>
.content {
  margin: 10px 0;
  background-color: aliceblue;
  border-radius: 2px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 30px 30px 30px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
