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
        <el-breadcrumb-item>生产管理</el-breadcrumb-item>
        <el-breadcrumb-item>生产流程管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="toolbar">
      <div class="query-box">
        <el-form
          :rules="rules"
          label-width="auto"
          ref="queryFrom"
          :model="queryForm"
          :inline="true"
        >
          <el-form-item prop="id">
            <el-input placeholder="生产流程ID" v-model="queryForm.id" clearable>
            </el-input>
          </el-form-item>
          <el-form-item prop="name">
            <el-input
              type="text"
              placeholder="生产流程名字"
              v-model="queryForm.name"
              clearable
            >
            </el-input>
          </el-form-item>

          <el-form-item prop="comment">
            <el-input
              type="text"
              placeholder="生产流程备注"
              v-model="queryForm.comment"
              clearable
            >
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitQuery('queryFrom')"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
      </div>

      <div class="create-box">
        <el-button
          style="display: inline-block;"
          @click="$router.push('/work/createWork')"
          >新建</el-button
        >
      </div>
    </div>
    <el-table stripe :data="works" style="flex-grow: 1" height="use">
      <el-table-column fixed sortable prop="id" label="ID" />

      <el-table-column fixed sortable prop="name" label="名字" />
      <el-table-column fixed sortable prop="comment" label="备注" />

      <el-table-column
        fixed
        sortable
        prop="createTime"
        label="创建时间"
        :formatter="timeFormatter"
      />
      <el-table-column fixed sortable prop="creatorName" label="创建人" />

      <el-table-column
        fixed
        sortable
        prop="updateTime"
        label="更新时间"
        :formatter="timeFormatter"
      />
      <el-table-column fixed sortable prop="updaterName" label="更新人" />

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="
              $router.push({
                path: '/work/workDetail/' + scope.row.id
              })
            "
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
  </el-card>
</template>

<script>
export default {
  name: 'workManage',
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
        name: '',
        comment: ''
      },

      queryId: '',
      queryName: '',
      queryComment: '',

      pageSize: 10,
      total: 0,
      pageNumber: 0,

      works: [],

      rules: {
        id: [
          {
            validator: checkId,
            trigger: 'blur'
          }
        ]
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
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.refreshData();
    },
    handlePageNumberChange(pageNumber) {
      this.pageNumber = pageNumber - 1;
      this.refreshData();
    },
    timeFormatter(row, column, cellValue) {
      return new Date(cellValue).toLocaleDateString();
    },
    refreshData() {
      const _this = this;

      let id = this.queryId;

      if (id !== undefined && id !== null && id.length !== 0) {
        this.axios.get('/api/work?id=' + id).then(res => {
          const data = res.data.data;

          if (data) {
            _this.works = [data];
          } else {
            _this.works = [];
          }

          _this.total = 1;
        });
      } else {
        let url =
          '/api/work?pageSize=' +
          this.pageSize +
          '&pageNumber=' +
          this.pageNumber;

        const name = this.queryName;

        if (name !== undefined && name !== null && name.length !== 0) {
          url += '&name=' + name;
        }

        const comment = this.queryComment;

        if (comment !== undefined && comment !== null && comment.length !== 0) {
          url += '&comment=' + comment;
        }

        this.axios.get(url).then(res => {
          const data = res.data.data;

          _this.pageSize = data.size;
          _this.total = data.total;
          _this.works = data.works;
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
}

.query-box {
  display: inline-block;
  width: 700px;
}

.query-box .el-form-item {
  width: 150px;
}

.create-box {
  display: inline-block;
  margin-left: 10px;
}
</style>
