<template>
  <el-dialog
    v-el-drag-dialog
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    width="500px"
    append-to-body
    title="创建快照视图">
    <el-form v-loading="loading" ref="createTimeViewForm" :rules="rules" :model="form" label-width="80px">
      <el-form-item prop="name" label="名称">
        <el-input v-model="form.name"/>
      </el-form-item>
      <el-form-item prop="size" label="预留空间">
        <el-input-number v-model="form.size" :precision="1" :step="0.1" :min="0.1"/>
        <el-select v-model="sizeUnit" style="width: 70px;">
          <el-option v-for="item in storageUnit" :key="item" :label="item" :value="item"/>
        </el-select>
      </el-form-item>
      <el-form-item label-width="0" style="text-align: right;">
        <el-button type="primary" @click.native="submitForm('createTimeViewForm')">创  建</el-button>
        <el-button @click="handleClose">取  消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { createTimeView } from '@/api/SRDstor/logicalResources/timeView'
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
    },
    snapshot: {
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
        name: '',
        size: 5
      },
      rules: {
        name: [{
          required: true, message: '请输入名称', trigger: 'blur'
        }],
        size: [{
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
      this.$refs['createTimeViewForm'].resetFields()
      this.$emit('handleDialogVisible', false)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          createTimeView({
            timeViewName: this.form.name,
            size: this.form.size + this.sizeUnit,
            snapshot: {
              name: this.selectedRow.name,
              poolName: this.snapshot.poolName,
              virDevName: this.snapshot.virDevName
            }
          }).then(resp => {
            this.loading = false
            this.sizeUint = 'MB'
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
