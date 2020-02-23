<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <div class="query-box">
        <el-form
          label-width="auto"
          ref="queryFrom"
          :model="queryForm"
          :inline="true"
        >
          <el-form-item>
            <el-input
              class="input_test"
              placeholder="权限ID"
              v-model="queryForm.roleId"
              clearable
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              class="input_test"
              type="text"
              placeholder="权限名称"
              v-model="queryForm.roleName"
              clearable
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              class="input_test"
              type="text"
              placeholder="权限控制"
              v-model="queryForm.roleRole"
              clearable
            >
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="create-box">
        <el-button
          style="display: inline-block;"
          @click="createDialogFormVisible = true"
          >新建</el-button
        >
      </div>

      <div class="query-result">
        <el-table stripe :data="roles" style="width: 100%" max-height="650px">
          <el-table-column fixed sortable prop="id" label="ID">
          </el-table-column>
          <el-table-column fixed sortable prop="name" label="权限名称">
          </el-table-column>
          <el-table-column fixed sortable prop="role" label="权限控制">
          </el-table-column>
          <el-table-column
            fixed
            sortable
            prop="createTime"
            label="创建时间"
            :formatter="timeFormatter"
          ></el-table-column>
          <el-table-column
            fixed
            sortable
            prop="updateTime"
            label="更新时间"
            :formatter="timeFormatter"
          ></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- <el-pagination background layout="prev, pager, next" :total="10">
        </el-pagination> -->
      </div>
    </div>

    <RoleCreater
      :show="createDialogFormVisible"
      v-on:close="createDialogFormVisible = false"
      v-on:success="roles.push($event)"
    ></RoleCreater>
    <RoleEditer
      ref="editer"
      :show="editDialogFormVisible"
      :data="tmp"
      v-on:close="editDialogFormVisible = false"
      v-on:success="editSuccess($event)"
    >
    </RoleEditer>
  </div>
</template>

<script>
import RoleCreater from './childComp/RoleCreater';
import RoleEditer from './childComp/RoleEditer';

export default {
  name: 'roleManage',
  components: {
    RoleCreater,
    RoleEditer
  },
  data() {
    return {
      queryForm: {
        roleId: '',
        roleName: '',
        roleRole: ''
      },
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
    handleEdit(index) {
      this.editIndex = index;
      this.tmp = this.roles[index];
      this.editDialogFormVisible = true;
    },
    handleDelete(index) {
      let _this = this;
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          _this.axios
            .delete('/api/role?id=' + _this.roles[index].id)
            .then(res => {
              _this.$message({
                message: res.data.message,
                type: 'success',
                showClose: true,
                center: true
              });
              _this.roles.splice(index, 1);
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
      let role = this.roles[this.editIndex];
      for (const i in role) {
        role[i] = data[i];
      }
    },
    timeFormatter(row, column, cellValue) {
      return new Date(cellValue).toLocaleDateString();
    }
  }
};
</script>

<style>
.query-box {
  display: block;
  width: 700px;
  /* clear: both; */
}

.query-box .el-form-item {
  width: 150px;
}

.create-box {
  display: block;
  width: 80px;
  /* float: right; */
}
</style>
