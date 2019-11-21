<template>
  <div class="procedureManagement">
    <template>
      <helloHeader />
    </template>
    <el-main>
      <el-card class="box-card">
        <div slot="header"
             class="clearfix">
          <span>工序管理列表</span>
          <el-button style="float: right; padding: 3px 0"
                     type="text">添加</el-button>
        </div>
        <div class="text item">
          <el-table :data="tableData"
                    stripe
                    style="width: 100%">
            <el-table-column prop="username"
                             label="工序编码"
                             width="180">
            </el-table-column>
            <el-table-column prop="realname"
                             label="工序名称"
                             width="180">
            </el-table-column>
            <el-table-column prop="age"
                             label="工序备注"
                             width="180">
            </el-table-column>
            <el-table-column prop="idType"
                             label="工序提成">
            </el-table-column>
            <!-- <el-table-column fixed="right"
                             label="操作"
                             width="100">
              <template slot-scope="scope">
                <el-button @click="handleEdit(scope.row.id)"
                           type="text"
                           size="small">修改</el-button>
                <el-button @click="handleDelete(scope.row.id)"
                           type="text"
                           size="small">删除</el-button>
              </template>
            </el-table-column> -->
          </el-table>
        </div>
      </el-card>
    </el-main>
  </div>
</template>>

<script>
// 引入辅助函数
import { mapState, mapActions } from 'vuex'
import helloHeader from '@/components/helloHeader.vue'
export default {
  components: {
    helloHeader
  },
  data () {
    return {
      tableData: []
    }
  },
  created () {
    // this.$store.dispatch('GET_USERLIST').then(() => {
    //   // 把全局的userlist赋值给tabledata
    //   this.tableData = this.userList
    // })

    // this.GET_USERLIST().then(() => {
    //   this.tableData = this.userList
    // })
    this.getUserList().then(() => {
      this.tableData = this.userList
    })
  },
  methods: {
    // ...mapActions(['GET_USERLIST']),
    ...mapActions({
      getUserList: 'GET_USERLIST'
    }),
    handleEdit (id) {
      console.log('修改' + id)
    },
    handleDelete (id) {
      console.log('删除' + id)
    }
  },
  computed: {
    ...mapState({
      userList: state => state.userList
    })
  }
}
</script>

<style scoped>
.procedureManagement {
  width: 100%;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
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
