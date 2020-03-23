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
        <el-breadcrumb-item :to="{ path: '/work/workManage' }"
          >生产流程管理</el-breadcrumb-item
        >
        <el-breadcrumb-item>创建生产流程</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card>
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
        <el-form-item label="工序">
          <el-select
            style="padding-right: 20px"
            v-model="newProcesses"
            multiple
            clearable
            placeholder="请选择工序"
            :disabled="processes.length === 0"
          >
            <el-option
              v-for="(item, index) in processes"
              :key="index"
              :label="item.name"
              :value="index"
            >
            </el-option>
          </el-select>
          <el-button type="primary" @click="addProcesses">添加</el-button>
        </el-form-item>
      </el-form>
      <div
        v-if="work.processes.length === 0"
        style="text-align: center; margin: 30px 0"
      >
        <span style="size: 14px; line-height: 1.5; color: #909399"
          >还没有流程工序</span
        >
      </div>
      <div v-else>
        <el-timeline style="padding-left: 20px; margin-top: 50px">
          <el-timeline-item
            v-for="(process, index) in work.processes"
            :key="process.id"
          >
            <el-card>
              <div class="work-process-box">
                <div class="work-process-info">
                  <span style="display: inline-block; width: 150px;">
                    {{ process.name }}
                  </span>
                  <span
                    style="margin-left: 30px"
                    v-if="process.comment.length !== 0"
                  >
                    备注: {{ process.comment }}
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
                      v-if="index !== work.processes.length - 1"
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
        <div style="text-align: center">
          <el-button type="primary" @click="create">创建</el-button>
        </div>
      </div>
    </el-card>
  </el-card>
</template>

<script>
export default {
  name: 'WorkCreator',
  data() {
    let checkName = (rule, value, callback) => {
      this.axios('/api/work?name=' + value).then(res => {
        for (const work of res.data.data.works) {
          if (work.name === value) {
            callback(new Error('名字为' + value + '的生产流程已经存在'));
            return;
          }
        }
        callback();
      });
    };

    return {
      work: {
        name: '',
        comment: '',
        processes: []
      },

      newProcesses: [],
      processes: [],

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
    let _this = this;
    let pageNumber = 0;
    let total = 0;
    const url = '/api/process?pageSize=50&pageNumber=';

    let callback = res => {
      total = res.data.data.total;
      pageNumber++;
      _this.processes.push.apply(_this.processes, res.data.data.processes);
      if (pageNumber < total) {
        _this.axios(url + pageNumber).then(callback);
      } else {
        _this.processes.sort((p1, p2) => {
          return p1.id - p2.id;
        });
      }
    };

    this.axios(url + pageNumber).then(callback);
  },
  methods: {
    addProcesses() {
      let count = 0;

      for (const i of this.newProcesses) {
        const index = i - count;
        this.work.processes.push.apply(
          this.work.processes,
          this.processes.splice(index, 1)
        );
        count++;
      }
      this.newProcesses.splice(0, this.newProcesses.length);
    },
    upWorkProcess(index) {
      let tmp = this.work.processes.splice(index, 1)[0];
      this.work.processes.splice(index - 1, 0, tmp);
    },
    downWorkProcess(index) {
      let tmp = this.work.processes.splice(index, 1)[0];
      this.work.processes.splice(index + 1, 0, tmp);
    },
    deleteWorkProcess(index) {
      this.processes.push.apply(
        this.processes,
        this.work.processes.splice(index, 1)
      );
    },
    create() {
      this.$refs.work.validate(valid => {
        if (valid) {
          let data = {
            name: this.work.name,
            comment: this.work.comment,
            processes: []
          };

          for (const process of this.work.processes) {
            data.processes.push(process.id);
          }

          let _this = this;

          this.axios.post('/api/work', data).then(res => {
            _this.$message({
              message: res.data.message,
              type: 'success',
              showClose: true,
              center: true
            });
            _this.$router.push('/work/workManage');
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style>
.work-process-box {
  display: flex;
  justify-content: space-between;
}

.work-process-info {
  display: flex;
  align-items: center;
}

.up-down-button {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  height: 65px;
  margin-right: 20px;
}
</style>
