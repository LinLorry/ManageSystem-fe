<template>
  <el-dialog title="编辑生产流程" :visible="show" v-on:close="$emit('close')">
    <el-form :model="work" label-width="60px" ref="work" :rules="rules">
      <el-form-item label="ID" prop="id">
        <el-input disabled :value="work.id" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input
          placeholder="请输入名称"
          v-model="work.name"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="comment">
        <el-input
          placeholder="请输入备注信息"
          v-model="work.comment"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="submitForm('work')">更新</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'workCreator',
  props: ['show', 'data'],
  data: function() {
    return {
      work: {
        id: 0,
        name: '',
        comment: ''
      },

      rules: {
        name: [
          {
            required: true,
            message: '请输入生产流程名称'
          }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const data = this.work;

          let _this = this;
          this.axios.post('/api/work', data).then(res => {
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
      Object.assign(this.work, newV);
    }
  }
};
</script>
