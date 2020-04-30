<template>
  <div>
    <van-nav-bar
      fixed
      placeholder
      left-arrow
      title="近期完成工序"
      @click-left="$router.go(-1)"
    />
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <el-card
          class="product-process-info-card"
          v-for="(productProcess, index) of productProcesses"
          :key="index"
        >
          <div slot="header" class="header">
            <span>{{
              dateFormat.format(new Date(productProcess.finishTime))
            }}</span>
          </div>
          <div class="content">
            <span>订单编号：</span>
            <strong>{{ productProcess.serial }}</strong>
            <br />

            <span>工序：</span>
            <strong>{{ productProcess.processName }}</strong>
            <br />

            <span>负责人：</span>
            <strong>{{ productProcess.finisherName }}</strong>
          </div>
        </el-card>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  name: 'RecentFinishProcess',
  data() {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZone: 'Asia/Shanghai'
    };

    return {
      loading: false,
      finished: false,
      refreshing: false,

      serial: '',
      total: 0,
      pageNumber: 0,

      productProcesses: [],
      dateFormat: new Intl.DateTimeFormat('zh-cn', options)
    };
  },
  methods: {
    onRefresh() {
      this.productProcesses.splice(0, this.productProcesses.length);
      this.finished = false;
      this.pageNumber = 0;

      this.loading = true;
      this.onLoad();
    },
    onLoad() {
      let _this = this;

      let params = {
        pageNumber: this.pageNumber,
        serial: this.serial
      };

      this.axios
        .request({
          url: '/api/product/completeProcess',
          method: 'get',
          params
        })
        .then(res => {
          const data = res.data.data;
          _this.total = data.total;
          _this.productProcesses.push.apply(
            _this.productProcesses,
            data.productProcesses
          );
          _this.pageNumber++;
          if (_this.pageNumber === _this.total) {
            _this.finished = true;
          }

          _this.loading = false;
          _this.refreshing = false;
        });
    }
  }
};
</script>

<style>
.product-process-info-card {
  margin: 10px 10px 30px;
}

.product-process-info-card .header {
  text-align: right;
}

.product-process-info-card .content span {
  display: inline-block;
  width: 5em;
}
</style>
