<template>
  <el-dialog title="新建子菜单" :visible="show" v-on:close="$emit('close')">
    <el-form
      hide-required-asterisk
      label-width="auto"
      ref="subForm"
      :model="subForm"
      :rules="rules"
    >
      <el-form-item label="原密码" prop="oldPassword">
        <el-input
          type="password"
          placeholder="请输入原密码"
          v-model="subForm.oldPassword"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input
          placeholder="请输入新密码"
          v-model="subForm.newPassword"
          autocomplete="off"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="重复新密码" prop="repeat">
        <el-input
          type="password"
          placeholder="请输入新密码"
          v-model="subForm.repeat"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="submitForm()">创建</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ChangePassword',
  props: ['show'],
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'));
      } else {
        if (this.subForm.newPassword !== '') {
          this.$refs.subForm.validateField('checkPass');
        }
        callback();
      }
    };
    let validateRepeat = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.subForm.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };

    return {
      subForm: {
        oldPassword: '',
        newPassword: '',
        repeat: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPassword: [{ validator: validatePass, trigger: 'blur' }],
        repeat: [{ validator: validateRepeat, trigger: 'blur' }]
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs.subForm.validate(value => {
        if (value) {
          this.$emit('close');
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped></style>
