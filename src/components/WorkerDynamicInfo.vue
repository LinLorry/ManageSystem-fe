<template>
  <div class="worker-dynamic-box">
    <el-card class="worker-dynamic-finish-box">
      <div slot="header">
        <i class="el-icon-bell" />
        <span style="margin-left: 5px">最新工作</span>
      </div>
      <ul>
        <li v-for="(item, index) of finish" :key="index">
          <div style="flex-grow: 1;">
            <el-link :href="'/product/detail/' + item.productId">
              {{
                item.finisher +
                  ' 完成订单 ' +
                  item.productSerial +
                  ' 的 ' +
                  item.processName
              }}
            </el-link>
          </div>
          <span>{{ timeFormatter.format(new Date(item.finishTime)) }}</span>
        </li>
      </ul>
    </el-card>
    <el-card class="worker-dynamic-finisher-box">
      <div slot="header">
        <i class="el-icon-user-solid" />
        <span style="margin-left: 5px">员工工作统计</span>
      </div>
      <ul>
        <li v-for="(item, index) of finisher" :key="index">
          <span>
            {{ item.name }}
          </span>
          <span>{{ item.size + ' 单' }}</span>
        </li>
      </ul>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'WorkerDynamicInfo',
  props: ['finish', 'finisher'],
  data() {
    return {
      timeFormatter: new Intl.DateTimeFormat('zh', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
    };
  }
};
</script>

<style>
.worker-dynamic-box {
  display: flex;
  justify-content: space-around;
}

.worker-dynamic-finish-box {
  flex-grow: 1;
  margin: 10px;
  text-align: center;
}

.worker-dynamic-finish-box ul {
  margin: 0;
  padding: 0;
}

.worker-dynamic-finish-box ul li {
  display: flex;
  justify-content: space-between;
}

.worker-dynamic-finisher-box {
  flex-grow: 1;
  margin: 10px;
  text-align: center;
}

.worker-dynamic-finisher-box ul {
  margin: 0;
  padding: 0;
}

.worker-dynamic-finisher-box ul li {
  text-align: left;
  display: flex;
  justify-content: space-between;
}
</style>
