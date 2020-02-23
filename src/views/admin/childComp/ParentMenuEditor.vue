<template>
  <el-dialog title="编辑父菜单" :visible="show" v-on:close="$emit('close')">
    <el-form :model="menu" label-width="auto" ref="menu" :rules="rules">
      <el-form-item label="ID" prop="Id">
        <el-input disabled v-model="menu.id" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="menu.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-input v-model="menu.icon" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="submitForm('menu')">编辑</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'menuEditor',
  props: ['show', 'data', 'parentMenus'],
  data() {
    var checkName = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('名字不能为空'));
      } else {
        const parentMenus = this.parentMenus;

        for (const parentMenu of parentMenus) {
          if (this.menu.id !== parentMenu.id && value === parentMenu.label) {
            return callback(new Error('该名字已被设置'));
          }
        }
        callback();
      }
    };

    var checkIcon = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('图标不能为空'));
      } else {
        callback();
      }
    };

    return {
      menu: {
        id: '',
        name: '',
        icon: ''
      },
      rules: {
        name: [
          {
            validator: checkName,
            trigger: 'blur'
          }
        ],
        icon: [
          {
            validator: checkIcon,
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

          const data = this.menu;
          let _this = this;
          this.axios.post('/api/menu/parent', data).then(res => {
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
      Object.assign(this.menu, newV);
    }
  }
};
</script>
