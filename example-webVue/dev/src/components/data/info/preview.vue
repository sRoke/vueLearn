<template>
  <el-dialog ref="dialog" custom-class="bg-wh tx-c box-shadow-none" @click="hidden()">
    <img :src="url" class="big-img">
  </el-dialog>
</template>
<style>
.box-shadow-none {
  box-shadow: 0 1px 3px rgba(0,0,0,0);
}
.big-img {
  max-width: 700px;
  max-height: 540px;
}
</style>
<script>
  export default {
    props: ['url'],
    data() {
      return {

      }
    },
    methods: {
      open() {
        this.$refs.dialog.open()
      }
    }
  }
</script>