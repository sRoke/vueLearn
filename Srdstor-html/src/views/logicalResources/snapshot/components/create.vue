<template>
  <el-dialog
    v-el-drag-dialog
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    width="500px"
    title="创建快照">
    <el-form v-loading="loading" ref="createSnapshotForm" :rules="rules" :model="form" label-width="70px">
      <el-form-item prop="name" label="名称">
        <el-input v-model="form.name"/>
      </el-form-item>
      <el-form-item label-width="0" style="text-align: right;">
        <el-button type="primary" @click.native="submitForm('createSnapshotForm')">创  建</el-button>
        <el-button @click="handleClose">取  消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { createSanpshot } from '@/api/SRDstor/logicalResources/snapshot'
export default {
  name: 'Create',
  props: {
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
      loading: false,
      dialogVisible: this.showDialog,
      selectedRow: this.currentRow,
      form: {
        name: ''
      },
      rules: {
        name: [{
          required: true, message: '请输入名称', trigger: 'blur'
        }]
      }
    }
  },
  watch: {
    showDialog(val) {
      this.dialogVisible = val
    },
    currentRow(val) {
      this.selectedRow = val
    }
  },
  methods: {
    handleClose() {
      this.$refs['createSnapshotForm'].resetFields()
      this.$emit('handleDialogVisible', false)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          createSanpshot({
            name: this.form.name,
            poolName: this.selectedRow.poolName,
            virDevName: this.selectedRow.name
          }).then(resp => {
            this.loading = false
            if (resp.rc === 0) {
              this.$message({ type: 'success', message: '创建成功' })
              this.handleClose()
            }
          }).catch(() => {
            this.loading = false
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
