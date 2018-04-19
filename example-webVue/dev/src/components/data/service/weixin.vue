<template>
<el-dialog ref="dialog1"
                 class="qrcode-container">
      <div>
          <h3 class="m-b-10">使用微信扫二维码关注服务号</h3>
          <h3>可及时获知订单的状态变化消息</h3>
          <img :src="qrcodeUrl"
               width="300" height="300"/>
      </div>
      </el-dialog>
</template>
<style>
.qrcode-container {
  text-align: center;
}

.qecode-dialog .el-dialog__body {
  text-align: center;
  padding: 20px 50px;
}

.qecode-dialog .el-dialog__header {
  text-align: center;
}
</style>
<script>
  import http from '../../../assets/js/http'
  export default {
    data() {
      return {
        qrcodeUrl: ''
      }
    },
    methods: {
      open(url) {
        this.qrcodeUrl = window.imgUrl + url
        console.log(this.qrcodeUrl)
        this.$refs.dialog1.open()
        // this.$refs.dialog.open(form)
      }
    },
    mixins: [http]
  }
</script>