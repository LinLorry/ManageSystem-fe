<template>
  <el-card
    body-style="
    overflow: auto;
    margin-bottom: 20px"
    style="display: flex;
    flex-direction: column;"
  >
    <div slot="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>生产管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/workManage' }"
          >生产流程管理</el-breadcrumb-item
        >
        <el-breadcrumb-item>生产流程详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card style="margin-bottom: 20px;">
      <div slot="header">
        <span>生产流程信息</span>
      </div>
      <div>
        <span>生产流程 Id: {{ work.id }}</span
        ><br />
        <span>生产流程名字: {{ work.name }}</span
        ><br />
        <span>生产流程备注: {{ work.comment }}</span
        ><br />
      </div>
    </el-card>
    <el-card>
      <div slot="header">
        <span>工序信息</span>
      </div>
      <div>
        <el-timeline>
          <el-timeline-item
            v-for="workProcess in workProcesses"
            :key="workProcess.id"
          >
            <el-card>
              <span style="display: inline-block; width: 150px;">
                {{ workProcess.name }}
              </span>
              <span v-if="workProcess.comment.length !== 0">
                备注: {{ workProcess.comment }}
              </span>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>
  </el-card>
</template>

<script>
export default {
  name: 'WorkDetail',
  data() {
    return {
      work: {
        id: 0,
        name: '',
        comment: ''
      },
      workProcesses: []
    };
  },
  created() {
    const _this = this;
    const id = this.$route.params.id;
    this.axios('/api/work?id=' + id).then(res => {
      if (res.data.data) {
        Object.assign(_this.work, res.data.data);
      }
    });

    this.axios('/api/work/processes?id=' + id).then(res => {
      if (res.data.data) {
        let workProcesses = res.data.data;
        workProcesses.sort((first, second) => {
          return first.sequenceNumber - second.sequenceNumber;
        });
        _this.workProcesses = workProcesses;
      }
    });
  }
};
</script>

<style></style>
