<template>
  <el-card
    body-style="
      display: flex;
      flex-direction: column;
      flex-grow:1;
    "
  >
    <div slot="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>员工管理</el-breadcrumb-item>
        <el-breadcrumb-item>员工工作量统计</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-form inline ref="queryForm" class="query-box">
      <el-form-item label="月份">
        <el-date-picker
          v-model="month"
          type="month"
          placeholder="选择月份"
          @change="refreshData"
        />
      </el-form-item>
    </el-form>

    <el-table stripe height="use" :data="data">
      <el-table-column fixed sortable prop="id" label="工人ID" />
      <el-table-column sortable prop="name" label="名字" />
      <el-table-column sortable prop="num" label="总共完成工序数" />

      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" @click="handleView(scope.$index)"
              >详细信息</el-button
            >
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <WorkloadDetail
      :show="viewDialogFormVisible"
      :data="data[viewIndex]"
      :month="month"
      @close="viewDialogFormVisible = false"
    />
  </el-card>
</template>

<script>
import WorkloadDetail from '@/views/worker/childComp/WorkloadDetail';

export default {
  name: 'WorkloadStatistics',
  components: {
    WorkloadDetail
  },
  data() {
    return {
      month: '',

      data: [{ id: 0, name: '', finishList: [], num: 0, finishSet: [] }],
      viewDialogFormVisible: false,
      viewIndex: 0
    };
  },
  created() {
    this.refreshData();
  },
  methods: {
    handleView(index) {
      this.viewIndex = index;
      this.viewDialogFormVisible = true;
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
          _this.dealWithData();
        });
    },
    dealWithData() {
      let data = this.data;
      data.forEach(o => {
        o.num = o.finishList.length;
        o.finishSet = [];
        let tmp = {};

        for (const f of o.finishList) {
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

        o.finishSet.forEach(f => (f.num = f.list.length));
      });

      this.data.sort((f, s) => f.id - s.id);
    }
  }
};
</script>
