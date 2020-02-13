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
      <el-button @click="createChildDialogFormVisible = true"
        >新建子菜单</el-button
      >
      <el-tree :data="menus">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <el-button type="text" size="mini" @click="() => edit(data)">
            {{ data.label }}
          </el-button>
        </span>
      </el-tree>
    </div>
    <div>
      <ParentCreater
        :show="createParentDialogFormVisible"
        :parentMenus="menus"
        @close="createParentDialogFormVisible = false"
        @success="createParent($event)"
      ></ParentCreater>

      <ParentEditer
        :show="editParentDialogFormVisible"
        :data="tmp"
        :parentMenus="menus"
        v-on:close="editParentDialogFormVisible = false"
        v-on:success="editParent($event)"
      >
      </ParentEditer>

      <ChildCreater
        :show="createChildDialogFormVisible"
        :parentMenus="menus"
        v-on:close="createChildDialogFormVisible = false"
        v-on:success="createChild($event)"
      ></ChildCreater>
    </div>
  </div>
</template>

<script>
import ParentCreater from './childComp/ParentMenuCreater'
import ParentEditer from './childComp/ParentMenuEditer'
import ChildCreater from './childComp/ChildMenuCreater'

export default {
  name: 'roleManage',
  components: {
    ParentCreater,
    ParentEditer,
    ChildCreater
  },
  data() {
    return {
      createParentDialogFormVisible: false,
      editParentDialogFormVisible: false,
      createChildDialogFormVisible: false,
      editChildDialogFormVisible: false,

      menus: [],
      tmp: {}
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
    },
    createChild(data) {
      this.menus
        .find(one => one.id === data.parentId)
        .children.splice(
          0,
          0,
          Object.assign(data, {
            label: data.name,
            isChild: true
          })
        )
    },
    edit(data) {
      if (data.isChild) {
        this.editChildDialogFormVisible = true
      } else {
        this.editParentDialogFormVisible = true
      }
      this.tmp = data
    },
    editParent(data) {
      let parent = this.menus.find(one => one.id === data.id)

      parent.label = data.name
      parent.name = data.name
      parent.icon = data.icon
    }
  }
}
</script>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
