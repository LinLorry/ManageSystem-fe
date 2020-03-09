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
        <el-breadcrumb-item>微信用户管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form inline ref="queryForm" :model="queryForm">
      <el-form-item style="width: 150px" prop="id">
        <el-input placeholder="微信用户ID" v-model="queryForm.id" clearable>
        </el-input>
      </el-form-item>
      <el-form-item style="width: 150px" prop="name">
        <el-input placeholder="名字" v-model="queryForm.name" clearable>
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitQuery('queryForm')"
          >查询</el-button
        >
      </el-form-item>
    </el-form>

    <el-table stripe :data="wechatUsers" style="flex-grow: 1" height="use">
      <el-table-column fixed sortable prop="id" label="ID" />
      <el-table-column fixed sortable prop="name" label="名字" />
      <el-table-column fixed sortable prop="nickname" label="微信名称" />
      <el-table-column fixed sortable prop="city" label="城市" />
      <el-table-column
        fixed
        sortable
        prop="sex"
        label="性别"
        :formatter="sexFormatter"
      />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleSet(scope.$index)"
            >编辑</el-button
          >
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
    <WechatUserSetter
      :show="setterDialogFormVisible"
      :data="tmp"
      @close="setterDialogFormVisible = false"
      @success="setSuccess($event)"
    />
  </el-card>
</template>

<script>
import WechatUserSetter from './childComp/WechatUserSetter';

export default {
  name: 'wechatManage',
  components: {
    WechatUserSetter
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
      setterDialogFormVisible: false,
      editIndex: 0,
      tmp: {}
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

          this.refreshData();
        } else {
          return false;
        }
      });
    },
    handleSet(index) {
      this.editIndex = index;
      this.tmp = this.wechatUsers[index];
      this.setterDialogFormVisible = true;
    },
    setSuccess(data) {
      this.wechatUsers.splice(
        this.wechatUsers.findIndex(one => one.id === data.id),
        1,
        data
      );
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
