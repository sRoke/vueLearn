<template>
  <el-dialog ref="dialog"
             size="tiny"
             title="文件上传"
             v-model="dialogVisible">
    <el-form ref="form"
             :inline="true"
             :model="form"
             label-width="100px">
  
      <el-form-item label="文件名">
        <el-input class="w-300"
                  v-model="form.name"></el-input>
      </el-form-item>
  
      <el-row>
        <el-form-item label="备注">
          <el-input type="textarea"
                    class="w-300"
                    v-model="form.desc"
                    :autosize="{ minRows: 4, maxRows: 5}">
          </el-input>
        </el-form-item>
      </el-row>
  
      <el-row>
        <el-form-item label="上传">
          <el-upload :file-list="form.fileList"
                     :action="uploadUrl"
                     :on-remove="handleRemove"
                     :on-success="uploadSuccess"
                     :on-error="uploadFail"
                     :default-file-list="form.fileList">
            <el-button type="text"
                       size='mini'
                       v-bind:class="{hide_upload: !show_btn}">
              <i class="el-icon-plus m-r-5"></i>选择文件
            </el-button>
            <div slot="tip"
                 class="el-upload__tip">允许文件：pdf，png，gif，jpg，jpeg，svg，rar，zip，xls
            </div>
          </el-upload>
        </el-form-item>
      </el-row>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button @click.prevent="dialogVisible = false">取 消</el-button>
      <el-button type="primary"
                 @click.prevent="submit()">确 定</el-button>
    </div>
  </el-dialog>
</template>
<style>
.hide_upload {
  display: none;
}
</style>
<script>
import http from 'assets/js/http'
export default {
  data() {
    return {
      dialogVisible: false,
      uploadUrl: '',
      show_btn: true,
      form: {
        name: '',
        desc: '',
        fileList: []
      }
    }
  },
  methods: {
    open() {  // 开启上传文件的模态框
      var self = this
      self.$refs.dialog.open()
      self.form.name = ''
      self.form.desc = ''
      self.show_btn = true
      self.form.fileList = []
    },
    close() { // 关闭模态框
      var self = this
      self.$refs.dialog.close()
    },
    submit() { // 确定客户上传的资料
      var self = this
      if (self.form.name != '' && self.form.fileList.length != 0) {
        self.dialogVisible = false
        self.$parent.followAdd(self.form)
        self.$refs.dialog.close()
      } else if (self.form.name == '') {
        self.$message({
          type: 'info',
          message: '请填写文件名'
        })
      } else {
        self.$message({
          type: 'info',
          message: '请上传文件'
        })
      }
    },
    uploadFail(err, res, file) { // 客户上传资料失败
      // console.log('err = ', _g.j2s(err))
      // console.log('res = ', _g.j2s(res))
    },
    handleRemove(file, fileList) { // 删除上传的资料
      var self = this
      self.show_btn = true
      self.form.fileList = []
    },
    uploadSuccess(res, file, fileList) { // 资料上传成功
      if (res.code === 400) {
        this.handleRemove(file, fileList)
        return _g.dealError(this, res)
      }
      var self = this
      self.show_btn = false
      self.form.fileList = fileList
    }
  },
  created() {
    var self = this
    self.uploadUrl = window.HOST + 'Upload/data'
  },
  mixins: [http]
}
</script>