<template>
  <div class="createOrder">
    <template>
      <helloHeader />
    </template>
    <el-main>
      <el-card class="box-card">
        <div slot="header"
             class="clearfix">
          <span>订单创建</span>
        </div>
        <div class="text item">
          <el-form :model="ruleForm"
                   :rules="rules"
                   ref="ruleForm"
                   label-position="left"
                   label-width="100px"
                   class="demo-ruleForm">
            <el-form-item label="订单号"
                          prop="order">
              <el-input v-model="ruleForm.order"></el-input>
            </el-form-item>
            <el-form-item label="生产流程ID"
                          prop="process">
              <el-input v-model.number="ruleForm.process"></el-input>
            </el-form-item>
            <el-form-item label="需求时间"
                          required>
              <el-col :span="11">
                <el-form-item prop="date1">
                  <el-date-picker type="date"
                                  placeholder="选择日期"
                                  v-model="ruleForm.date1"
                                  style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col class="line"
                      :span="2">-</el-col>
              <el-col :span="11">
                <el-form-item prop="date2">
                  <el-time-picker placeholder="选择时间"
                                  v-model="ruleForm.date2"
                                  style="width: 100%;"></el-time-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="备注"
                          prop="desc">
              <el-input type="textarea"
                        v-model="ruleForm.desc"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         @click="submitForm('ruleForm')">立即创建</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </el-main>
  </div>
</template>>

<script>
import helloHeader from '@/components/helloHeader.vue'
export default {
  components: {
    helloHeader
  },
  data () {
    return {
      ruleForm: {
        order: '',
        process: '',
        date1: '',
        date2: '',
        desc: ''
      },
      rules: {
        order: [
          { required: true, message: '请输入订单号', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        process: [
          { required: true, message: '请输入生产流程ID' },
          { type: 'number', message: '生产流程ID必须为整数' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        desc: [
          { required: false, message: '请填写活动形式', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
          console.log(formName)
          console.log(this.ruleForm)
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

<style scoped>
.createOrder {
  width: 100%;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
  margin-left: 40px;
  float: left;
}

.el-form {
  border: none;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
</style>
