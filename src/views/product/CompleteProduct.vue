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
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>已完成订单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="toolbar">
      <div class="query-box">
        <el-form
          label-position="top"
          label-width="auto"
          ref="queryForm"
          :model="queryForm"
          :inline="true"
        >
          <el-form-item label="序号" prop="serial">
            <el-input
              v-model="queryForm.serial"
              placeholder="订单序号"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="下单日期" prop="beginTime">
            <el-date-picker
              unlink-panels
              v-model="queryForm.beginTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :editable="false"
            />
          </el-form-item>
          <el-form-item label="需求日期" prop="demandTime">
            <el-date-picker
              unlink-panels
              v-model="queryForm.demandTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :editable="false"
            />
          </el-form-item>
          <el-form-item label="出货日期" prop="endTime">
            <el-date-picker
              unlink-panels
              v-model="queryForm.endTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :editable="false"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitQuery">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <el-table stripe :data="products" style="flex-grow: 1" height="use">
      <el-table-column fixed sortable prop="id" label="ID" />
      <el-table-column sortable prop="serial" label="序号" />
      <el-table-column sortable prop="igt" label="IGT号" />
      <el-table-column sortable prop="erp" label="ERP号" />
      <el-table-column sortable prop="central" label="central号" />
      <el-table-column sortable prop="area" label="地区" />
      <el-table-column sortable prop="design" label="花色" />
      <el-table-column
        sortable
        prop="beginTime"
        label="下单时间"
        :formatter="timeFormatter"
      />
      <el-table-column
        sortable
        prop="demandTime"
        label="需求时间"
        :formatter="timeFormatter"
      />
      <el-table-column
        sortable
        prop="endTime"
        label="出货时间"
        :formatter="timeFormatter"
      />

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              size="mini"
              @click="$router.push('/product/detail/' + scope.row.id)"
              >编辑</el-button
            >
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      hide-on-single-page
      :current-page="this.tmp.pageNumber + 1"
      :page-count="total"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="tmp.pageSize"
      layout="sizes, prev, pager, next"
      @size-change="handleSizeChange"
      @current-change="handlePageNumberChange"
    />
  </el-card>
</template>

<script>
export default {
  name: 'CompleteProduct',
  data() {
    return {
      queryForm: {
        serial: '',
        beginTime: [],
        demandTime: [],
        endTime: []
      },

      tmp: {
        pageSize: 10,
        pageNumber: 0,

        serial: '',
        beginTimeAfter: '',
        beginTimeBefore: '',
        demandTimeAfter: '',
        demandTimeBefore: '',
        endTimeAfter: '',
        endTimeBefore: ''
      },

      total: 0,

      products: [],
      editDialogFormVisible: false,
      editIndex: 0
    };
  },
  created() {
    this.refreshData();
  },
  methods: {
    submitQuery() {
      this.$refs.queryForm.validate(valid => {
        if (valid) {
          Object.keys(this.tmp).forEach(key => {
            this.tmp[key] = null;
          });

          if (this.queryForm.serial) {
            this.tmp.serial = this.queryForm.serial;
          }

          if (
            this.queryForm.beginTime &&
            this.queryForm.beginTime.length === 2
          ) {
            this.tmp.beginTimeAfter = this.queryForm.beginTime[0];
            this.tmp.beginTimeBefore = this.queryForm.beginTime[1];
          }

          if (
            this.queryForm.demandTime &&
            this.queryForm.demandTime.length === 2
          ) {
            this.tmp.demandTimeAfter = this.queryForm.demandTime[0];
            this.tmp.demandTimeBefore = this.queryForm.demandTime[1];
          }

          if (
            this.queryForm.demandTime &&
            this.queryForm.endTime.length === 2
          ) {
            this.tmp.endTimeAfter = this.queryForm.endTime[0];
            this.tmp.endTimeBefore = this.queryForm.endTime[1];
          }

          this.tmp.pageNumber = 0;

          console.log(this.tmp);
          this.refreshData();
        } else {
          return false;
        }
      });
    },
    handleSizeChange(pageSize) {
      this.tmp.pageSize = pageSize;
      this.refreshData();
    },
    handlePageNumberChange(pageNumber) {
      this.tmp.pageNumber = pageNumber - 1;
      this.refreshData();
    },
    refreshData() {
      let _this = this;
      const data = this.tmp;

      let params = {
        complete: true
      };

      Object.keys(data).forEach(key => {
        params[key] = data[key];
      });

      this.axios
        .request({
          url: '/api/product',
          method: 'get',
          params
        })
        .then(res => {
          const data = res.data.data;

          _this.pageSize = data.size;
          _this.total = data.total;
          _this.products = data.products;
        });
    },
    timeFormatter(row, column, cellValue) {
      return new Date(cellValue).toLocaleDateString();
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
}

.query-box .el-input {
  width: 150px;
}
</style>
