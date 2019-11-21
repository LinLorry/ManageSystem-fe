<template>
  <div class="login">
    <!-- 登陆表单 -->
    <el-form :model="loginForm"
             status-icon
             :rules="rules"
             ref="loginForm"
             label-width="100px"
             class="demo-loginForm">
      <h1 class="title">
        <i class="el-icon-setting"></i>
        vuexms登录
      </h1>

      <el-form-item label="账号"
                    prop="username">
        <el-input type="text"
                  v-model="loginForm.username"
                  autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="密码"
                    prop="password">
        <el-input type="password"
                  v-model="loginForm.password"
                  autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item class="btn">
        <el-button type="primary"
                   style="width: 40%;margin-right: 50px;"
                   @click="submitForm('loginForm')">登录</el-button>
        <el-button style="width: 40%"
                   @click="resetForm('loginForm')">重置</el-button>
      </el-form-item>

      <div>
        <a href="#/register"
           style="float: right;color: #3C8DBC;font-size: 14px;margin-right: 20px;margin-top:0">Register-></a>
      </div>
    </el-form>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        password: '',
        username: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 18, message: '长度在 5 到 18 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let _this = this
          console.log(this.axios)
          this.axios.post('/api/user/token', {
            params: {
              username: _this.loginForm.username,
              password: _this.loginForm.password
            }
          })
            .then(response => {
              if (response.data.length) {
                console.log('接收后端响应登录请求的数据：', response.data[0])

                // 把用户信息存入本地存储
                localStorage.setItem(
                  'userinfo',
                  JSON.stringify(response.data[0])
                )

                let userinfo = JSON.parse(localStorage.getItem('userinfo'))

                // 把当前登录用户数据存入store
                _this.$store.commit('SAVE_USERINFO', userinfo)

                _this.$message({
                  message: '登录成功',
                  type: 'success'
                })

                // 跳转到后台首页
                _this.$router.push('/')
              } else {
                _this.$message.error('登录失败')
              }
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style>
/* html,
body {
  margin: 0;
  padding: 0;
} */
html,
body,
#app,
.login {
  height: 100%;
}
.login {
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-form {
  margin: 0 auto;
  padding: 50px 45px 10px 10px;
  width: 400px;
  border: 1px solid #cccccc;
  border-radius: 10px;
}
.el-form .title {
  font-size: 26px;
  color: #333333;
  font-weight: bold;
  padding: 20px 0 20px 60px;
}
</style>
