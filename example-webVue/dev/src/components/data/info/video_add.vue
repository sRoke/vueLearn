<template>
  <el-dialog ref="dialog" title="添加视频" v-model="dialogFormVisible" class="pp1">
    <el-form ref="form" :model="form" label-width="100px" :rules="rules">
       <el-form-item label="视频名称:" :label-width="formLabelWidth" prop="name">
      <el-input v-model="form.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Seo Title:" :label-width="formLabelWidth">
        <el-input v-model="form.seo_title" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Seo Keyword:" :label-width="formLabelWidth">
        <el-input v-model="form.seo_keyword" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Seo:" :label-width="formLabelWidth">
        <el-input v-model="form.seo_description" auto-complete="off" ></el-input>
      </el-form-item>
      <el-form-item label="链接:" :label-width="formLabelWidth" prop="video_url">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          v-model="form.video_url" size="large">
        </el-input>
      </el-form-item>
      <el-form-item label="封面:" :label-width="formLabelWidth" prop="img_url">
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
            <el-button size="small" type="primary">{{text1}}</el-button>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="简介:" :label-width="formLabelWidth" prop="description">
        <el-input type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          v-model="form.description" size="large">  
        </el-input>
      </el-form-item>
       <el-form-item label="排序:" :label-width="formLabelWidth" prop="sort" >
      <el-input v-model="form.sort" auto-complete="off" class="input_mini" placeholder="请输入0-1000的数字"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary"  :disabled="disable" @click="add()" :loading="isLoading">添加</el-button>
      <preview ref="preview" :url="propsImg"></preview>
    </div>
  </el-dialog>
</template>
<style>
  .surface_size{
    width: 100px;
    height: 100px;
  }
  .add_surface{
    font-size: 70px;
  }
  .pp1 .el-dialog{
    min-width: 550px
  }
  .pp1 .el-form{
    width: 80%;
    /*margin: 0 auto;*/
  }
</style>
<script>
import http from '../../../assets/js/http'
import preview from './preview.vue'
export default {
  props: ['info'],
  data() {
    return {
      isLoading: false,
      pic1: null,
      disable: false,
      text1: '点击上传',
      form: {
        sort: '',
        name: '',
        description: ''
      },
      uploadUrl: '',
      fileList: [],
      propsImg: '',
      rules: {
        name: [
          { required: true, message: '视频名称不能为空' },
          { min: 0, max: 20, message: '长度在 0 到 20 个字符' }
        ],
        video_url: [
          { required: true, message: '链接名称不能为空' }
        ],
        img_url: [
          { required: true, message: '封面不能为空' }
        ]
      }
    }
  },
  methods: {
    add() {
      this.$refs.form.validate((pass) => {
        if (pass) {
          this.isLoading = true
          if (this.form.sort >= 0 && this.form.sort <= 1000) {
            this.apiPost('videos', this.form).then((res) => {
              if (res.code == 200) {
                _g.toastMsg(this, 'success', '添加成功')
                this.$refs.dialog.close()
                this.$parent.getData()
              } else {
                _g.dealError(this, res)
                this.isLoading = !this.isLoading
              }
            })
          } else if (this.form.sort == undefined) {
            this.apiPost('videos', this.form).then((res) => {
              if (res.code == 200) {
                _g.toastMsg(this, 'success', '添加成功')
                this.$refs.dialog.close()
                this.$parent.getData()
              } else {
                _g.dealError(this, res)
                this.isLoading = !this.isLoading
              }
            })
          } else {
            _g.toastMsg(this, 'warning', '排序为0-1000的数字')
            this.isLoading = !this.isLoading
          }
        }
      })
    },
    open() {
      this.$refs.dialog.open()
      this.form = {}
      this.fileList = []
      this.pic1 = null
      this.isLoading = false
    },
    uploadSuccess(res, file, fileList) {
      this.text1 = '替换图片'
      this.form.img_url = res.data
      this.pic1 = window.imgUrl + res.data
    },
    uploadFail(err, res, file) {
      console.log('err = ', _g.j2s(err))
      console.log('res = ', _g.j2s(res))
    },
    handleRemove(file, fileList) {
      this.form.img_url = ''
      this.fileList.splice(file)
    },
    viewPic() {
      this.propsImg = this.fileList[0].url
      // this.$refs.preview.open()
    }
  },
  created() {
    this.uploadUrl = window.HOST + 'Upload'
  },
  components: {
    preview
  },
  mixins: [http]
}
</script>