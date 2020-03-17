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
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="toolbar">
      <el-form inline ref="queryForm" :model="queryForm" :rules="rules">
        <el-form-item style="width: 150px" prop="id">
          <el-input placeholder="用户ID" v-model="queryForm.id" clearable />
        </el-form-item>
        <el-form-item style="width: 150px" prop="name">
          <el-input
            type="text"
            placeholder="名字"
            v-model="queryForm.name"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitQuery('queryForm')"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
      <el-button @click="createDialogFormVisible = true">新建</el-button>
    </div>

    <el-table stripe :data="users" style="flex-grow: 1" height="use">
      <el-table-column fixed sortable prop="id" label="ID" />
      <el-table-column fixed sortable prop="username" label="用户名" />
      <el-table-column fixed sortable prop="name" label="名字" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" @click="handleEdit(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              v-if="scope.row.disable"
              type="success"
              @click="enable(scope.row.id)"
              >启用</el-button
            >
            <el-button
              size="mini"
              v-else
              type="danger"
              @click="disable(scope.row.id)"
              >禁用</el-button
            >
            <el-button
              type="info"
              size="mini"
              @click="resetPassword(scope.row.id)"
              >重置密码</el-button
            >
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      hide-on-single-page
      :page-count="total"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="sizes, prev, pager, next"
      @size-change="handleSizeChange"
      @current-change="handlePageNumberChange"
    />
    <UserCreator
      :show="createDialogFormVisible"
      @close="createDialogFormVisible = false"
    />
    <UserEditor
      :data="users[editIndex]"
      :show="editDialogFormVisible"
      @close="editDialogFormVisible = false"
      @success="editSuccess($event)"
    />

    <el-dialog
      title="重置用户密码"
      :visible.sync="resetPasswordDialogVisible"
      width="450px"
    >
      <el-form
        hide-required-asterisk
        ref="resetPasswordInfo"
        :model="resetPasswordInfo"
        :rules="resetPasswordRules"
      >
        <el-form-item label="用户ID：">
          <el-input disabled="" v-model="resetPasswordInfo.id" />
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input
            v-model="resetPasswordInfo.password"
            placeholder="新密码"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetPasswordDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleResetPassword">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import UserCreator from '@/views/admin/childComp/UserCreator';
import UserEditor from '@/views/admin/childComp/UserEditor';

export default {
  name: 'UserManage',
  components: {
    UserCreator,
    UserEditor
  },
  data() {
    let checkId = (rule, value, callback) => {
      if (isNaN(Number(value))) {
        return callback(new Error('id为数字，请输入数字'));
      }
      callback();
    };

    return {
      queryForm: {
        id: '',
        name: ''
      },

      queryId: '',
      queryName: '',

      pageSize: 10,
      total: 0,
      pageNumber: 0,

      users: [],
      createDialogFormVisible: false,
      editDialogFormVisible: false,
      resetPasswordDialogVisible: false,
      resetPasswordInfo: {
        id: 0,
        password: ''
      },
      editIndex: 0,
      rules: {
        id: [
          {
            validator: checkId,
            trigger: 'blur'
          }
        ]
      },
      resetPasswordRules: {
        password: [{ required: true, message: '密码不能为空' }]
      }
    };
  },
  created() {
    this.refreshData();
  },
  methods: {
    submitQuery(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const data = this.queryForm;
          this.queryId = data.id;
          this.queryName = data.name;
          this.queryComment = data.comment;

          this.refreshData();
        } else {
          return false;
        }
      });
    },
    handleEdit(id) {
      this.editIndex = this.users.findIndex(u => {
        return u.id === id;
      });
      this.editDialogFormVisible = true;
    },
    editSuccess(data) {
      Object.assign(this.users[this.editIndex], data);
    },
    enable(id) {
      const index = this.users.findIndex(u => {
        return u.id === id;
      });
      let data = this.users[index];
      let _this = this;

      this.$confirm(
        '此操作将启用用户：' + data.username + ', 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          _this.axios
            .post('/api/user/disable', {
              id: data.id,
              operation: false
            })
            .then(res => {
              _this.users[index].disable = false;
              _this.$message({
                message: res.data.message,
                type: 'success',
                showClose: true,
                center: true
              });
            });
        })
        .catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消启用'
          });
        });
    },
    disable(id) {
      const index = this.users.findIndex(u => {
        return u.id === id;
      });
      let data = this.users[index];
      let _this = this;

      this.$confirm(
        '此操作将禁用用户：' + data.username + ', 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          _this.axios
            .post('/api/user/disable', {
              id: data.id,
              operation: true
            })
            .then(res => {
              _this.users[index].disable = true;
              _this.$message({
                message: res.data.message,
                type: 'success',
                showClose: true,
                center: true
              });
            });
        })
        .catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消禁用'
          });
        });
    },
    resetPassword(id) {
      this.resetPasswordInfo.id = id;
      this.resetPasswordDialogVisible = true;
    },
    handleResetPassword() {
      let _this = this;
      this.$refs.resetPasswordInfo.validate(valid => {
        if (valid) {
          _this.resetPasswordDialogVisible = false;
          let data = _this.resetPasswordInfo;

          _this.axios.post('/api/user/password', data).then(res => {
            _this.$message({
              message: res.data.message,
              type: 'success',
              showClose: true,
              center: true
            });
            _this.$emit('success', res.data.data);
          });
        } else {
          return false;
        }
      });
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.refreshData();
    },
    handlePageNumberChange(pageNumber) {
      this.pageNumber = pageNumber - 1;
      this.refreshData();
    },
    refreshData() {
      const _this = this;

      let id = this.queryId;

      if (id !== undefined && id !== null && id.length !== 0) {
        this.axios.get('/api/user?id=' + id).then(res => {
          const data = res.data.data;

          if (data) {
            _this.users = [data];
          } else {
            _this.users = [];
          }

          _this.total = 1;
        });
      } else {
        let url =
          '/api/user?pageSize=' +
          this.pageSize +
          '&pageNumber=' +
          this.pageNumber;

        const name = this.queryName;

        if (name !== undefined && name !== null && name.length !== 0) {
          url += '&name=' + name;
        }

        this.axios.get(url).then(res => {
          const data = res.data.data;

          _this.pageSize = data.size;
          _this.total = data.total;
          _this.users = data.users;
        });
      }
    }
  }
};
</script>

<style>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
</style>
