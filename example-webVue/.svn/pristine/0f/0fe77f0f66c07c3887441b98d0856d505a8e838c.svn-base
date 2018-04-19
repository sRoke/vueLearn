<template>
  <el-dialog ref="dialog" title="上传">
    <div class="ovf-auto" id="fileUp">
    <!--   <div class="clearn" v-show="name != ''">
        <div class="fl">{{name}}</div>
        <el-button size="small" type="text" class="fr" @click="del()">删除</el-button>
      </div> -->
      <el-row class="m-b-20">
        <el-col :span="5" class="tx-r h-40">文件名：</el-col>
        <el-col :span="17">
          <el-input v-model="name"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5" class="tx-r h-40">文件上传：</el-col>
        <el-col :span="17">
          <el-upload
            :action="uploadUrl"
            :on-success="uploadSuccess"
            :on-error="uploadFail"
            :on-remove="handleRemove"
            :multiple="false"
            :file-list="fileList"
            :show-upload-list="false">
            <el-button v-if='url == ""' size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-col>
      </el-row>
      <div class="m-t-20">
        <el-button class="fr m-r-20" @click="close()">取消</el-button>
        <el-button type="primary" class="fr m-r-30" :loading="uploadFlag" @click="upImg()">确定</el-button>
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
    props: ['status', 'urlId'],
    data() {
      return {
        uploadUrl: '',
        name: '',
        fileList: [],
        url: '',
        id: null,
        uploadFlag: false
      }
    },
    methods: {
      open() {
        this.fileList = []
        this.name = ''
        this.url = ''
        this.$refs.dialog.open()
      },
      close() {
        this.$refs.dialog.close()
      },
      handleRemove(file, fileList) {
        this.name = ''
        this.url = ''
      },
      uploadSuccess(res, file, fileList) {
        if (res.code == 200) {
          this.url = res.data
        } else {
          this.fileList = []
          _g.toastMsg(this, 'warning', res.error + ',请上传图片,pdf,rar等格式文件')
        }
      },
      uploadFail(err, res, file) {
        console.log('err = ', _g.j2s(err))
        console.log('res = ', _g.j2s(res))
      },
      upImg() {
        if (this.name.trim() == '') {
          _g.toastMsg(this, 'warning', '请输入文件名')
          return
        }
        if (this.url == '') {
          _g.toastMsg(this, 'warning', '请上传文件')
          return
        }
        this.uploadFlag = true
        if (this.status == 0) {
          let upData = {
            file_name: this.name,
            file_url: this.url
          }
          this.apiPost('requires/' + this.urlId + '/files', upData).then((res) => {
            console.log(res)
            if (res.code == 200) {
              _g.toastMsg(this, 'success', '上传成功')
              setTimeout(() => {
                _g.reloadPage(this)
              }, 1000)
            } else {
              this.uploadFlag = false
              _g.dealError(this, res)
            }
          }, (res) => {
            this.uploadFlag = false
          })
        } else {
          let upData = {
            action_type: 'updateStatus',
            file_name: this.name,
            file_url: this.url,
            status: this.status
          }
          this.apiPut('orders/' + this.id, '', upData).then((res) => {
            console.log(res)
            if (res.code == 200) {
              _g.toastMsg(this, 'success', '上传成功')
              setTimeout(() => {
                _g.reloadPage(this)
              }, 1000)
            } else {
              this.uploadFlag = false
              _g.dealError(this, res)
            }
          }, (res) => {
            this.uploadFlag = false
          })
        }
      }
    },
    created() {
      this.uploadUrl = window.HOST + 'Upload/data'
      this.id = this.$route.params.id
    },
    mixins: [http]
  }
</script>