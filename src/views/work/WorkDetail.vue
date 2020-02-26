<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>生产管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/workManage' }"
        >生产流程管理</el-breadcrumb-item
      >
      <el-breadcrumb-item>生产流程详情</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="content">
      <el-card class="info">
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
              v-for="(workProcess, index) in workProcesses"
              :key="workProcess.id"
            >
              <el-card>
                <div class="work-process-box">
                  <div class="work-process-info">
                    <span> {{ workProcess.name }} </span>
                    <span
                      style="margin-left: 30px"
                      v-if="workProcess.comment.length !== 0"
                    >
                      备注: {{ workProcess.comment }}
                    </span>
                  </div>
                  <div>
                    <el-button-group class="up-down-button">
                      <el-button
                        v-if="index !== 0"
                        size="small"
                        @click="upWorkProcess(index)"
                        icon="el-icon-caret-top"
                      ></el-button>
                      <el-button
                        v-if="index !== workProcesses.length - 1"
                        size="small"
                        @click="downWorkProcess(index)"
                        icon="el-icon-caret-bottom"
                      ></el-button>
                    </el-button-group>
                    <el-button
                      type="text"
                      @click="deleteWorkProcess(index)"
                      style="color: red"
                      icon="el-icon-delete"
                    />
                  </div>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>

          <div style="margin-bottom: 30px; text-align: center">
            <el-button type="primary" v-if="change" @click="updateWorkProcesses"
              >更新流程工序</el-button
            >
          </div>
          <div class="action-box">
            <div>
              <el-collapse>
                <el-collapse-item title="添加流程工序">
                  <ul
                    v-infinite-scroll="loadProcesses"
                    style="overflow:auto; height: 100px"
                  >
                    <li
                      v-if="processes.length === 0"
                      style="
                      text-align: center;
                      color: #909399;
                      list-style: none"
                    >
                      没有剩余工序
                    </li>

                    <li
                      v-for="(process, index) in processes"
                      :key="process.id"
                      class="process-box"
                    >
                      <span>{{ process.name }}</span>

                      <el-button
                        size="medium"
                        type="text"
                        style="margin-right: 20px"
                        icon="el-icon-circle-plus-outline"
                        @click="addWorkProcesses(index)"
                      />
                    </li>
                  </ul>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WorkDetail',
  data() {
    return {
      work: {
        id: 0,
        name: '',
        comment: '',
        createTime: '',
        creatorName: '',
        updateTime: '',
        updaterName: ''
      },
      workProcesses: [],
      processPageNumber: 0,
      processPageTotal: 1,
      processes: [],
      processId: 0,
      change: false
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
        _this.loadProcesses();
      }
    });
  },
  methods: {
    upWorkProcess(index) {
      let tmp = this.workProcesses.splice(index, 1)[0];
      this.workProcesses.splice(index - 1, 0, tmp);
      this.change = true;
    },
    downWorkProcess(index) {
      let tmp = this.workProcesses.splice(index, 1)[0];
      this.workProcesses.splice(index + 1, 0, tmp);
      this.change = true;
    },
    deleteWorkProcess(index) {
      const process = this.workProcesses.splice(index, 1)[0];
      this.processes.push(process);
      this.change = true;
    },
    loadProcesses() {
      if (this.processPageNumber > this.processPageTotal) return;

      let _this = this;
      this.axios(
        '/api/process?pageSize=5&pageNumber=' + this.processPageNumber
      ).then(res => {
        if (res.data.data) {
          let processes = res.data.data.processes;

          for (let workProcess of _this.workProcesses) {
            const index = processes.findIndex(process => {
              return process.id === workProcess.id;
            });

            if (index !== -1) {
              processes.splice(index, 1);
            }
          }

          _this.processes.push.apply(_this.processes, processes);
          _this.processPageTotal = res.data.data.total;
          _this.processPageNumber++;
        }
      });
    },
    addWorkProcesses(index) {
      const process = this.processes.splice(index, 1)[0];
      this.workProcesses.push(process);
      this.change = true;
    },
    updateWorkProcesses() {
      let _this = this;

      const data = [];

      for (const workProcess of this.workProcesses) {
        data.push(workProcess.id);
      }

      this.axios
        .post('/api/work/processes', {
          id: this.work.id,
          processes: data
        })
        .then(res => {
          if (res.data.data) {
            _this.$message({
              message: res.data.message,
              type: 'success',
              showClose: true,
              center: true
            });

            const workProcesses = res.data.data.processes;

            workProcesses.sort((first, second) => {
              return first.sequenceNumber - second.sequenceNumber;
            });
            _this.workProcesses = workProcesses;
            _this.processes.splice(0, _this.processes.length);
            _this.processPageNumber = 0;
            _this.loadProcesses();
          }
          _this.change = false;
        });
    }
  }
};
</script>

<style>
.info {
  margin-bottom: 20px;
}

.work-process-box {
  display: flex;
  justify-content: space-between;
}

.work-process-info {
  display: flex;
  /*flex-direction: column;*/
  /*justify-content: center;*/
  align-items: center;
}

.up-down-button {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  height: 65px;
  margin-right: 20px;
}

.process-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
