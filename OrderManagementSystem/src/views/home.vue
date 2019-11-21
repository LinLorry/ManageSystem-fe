<template>
  <div class="home">
    <!-- 首页的头部 -->
    <template>
      <helloHeader />
    </template>

    <!-- 首页的主体 -->
    <el-main>
      <el-card class="box-card">
        <div slot="header"
             class="clearfix">
          <span>卡片名称</span>
          <el-button style="float: right; padding: 3px 0"
                     type="text">操作按钮</el-button>
        </div>
        <div class="text item">
          用户账号： {{userinfo.username}}
        </div>
        <div class="text item">
          用户密码： {{userinfo.password}}
        </div>
        <div class="text item">
          真实姓名： {{userinfo.realname}}
        </div>
        <div class="text item">
          证件号码： {{userinfo.idType}}
        </div>
      </el-card>
    </el-main>
  </div>
</template>>

<script>
import helloHeader from '@/components/helloHeader.vue'
import { mapState } from 'vuex'
export default {
  components: {
    helloHeader
  },
  data () {
    return {

    }
  },
  computed: {
    // 辅助函数 获取state数据
    ...mapState({
      userinfo: state => state.userinfo
    })
  }
}
</script>

<style scoped>
.home {
  width: 100%;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
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

.box-card {
}
</style>
