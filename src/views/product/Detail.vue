<template>
  <el-card body-style="overflow: auto;">
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
            :readonly="product.complete"
            v-model="product.serial"
            placeholder="请输入订单序号"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="IGT" prop="IGT">
          <el-input
            :readonly="product.complete"
            v-model="product.IGT"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="ERP" prop="ERP">
          <el-input
            :readonly="product.complete"
            v-model="product.ERP"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="central" prop="central">
          <el-input
            :readonly="product.complete"
            v-model="product.central"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="地区" prop="area">
          <el-input
            :readonly="product.complete"
            v-model="product.area"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="花色" prop="design">
          <el-input
            :readonly="product.complete"
            v-model="product.design"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="下单日期" prop="beginTime">
          <el-date-picker
            :readonly="product.complete"
            v-model="product.beginTime"
            type="date"
            placeholder="选择下单日期"
          />
        </el-form-item>
        <el-form-item label="需求日期" prop="demandTime">
          <el-date-picker
            :readonly="product.complete"
            v-model="product.demandTime"
            type="date"
            placeholder="选择需求日期"
          />
        </el-form-item>
        <el-form-item label="出货日期" prop="endTime">
          <el-date-picker
            :readonly="product.complete"
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
        <div style="text-align: center;margin-bottom: 20px;">
          <div ref="qrCodeDiv" style="display: inline-block" />
        </div>

        <div style="text-align: center" v-if="!product.complete">
          <el-button type="primary" @click="update">更新</el-button>
          <el-button type="primary" @click="completeProduct">
            完成该订单
          </el-button>
        </div>
      </el-form>
    </el-card>
    <el-card style="margin-bottom: 20px;">
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
            v-for="process in product.processes"
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
              <div v-if="!product.complete" class="process-tail">
                <el-button
                  v-if="process.complete"
                  type="danger"
                  size="mini"
                  @click="unCompleteProcess(process.id)"
                >
                  取消完成
                </el-button>
                <el-button
                  v-else
                  type="success"
                  size="mini"
                  @click="completeProcess(process.id)"
                >
                  完成
                </el-button>
              </div>
              <div v-else class="process-tail">
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
import QRCode from 'qrcodejs2';

export default {
  name: 'ProductDetail',
  data() {
    return {
      product: {
        id: 0,
        complete: true,
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
        new QRCode(this.$refs.qrCodeDiv, {
          text: location.href,
          width: 200,
          height: 200,
          correctLevel: QRCode.CorrectLevel.L //容错率，L/M/H
        });
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
    },
    completeProduct() {
      let _this = this;

      this.$confirm(
        '确定完成订单号为' + this.product.serial + '的订单？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          _this.axios
            .post('/api/product/complete', { id: this.product.id })
            .then(res => {
              _this.$message({
                message: res.data.message,
                type: 'success',
                showClose: true,
                center: true
              });
              _this.product.complete = true;
            });
        })
        .catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消'
          });
        });
    },
    completeProcess(processId) {
      let _this = this;
      const process = this.product.processes.find(p => p.id === processId);
      const data = {
        productId: this.product.id,
        processId
      };

      this.$confirm('确定完成该订单的' + process.name + '工序？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          _this.$axios.post('/api/product/completeProcess', data).then(res => {
            _this.$message({
              message: res.data.message,
              type: 'success',
              showClose: true,
              center: true
            });
            _this.product.processes.find(
              p => p.id === processId
            ).complete = true;
          });
        })
        .catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消'
          });
        });
    },
    unCompleteProcess(processId) {
      let _this = this;
      const process = this.product.processes.find(p => p.id === processId);
      const data = {
        productId: this.product.id,
        processId
      };

      this.$confirm('确定完成该订单的' + process.name + '工序？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          _this.$axios
            .post('/api/product/unCompleteProcess', data)
            .then(res => {
              _this.$message({
                message: res.data.message,
                type: 'success',
                showClose: true,
                center: true
              });
              _this.product.processes.find(
                p => p.id === processId
              ).complete = false;
            });
        })
        .catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消'
          });
        });
    }
  },
  computed: {
    processesPercentage() {
      let completeNumber = 0;
      const length = this.product.processes.length;
      if (length === 0) return 100;

      for (const process of this.product.processes) {
        if (process.complete) {
          completeNumber++;
        }
      }

      return parseInt((completeNumber * 100) / length);
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
