<template>
  <div class="m-l-50 m-t-30 w-800">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px">
      <el-form-item label="系统名称" prop="system_name">
        <el-input v-model.trim="form.system_name" class="h-40 w-200"></el-input>
      </el-form-item>
      <el-form-item label="版权信息">
        <el-input v-model.trim="form.copyright" class="h-40 w-200"></el-input>
      </el-form-item>
      <el-form-item label="LOGO">
        <!-- <el-upload
          :action="uploadUrl"
          type="drag"
          :thumbnail-mode="true"
          :on-preview="viewPic"
          :on-remove="handleRemove"
          :on-success="uploadSuccess"
          :on-error="uploadFail"
          :default-file-list="fileList">
          <i class="el-icon-upload"></i>
          <div class="el-dragger__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件</div>
        </el-upload> -->
        <div class="ca_1">  
          <div  class="v12">
            <img :src="pic1"/>
          </div>
          <el-upload
            :action="uploadUrl"
            :on-preview="handlePreview"
            :on-success="uploadSuccess"
            :on-remove="handleRemove"
            :show-upload-list="false"
            :show-file-list="false"
            :default-file-list="fileList" class="works_img">
            <el-button size="small" type="primary">上传图片</el-button>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </div>
      </el-form-item>

      <el-form-item label="公司地址" prop="address">
        <el-input v-model.trim="form.address" class="h-40 w-400"></el-input>
      </el-form-item>
      <el-form-item label="开户行" prop="bank">
        <el-input v-model.trim="form.bank" class="h-40 w-400"></el-input>
      </el-form-item>
      <el-form-item label="开户行账号  " prop="bank_account">
        <el-input v-model.trim="form.bank_account" class="h-40 w-400"></el-input>
      </el-form-item>
      <el-form-item label="公司名称" prop="company">
        <el-input v-model.trim="form.company" class="h-40 w-400"></el-input>
      </el-form-item>
      <el-form-item label="公司联系方式" prop="phone">
        <el-input v-model.trim="form.phone" class="h-40 w-400"></el-input>
      </el-form-item>


      <el-form-item label="订单合同协议">
        <div id='orderEditor'></div>
      </el-form-item>
      <el-form-item label="需求合同协议">
        <div id='requireEditor'></div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="add()" :loading="isLoading">提交</el-button>
      </el-form-item>
    </el-form>
    <preview ref="preview" :url="propsImg"></preview>
  </div>
</template>
<style type="text/css">
  .form-checkbox:first-child{
    margin-left: 15px;
  }
  #requireEditor,#orderEditor{
    width: 600px;
    height: 300px;
  }
</style>
<script>
  import http from '../../../assets/js/http'
  import preview from './preview.vue'
  import Wangeditor from 'wangeditor'
  export default {
    data() {
      return {
        isLoading: false,
        pic1: null,
        form: {
          system_name: '',
          copyright: '',
          order_contract_agreement: '',
          require_contract_agreement: '',
          system_logo: ''
        },
        uploadUrl: '',
        fileList: [],
        propsImg: '',
        rules: {
          system_name: [
            { required: true, message: '请输入系统名称' }
          ]
        },
        orderEditor: null,
        requireEditor: null
      }
    },
    methods: {
      add() {
        this.form.order_contract_agreement = this.orderEditor.$txt.html()
        this.form.require_contract_agreement = this.requireEditor.$txt.html()
        // console.log(this.form)
        this.$refs.form.validate((pass) => {
          if (pass) {
            this.isLoading = true
            this.apiPut('system_configs', '', this.form).then((res) => {
              if (res.code == 200) {
                _g.toastMsg(this, 'success', '配置成功')
                setTimeout(() => {
                  // location.reload()
                  _g.reloadPage(this)
                }, 1500)
              } else {
                _g.dealError(this, res)
                this.isLoading = !this.isLoading
              }
            })
          }
        })
      },
      goback() {
        router.go(-1)
      },
      uploadSuccess(res, file, fileList) {
        // this.form.system_logo = res.data
        // let data = {
        //   name: '图片',
        //   url: window.imgUrl + res.data
        // }
        // if (this.fileList.length) {
        //   this.fileList[0] = data
        // } else {
        //   this.fileList.push(data)
        // }
        this.form.system_logo = res.data
        this.pic1 = window.imgUrl + res.data
      },
      uploadFail(err, res, file) {
        console.log('err = ', _g.j2s(err))
        console.log('res = ', _g.j2s(res))
      },
      handleRemove(file, fileList) {
        console.log('file = ', file)
        console.log('fileList = ', fileList)
      },
      viewPic() {
        this.propsImg = this.fileList[0].url
        this.$refs.preview.open()
      }
    },
    mounted() {
      var menus = [
        'bold',
        'underline',
        'italic',
        'strikethrough',
        'eraser',
        'forecolor',
        'bgcolor',
        '|',
        'quote',
        'fontfamily',
        'fontsize',
        'head',
        'unorderlist',
        'orderlist',
        'alignleft',
        'aligncenter',
        'alignright',
        '|',
        'link',
        'unlink',
        'table',
        'img',
        'undo',
        'redo'
      ]
      this.orderEditor = new Wangeditor('orderEditor')
      this.orderEditor.config.menus = menus
      this.orderEditor.config.uploadImgUrl = window.HOST + 'Wangeditor'
      this.orderEditor.config.uploadImgFns.onload = (resultText, xhr) => {
        this.orderEditor.command(null, 'insertHtml', '<img src=' + resultText + ' style="max-width:100%;"/>')
      }
      this.orderEditor.create()
      this.requireEditor = new Wangeditor('requireEditor')
      this.requireEditor.config.menus = menus
      this.requireEditor.config.uploadImgUrl = window.HOST + 'Wangeditor'
      this.requireEditor.config.uploadImgFns.onload = (resultText, xhr) => {
        this.requireEditor.command(null, 'insertHtml', '<img src=' + resultText + ' style="max-width:100%;"/>')
      }
      this.requireEditor.create()
      this.uploadUrl = window.HOST + '/Upload'
      this.apiGet('system_configs').then((res) => {
        if (res.code == 200) {
          this.form.system_name = res.data.system_name
          this.form.copyright = res.data.copyright
          this.form.address = res.data.address
          this.form.bank = res.data.bank
          this.form.bank_account = res.data.bank_account
          this.form.company = res.data.company
          this.form.phone = res.data.phone
          this.form.order_contract_agreement = res.data.order_contract_agreement
          this.form.require_contract_agreement = res.data.require_contract_agreement
          this.orderEditor.$txt.html('')
          this.requireEditor.$txt.html('')
          this.orderEditor.$txt.append(this.form.order_contract_agreement)
          this.requireEditor.$txt.append(this.form.require_contract_agreement)
          if (res.data.system_logo) {
            let img = window.imgUrl + res.data.system_logo
            this.fileList.push({ name: '图片', url: img })
            this.form.system_logo = res.data.system_logo
            this.pic1 = img
          }
        } else {
          _g.dealError(this, res)
        }
      })
    },
    components: {
      preview
    },
    mixins: [http]
  }
</script>