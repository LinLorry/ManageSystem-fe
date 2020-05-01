<template>
  <div>
    <van-nav-bar
      fixed
      placeholder
      left-arrow
      title="我完成的工序"
      @click-left="$router.go(-1)"
    />
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div
          v-for="(item, index) in workloads"
          :key="index"
          @click="
            $router.push({
              path: '/wechat/product/' + item.productId + '?detail=true'
            })
          "
        >
          <el-card class="productProcess-info-card">
            <div class="content">
              <div>
                <span>订单号：</span> <strong>{{ item.productSerial }}</strong>
              </div>
              <div>
                <span>工序名：</span>
                <strong>{{ item.processName }}</strong>
              </div>
              <div>
                <span>完成时间：</span>
                <strong>
                  {{ item.finishDate.toLocaleDateString('zh-cn', options) }}
                </strong>
              </div>
            </div>
          </el-card>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  name: 'MyWorkload',
  data() {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric'
    };

    return {
      options,
      loading: false,
      finished: false,
      refreshing: false,

      total: 0,
      pageNumber: 0,
      workloads: []
    };
  },
  methods: {
    onRefresh() {
      this.workloads.splice(0, this.workloads.length);
      this.finished = false;
      this.pageNumber = 0;

      this.loading = true;
      this.onLoad();
    },
    onLoad() {
      let _this = this;

      let params = {
        pageNumber: this.pageNumber
      };

      this.axios
        .request({
          url: '/api/user/selfFinish',
          method: 'get',
          params
        })
        .then(res => {
          const data = res.data.data;
          _this.total = data.total;
          _this.workloads.push.apply(_this.workloads, data.productProcesses);
          _this.workloads.forEach(w => (w.finishDate = new Date(w.finishTime)));
          _this.pageNumber++;
          if (_this.pageNumber >= _this.total) {
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
.productProcess-info-card {
  margin: 10px 10px 30px;
}

.productProcess-info-card .content {
  display: flex;
  flex-direction: column;
}
.productProcess-info-card .content div {
  display: flex;
}

.productProcess-info-card .content span {
  display: inline-block;
  width: 5em;
}
</style>
