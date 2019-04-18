<template>
  <el-dialog
    v-el-drag-dialog
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    append-to-body
    title="修改iSCSI目标"
    width="500px">
    <el-form v-loading="loading" ref="updateiSCSITargetForm" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="name" readonly/>
      </el-form-item>
      <el-form-item label="iSCSI的IP地址" prop="ip">
        <el-select v-model="form.ip" multiple style="display: block;">
          <el-option
            v-for="item in targetIps"
            :key="item"
            :label="item"
            :value="item"/>
        </el-select>
      </el-form-item>
      <el-form-item label-width="0" style="text-align: right;">
        <el-button type="primary" @click="submitForm('updateiSCSITargetForm')">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { deepClone } from '@/utils/index'
import { getIPs } from '@/api/SRDstor/systemManage'
import { updateiSCSITarget } from '@/api/SRDstor/client/iSCSITarget'
export default {
  name: 'Update',
  props: {
    // 是否显示弹窗
    showDialog: {
      type: Boolean,
      default: false
    },
    currentRow: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      targetIps: [],
      osType: ['windows', 'linux', 'unix', 'macOS', 'kylin'],
      name: '',
      form: {
        ip: [] // {ipaddress: '', port: ''}
      },
      dialogVisible: this.showDialog, // 是否显示弹窗 {Boolean}
      rules: {
        ip: [
          { required: true, message: '请选择IP地址', trigger: 'blur' }
        ]
      }, // 表单验证
      loading: false // 是否显示加载动画 {Boolean}
    }
  },
  watch: {
    currentRow(val) {
      if (val !== null) {
        this.name = val.name
      }
    },
    showDialog(val) {
      this.dialogVisible = val
      if (val) {
        this.getIPs()
      }
    }
  },
  methods: {
    /**
       * 关闭弹窗
       */
    handleClose() {
      this.targetIps = []
      this.$refs['updateiSCSITargetForm'].resetFields()
      this.$emit('handleDialogVisible', false)
    },
    getIPs() {
      getIPs()
        .then(resp => {
          if (resp.rc === 0) {
            this.targetIps = resp.data
          }
        })
    },
    /**
       * 提交编辑表单
       * @param formName
       */
    submitForm(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.loading = true
          // 处理表单数据
          const params = deepClone(this.form)
          updateiSCSITarget(_this.currentRow.id, params)
            .then((resp) => {
              _this.loading = false
              if (resp.rc === 0) {
                _this.handleClose()
                _this.$emit('updateData', true)
                _this.$message({ type: 'success', message: '编辑iSCSITarget成功' })
              } else {
                _this.$message({ type: 'error', message: '编辑iSCSITarget失败' })
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

<style scoped lang="scss">
</style>
