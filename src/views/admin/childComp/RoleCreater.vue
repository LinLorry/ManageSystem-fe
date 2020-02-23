<template>
  <el-dialog title="新建权限" :visible.sync="show">
    <el-form :model="role" label-width="auto" ref="role" :rules="rules">
      <el-form-item label="名称" prop="name">
        <el-input
          placeholder="请输入名称"
          v-model="role.name"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="权限控制" prop="role">
        <el-input
          placeholder="请输入权限控制"
          v-model="role.role"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="submitForm('role')">创建</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'roleCreater',
  props: ['show'],
  data: function() {
    var checkName = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('名字不能为空'));
      } else {
        callback();
      }
    };

    var checkRole = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('权限控制不能为空'));
      } else {
        callback();
      }
    };
    return {
      role: {
        name: '',
        role: ''
      },
      rules: {
        name: [
          {
            validator: checkName,
            trigger: 'blur'
          }
        ],
        role: [
          {
            validator: checkRole,
            trigger: 'blur'
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

          const data = this.role;
          let _this = this;
          this.axios.post('/api/role', data).then(res => {
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
