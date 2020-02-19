<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>微信用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <div class="query-box">
        <el-form
          label-width="auto"
          ref="queryFrom"
          :model="queryForm"
          :inline="true"
        >
          <el-form-item>
            <el-input placeholder="微信用户ID" v-model="queryForm.id" clearable>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              type="text"
              placeholder="名字"
              v-model="queryForm.name"
              clearable
            >
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="query-result">
        <el-table
          stripe
          :data="wechatUsers"
          style="width: 100%"
          max-height="500px"
        >
          <el-table-column fixed sortable prop="id" label="ID" />

          <el-table-column fixed sortable prop="name" label="名字" />
          <el-table-column fixed sortable prop="nickname" label="微信名称" />
          <el-table-column fixed sortable prop="city" label="城市" />
          <el-table-column
            fixed
            sortable
            prop="sex"
            label="性别"
            :formatter="sexFormatter"
          />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleSet(scope.$index)"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          :page-count="total"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handlePageNumberChange"
        >
        </el-pagination>
      </div>
    </div>
    <WechatUserSetter
      :show="setterDialogFormVisible"
      :data="tmp"
      @close="setterDialogFormVisible = false"
      @success="setSuccess($event)"
    />
  </div>
</template>

<script>
import WechatUserSetter from './childComp/WechatUserSetter'

export default {
  name: 'wechatManage',
  components: {
    WechatUserSetter
  },
  data() {
    return {
      queryForm: {
        id: '',
        name: ''
      },
      pageSize: 20,
      total: 0,
      pageNumber: 0,

      wechatUsers: [],
      setterDialogFormVisible: false,
      editIndex: 0,
      tmp: {}
    }
  },
  created() {
    this.refreshData()
  },
  methods: {
    handleSet(index) {
      this.editIndex = index
      this.tmp = this.wechatUsers[index]
      this.setterDialogFormVisible = true
    },
    setSuccess(data) {
      this.wechatUsers.splice(
        this.wechatUsers.findIndex(one => one.id === data.id),
        1,
        data
      )
    },
    sexFormatter(row, column, sex) {
      if (sex) {
        if (sex === 0) {
          return '未知'
        } else if (sex === 1) {
          return '男'
        } else if (sex === 2) {
          return '女'
        }
      }
    },
    onSubmit() {
      console.log('query')
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.refreshData()
    },
    handlePageNumberChange(pageNumber) {
      this.pageNumber = pageNumber - 1
      this.refreshData()
    },
    refreshData() {
      const _this = this
      const url =
        '/api/wechat/user?pageSize=' +
        this.pageSize +
        '&pageNumber=' +
        this.pageNumber
      this.axios.get(url).then(res => {
        const data = res.data.data

        _this.pageSize = data.size
        _this.total = data.total
        _this.wechatUsers = data.wechatUsers
      })
    }
  }
}
</script>

<style>
.query-box {
  display: block;
  width: 700px;
  /* clear: both; */
}

.query-box .el-form-item {
  width: 150px;
}
</style>
