<template>
  <el-card
    body-style="
    overflow: auto;
    margin-bottom: 20px"
    style="display: flex;
    flex-direction: column;"
  >
    <div slot="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item
          v-if="product.complete"
          :to="{ path: '/product/complete' }"
          >已完成订单</el-breadcrumb-item
        >
        <el-breadcrumb-item v-else :to="{ path: '/product/unComplete' }"
          >未完成订单</el-breadcrumb-item
        >
        <el-breadcrumb-item>订单详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card style="margin-bottom: 20px;">
      <div slot="header">
        <span>订单信息</span>
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
        <el-form-item label="ID">
          <el-input readonly :value="product.id" />
        </el-form-item>
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
        <el-form-item label="生产流程">
          <el-input readonly :value="product.workName" />
        </el-form-item>
        <el-form-item label="创建人ID">
          <el-input readonly :value="product.creatorId" />
        </el-form-item>
        <el-form-item label="创建人名称">
          <el-input readonly :value="product.creatorName" />
        </el-form-item>
        <el-form-item label="更新人ID">
          <el-input readonly :value="product.updaterId" />
        </el-form-item>
        <el-form-item label="更新人名称">
          <el-input readonly :value="product.updaterName" />
        </el-form-item>
        <div style="text-align: center">
          <el-button type="primary" @click="update">更新</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header">
        <span>流程工序信息</span>
      </div>
      <div>
        <span style="padding-left: 20px;">完成情况:</span>
        <el-progress
          :percentage="processesPercentage"
          style="margin: 10px 0 30px; padding-left: 20px"
        />
        <el-timeline style="padding-left: 20px">
          <el-timeline-item
            v-for="(process, index) in product.processes"
            :key="process.id"
          >
            <el-card
              body-style="
                display: flex;
                justify-content: space-between;
              "
            >
              <div class="process-head">
                <span style="display: inline-block; width: 150px;">
                  {{ process.name }}
                </span>
              </div>
              <div class="process-tail">
                <el-button
                  type="success"
                  v-if="index === firstUnComplete"
                  size="mini"
                  >完成</el-button
                >
                <i
                  v-if="process.complete"
                  class="el-icon-success"
                  style="color: #67C23A"
                />
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>
  </el-card>
</template>

<script>
// TODO 工序完成和编辑

export default {
  name: 'ProductDetail',
  data() {
    return {
      product: {
        id: 0,
        serial: '',
        IGT: '',
        ERP: '',
        central: '',
        area: '',
        design: '',
        beginTime: '',
        demandTime: '',
        endTime: '',
        workId: '',
        workName: '',
        creatorId: 0,
        creatorName: '',
        updaterId: '',
        updaterName: '',
        processes: []
      },

      rules: {
        serial: [{ required: true, message: '序号不能为空' }]
      }
    };
  },
  created() {
    const _this = this;
    const id = this.$route.params.id;

    this.axios('/api/product?id=' + id).then(res => {
      if (res.data.data) {
        _this.product = Object.assign(_this.product, res.data.data);
        _this.product.IGT = res.data.data.igt;
        _this.product.ERP = res.data.data.erp;
      }
    });

    this.axios('/api/product/processes?id=' + id).then(res => {
      if (res.data.data) {
        const data = res.data.data;

        data.sort((first, second) => {
          return first.sequence - second.sequence;
        });

        _this.product.processes.push.apply(_this.product.processes, data);
      }
    });
  },
  methods: {
    update() {
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
          });
        } else {
          return false;
        }
      });
    }
  },
  computed: {
    firstUnComplete: function() {
      const processes = this.product.processes;
      if (processes.length === 0) return 0;

      for (let index = 0; index < processes.length; ++index) {
        if (!processes[index].complete) {
          return index;
        }
      }

      return processes.length;
    },
    processesPercentage: function() {
      return (
        (100 * this.firstUnComplete) /
        (this.product.processes.length === 0
          ? 1
          : this.product.processes.length)
      );
    }
  }
};
</script>

<style>
.product-info .el-input {
  width: 300px;
}

.process-head {
  display: flex;
}
.process-tail {
  display: flex;
}
</style>
