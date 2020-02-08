<template>
  <el-container class="loginContainer">
    <el-main>
      <div class="loginBox">
        <el-form
          label-width="auto"
          ref="loginForm"
          :rules="rules"
          :model="loginForm"
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
          <el-button type="primary" @click="submitForm('loginForm')"
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
    var checkUsername = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('账号不能为空'))
      } else {
        callback()
      }
    }

    var checkPassWord = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {
            validator: checkUsername,
            trigger: 'blur'
          }
        ],
        password: [
          {
            validator: checkPassWord,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    const token = this.$route.query.token
    if (token) {
      localStorage.setItem('token', token)
      this.$router.push('/')
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const data = this.loginForm
          let _this = this
          if (data.username && data.password) {
            this.axios.post('/api/user/token', data).then(res => {
              _this.$message({
                message: '登陆成功',
                type: 'success',
                showClose: true,
                center: true
              })
              localStorage.setItem('token', res.data.token)
              _this.$router.push('/')
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style>
.loginContainer {
  height: 100%;
  background-color: #14b9d6;
}

.loginBox .el-form {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 2px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 50px 50px 30px;
  text-align: center;
  background: #f7f7f7;
}
</style>
