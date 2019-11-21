<template>
  <div class="register">
    <!-- 注册表单 -->
    <el-form :model="ruleForm"
             status-icon
             :rules="rules"
             ref="ruleForm"
             label-width="100px"
             class="demo-ruleForm">
      <el-form-item label="用户名"
                    prop="username">
        <el-input type="text"
                  v-model="ruleForm.username"
                  autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="姓名"
                    prop="name">
        <el-input type="text"
                  v-model="ruleForm.name"
                  autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="密码"
                    prop="pass">
        <el-input type="password"
                  v-model="ruleForm.pass"
                  autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码"
                    prop="checkPass">
        <el-input type="password"
                  v-model="ruleForm.checkPass"
                  autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'register',
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        pass: '',
        checkPass: '',
        name: '',
        username: ''
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 18, message: '长度在 5 到 18 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let _this = this
          console.log(_this.ruleForm.username)
          console.log(this.axios)
          // this.axios.post('/api/checklogin', {
          this.axios
            .post('/api/user/register', {
              params: {
                username: _this.ruleForm.username,
                password: _this.ruleForm.pass,
                name: _this.ruleForm.name
              }
            })
            .then(response => {
              if (response.data.length) {
                console.log('接收后端响应登录请求的数据：', response.data[0])
                console.log(response.data)
                // 跳转到后台首页
                _this.$router.push('/')
              } else {
                _this.$message.error('登录失败')
              }
            })
          alert('submit!')
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
.register {
  height: 100%;
}
.register {
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
