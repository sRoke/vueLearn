<template>
  <el-dialog ref="dialog" title="新增" title-class="title-blue" class="pp1">
    <el-form ref="form" :model="form" label-width="100px" class="w-600">
       <el-form-item label="类型:" :label-width="formLabelWidth" prop="type" :rules="[
        { required: true, message: '类型不能为空'}]">
           <el-radio-group v-model="form.type">
             <el-row :gutter="27">
                <el-col :offset="2" :span="3">
                  <el-radio :label="1">首页</el-radio>
                </el-col>
                <el-col :offset="6" :span="3">
                  <el-radio :label="2">设计库</el-radio>
                </el-col>
                <el-col :offset="6" :span="3">
                  <el-radio :label="3">设计快讯</el-radio>
                </el-col>
              </el-row>
              <div class="margin">
                <el-row :gutter="27">
                  <el-col :offset="2" :span="3">
                    <el-radio :label="4">视频专区</el-radio>
                  </el-col>
                  <el-col :offset="6" :span="3">
                    <el-radio :label="5">经典案例</el-radio>
                  </el-col>
                </el-row>
              </div>  
            </el-radio-group>
        </el-form-item>
        <el-form-item label="图片:" :label-width="formLabelWidth" prop="img_url">
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
            <el-button size="small" type="primary">替换图片</el-button>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="外链Url:" :label-width="formLabelWidth" prop="visit_url">
          <el-input v-model="form.visit_url" placeholder="javascript.void(0)" ></el-input>
        </el-form-item>
        <el-form-item label="启用:" :label-width="formLabelWidth" prop="start">
          <el-checkbox v-model="form.start"></el-checkbox>
        </el-form-item>
        <el-form-item label="排序:" :label-width="formLabelWidth" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入0-1000的数字" class="input_mini"></el-input>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary"  :disabled="disable" @click="submit()" icon="el-icon-check" :loading="isLoading">保存</el-button>
      <el-button  @click="cancel()">取消</el-button>
    </div>
    <preview ref="preview" :url="propsImg"></preview>
  </el-dialog>
</template>

<style>
  .title-blue{
    background: #0C6BC9;
  }
  .margin{
    margin-top: 10px;
    margin-bottom: 10px
  }
  .picsize{
    width: 200px;
    height: 150px;
  }
  .input_mini{
    width: 200px;
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
      form: {
        type: '',
        start: false,
        sort: ''
      },
      uploadUrl: '',
      fileList: [],
      propsImg: ''
    }
  },
  methods: {
    open(id) {
      this.form.id = id
      // console.log(this.form.id)
      this.$refs.dialog.open(id)
      this.isLoading = false
      this.apiGet('carousels/' + this.form.id, this.form).then((res) => {
        // console.log(res.data)
        this.form = res.data
        this.form.type = parseInt(this.form.type)
        if (res.data.start == 0) {
          this.form.start = false
        } else if (res.data.start == 1) {
          this.form.start = true
        }
        this.fileList = []
        let img = window.imgUrl + res.data.img_url
        this.fileList.push({ name: '图片', url: img })
        this.form.img_url = res.data.img_url
        this.pic1 = img
      })
    },
    cancel() {
      this.$refs.dialog.close()
    },
    submit() {
      // console.log(this.form)
      this.$refs.form.validate((pass) => {
        if (pass) {
          this.isLoading = true
          if (this.form.sort >= 0 && this.form.sort <= 1000) {
            this.apiPut('carousels/', this.form.id, this.form).then((res) => {
              if (res.code == 200) {
                _g.toastMsg(this, 'success', '编辑成功')
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
    uploadSuccess(res, file, fileList) {
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
      // 有问题
      this.$refs.preview.open()
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