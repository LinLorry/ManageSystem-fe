<template>
  <el-dialog title="编辑子菜单" :visible="show" @close="$emit('close')">
    <el-form
      ref="wechatUser"
      label-width="auto"
      :rules="rules"
      :model="wechatUser"
    >
      <el-form-item label="ID">
        <el-input disabled :value="wechatUser.id" autocomplete="off" />
      </el-form-item>

      <el-form-item v-if="nullUser" label="设置用户方式">
        <el-radio-group v-model="createUser" size="small">
          <el-radio-button :label="true">新建用户</el-radio-button>
          <el-radio-button :label="false">从已有用户中设置</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-else label="禁用该用户">
        <el-checkbox v-model="disable"></el-checkbox>
      </el-form-item>

      <div v-if="userInfo">
        <el-form-item label="设置用户ID" prop="userId">
          <el-input-number
            controls-position="right"
            v-model="wechatUser.userId"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="用户姓名">
          <span>{{ userName }}</span>
        </el-form-item>
      </div>

      <el-form-item label="设置组别" prop="roles">
        <el-checkbox-group v-model="wechatUser.roles">
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
      <el-button type="primary" @click="submitForm">编辑</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'wechatUserSetter',
  props: ['show', 'data'],
  data() {
    // TODO 后端查询用户接口尚未完成，等待完成后查询对应id用户是否存在
    var checkUserId = (rule, value, callback) => {
      callback()
    }

    return {
      wechatUser: {
        id: 0,
        userId: 0,
        roles: []
      },

      nullUser: false,
      createUser: true,

      disable: false,

      userName: '',
      roles: [],
      rules: {
        userId: [
          {
            required: !this.createUser,
            message: '请输入用户ID',
            trigger: 'blur'
          },
          {
            validator: checkUserId,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    const _this = this
    this.axios('/api/role').then(res => {
      res.data.data.sort((first, second) => {
        return first.id - second.id
      })
      _this.roles = res.data.data
    })
  },
  methods: {
    submitForm() {
      this.$refs.wechatUser.validate(valid => {
        if (valid) {
          this.$emit('close')

          let data = {
            id: this.wechatUser.id
          }

          if (this.nullUser) {
            if (!this.createUser) {
              data.userId = this.wechatUser.userId
            }
            data.roles = this.wechatUser.roles
          } else {
            if (this.disable) {
              data.disable = true
            } else {
              data.userId = this.wechatUser.userId
              data.roles = this.wechatUser.roles
            }
          }

          let _this = this

          this.axios.post('/api/wechat/user', data).then(res => {
            _this.$message({
              message: res.data.message,
              type: 'success',
              showClose: true,
              center: true
            })
            _this.$emit('success', res.data.data)
          })
        } else {
          return false
        }
      })
    }
  },
  computed: {
    userInfo() {
      if (this.nullUser) {
        return !this.createUser
      } else {
        return true
      }
    }
  },
  watch: {
    data(newV) {
      this.wechatUser.id = newV.id
      this.disable = false

      if (newV.user) {
        // TODO 用户权限查询接口开放后实时显示用户权限
        this.nullUser = false
        this.createUser = false
        this.wechatUser.userId = newV.user.id
        this.userName = newV.user.name
      } else {
        this.nullUser = true
        this.createUser = true
        this.wechatUser.roles.splice(0, this.wechatUser.roles.length)
        this.wechatUser.userId = 0
        this.userName = null
      }
    }
  }
}
</script>
