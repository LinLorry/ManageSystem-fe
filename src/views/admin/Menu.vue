<template>
  <el-card
    body-style="
    display: flex;
    flex-direction: column;
    flex-grow:1;
    margin-bottom: 20px"
    style="display: flex;
    flex-direction: column;"
  >
    <div slot="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div>
      <el-button @click="createParentDialogFormVisible = true"
        >新建父菜单</el-button
      >
      <el-button @click="createChildDialogFormVisible = true"
        >新建子菜单</el-button
      >
      <el-tree
        draggable
        highlight-current
        ref="tree"
        node-key="id"
        :data="menus"
        :allow-drop="allowDrop"
        @node-drag-start="handleDragStart"
        @node-drag-end="handleDragEnd"
        @node-drop="handleDrag"
      >
        <span slot-scope="{ node, data }">
          <el-button type="text" size="mini" @click="() => edit(data)">
            {{ data.label }}
          </el-button>
        </span>
      </el-tree>

      <el-button @click="updateLocation">更新菜单排序</el-button>
    </div>

    <ParentCreator
      :show="createParentDialogFormVisible"
      :parentMenus="menus"
      @close="createParentDialogFormVisible = false"
      @success="createParent($event)"
    ></ParentCreator>

    <ParentEditor
      :show="editParentDialogFormVisible"
      :data="tmp"
      :parentMenus="menus"
      @close="editParentDialogFormVisible = false"
      @success="editParent($event)"
    >
    </ParentEditor>

    <ChildCreator
      :show="createChildDialogFormVisible"
      :parentMenus="menus"
      @close="createChildDialogFormVisible = false"
      @success="createChild($event)"
    ></ChildCreator>

    <ChildEditor
      :show="editChildDialogFormVisible"
      :data="tmp"
      :parentMenus="menus"
      @close="editChildDialogFormVisible = false"
      @success="editChild($event)"
    >
    </ChildEditor>
  </el-card>
</template>

<script>
import ParentCreator from './childComp/ParentMenuCreator';
import ParentEditor from './childComp/ParentMenuEditor';
import ChildCreator from './childComp/ChildMenuCreator';
import ChildEditor from './childComp/ChildMenuEditor';

export default {
  name: 'roleManage',
  components: {
    ParentCreator,
    ParentEditor,
    ChildCreator,
    ChildEditor
  },
  data() {
    return {
      createParentDialogFormVisible: false,
      editParentDialogFormVisible: false,
      createChildDialogFormVisible: false,
      editChildDialogFormVisible: false,

      menus: [],
      tmp: {},
      deleteNode: {
        id: 'delete',
        label: '删除',
        isDelete: true,
        children: []
      },
      deleteAdmin: false
    };
  },
  created() {
    const _this = this;
    this.axios.get('/api/menu/parent').then(res => {
      let data = res.data.data;
      _this.sortMenu(data);
      let menus = _this.menus;

      for (const parentIndex in data) {
        let parent = data[parentIndex];

        menus.push(
          Object.assign(parent, {
            label: parent.name,
            isChild: false
          })
        );

        for (const childIndex in parent.children) {
          let child = parent.children[childIndex];

          Object.assign(child, {
            label: child.name,
            isChild: true,
            parentId: parent.id
          });
        }
      }
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
    },
    createParent(data) {
      this.menus.splice(
        0,
        0,
        Object.assign(data, {
          label: data.name,
          isChild: false,
          children: []
        })
      );
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
        );
    },
    edit(data) {
      if (data.isChild) {
        this.editChildDialogFormVisible = true;
      } else {
        this.editParentDialogFormVisible = true;
      }
      this.tmp = data;
    },
    editParent(data) {
      let parent = this.menus.find(one => one.id === data.id);

      parent.label = data.name;
      parent.name = data.name;
      parent.icon = data.icon;
    },
    editChild(data) {
      let oldParent = this.menus.find(one => one.id === data.oldParentId);

      oldParent.children.splice(
        oldParent.children.findIndex(one => one.id === data.id),
        1
      );

      let parent = this.menus.find(one => one.id === data.parentId);

      parent.children.splice(
        0,
        0,
        Object.assign(data, {
          label: data.name,
          isChild: true,
          parentId: parent.id
        })
      );
    },
    updateLocation() {
      let location = 0;
      let childLocation = 0;
      let parentIdLocationMap = [];
      let childIdLocationMap = [];

      let childParentChangeMap = [];

      for (const parentMenu of this.menus) {
        parentIdLocationMap.push({
          id: parentMenu.id,
          location
        });
        location++;
        childLocation = 0;

        for (const childMenu of parentMenu.children) {
          childIdLocationMap.push({
            id: childMenu.id,
            location: childLocation
          });
          childLocation++;

          if (childMenu.parentId !== parentMenu.id) {
            childParentChangeMap.push({
              id: childMenu.id,
              parentId: parentMenu.id
            });
          }
        }
      }

      let successSize = 2 + childParentChangeMap.length;

      const _this = this;
      let callback = () => {
        if (--successSize === 0) {
          _this.$message({
            message: '更新菜单成功',
            type: 'success',
            showClose: true,
            center: true
          });
          _this.$router.go(0);
        }
      };

      // TODO 优化更新，判断修改
      this.axios
        .post('/api/menu/parent/location', parentIdLocationMap)
        .then(callback);
      this.axios
        .post('/api/menu/child/location', childIdLocationMap)
        .then(() => {
          callback();
          for (const one of childParentChangeMap) {
            this.axios.post('/api/menu/child', one).then(callback);
          }
        });
    },
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.isDelete) {
        if (type === 'next') return false;
        const id = draggingNode.data.id;
        const isChild = draggingNode.data.isChild;

        if (id === 1 || (isChild && id === 2)) {
          this.deleteAdmin = true;
          return false;
        }

        return true;
      }

      if (draggingNode.data.isChild) {
        if (dropNode.data.isChild) {
          if (type !== 'inner') {
            return true;
          }
        } else {
          if (type === 'inner') {
            return true;
          }
        }
      } else {
        if (!dropNode.data.isChild && type !== 'inner') {
          return true;
        }
      }

      return false;
    },
    handleDragStart() {
      this.$refs.tree.append(this.deleteNode);
    },
    handleDragEnd() {
      if (this.deleteAdmin) {
        this.deleteAdmin = false;
        this.$message({
          message: '不能删除这个菜单',
          type: 'error',
          showClose: true,
          center: true
        });
      }
      this.$refs.tree.remove(this.deleteNode);
    },
    handleDrag(draggingNode, dropNode, type) {
      if (dropNode.data.isDelete && type !== 'before') {
        let url;
        const data = draggingNode.data;
        if (data.isChild) {
          url = '/api/menu/child?id=';
        } else {
          url = '/api/menu/parent?id=';
        }
        url += data.id;
        const _this = this;
        this.axios.delete(url).then(res => {
          _this.$message({
            message: res.data.message,
            type: 'success',
            showClose: true,
            center: true
          });
          _this.deleteNode.children.splice(0, this.deleteNode.children.length);
        });
      }
    }
  }
};
</script>

<style></style>
