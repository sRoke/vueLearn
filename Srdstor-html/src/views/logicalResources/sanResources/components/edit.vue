<template>
  <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" :before-close="handleClose" title="编辑逻辑卷" width="500px">
    <el-form v-loading="loading" ref="updateSanResourceForm" :model="form" :rules="rules" label-width="70px">
      <el-form-item label="名称" prop="newname">
        <el-input v-model="form.newname"/>
      </el-form-item>
      <el-form-item label-width="0" style="text-align: right;">
        <el-button type="primary" @click="submitForm('updateSanResourceForm')">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { deepClone } from '@/utils/index'
import { editSanResource } from '@/api/SRDstor/logicalResources/sanResources'
export default {
  name: 'Edit',
  props: {
    // 是否显示弹窗
    showDialog: {
      type: Boolean,
      default: false
    },
    currentRow: {
      type: Object,
      default: () => {
        return null
      }
    }
  },
  data() {
    return {
      dialogVisible: this.showDialog, // 是否显示弹窗 {Boolean}
      loading: false, // 是否显示加载动画 {Boolean}
      form: {
        newname: '',
        oldname: '',
        poolname: ''
      },
      rules: {
        newname: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    showDialog(val) {
      this.dialogVisible = val
    },
    currentRow(val) {
      this.currentRow = val
      if (val) {
        this.form.oldname = val.name
        this.form.poolname = val.poolName
      }
    }
  },
  methods: {
    handleClose() {
      this.$refs['updateSanResourceForm'].resetFields()
      this.$emit('handleDialogVisible', false)
    },
    submitForm(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.loading = true
          // 处理表单数据
          const params = deepClone(this.form)
          editSanResource(params)
            .then((resp) => {
              _this.loading = false
              if (resp.rc === 0) {
                _this.handleClose()
                _this.$emit('updateData', true)
                _this.$message({ type: 'success', message: '编辑逻辑卷成功' })
              } else {
                _this.$message({ type: 'error', message: '编辑逻辑卷失败' })
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
