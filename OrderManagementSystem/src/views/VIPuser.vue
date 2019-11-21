<template>
  <div class="useradd">
    <template>
      <helloHeader />
    </template>
    <h1>添加账号</h1>
    <el-main>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>用户账号列表</span>
          <el-button style="float: right; padding: 3px 0" type="text"
            >添加</el-button
          >
        </div>
        <div class="text item">
          <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="username" label="用户名" width="180">
            </el-table-column>
            <el-table-column prop="realname" label="真实姓名" width="180">
            </el-table-column>
            <el-table-column prop="age" label="年龄" width="180">
            </el-table-column>
            <el-table-column prop="idType" label="证件号"> </el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button
                  @click="handleEdit(scope.row.id)"
                  type="text"
                  size="small"
                  >修改</el-button
                >
                <el-button
                  @click="handleDelete(scope.row.id)"
                  type="text"
                  size="small"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </el-main>
  </div> </template
>>

<script>
import { mapState, mapActions } from 'vuex'
import helloHeader from '@/components/helloHeader.vue'
export default {
  components: {
    helloHeader
  },
  data () {
    return {
      tableData: [],
      newUserList: []
    }
  },
  created () {
    this.getUserList().then(() => {
      // this.tableData = this.userList
      // this.newUserList = this.userList.filter(v => v.age > 25)
      // this.tableData = this.newUserList
      // console.log(this.tableData)

      this.tableData = this.$store.getters.vipUsers
    })
  },
  methods: {
    ...mapActions({ getUserList: 'GET_USERLIST' })
  },
  computed: {
    ...mapState({
      userList: state => state.userList
    })
  }
}
</script>

<style scoped>
.useradd {
  width: 100%;
}
</style>
