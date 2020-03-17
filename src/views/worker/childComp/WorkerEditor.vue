<template>
  <el-dialog title="编辑用户" :visible="show" v-on:close="$emit('close')">
    <el-form label-width="60px" ref="user">
      <el-form-item label="ID">
        <el-input disabled :value="user.id" />
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="user.name" />
      </el-form-item>
      <el-form-item label="工序">
        <el-select
          style="padding-right: 20px"
          :disable="tmpProcesses.length === 0"
          v-model="newProcesses"
          multiple
          clearable
          placeholder="请选择工序"
        >
          <el-option
            v-for="item in tmpProcesses"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <el-button type="primary" @click="addProcesses">添加</el-button>
      </el-form-item>
    </el-form>

    <div style="margin-left: 60px;">
      <el-table
        :data="user.processes"
        :show-header="false"
        empty-text="暂无工序"
      >
        <el-table-column>
          <template slot-scope="scope">
            {{
              processes.find(p => {
                return p.id === user.processes[scope.$index];
              }).name
            }}
          </template>
        </el-table-column>
        <el-table-column align="right">
          <template slot-scope="scope">
            <i
              class="el-icon-remove"
              style="color: red"
              @click="wipeOffProcess(scope.$index)"
            ></i>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button v-if="processChange" type="primary" @click="updateProcesses"
        >更新工序</el-button
      >
      <el-button v-if="isNotWorker" type="primary" @click="setWorker"
        >设置为生产人员</el-button
      >
      <el-button type="primary" @click="updateUserInfo">编辑</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'WorkerProcessEditor',
  props: ['show', 'data'],
  data() {
    return {
      user: {
        id: 0,
        name: '',
        processes: []
      },

      isNotWorker: false,

      tmpProcesses: [],
      newProcesses: [],
      processChange: false,
      processes: [],
      rules: {
        username: [{ required: true, message: '用户名不能为空' }]
      }
    };
  },
  created() {
    let _this = this;
    let pageNumber = 1;
    let total;
    let callback = res => {
      _this.processes.push.apply(_this.processes, res.data.data.processes);

      if (pageNumber < total) {
        _this.axios('/api/process?pageNumber=' + pageNumber).then(callback);
      } else {
        _this.processes.sort((first, second) => {
          return first.id - second.id;
        });
      }
    };

    this.axios('/api/process').then(res => {
      total = res.data.data.total;
      callback(res);
    });
  },
  methods: {
    addProcesses() {
      if (this.isNotWorker) {
        this.$message({
          message: '该用户还不是生产人员，请先设置为生产人员再进行工序操作',
          type: 'error',
          showClose: true,
          center: true
        });

        return;
      }

      this.processChange = true;

      this.user.processes.push.apply(this.user.processes, this.newProcesses);

      for (const processes of this.newProcesses) {
        this.tmpProcesses.splice(
          this.tmpProcesses.findIndex(p => {
            return p.id === processes;
          }),
          1
        );
      }

      this.newProcesses.splice(0, this.newProcesses.length);
    },
    wipeOffProcess(index) {
      if (this.isNotWorker) {
        this.$message({
          message: '该用户还不是生产人员，请先设置为生产人员再进行工序操作',
          type: 'error',
          showClose: true,
          center: true
        });

        return;
      }

      this.processChange = true;
      const id = this.user.processes[index];

      this.tmpProcesses.push(
        this.processes.find(process => {
          return process.id === id;
        })
      );
      this.user.processes.splice(index, 1);
    },
    setWorker() {
      let _this = this;
      this.axios
        .post('/api/worker/set', {
          id: this.user.id,
          operation: true
        })
        .then(res => {
          _this.isNotWorker = false;

          _this.$message({
            message: res.data.message,
            type: 'success',
            showClose: true,
            center: true
          });
        });
    },
    updateUserInfo() {
      let data = {
        id: this.user.id,
        name: this.user.name
      };

      let _this = this;
      this.axios.post('/api/worker', data).then(res => {
        _this.$message({
          message: res.data.message,
          type: 'success',
          showClose: true,
          center: true
        });
        _this.$emit('success', res.data.data);
      });
    },
    updateProcesses() {
      this.processChange = false;
      let data = {
        id: this.user.id,
        processes: this.user.processes
      };

      let _this = this;
      this.axios.post('/api/userProcess', data).then(res => {
        _this.$message({
          message: res.data.message,
          type: 'success',
          showClose: true,
          center: true
        });
      });
    }
  },
  watch: {
    data(newV) {
      Object.assign(this.user, newV);

      let _this = this;

      this.user.processes.splice(0, this.user.processes.length);
      this.processChange = false;

      this.axios('/api/userProcess?id=' + newV.id).then(res => {
        res.data.data.sort((first, second) => {
          return first.id - second.id;
        });

        for (const one of res.data.data) {
          _this.user.processes.push(one.id);
        }

        _this.tmpProcesses.splice(0, _this.tmpProcesses.length);
        for (const process of _this.processes) {
          if (_this.user.processes.indexOf(process.id) === -1) {
            _this.tmpProcesses.push(process);
          }
        }
      });

      this.axios('/api/worker/check?id=' + newV.id).then(res => {
        _this.isNotWorker = !res.data.data;
      });
    }
  }
};
</script>

<style></style>
