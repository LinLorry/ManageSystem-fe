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
        <el-breadcrumb-item>员工管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-table stripe :data="workers" style="flex-grow: 1">
      <el-table-column fixed sortable prop="id" label="ID" />
      <el-table-column fixed sortable prop="name" label="名字" />

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" @click="handleEdit(scope.$index)"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" @click="disable(scope.$index)"
              >禁用</el-button
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
    <WorkerEditor
      :show="editDialogFormVisible"
      :data="workers[editIndex]"
      @close="editDialogFormVisible = false"
      @success="editSuccess($event)"
    />
  </el-card>
</template>

<script>
import WorkerEditor from '@/views/worker/childComp/WorkerEditor';

export default {
  name: 'Worker',
  components: {
    WorkerEditor
  },
  data() {
    return {
      pageSize: 10,
      total: 0,
      pageNumber: 0,

      workers: [],
      editDialogFormVisible: false,
      editIndex: 0
    };
  },
  created() {
    this.refreshData();
  },
  methods: {
    handleEdit(index) {
      this.editIndex = index;
      this.editDialogFormVisible = true;
    },
    editSuccess(data) {
      Object.assign(this.workers[this.editIndex], data);
    },
    disable(index) {
      const data = this.workers[index];
      let _this = this;

      this.$confirm('此操作将禁用员工：' + data.name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          _this.axios
            .post('/api/worker/set', {
              id: data.id,
              operation: false
            })
            .then(res => {
              _this.workers.splice(index, 1);
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
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.refreshData();
    },
    handlePageNumberChange(pageNumber) {
      this.pageNumber = pageNumber - 1;
      this.refreshData();
    },
    refreshData() {
      let _this = this;

      let url =
        '/api/worker?pageSize=' +
        this.pageSize +
        '&pageNumber=' +
        this.pageNumber;

      this.axios.get(url).then(res => {
        const data = res.data.data;

        _this.pageSize = data.size;
        _this.total = data.total;
        _this.workers = data.workers;
      });
    }
  }
};
</script>

<style></style>
