<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
  #nprogress .bar {
    background: #e96661 !important; //自定义颜色
  }

  .el-menu--horizontal {
    border-bottom: 1px solid #31404d !important;
  }
</style>
