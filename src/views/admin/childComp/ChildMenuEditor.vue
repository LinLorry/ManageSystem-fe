<template>
  <el-dialog title="编辑子菜单" :visible="show" v-on:close="$emit('close')">
    <el-form :model="menu" label-width="auto" ref="menu" :rules="rules">
      <el-form-item label="ID" prop="Id">
        <el-input disabled v-model="menu.id" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="menu.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="路径" prop="url">
        <el-input v-model="menu.url" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="父级菜单" prop="parentId">
        <el-select v-model="menu.parentId" placeholder="请选择">
          <el-option
            v-for="item in parentMenus"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="可访问的权限" prop="roles">
        <el-checkbox-group v-model="menu.roles">
          <el-checkbox
            style="display:block"
            v-for="item in roles"
            :label="item.id"
            :key="item.id"
            :disabled="item.id === 1"
            >{{ item.name }}</el-checkbox
          >
        </el-checkbox-group>
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
          for (const childMenu of parentMenu.children) {
            if (this.menu.id !== childMenu.id && value === childMenu.label) {
              return callback(new Error('该名字已被设置'));
            }
          }
        }
        callback();
      }
    };

    var checkUrl = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('路径不能为空'));
      } else {
        const parentMenus = this.parentMenus;

        for (const parentMenu of parentMenus) {
          for (const childMenu of parentMenu.children) {
            if (this.menu.id !== childMenu.id && value === childMenu.url) {
              return callback(new Error('该Url已被设置'));
            }
          }
        }
        callback();
      }
    };

    var checkParent = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请选择父菜单'));
      } else {
        callback();
      }
    };

    return {
      menu: {
        id: 0,
        name: '',
        url: '',
        parentId: '',
        roles: []
      },
      oldParentId: 0,
      roles: [],
      rules: {
        name: [
          {
            validator: checkName,
            trigger: 'blur'
          }
        ],
        url: [
          {
            validator: checkUrl,
            trigger: 'blur'
          }
        ],
        parentId: [
          {
            validator: checkParent,
            trigger: 'blur'
          }
        ]
      }
    };
  },
  created() {
    const _this = this;
    this.axios('/api/role').then(res => {
      res.data.data.sort((first, second) => {
        return first.id - second.id;
      });
      _this.roles = res.data.data;
    });
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit('close');

          const data = this.menu;
          let _this = this;
          this.axios.post('/api/menu/child', data).then(res => {
            _this.$message({
              message: res.data.message,
              type: 'success',
              showClose: true,
              center: true
            });
            res.data.data.oldParentId = _this.oldParentId;
            res.data.data.parentId = data.parentId;
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
      const _this = this;
      this.oldParentId = newV.parentId;
      Object.assign(this.menu, newV);
      this.menu.roles.splice(0, this.menu.roles.length);

      this.axios('/api/menu/child?id=' + newV.id).then(res => {
        for (const role of res.data.data.roles) {
          _this.menu.roles.push(role.id);
        }
      });
    }
  }
};
</script>
