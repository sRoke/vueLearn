<template>
  <el-dialog ref="dialog" title="合同协议" size="large">
    <div class="ovf-auto">
      <div v-html="msg"></div>
    </div>
  </el-dialog>
</template>

<script>
  import http from '../../../assets/js/http'
  export default {
    props: ['msg'],
    data() {
      return {}
    },
    methods: {
      open() {
        this.$refs.dialog.open()
      }
    },
    mixins: [http]
  }
</script>