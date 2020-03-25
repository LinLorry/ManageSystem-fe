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
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-table
      stripe
      :data="
        roles.filter(
          data =>
            !search ||
            data.name.toLowerCase().includes(search.toLowerCase()) ||
            data.role.toLowerCase().includes(search.toLowerCase())
        )
      "
      height="use"
    >
      <el-table-column fixed sortable prop="id" label="ID" />
      <el-table-column sortable prop="name" label="权限名称" />
      <el-table-column sortable prop="role" label="权限控制" />
      <el-table-column
        sortable
        prop="createTime"
        label="创建时间"
        :formatter="timeFormatter"
      />
      <el-table-column
        sortable
        prop="updateTime"
        label="更新时间"
        :formatter="timeFormatter"
      />
      <el-table-column fixed="right" label="操作" align="right">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="mini"
            placeholder="输入关键字搜索"
            :slot="scope"
          />
          <el-button
            style="margin-top: 5px"
            size="mini"
            @click="createDialogFormVisible = true"
            >新建</el-button
          >
        </template>
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" @click="handleEdit(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id)"
              >删除</el-button
            >
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <RoleCreator
      :show="createDialogFormVisible"
      v-on:close="createDialogFormVisible = false"
      v-on:success="roles.push($event)"
    />

    <RoleEditor
      :show="editDialogFormVisible"
      :data="tmp"
      v-on:close="editDialogFormVisible = false"
      v-on:success="editSuccess($event)"
    />
  </el-card>
</template>

<script>
import RoleCreator from './childComp/RoleCreator';
import RoleEditor from './childComp/RoleEditor';

export default {
  name: 'roleManage',
  components: {
    RoleCreator,
    RoleEditor
  },
  data() {
    return {
      search: '',
      roles: [],
      createDialogFormVisible: false,
      editDialogFormVisible: false,
      editIndex: 0,
      tmp: {}
    };
  },
  created() {
    const _this = this;
    this.axios.get('/api/role').then(res => {
      _this.roles = res.data.data;
    });
  },
  methods: {
    handleEdit(id) {
      this.tmp = this.roles.find(r => {
        return r.id === id;
      });
      this.editDialogFormVisible = true;
    },
    handleDelete(id) {
      let _this = this;
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          _this.axios.delete('/api/role?id=' + id).then(res => {
            _this.$message({
              message: res.data.message,
              type: 'success',
              showClose: true,
              center: true
            });
            _this.roles.splice(
              _this.roles.findIndex(r => {
                return r.id === id;
              }),
              1
            );
          });
        })
        .catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    editSuccess(data) {
      Object.assign(
        this.roles.find(r => {
          return r.id === data.id;
        }),
        data
      );
    },
    timeFormatter(row, column, cellValue) {
      return new Date(cellValue).toLocaleDateString();
    }
  }
};
</script>

<style></style>
