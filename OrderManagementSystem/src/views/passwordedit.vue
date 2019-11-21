<template>
  <div class="passwordedit">
    <template>
      <helloHeader />
    </template>
    <h1>修改密码</h1>
  </div>
</template>>

<script>
import helloHeader from '@/components/helloHeader.vue'
export default {
  components: {
    helloHeader
  },
  data () {
    return {}
  }
}
</script>

<style scoped>
.passwordedit {
  width: 100%;
}
</style>
