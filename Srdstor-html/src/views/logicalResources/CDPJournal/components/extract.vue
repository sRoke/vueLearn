<template>
  <el-dialog
    v-el-drag-dialog
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    append-to-body
    width="600px"
    title="提取CDP">
    <el-form v-loading="loading" ref="extractCDPJournalForm" :rules="rules" :model="form" label-width="50px">
      <el-form-item label="大小">
        <el-input v-model="form.condition.size" style="width: 80px;"/>
        <el-select v-model="sizeUnit" style="width: 80px;">
          <el-option v-for="item in memoryUnit" :key="item" :label="item" :value="item"/>
        </el-select>
      </el-form-item>
      <el-form-item label-width="0" style="text-align: center;">
        <el-button type="primary" @click.native="submitForm('extractCDPJournalForm')">创 建</el-button>
        <el-button @click.native="handleClose">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { deepClone } from '@/utils/index'
import { extractCDPJournal } from '@/api/SRDstor/logicalResources/CDPJournal'
export default {
  name: 'Extract',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    selectedSanResource: {
      type: Object,
      default: () => {
        return null
      }
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
      selectedRow: null,
      dialogVisible: this.showDialog,
      memoryUnit: ['M', 'G', 'T'],
      sizeUnit: 'M',
      form: {
        name: '',
        poolName: '',
        condition: {
          size: 1,
          snapshotId: '',
          timestamp: ''
        }
      },
      rules: {}
    }
  },
  watch: {
    selectedSanResource(val) {
      this.selectedSanResource = val
    },
    currentRow(val) {
      this.selectedRow = val
    },
    showDialog(val) {
      this.dialogVisible = val
      if (val) {
        this.form.name = this.selectedSanResource.name
        this.form.poolName = this.selectedSanResource.poolName
        this.form.condition.snapshotId = this.selectedRow.guid
        this.form.condition.timestamp = this.selectedRow.timestamp
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          const params = deepClone(this.form)
          params.condition.size = params.condition.size + this.sizeUnit
          extractCDPJournal(params).then(resp => {
            this.loading = false
            if (resp.rc === 0) {
              this.$message({ type: 'success', message: '触发提取成功' })
              this.handleClose()
            } else {
              this.$message({ type: 'error', message: '触发提取失败' })
            }
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleClose() {
      this.$emit('handleDialogVisible', false)
    }
  }
}
</script>

<style scoped>

</style>
