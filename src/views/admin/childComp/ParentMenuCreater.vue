<template>
  <el-dialog title="新建父菜单" :visible="show" v-on:close="$emit('close')">
    <el-form :model="menu" label-width="auto" ref="menu" :rules="rules">
      <el-form-item label="名称" prop="name">
        <el-input
          placeholder="请输入名称"
          v-model="menu.name"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-input
          placeholder="请输入图标代码"
          v-model="menu.icon"
          autocomplete="off"
          :prefix-icon="menu.icon"
        ></el-input>
      </el-form-item>
      <div style="text-align: center">
        <span
          >图标可在<a
            href="https://element.eleme.cn/#/zh-CN/component/icon"
            target="_blank:"
            style="color:#606266"
            >此</a
          >查询，输入图标下的代码即可</span
        >
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="submitForm('menu')">创建</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'parentMenuCreater',
  props: ['show', 'parentMenus'],
  data: function() {
    var checkName = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('名字不能为空'));
      } else {
        const parentMenus = this.parentMenus;

        for (const parentMenu of parentMenus) {
          if (value === parentMenu.label) {
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
            _this.menu = {
              name: '',
              icon: ''
            };
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
