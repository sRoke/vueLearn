<template>
  <el-button title="重置"
             @click="reset">
    <i class="fa fa-refresh"
       aria-hidden="true"></i>
  </el-button>
</template>

<style scoped>
.fa {
  color: #8391a5
}
</style>

<script>
// ----- 使用方法 ------ //
// import resetBtn from 'common/reset.vue'
// components : { 'reset-btn' : resetBtn }
// <reset-btn :reset="要执行的函数"></reset-btn>
export default {
  props: ['reset']
}
</script>