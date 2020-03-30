<template>
  <div class="product-dynamic-box">
    <el-card class="product-dynamic-info-box">
      <i class="el-icon-s-order"></i>
      <span class="show-num"> {{ value.notStart }} </span> <br />
      <span>未进行订单</span>
    </el-card>
    <el-card class="product-dynamic-info-box">
      <i class="el-icon-s-marketing"></i>
      <span class="show-num"> {{ value.start }} </span> <br />
      <span>正在进行订单</span>
    </el-card>
    <el-card class="product-dynamic-info-box">
      <i class="el-icon-s-claim"></i>
      <span class="show-num"> {{ value.canComplete }} </span> <br />
      <span>可以完成订单</span>
    </el-card>
    <el-card class="product-dynamic-info-box">
      <i class="el-icon-s-check"></i>
      <span class="show-num"> {{ value.created }} </span> <br />
      <span>当月创建订单</span>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ProductDynamicInfo',
  props: ['value']
};
</script>

<style>
.product-dynamic-box {
  display: flex;
  justify-content: space-around;
}

.product-dynamic-info-box {
  flex-grow: 1;
  margin: 10px;
  text-align: center;
}

.product-dynamic-info-box .show-num {
  font-size: 20px;
}
</style>
