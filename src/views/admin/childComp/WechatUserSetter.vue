<template>
  <el-dialog title="编辑子菜单" :visible="show" @close="$emit('close')">
    <el-form ref="user" label-width="auto" :model="user">
      <el-form-item label="ID">
        <el-input disabled :value="wechatUserId" autocomplete="off" />
      </el-form-item>

      <el-form-item label="用户ID">
        <el-input disabled="" :value="user.id" />
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="user.username"
          placeholder="用户名"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="user.name" placeholder="姓名" autocomplete="off" />
      </el-form-item>
      <el-form-item label="设置组别" prop="roles">
        <el-checkbox-group v-model="user.roles" @change="rolesChange = true">
          <el-checkbox
            style="display:block"
            v-for="item in roles"
            :label="item.id"
            :key="item.id"
            >{{ item.name }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button v-if="user.disable" type="success" @click="enable"
        >启用该用户</el-button
      >
      <el-button v-else type="danger" @click="disable">禁用该用户</el-button>
      <el-button type="primary" @click="submitForm">编辑</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'wechatUserSetter',
  props: ['show', 'data'],
  data() {
    return {
      wechatUserId: '',
      user: {
        id: 0,
        username: '',
        name: '',
        disable: true,
        roles: []
      },

      rolesChange: false,

      roles: []
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
    submitForm() {
      this.$emit('close');

      let data = {
        id: this.user.id,
        username: this.user.username,
        name: this.user.name
      };

      if (this.rolesChange) {
        data.roles = this.user.roles;
      }

      let _this = this;
      this.axios.post('/api/admin/user', data).then(res => {
        _this.$message({
          message: res.data.message,
          type: 'success',
          showClose: true,
          center: true
        });
        _this.$emit('success', res.data.data);
      });
    },
    enable() {
      let data = this.user;
      let _this = this;

      _this.axios
        .post('/api/admin/user/disable', {
          id: data.id,
          operation: false
        })
        .then(res => {
          _this.user.disable = false;
          _this.$message({
            message: res.data.message,
            type: 'success',
            showClose: true,
            center: true
          });
        });
    },
    disable() {
      let data = this.user;
      let _this = this;

      _this.axios
        .post('/api/admin/user/disable', {
          id: data.id,
          operation: true
        })
        .then(res => {
          _this.user.disable = true;
          _this.$message({
            message: res.data.message,
            type: 'success',
            showClose: true,
            center: true
          });
        });
    }
  },
  watch: {
    data(newV) {
      this.wechatUserId = newV.id;

      this.user.roles.splice(0, this.user.roles.length);
      this.rolesChange = false;

      if (newV.user) {
        const user = newV.user;
        Object.assign(this.user, user);
        let _this = this;

        this.axios('/api/admin/user/authority?id=' + user.id).then(res => {
          res.data.data.sort((first, second) => {
            return first.id - second.id;
          });

          for (const one of res.data.data) {
            _this.user.roles.push(one.id);
          }
        });
      }
    }
  }
};
</script>
