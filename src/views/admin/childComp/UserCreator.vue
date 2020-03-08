<template>
  <el-dialog title="新建用户" :visible="show" v-on:close="$emit('close')">
    <el-form :model="user" label-width="auto" ref="user" :rules="rules">
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="user.username"
          placeholder="请输入用户名"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="user.password"
          placeholder="请输入密码"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input
          placeholder="请输入名称"
          v-model="user.name"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="submitForm('user')">创建</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'UserCreator',
  props: ['show'],
  data() {
    return {
      user: {
        username: '',
        password: '',
        name: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码'
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
  }
};
</script>

<style></style>
