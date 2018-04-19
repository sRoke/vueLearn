<template>
  <el-dialog ref="dialog" title="编辑备注">
    <div class="ovf-auto" id="fileUp">
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4}"
        placeholder="请输入备注"
        v-model="childRemark">
      </el-input>
      <div class="m-t-20">
        <el-button class="fr m-r-20" @click="close()">取消</el-button>
        <el-button type="primary" class="fr m-r-30" @click="save()">确定</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<style>
  #fileUp .clearn {
    width: 100%;
    height: 35px;
  }
  #fileUp .el-dragger__cover__interact .btn:not(:first-child) {
    display: none !important;
  }
  .m-r-auto {
    margin: 0 auto;
  }
  .box-shadow-none {
    box-shadow: 0 1px 3px rgba(0,0,0,0);
  }
   .big-img {
    max-width: 700px;
    max-height: 540px;
  }
</style>
<script>
  import http from '../../../assets/js/http'
  export default {
    props: ['info'],
    data() {
      return {
        childRemark: ''
      }
    },
    watch: {
      info: function (val) {
        this.childRemark = this.info
      }
    },
    methods: {
      open() {
        this.$refs.dialog.open()
        this.childRemark = this.info
      },
      close() {
        this.$refs.dialog.close()
      },
      save() {
        this.$parent.updateRemark(this.childRemark)
        this.close()
      }
    },
    created() {
    },
    mixins: [http]
  }
</script>