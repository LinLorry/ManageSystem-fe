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
        <van-cell
          style="font-size: 1.2rem"
          v-for="item in products"
          :key="item.id"
          :title="item.serial"
          @click="$router.push('/wechat/product/' + item.id)"
        >
          <template #label>
            <div style="font-size: 1rem">
              <span>{{ item.igt + ' ' + item.design }}</span> <br />
              <span> {{ item.central }}</span> <br />
            </div>
          </template>
        </van-cell>
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

<style></style>
