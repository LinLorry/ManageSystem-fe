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
      <van-cell title="IGT" :value="product.IGT" />
      <van-cell title="ERP" :value="product.ERP" />
      <van-cell title="花色" :value="product.design" />
      <van-cell title="订单状态">
        <template #default>
          <van-tag v-if="status === 0" type="success">完成</van-tag>
          <van-tag v-else-if="status === 1" type="primary">进行中</van-tag>
          <van-tag v-else type="warning">尚未开始</van-tag>
        </template>
      </van-cell>
    </van-cell-group>
    <van-collapse v-model="showDetail">
      <van-collapse-item title="更多信息" name="1">
        <van-cell title="下单时间" :value="formatterTime(product.beginTime)" />
        <van-cell title="需求时间" :value="formatterTime(product.demandTime)" />
        <van-cell title="出货时间" :value="formatterTime(product.endTime)" />
      </van-collapse-item>
    </van-collapse>

    <van-cell-group>
      <template #title>
        <span>订单进度</span>
        <van-progress
          v-if="status === 1"
          :percentage="product.percentage"
          style="margin: 20px 0"
        />
      </template>
      <van-cell
        v-for="process of product.processes"
        :key="process.id"
        :title="process.name"
      >
        <template #default>
          <van-icon v-if="process.complete" name="success" />
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
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
        completeNumber: 0,
        beginTime: '',
        demandTime: '',
        endTime: '',
        percentage: 0,
        workName: '',
        processes: []
      },
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

    let params = {
      id: id,
      withProcesses: true
    };

    this.$axios
      .request({
        url: '/api/product',
        method: 'get',
        params
      })
      .then(res => {
        if (res.data.data) {
          _this.dealWith(res.data.data);
        }
      });
  },
  methods: {
    dealWith(data) {
      let product = this.product;

      Object.assign(product, data);
      this.sortProcesses();

      if (product.processes.length === 0) {
        product.percentage = 0;
      } else {
        product.completeNumber = 0;
        for (const process of product.processes) {
          if (process.complete) {
            product.completeNumber++;
          }
        }
        product.percentage = parseInt(
          (product.completeNumber * 100) / product.processes.length
        );
        if (product.completeNumber === product.processes.length) {
          product.complete = true;
        }
      }
    },
    async sortProcesses() {
      this.product.processes.sort((f, s) => f.sequence - s.sequence);
    },
    formatterTime(time) {
      if (time) {
        return this.timeFormatter.format(new Date(time));
      } else {
        return '';
      }
    }
  },
  computed: {
    desc() {
      const product = this.product;

      return 'IGT: ' + product.IGT + '\n' + 'ERP: ' + product.ERP;
    },
    status() {
      const completeNumber = this.product.completeNumber;

      if (completeNumber === this.product.processes.length) {
        return 0;
      } else if (completeNumber > 0) {
        return 1;
      } else {
        return 2;
      }
    }
  }
};
</script>

<style></style>
