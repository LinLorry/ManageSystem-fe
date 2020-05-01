<template>
  <div>
    <van-nav-bar
      fixed
      placeholder
      left-arrow
      :title="title"
      @click-left="$emit('close')"
    />
    <van-list>
      <div
        v-for="(productProcess, index) of value.finishList"
        :key="index"
        @click="
          $router.push({
            path: '/wechat/product/' + productProcess.productId + '?detail=true'
          })
        "
      >
        <el-card class="productProcess-info-card">
          <div class="content">
            <div>
              <span>订单号：</span> <strong>{{ productProcess.serial }}</strong>
            </div>
            <div>
              <span>工序名：</span>
              <strong>{{ productProcess.processName }}</strong>
            </div>
            <div>
              <span>完成时间：</span>
              <strong>
                {{
                  productProcess.finishDate.toLocaleDateString('zh-cn', options)
                }}
              </strong>
            </div>
          </div>
        </el-card>
      </div>
    </van-list>
  </div>
</template>

<script>
export default {
  name: 'WorkloadDetail',
  props: {
    value: {
      type: Object,
      default: function() {
        return { id: 0, name: '', finishList: [] };
      }
    }
  },
  data() {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric'
    };

    return {
      activeNames: [],
      options
    };
  },
  computed: {
    title() {
      if (this.value) {
        return this.value.name + '工序统计';
      }
      return '';
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
