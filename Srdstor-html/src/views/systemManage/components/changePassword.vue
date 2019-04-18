<template>
  <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" :before-close="handleClose" append-to-body title="修改密码" width="500px">
    <el-form v-loading="loading" ref="changePasswordForm" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="用户名" prop="user">
        <el-input v-model="form.user"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" show-password/>
      </el-form-item>
      <el-form-item label="服务器名" prop="svrname">
        <el-input v-model="form.svrname"/>
      </el-form-item>
      <el-form-item label-width="0" style="text-align: right;">
        <el-button type="primary" @click="submitForm('changePasswordForm')">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { deepClone } from '@/utils/index'
import { changePassword } from '@/api/SRDstor/systemManage'
export default {
  name: 'ChangePassword',
  props: {
    // 是否显示弹窗
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: this.showDialog, // 是否显示弹窗 {Boolean}
      loading: false, // 是否显示加载动画 {Boolean}
      form: {
        user: '',
        password: '',
        svrname: ''
      },
      rules: {
        user: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        svrname: [
          { required: true, message: '请输入服务器名', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    showDialog(val) {
      this.dialogVisible = val
    }
  },
  methods: {
    handleClose() {
      this.$refs['changePasswordForm'].resetFields()
      this.$emit('handleDialogVisible', false)
    },
    submitForm(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.loading = true
          // 处理表单数据
          const params = deepClone(this.form)
          changePassword(params)
            .then((resp) => {
              _this.loading = false
              if (resp.rc === 0) {
                _this.handleClose()
                _this.$message({ type: 'success', message: '修改密码成功' })
                _this.$store.dispatch('LogOut').then(() => {
                  location.reload() // 为了重新实例化vue-router对象 避免bug
                })
              } else {
                _this.$message({ type: 'error', message: '修改密码失败' })
              }
            })
            .catch(() => {
              _this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
