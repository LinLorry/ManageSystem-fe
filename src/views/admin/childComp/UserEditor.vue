<template>
  <el-dialog title="编辑用户" :visible="show" v-on:close="$emit('close')">
    <el-form :model="user" label-width="auto" ref="user" :rules="rules">
      <el-form-item label="ID" prop="Id">
        <el-input disabled v-model="user.id" autocomplete="off" />
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="user.username" autocomplete="off" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="user.name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="submitForm('user')">编辑</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'UserEditor',
  props: ['show', 'data'],
  data() {
    return {
      user: {
        id: 0,
        username: '',
        name: ''
      },
      rules: {
        username: [{ required: true, message: '用户名不能为空' }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit('close');

          const data = this.user;
          let _this = this;
          this.axios.post('/api/user', data).then(res => {
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
      Object.assign(this.user, newV);
    }
  }
};
</script>

<style scoped></style>
