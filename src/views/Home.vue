<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div>
      <ProductDynamicInfo v-if="hasProduct" :value="productInfo" />
      <WorkerDynamicInfo
        v-if="hasWorker"
        :finish="workerInfo.finishInfo"
        :finisher="workerInfo.finisherInfo"
      ></WorkerDynamicInfo>
    </div>
  </el-card>
</template>

<script>
import ProductDynamicInfo from '@/components/ProductDynamicInfo';
import WorkerDynamicInfo from '@/components/WorkerDynamicInfo';

export default {
  name: 'Home',
  components: {
    ProductDynamicInfo,
    WorkerDynamicInfo
  },
  data() {
    return {
      hasProduct: false,
      hasWorker: false,
      productInfo: {
        start: 0,
        notStart: 0,
        canComplete: 0,
        created: 0
      },
      workerInfo: {
        finishInfo: [],
        finisherInfo: []
      }
    };
  },
  created() {
    let _this = this;

    this.axios('/api/user/dynamic').then(res => {
      if (res.data.data) {
        const data = res.data.data;

        if (data.product) {
          _this.hasProduct = true;
          Object.assign(_this.productInfo, data.product);
        }

        if (data.worker) {
          _this.hasWorker = true;
          Object.assign(_this.workerInfo, data.worker);
          _this.workerInfo.finishInfo.splice(0, 10);
          _this.workerInfo.finisherInfo.sort((f, s) => {
            return s.size - f.size;
          });
        }
      }
    });
  },
  methods: {}
};
</script>

<style></style>
