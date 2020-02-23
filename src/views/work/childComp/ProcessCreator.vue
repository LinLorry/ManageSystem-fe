<template>
  <el-dialog title="新建工序" :visible="show" v-on:close="$emit('close')">
    <el-form :model="process" label-width="auto" ref="process" :rules="rules">
      <el-form-item label="名称" prop="name">
        <el-input
          placeholder="请输入名称"
          v-model="process.name"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="comment">
        <el-input
          placeholder="请输入备注信息"
          v-model="process.comment"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="submitForm('process')">创建</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'processCreator',
  props: ['show'],
  data: function() {
    return {
      process: {
        name: '',
        comment: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入工序名称'
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
  }
};
</script>
