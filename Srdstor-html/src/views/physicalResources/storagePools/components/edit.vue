<template>
  <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" :before-close="handleClose" title="编辑存储池" width="500px">
    <el-form v-loading="loading" ref="editStoragePoolForm" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="名称" prop="reName">
        <el-input v-model="form.reName"/>
      </el-form-item>
      <el-form-item label="	热备盘自动替换">
        <el-switch :disabled="hotSpareDeviceAry.length === 0" v-model = "form.autoReplace"/>
      </el-form-item>
      <el-form-item label-width="0" style="text-align: right;">
        <el-button type="primary" @click="submitForm('editStoragePoolForm')">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { deepClone } from '@/utils/index'
import { editStoragePool } from '@/api/SRDstor/physicalResources/storagePools'
export default {
  name: 'Edit',
  props: {
    // 是否显示弹窗
    showDialog: {
      type: Boolean,
      default: false
    },
    // 存储池名称
    storagePoolName: {
      type: Object,
      default: () => {
        return null
      }
    },
    isAutoReplace: {
      type: String,
      default: ''
    },
    hotSpareDeviceAry: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      form: {
        name: '', // 存储池名称 {String}
        autoReplace: false, // 热备盘是否自动替换 {Boolean}
        reName: ''
      },
      oldName: '',
      dialogVisible: this.showDialog, // 是否显示弹窗 {Boolean}
      rules: {
        reName: [
          { required: true, message: '请输入存储池名称', trigger: 'blur' }
        ]
      }, // 表单验证
      loading: false // 是否显示加载动画 {Boolean}
    }
  },
  watch: {
    storagePoolName(val) {
      if (val !== null) {
        this.form.name = val.orgName
        this.form.reName = val.altName
        this.oldName = val.altName
      }
    },
    hotSpareDeviceAry(val) {
      this.hotSpareDeviceAry = val
    },
    showDialog(val) {
      this.dialogVisible = val
    },
    isAutoReplace(val) {
      this.isAutoReplace = val
      if (val === 'on') {
        this.form.autoReplace = true
      } else if (val === 'off') {
        this.form.autoReplace = false
      }
    }
  },
  methods: {
    /**
     * 关闭弹窗
     */
    handleClose() {
      this.$refs['editStoragePoolForm'].resetFields()
      this.$emit('handleDialogVisible', false)
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
          // params.name = this.form.name
          params.autoReplace = params.autoReplace ? 'on' : 'off'
          if (_this.oldName === params.reName) {
            params.reName = ''
          }
          editStoragePool(params)
            .then((resp) => {
              _this.loading = false
              if (resp.rc === 0) {
                _this.$emit('updateData', true)
                _this.handleClose()
                _this.$message({ type: 'success', message: '编辑存储池成功' })
              } else {
                _this.$message({ type: 'error', message: '编辑存储池失败' })
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
