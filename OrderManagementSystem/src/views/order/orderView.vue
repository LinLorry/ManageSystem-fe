<template>
  <div class="orderView">
    <template>
      <helloHeader />
    </template>
    <el-main>
      <el-card class="box-card">
        <div slot="header"
             class="clearfix">
          <span>订单查看</span>
        </div>
        <div class="text item">
          <el-tag>标签一</el-tag>
          <el-tag type="success">标签二</el-tag>
          <el-tag type="info">标签三</el-tag>
          <el-tag type="warning">标签四</el-tag>
          <el-tag type="danger">标签五</el-tag>
        </div>
        <div class="text item">
          <el-select v-model="value"
                     placeholder="请选择">
            <el-option v-for="item in options"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
          <el-input type="primary"
                    v-model="search"
                    style="width: 50%;margin: 0 30px;"
                    placeholder="输入关键字搜索" />
          <el-button>搜索</el-button>
        </div>
        <div class="text item">
          <el-table :data="tableData"
                    stripe
                    style="width: 100%">
            <el-table-column type="index"
                             label="序号"
                             width="80">
            </el-table-column>
            <el-table-column prop="realname"
                             label="订单号"
                             width="80">
            </el-table-column>
            <el-table-column prop="age"
                             label="创建时间"
                             width="80">
            </el-table-column>
            <el-table-column prop="idType"
                             label="生产流程">
            </el-table-column>
            <el-table-column prop="idType"
                             label="出货时间">
            </el-table-column>
            <el-table-column prop="idType"
                             label="状态">
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
import helloHeader from '@/components/helloHeader.vue'
export default {
  components: {
    helloHeader
  },
  data () {
    return {
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: '',
      search: '',
      tableData: [
        {
          username: '王小虎',
          realname: '上海',
          age: '普陀区',
          idType: 200333
        },
        {
          username: '王小虎',
          realname: '上海',
          age: '普陀区',
          idType: 200333
        },
        {
          username: '王小虎',
          realname: '上海',
          age: '普陀区',
          idType: 200333
        },
        {
          username: '王小虎',
          realname: '上海',
          age: '普陀区',
          idType: 200333
        },
        {
          username: '王小虎',
          realname: '上海',
          age: '普陀区',
          idType: 200333
        }
      ]
    }
  },
  created () {

  },
  methods: {

  },
  computed: {

  }
}
</script>

<style scoped>
.orderView {
  width: 100%;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.el-tag {
  margin-right: 20px;
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
