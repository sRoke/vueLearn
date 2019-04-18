<template>
  <el-dialog
    v-el-drag-dialog
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    width="500px"
    title="编辑快照视图">
    <el-form v-loading="loading" ref="editTimeViewForm" :rules="rules" :model="form" label-width="80px">
      <el-form-item prop="reservation" label="预留空间">
        <el-input-number v-model="form.reservation" :precision="1" :step="0.1" :min="0.1"/>
        <el-select v-model="sizeUnit" style="width: 70px;">
          <el-option v-for="item in storageUnit" :key="item" :label="item" :value="item"/>
        </el-select>
      </el-form-item>
      <el-form-item label-width="0" style="text-align: right;">
        <el-button type="primary" @click="submitForm('editTimeViewForm')">编 辑</el-button>
        <el-button @click="handleClose">取  消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { setTimeViewReservation } from '@/api/SRDstor/logicalResources/timeView'
export default {
  name: 'Edit',
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
        reservation: 5
      },
      rules: {
        reservation: [{
          required: true, message: '请输入预留空间', trigger: 'blur'
        }]
      },
      storageUnit: ['MB', 'GB', 'TB'],
      sizeUnit: 'MB'
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
      this.$refs['editTimeViewForm'].resetFields()
      this.$emit('handleDialogVisible', false)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          setTimeViewReservation({
            reservation: this.form.reservation + this.sizeUnit,
            poolName: this.selectedRow.poolName,
            name: this.selectedRow.name
          }).then(resp => {
            this.sizeUnit = 'MB'
            this.loading = false
            if (resp.rc === 0) {
              this.$message({ type: 'success', message: '编辑成功' })
              this.$emit('updateData', true)
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
