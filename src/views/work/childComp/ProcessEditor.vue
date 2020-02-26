<template>
  <el-dialog title="编辑工序" :visible="show" v-on:close="$emit('close')">
    <el-form :model="process" label-width="auto" ref="process" :rules="rules">
      <el-form-item label="ID" prop="Id">
        <el-input disabled v-model="process.id" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="process.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="comment">
        <el-input v-model="process.comment" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="submitForm('process')">编辑</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ProcessEditor',
  props: ['show', 'data'],
  data() {
    let checkName = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('名字不能为空'));
      } else {
        this.axios('/api/process?name=' + value).then(res => {
          if (res.data.data) {
            const processes = res.data.data.processes;

            const _this = this;
            if (
              processes.findIndex(process => {
                return (
                  process.name === value && process.id !== _this.process.id
                );
              }) !== -1
            ) {
              callback(new Error('该名字已经存在'));
            } else {
              callback();
            }
          }
        });
      }
    };

    return {
      process: {
        name: '',
        comment: ''
      },
      rules: {
        name: [
          {
            validator: checkName,
            trigger: 'blur'
          }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit('close');

          const data = this.process;
          let _this = this;
          this.axios.post('/api/process', data).then(res => {
            _this.$message({
              message: res.data.message,
              type: 'success',
              showClose: true,
              center: true
            });
            _this.$emit('success', res.data.data);
          });
        } else {
          return false;
        }
      });
    }
  },
  watch: {
    data(newV) {
      Object.assign(this.process, newV);
    }
  }
};
</script>

<style></style>
