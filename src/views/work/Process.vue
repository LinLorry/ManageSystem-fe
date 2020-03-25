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
        <el-breadcrumb-item>工序管理</el-breadcrumb-item>
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
            <el-input
              placeholder="工序ID"
              v-model.number="queryForm.id"
              clearable
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="name">
            <el-input
              type="text"
              placeholder="工序名字"
              v-model="queryForm.name"
              clearable
            >
            </el-input>
          </el-form-item>

          <el-form-item prop="comment">
            <el-input
              type="text"
              placeholder="工序备注"
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

      <el-button class="create-box" @click="createDialogFormVisible = true"
        >新建</el-button
      >
    </div>
    <el-table stripe :data="processes" height="use">
      <el-table-column fixed sortable prop="id" label="ID" />

      <el-table-column sortable prop="name" label="名字" />
      <el-table-column sortable prop="comment" label="备注" />

      <el-table-column
        sortable
        prop="createTime"
        label="创建时间"
        :formatter="timeFormatter"
      />
      <el-table-column sortable prop="creatorName" label="创建人" />

      <el-table-column
        sortable
        prop="updateTime"
        label="更新时间"
        :formatter="timeFormatter"
      />
      <el-table-column sortable prop="updaterName" label="更新人" />

      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)"
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

    <ProcessCreator
      :show="createDialogFormVisible"
      @close="createDialogFormVisible = false"
    />
    <ProcessEditor
      :show="editDialogFormVisible"
      :data="tmp"
      @close="editDialogFormVisible = false"
      @success="editSuccess($event)"
    />
  </el-card>
</template>

<script>
import ProcessCreator from '@/views/work/childComp/ProcessCreator';
import ProcessEditor from '@/views/work/childComp/ProcessEditor';

export default {
  name: 'processManage',
  components: {
    ProcessCreator,
    ProcessEditor
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
        name: '',
        comment: ''
      },

      queryId: '',
      queryName: '',
      queryComment: '',

      pageSize: 10,
      total: 0,
      pageNumber: 0,

      processes: [],
      createDialogFormVisible: false,
      editDialogFormVisible: false,
      editIndex: 0,
      tmp: {},
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
    handleEdit(id) {
      this.editDialogFormVisible = true;
      this.tmp = this.processes.find(p => {
        return p.id === id;
      });
    },
    editSuccess(data) {
      const index = this.processes.findIndex(process => {
        return process.id === data.id;
      });

      this.processes.splice(index, 1, data);
    },
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
        this.axios.get('/api/process?id=' + id).then(res => {
          const data = res.data.data;

          if (data) {
            _this.processes = [data];
          } else {
            _this.processes = [];
          }

          _this.total = 1;
        });
      } else {
        let url =
          '/api/process?pageSize=' +
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
          _this.processes = data.processes;
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

.query-box .el-input {
  width: 150px;
}

.create-box {
  margin-left: 10px;
}
</style>
