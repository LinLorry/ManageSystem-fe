<template>
  <el-container class="loginContainer">
    <el-main class="loginMain">
      <div class="loginBox">
        <el-form
          hide-required-asterisk
          label-position="right"
          label-width="50px"
          ref="loginForm"
          :rules="rules"
          :model="loginForm"
          @submit.native.prevent
        >
          <el-form-item label="账号" prop="username">
            <el-input
              placeholder="请输入账号"
              v-model="loginForm.username"
              autocomplete="off"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              placeholder="请输入密码"
              type="password"
              v-model="loginForm.password"
              autocomplete="off"
            >
            </el-input>
          </el-form-item>
          <el-button
            type="primary"
            native-type="submit"
            @click="submitForm('loginForm')"
            >登陆</el-button
          >
        </el-form>
      </div>
    </el-main>
    <el-footer></el-footer>
  </el-container>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '账号不能为空'
          }
        ],
        password: [
          {
            required: true,
            message: '密码不能为空'
          }
        ]
      }
    };
  },
  created() {
    let _this = this;
    if (localStorage.getItem('token')) {
      this.$axios('/api/user/profile').then(res => {
        _this.$router.push('/');
        localStorage.setItem('userInfo', JSON.stringify(res.data.data));
      });
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const preUrl = this.$route.query.preUrl;

          const data = this.loginForm;
          let _this = this;
          if (data.username && data.password) {
            this.axios.post('/api/user/token', data).then(res => {
              _this.$message({
                message: '登陆成功',
                type: 'success',
                showClose: true,
                center: true
              });
              localStorage.setItem('token', res.data.token);
              if (preUrl) {
                _this.$router.push({ path: preUrl });
              } else {
                _this.$router.push('/');
              }
              _this.$loginFlag = false;
            });
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style>
.loginContainer {
  height: 100%;
  background-color: #14b9d6;
}

.loginMain {
  display: flex;
  justify-content: center;
  align-items: center;
}

.loginBox {
  border-radius: 2px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 50px 30px 30px;
  text-align: center;
  background: #f7f7f7;
}
</style>
