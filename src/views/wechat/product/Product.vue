<template>
  <div>
    <van-nav-bar
      fixed
      placeholder
      left-arrow
      title="订单列表"
      @click-left="$router.go(-1)"
    />
    <van-search
      v-model="serial"
      show-action
      placeholder="请输入搜索关键词"
      @search="onRefresh"
      @cancel="onRefresh"
    />
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div
          class="product-info-card"
          v-for="item in products"
          :key="item.id"
          @click="$router.push('/wechat/product/' + item.id + '?detail=true')"
        >
          <el-card>
            <div slot="header" class="header">
              <strong>{{ item.serial }}</strong>
              <span>{{ new Date(item.createTime).toLocaleDateString() }}</span>
            </div>
            <div class="content">
              <div style="display: flex; justify-content: space-between">
                <span>
                  IGT: <strong>{{ item.igt }}</strong>
                </span>
                <span>{{ item.design }}</span>
              </div>
              <div>
                <span>
                  ERP: <strong>{{ item.erp }}</strong>
                </span>
              </div>
              <div>
                <span>
                  Central: <strong>{{ item.central }}</strong>
                </span>
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
  name: 'WechatProduct',
  data() {
    return {
      loading: false,
      finished: false,
      refreshing: false,

      serial: '',
      total: 0,
      pageNumber: 0,

      products: []
    };
  },
  methods: {
    onRefresh() {
      this.products.splice(0, this.products.length);
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
          url: '/api/product',
          method: 'get',
          params
        })
        .then(res => {
          const data = res.data.data;
          _this.total = data.total;
          _this.products.push.apply(_this.products, data.products);
          _this.pageNumber++;
          if (_this.pageNumber > _this.total) {
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
.product-info-card {
  margin: 10px 10px 30px;
}

.product-info-card .header {
  display: flex;
  justify-content: space-between;
}
</style>
