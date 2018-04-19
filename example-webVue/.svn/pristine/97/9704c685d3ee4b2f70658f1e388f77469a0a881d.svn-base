<template>
  <el-dialog ref="dialog" title="添加专家" v-model="dialogFormVisible" class="pp1">
    <el-form ref="form" :model="form" label-width="100px" :rules="rules">
       <el-form-item label="专家头衔:" :label-width="formLabelWidth" prop="title">
      <el-input v-model.trim="form.title" auto-complete="off" ></el-input>
      </el-form-item>
      <el-form-item label="姓名:" :label-width="formLabelWidth" prop="name">
        <el-input v-model.trim="form.name" auto-complete="off" ></el-input>
      </el-form-item>
      <el-form-item label="简介:" :label-width="formLabelWidth" prop="brief">
        <el-input v-model.trim="form.brief" auto-complete="off" ></el-input>
      </el-form-item>
      <el-form-item label="封面:" :label-width="formLabelWidth" prop="cover">
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
      <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
        <el-input type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          v-model.trim="form.description" size="large">  
        </el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
          <el-radio :label="1" class="radio" v-model="form.status">已上架</el-radio>
          <el-radio :label="2" class="radio" v-model="form.status">已下架</el-radio>
      </el-form-item>
      <el-form-item label="排序" prop="sort" :label-width="formLabelWidth">
        <el-input v-model="form.sort" placeholder="请输入0-1000的数字" class="input_mini"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary"  @click="close()">取消</el-button>
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
  .hidd .btn:nth-child(2){
    display: none;
  }
</style>
<script>
import http from '../../../assets/js/http'
import preview from './preview.vue'
export default {
  props: [''],
  data() {
    return {
      isLoading: false,
      text1: '上传图片',
      pic1: null,
      disable: false,
      form: {
        title: '',
        name: '',
        brief: '',
        cover: '',
        description: '',
        status: '',
        sort: '',
        radio: '2'
      },
      label: '',
      uploadUrl: '',
      fileList: [],
      propsImg: '',
      rules: {
        title: [
          { required: true, message: '请输入专家头衔' }
        ],
        name: [
          { required: true, message: '请输入姓名' }
        ],
        description: [
          { required: true, message: '描述' }
        ],
        cover: [
          { required: true, message: '请添加封面' }
        ],
        brief: [
          { required: true, message: '请输入简介' }
        ],
        status: [
          { required: true, message: '选择状态' }
        ]
      }
    }
  },
  methods: {
    add() { // 添加专家
      this.$refs.form.validate((pass) => {
        if (pass) {
          this.isLoading = true
          console.log(this.form)
          if (this.form.sort >= 0 && this.form.sort <= 1000) {
            this.apiPost('experts', this.form).then((res) => {
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
      this.isLoading = false
      this.form = {
        title: '',
        name: '',
        brief: '',
        cover: '',
        description: '',
        status: 1,
        sort: '',
        radio: '2'
      }
      this.fileList = []
      this.pic1 = null
    },
    close() {
      this.$refs.dialog.close()
    },
    uploadSuccess(res, file, fileList) { // 图片上传成功
      // this.form.cover = res.data
      // let data = {
      //   name: '图片',
      //   url: window.imgUrl + res.data
      // }
      // if (this.fileList.length) {
      //   this.fileList[0] = data
      // } else {
      //   this.fileList.push(data)
      // }
      this.text1 = '替换图片'
      this.form.cover = res.data
      this.pic1 = window.imgUrl + res.data
      // console.log(this.pic1)
      // console.log(this.form.cover)
    },
    uploadFail(err, res, file) {
      console.log('err = ', _g.j2s(err))
      console.log('res = ', _g.j2s(res))
    },
    handleRemove(file, fileList) {
      this.form.cover = ''
      this.fileList.splice(file)
    },
    viewPic() {
      this.propsImg = this.fileList[0].url
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