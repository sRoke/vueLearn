<template>
  <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" :before-close="handleClose" title="编辑客户端" width="500px">
    <el-form v-loading="loading" ref="editSanClientForm" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name"/>
      </el-form-item>
      <el-form-item label="IP">
        <el-input v-model="form.ip"/>
      </el-form-item>
      <el-form-item label="系统类型" prop="os_type">
        <el-select v-model="form.os_type">
          <el-option
            v-for="item in osType"
            :key="item"
            :label="item"
            :value="item"/>
        </el-select>
      </el-form-item>
      <el-form-item label="描述">
        <el-input :rows="2" v-model="form.description" type="textarea" placeholder="请输入内容"/>
      </el-form-item>
      <el-form-item label-width="0" style="text-align: right;">
        <el-button type="primary" @click="submitForm('editSanClientForm')">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { deepClone } from '@/utils/index'
import { updateSanClient } from '@/api/SRDstor/client/sanClients'

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
        return {}
      }
    }
  },
  data() {
    return {
      osType: ['Windows', 'Linux', 'Unix', 'MacOS', 'Kylin'],
      form: {
        name: '',
        ip: '',
        os_type: '',
        description: ''
      },
      dialogVisible: this.showDialog, // 是否显示弹窗 {Boolean}
      rules: {
        name: [
          { required: true, message: '请输入客户端名称', trigger: 'blur' }
        ],
        os_type: [
          { required: true, message: '请输入系统类型', trigger: 'blur' }
        ]
      }, // 表单验证
      loading: false // 是否显示加载动画 {Boolean}
    }
  },
  watch: {
    showDialog(val) {
      this.dialogVisible = val
    },
    currentRow(val) {
      if (val !== null) {
        this.form.name = val.name
        this.form.ip = val.ip
        this.form.os_type = val.os_type
        this.form.description = val.description
      }
    }
  },
  methods: {
    /**
       * 关闭弹窗
       */
    handleClose() {
      this.$refs['editSanClientForm'].resetFields()
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
          updateSanClient(_this.currentRow.id, params)
            .then((resp) => {
              _this.loading = false
              if (resp.rc === 0) {
                _this.handleClose()
                _this.$emit('updateData', true)
                _this.$message({ type: 'success', message: '编辑客户端成功' })
              } else {
                _this.$message({ type: 'error', message: '编辑客户端失败' })
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
