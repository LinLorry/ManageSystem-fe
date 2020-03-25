<template>
  <el-card
    body-style="
      display: flex;
      flex-direction: column;
      flex-grow:1;
    "
  >
    <div slot="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>员工管理</el-breadcrumb-item>
        <el-breadcrumb-item>微信用户管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form inline ref="queryForm" class="query-box" :model="queryForm">
      <el-form-item prop="id">
        <el-input clearable placeholder="微信用户ID" v-model="queryForm.id" />
      </el-form-item>
      <el-form-item prop="name">
        <el-input clearable placeholder="名字" v-model="queryForm.name" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitQuery">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table stripe height="use" :data="wechatUsers">
      <el-table-column fixed sortable prop="id" label="ID" />
      <el-table-column sortable prop="name" label="名字" />
      <el-table-column sortable prop="nickname" label="微信名称" />
      <el-table-column sortable prop="city" label="城市" />
      <el-table-column
        sortable
        prop="sex"
        label="性别"
        :formatter="sexFormatter"
      />
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="wechatUsers[scope.$index].user"
            size="mini"
            @click="handleEdit(scope.$index)"
            >编辑</el-button
          >
          <el-button
            v-else
            type="info"
            size="mini"
            @click="createUser(scope.$index)"
            >启用</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      style="padding-top: 10px; text-align: right"
      layout="sizes, prev, pager, next"
      :page-count="total"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      @size-change="handleSizeChange"
      @current-change="handlePageNumberChange"
    />
    <WorkerEditor
      :show="editDialogFormVisible"
      :data="
        wechatUsers[editIndex] === undefined
          ? null
          : wechatUsers[editIndex].user
      "
      @close="editDialogFormVisible = false"
    />
  </el-card>
</template>

<script>
import WorkerEditor from './childComp/WorkerEditor';

export default {
  name: 'WechatWorker',
  components: {
    WorkerEditor
  },
  data() {
    return {
      queryForm: {
        id: '',
        name: ''
      },

      queryId: '',
      queryName: '',

      pageSize: 20,
      total: 0,
      pageNumber: 0,

      wechatUsers: [],
      editDialogFormVisible: false,
      editIndex: 0,
      tmp: {}
    };
  },
  created() {
    this.refreshData();
  },
  methods: {
    submitQuery() {
      this.$refs.queryForm.validate(valid => {
        if (valid) {
          const data = this.queryForm;
          this.queryId = data.id;
          this.queryName = data.name;

          this.refreshData();
        } else {
          return false;
        }
      });
    },
    createUser(index) {
      const data = this.wechatUsers[index];
      let _this = this;
      this.axios.post('/api/wechat/user/enable', { id: data.id }).then(res => {
        _this.$message({
          message: res.data.message,
          type: 'success',
          showClose: true,
          center: true
        });
        Object.assign(_this.wechatUsers[index], res.data.data);
      });
    },
    sexFormatter(row, column, sex) {
      if (sex) {
        if (sex === 0) {
          return '未知';
        } else if (sex === 1) {
          return '男';
        } else if (sex === 2) {
          return '女';
        }
      }
    },
    handleEdit(index) {
      this.editIndex = index;
      this.editDialogFormVisible = true;
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
        this.axios.get('/api/wechat/user?id=' + id).then(res => {
          const data = res.data.data;

          if (data) {
            _this.wechatUsers = [data];
          } else {
            _this.wechatUsers = [];
          }

          _this.total = 1;
        });
      } else {
        let url =
          '/api/wechat/user?pageSize=' +
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
          _this.wechatUsers = data.wechatUsers;
        });
      }
    }
  }
};
</script>

<style></style>
