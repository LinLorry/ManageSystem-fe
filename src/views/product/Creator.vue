<template>
  <el-card body-style="overflow: auto;">
    <div slot="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/product/unComplete' }"
          >未完成订单</el-breadcrumb-item
        >
        <el-breadcrumb-item>创建订单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card style="margin-bottom: 20px;">
      <div slot="header">
        <span>创建订单</span>
      </div>
      <el-form
        inline
        hide-required-asterisk
        ref="product"
        label-width="auto"
        label-position="left"
        :model="product"
        :rules="rules"
        class="product-info"
      >
        <el-form-item label="序号" prop="serial">
          <el-input
            v-model="product.serial"
            placeholder="请输入订单序号"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="IGT" prop="IGT">
          <el-input v-model="product.IGT" autocomplete="off" />
        </el-form-item>
        <el-form-item label="ERP" prop="ERP">
          <el-input v-model="product.ERP" autocomplete="off" />
        </el-form-item>
        <el-form-item label="central" prop="central">
          <el-input v-model="product.central" autocomplete="off" />
        </el-form-item>
        <el-form-item label="地区" prop="area">
          <el-input v-model="product.area" autocomplete="off" />
        </el-form-item>
        <el-form-item label="花色" prop="design">
          <el-input v-model="product.design" autocomplete="off" />
        </el-form-item>
        <el-form-item label="下单日期" prop="beginTime">
          <el-date-picker
            v-model="product.beginTime"
            type="date"
            placeholder="选择下单日期"
          />
        </el-form-item>
        <el-form-item label="需求日期" prop="demandTime">
          <el-date-picker
            v-model="product.demandTime"
            type="date"
            placeholder="选择需求日期"
          />
        </el-form-item>
        <el-form-item label="出货日期" prop="endTime">
          <el-date-picker
            v-model="product.endTime"
            type="date"
            placeholder="选择出货日期"
          />
        </el-form-item>
        <el-form-item label="生产流程" prop="workId">
          <el-select
            style="padding-right: 20px;"
            v-model="product.workId"
            placeholder="请选择生产流程"
            @change="selectWork"
          >
            <el-option
              v-for="item in works"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <div style="text-align: center">
          <el-button type="primary" @click="create">创建</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card v-if="product.workId">
      <div slot="header">
        <span>流程工序信息</span>
      </div>

      <el-timeline style="padding-left: 20px">
        <el-timeline-item v-for="process in processes" :key="process.id">
          <el-card
            body-style="
                display: flex;
                justify-content: space-between;
              "
          >
            <span style="display: inline-block; width: 150px;">
              {{ process.name }}
            </span>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </el-card>
</template>

<script>
// TODO 批量创建顶单

export default {
  name: 'Creator',
  data() {
    return {
      product: {
        serial: '',
        IGT: '',
        ERP: '',
        central: '',
        area: '',
        design: '',
        beginTime: '',
        demandTime: '',
        endTime: '',
        workId: ''
      },

      works: [],
      processes: [],

      rules: {
        serial: [{ required: true, message: '序号不能为空' }],
        workId: [{ required: true, message: '生产流程不能为空' }]
      }
    };
  },
  created() {
    let _this = this;
    let pageNumber = 0;
    let total = 0;
    const url = '/api/work?pageSize=50&pageNumber=';

    let callback = res => {
      total = res.data.data.total;
      pageNumber++;
      _this.works.push.apply(_this.works, res.data.data.works);
      if (pageNumber < total) {
        _this.axios(url + pageNumber).then(callback);
      } else {
        _this.works.sort((p1, p2) => {
          return p1.id - p2.id;
        });
      }
    };

    this.axios(url + pageNumber).then(callback);
  },
  methods: {
    selectWork(id) {
      let processes = this.processes;

      let work = this.works.find(w => {
        return w.id === id;
      });

      if (work.processes) {
        processes.splice(0, processes.length);
        processes.push.apply(processes, work.processes);
      } else {
        this.axios('/api/work/processes?id=' + work.id).then(res => {
          work.processes = res.data.data;
          processes.splice(0, processes.length);
          processes.push.apply(processes, res.data.data);
        });
      }
    },
    create() {
      this.$refs.product.validate(valid => {
        if (valid) {
          let data = this.product;

          let _this = this;

          this.axios.post('/api/product', data).then(res => {
            _this.$message({
              message: res.data.message,
              type: 'success',
              showClose: true,
              center: true
            });
            _this.$router.push('/product/unComplete');
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style>
.product-info .el-input {
  width: 300px;
}
</style>
