<template>
  <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" :before-close="handleClose" title="设置IP" width="500px">
    <el-form v-loading="loading" ref="setIpForm" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name"/>
      </el-form-item>
      <el-form-item label="IP地址" prop="addr">
        <el-input v-model="form.addr"/>
      </el-form-item>
      <el-form-item label="子网掩码" prop="netmask">
        <el-input v-model="form.netmask"/>
      </el-form-item>
      <el-form-item label="网关" prop="gateway">
        <el-input v-model="form.gateway"/>
      </el-form-item>
      <el-form-item label-width="0" style="text-align: center;">
        <el-button type="primary" @click="submitForm('setIpForm')">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { deepClone } from '@/utils/index'
import { setIp } from '@/api/SRDstor/systemManage'
export default {
  name: 'SetIp',
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
        name: '',
        addr: '',
        netmask: '',
        gateway: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        addr: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        netmask: [
          { required: true, message: '请输入子网掩码', trigger: 'blur' }
        ],
        gateway: [
          { required: true, message: '请输入网关', trigger: 'blur' }
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
      this.$refs['setIpForm'].resetFields()
      this.$emit('handleDialogVisible', false)
    },
    submitForm(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.loading = true
          // 处理表单数据
          const params = deepClone(this.form)
          setIp(params)
            .then((resp) => {
              _this.loading = false
              if (resp.rc === 0) {
                _this.handleClose()
                _this.$message({ type: 'success', message: '修改IP成功' })
              } else {
                _this.$message({ type: 'error', message: '修改IP失败' })
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
