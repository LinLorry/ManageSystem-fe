<template>
  <div>
    <van-nav-bar
      fixed
      placeholder
      left-arrow
      title="订单进度"
      @click-left="$router.go(-1)"
    />
    <van-cell-group title="基础信息">
      <van-cell title="订单号" :value="product.serial" />
      <van-cell v-if="detail" title="IGT" :value="product.igt" />
      <van-cell v-if="detail" title="ERP" :value="product.erp" />
      <van-cell title="花色" :value="product.design" />
      <van-cell title="订单状态">
        <template #default>
          <van-tag v-if="status === 0" type="success">完成</van-tag>
          <van-tag v-else-if="status === 1" type="primary">进行中</van-tag>
          <van-tag v-else type="warning">尚未开始</van-tag>
        </template>
      </van-cell>
    </van-cell-group>
    <van-collapse v-if="detail" v-model="showDetail">
      <van-collapse-item title="更多信息" name="1">
        <van-cell title="下单时间" :value="formatTime(product.beginTime)" />
        <van-cell title="需求时间" :value="formatTime(product.demandTime)" />
        <van-cell title="出货时间" :value="formatTime(product.endTime)" />
      </van-collapse-item>
    </van-collapse>

    <van-cell-group v-if="detail">
      <template #title>
        <span>订单进度</span>
        <van-progress
          v-if="status === 1"
          :percentage="percentage"
          style="margin: 20px 0"
        />
      </template>
      <van-collapse v-model="activeProcess" accordion>
        <van-collapse-item
          v-for="process of product.processes"
          :key="process.id"
          :title="process.name"
          :name="process.id"
        >
          <template #right-icon>
            <div v-if="process.complete" style="margin-right: 5px">
              <span style="margin-right: 3px">{{
                process.completeUserName +
                  ' ' +
                  formatTime(process.completeTime)
              }}</span>
              <van-icon name="success" />
            </div>
            <van-icon
              v-if="parseInt(activeProcess) === process.id"
              name="arrow-up"
            />
            <van-icon v-else name="arrow-down" />
          </template>
          <div style="text-align: center">
            <van-button
              v-if="process.complete"
              type="danger"
              @click="cancelProcesses"
            >
              取消完成该工序
            </van-button>
            <van-button v-else type="primary" @click="completeProcess">
              完成该工序
            </van-button>
          </div>
        </van-collapse-item>
      </van-collapse>
    </van-cell-group>
    <div v-else-if="productProcesses.length === 0" class="complete-info">
      <span>该订单的你能完成的所有工序都已经完成！</span>
    </div>
    <van-cell-group v-else title="订单进度">
      <van-collapse v-model="activeProcess" accordion>
        <van-collapse-item
          v-for="process of productProcesses"
          :key="process.id"
          :title="process.name"
          :name="process.id"
        >
          <div style="text-align: center">
            <van-button type="primary" @click="completeProcess"
              >完成该工序</van-button
            >
          </div>
        </van-collapse-item>
      </van-collapse>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  name: 'ProductDetail',
  props: ['detail'],
  data() {
    let tmp = localStorage.getItem('userProcesses');
    let userProcesses = [];
    if (tmp) {
      userProcesses = JSON.parse(tmp);
    }

    return {
      product: {
        id: 0,
        serial: '',
        igt: '',
        erp: '',
        central: '',
        area: '',
        design: '',
        completeNumber: 0,
        beginTime: '',
        demandTime: '',
        endTime: '',
        workName: '',
        processes: []
      },

      userProcesses,
      activeProcess: '',

      showDetail: [],
      timeFormatter: new Intl.DateTimeFormat('zh', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    };
  },
  created() {
    let _this = this;
    const id = this.$route.params.id;

    let callback = function() {
      let params = {
        id: id,
        withProcesses: true
      };

      _this.$axios
        .request({
          url: '/api/product',
          method: 'get',
          params
        })
        .then(res => {
          if (res.data.data) {
            const product = res.data.data;
            Object.assign(_this.product, product);
            _this.sortProcesses();
          }
        });

      _this.$axios('/api/user/processes').then(res => {
        _this.userProcesses.splice(0, _this.userProcesses.length);
        _this.userProcesses.push.apply(_this.userProcesses, res.data.data);
      });
    };

    if (this.detail) {
      this.$axios('/api/user/level').then(res => {
        let can = false;
        for (const level of res.data.data) {
          if (level === 'admin' || level === 'product manager') {
            can = true;
            break;
          }
        }
        if (can) {
          this.$axios('/api/product?id= ' + id).then(res => {
            if (res.data.data) {
              Object.assign(_this.product, res.data.data);
            }
          });

          this.$axios('/api/product/processes?id=' + id).then(res => {
            _this.product.processes.push.apply(
              _this.product.processes,
              res.data.data
            );
            _this.sortProcesses();
          });
        } else {
          this.$router.replace({ path: '/wechat/product/' + id });
          callback();
        }
      });
    } else {
      callback();
    }
  },
  methods: {
    sortProcesses() {
      this.product.processes.sort((f, s) => f.sequence - s.sequence);
    },
    formatTime(time) {
      if (time) {
        return this.timeFormatter.format(new Date(time));
      } else {
        return '';
      }
    },
    completeProcess() {
      let _this = this;
      const data = {
        productId: this.product.id,
        processId: parseInt(this.activeProcess)
      };
      let process = this.product.processes.find(p => p.id === data.processId);

      let beforeClose = (action, done) => {
        if (action === 'confirm') {
          _this.$axios.post('/api/product/completeProcess', data).then(res => {
            _this.$message({
              type: 'success',
              message: res.data.message,
              showClose: true,
              center: true
            });

            process.complete = true;
            Object.assign(process, res.data.data);
            done();
          });
        } else {
          done();
        }
      };

      this.$dialog.confirm({
        message: '确定完成 ' + process.name + ' 工序？',
        beforeClose
      });
    },
    cancelProcesses() {
      let _this = this;
      const data = {
        productId: this.product.id,
        processId: parseInt(this.activeProcess)
      };
      let process = this.product.processes.find(p => p.id === data.processId);

      let beforeClose = (action, done) => {
        if (action === 'confirm') {
          _this.$axios
            .post('/api/product/unCompleteProcess', data)
            .then(res => {
              _this.$message({
                type: 'success',
                message: res.data.message,
                showClose: true,
                center: true
              });

              process.complete = false;

              done();
            });
        } else {
          done();
        }
      };

      this.$dialog.confirm({
        message: '确定取消完成 ' + process.name + ' 工序？',
        beforeClose
      });
    }
  },
  computed: {
    status() {
      const completeNumber = this.completeNumber;

      if (this.product.complete) {
        return 0;
      } else if (completeNumber > 0) {
        return 1;
      } else {
        return 2;
      }
    },
    percentage() {
      let product = this.product;

      if (product.processes.length === 0) {
        return 0;
      }

      return parseInt((this.completeNumber * 100) / product.processes.length);
    },
    completeNumber() {
      let completeNumber = 0;
      for (const process of this.product.processes) {
        if (process.complete) {
          completeNumber++;
        }
      }

      return completeNumber;
    },
    productProcesses() {
      let productProcesses = [];
      for (const up of this.userProcesses) {
        const p = this.product.processes.find(p => p.id === up.id);
        if (p && !p.complete) {
          productProcesses.push(p);
        }
      }

      productProcesses.sort((f, s) => f.sequence - s.sequence);

      return productProcesses;
    }
  }
};
</script>

<style>
.complete-info {
  text-align: center;
  margin: 30px 0;
  color: #969799;
  font-size: 14px;
}
</style>
