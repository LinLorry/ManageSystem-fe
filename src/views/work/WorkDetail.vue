<template>
  <el-card body-style="overflow: auto;">
    <div slot="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>生产管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/work/workManage' }"
          >生产流程管理</el-breadcrumb-item
        >
        <el-breadcrumb-item>生产流程详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card style="margin-bottom: 20px;">
      <div slot="header">
        <span>生产流程信息</span>
      </div>
      <el-form
        hide-required-asterisk
        ref="work"
        label-width="auto"
        label-position="left"
        :model="work"
        :rules="rules"
      >
        <el-form-item label="ID">
          <el-input disabled :value="work.id" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="work.name"
            placeholder="请输入生产流程名称"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="备注" prop="comment">
          <el-input
            v-model="work.comment"
            placeholder="请输入生产流程备注"
            autocomplete="off"
          />
        </el-form-item>
        <el-button type="primary" @click="update">更新</el-button>
      </el-form>
    </el-card>
    <el-card style="margin-bottom: 20px">
      <div slot="header">
        <span>流程工序信息</span>
      </div>
      <div>
        <el-timeline style="padding-left: 20px">
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
    let checkName = (rule, value, callback) => {
      this.axios('/api/work?name=' + value).then(res => {
        for (const work of res.data.data.works) {
          if (work.name === value && work.id !== this.work.id) {
            callback(new Error('名字为' + value + '的生产流程已经存在'));
            return;
          }
        }
        callback();
      });
    };

    return {
      work: {
        id: 0,
        name: '',
        comment: ''
      },
      workProcesses: [],
      rules: {
        name: [
          { required: true, message: '生产流程名称不能为空' },
          {
            validator: checkName,
            trigger: 'blur'
          }
        ]
      }
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
  },
  methods: {
    update() {
      this.$refs.work.validate(valid => {
        if (valid) {
          let data = this.work;

          let _this = this;

          this.axios.post('/api/work', data).then(res => {
            _this.$message({
              message: res.data.message,
              type: 'success',
              showClose: true,
              center: true
            });
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style></style>
