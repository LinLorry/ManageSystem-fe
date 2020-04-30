<template>
  <div>
    <van-nav-bar
      fixed
      placeholder
      left-arrow
      right-text="选择日期"
      :title="title"
      @click-left="$router.go(-1)"
      @click-right="showDatePicker = true"
    />
    <van-pull-refresh v-model="refreshing" @refresh="refreshData">
      <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="finishedText"
        @load="refreshData"
      >
        <div
          v-for="workerInfo of data"
          :key="workerInfo.id"
          @click="click(workerInfo)"
        >
          <el-card class="worker-info-card">
            <div slot="header" class="header">
              <span>{{ workerInfo.name }}</span>
            </div>
            <div class="content">
              <span>本月完成工序数：</span>
              <strong>{{ workerInfo.finishList.length }}</strong>
              <br />
              <span>今日完成工序数：</span>
              <strong>{{ workerInfo.todayNum }}</strong>
            </div>
          </el-card>
        </div>
      </van-list>
    </van-pull-refresh>

    <van-popup ref="datePickerPopup" v-model="showDatePicker" position="bottom">
      <van-datetime-picker
        type="year-month"
        :value="month"
        @confirm="datePickerConfirm($event)"
        @cancel="showDatePicker = false"
      />
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'WorkloadList',
  data() {
    let now = new Date();

    return {
      month: new Date(now.getFullYear(), now.getMonth(), 1),
      showDatePicker: false,

      data: [],
      loading: false,
      finished: false,
      refreshing: false
    };
  },
  methods: {
    datePickerConfirm(date) {
      this.month = date;
      this.showDatePicker = false;
      this.refreshData();
    },
    refreshData() {
      let _this = this;

      let params = {
        month: this.month
      };

      this.axios
        .request({
          url: '/api/worker/statistical',
          method: 'get',
          params
        })
        .then(res => {
          _this.data.splice(0, _this.data.length);
          _this.data.push.apply(_this.data, res.data.data);
          _this.loading = false;
          _this.refreshing = false;
          _this.finished = true;
          _this.dealWithData();
        });
    },
    dealWithData() {
      let data = this.data;
      let now = new Date();
      let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      data.forEach(o => {
        o.num = o.finishList.length;
        o.finishSet = [];
        let tmp = {};

        let todayNum = 0;

        for (const f of o.finishList) {
          let date = new Date(f.finishTime);
          if (date > today) todayNum++;

          let index = tmp[f.processId];
          if (index) {
            o.finishSet[index].list.push(f);
          } else {
            tmp[f.processId] = o.finishSet.length;
            o.finishSet.push({
              name: f.processName,
              list: [f]
            });
          }
        }

        o.todayNum = todayNum;

        o.finishSet.forEach(f => (f.num = f.list.length));
      });

      this.data.sort((f, s) => f.id - s.id);
    },
    click(data) {
      this.$emit('showDetail', data);
    }
  },
  computed: {
    title() {
      const option = { year: 'numeric', month: 'long' };
      return this.month.toLocaleDateString('zh-cn', option);
    },
    finishedText() {
      if (this.data.length === 0) return '这个月没有工序完成';
      else return '';
    }
  }
};
</script>

<style>
.worker-info-card {
  margin: 10px 10px 30px;
}

.worker-info-card .content span {
  display: inline-block;
  width: 10em;
}
</style>
