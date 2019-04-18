<template>
  <el-dialog
    v-el-drag-dialog
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    :title="dialogTitle"
    width="500px">
    <el-form v-loading="loading" ref="createSnapshotPolicyForm" :rules="rules" :model="form" label-width="80px">
      <el-form-item prop="initTime" label="开始时间">
        <el-date-picker
          v-model="form.initTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"/>
      </el-form-item>
      <el-form-item prop="interval" label="间隔时间">
        <el-input-number v-model="form.interval" :min="1"/>
        <el-select v-model="intervalUnit" style="width: 85px;">
          <el-option v-for="item in timeUnit" :key="item.name" :label="item.name" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item prop="snapshotMaxNum" label="快照数量">
        <el-input-number v-model="form.snapshotMaxNum" :min="1"/>
      </el-form-item>
      <el-form-item label-width="0" style="text-align: right;">
        <el-button type="primary" @click.native="submitForm('createSnapshotPolicyForm')">确  定</el-button>
        <el-button @click="handleClose">取  消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { createSnapshotPolicy } from '@/api/SRDstor/logicalResources/snapshotPolicy'
export default {
  name: 'Action',
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
    actionType: {
      type: Number,
      default: 1
    },
    snapshotPolicyInfo: {
      type: Object,
      default: () => {
        return {
          poolName: '',
          virDevName: '',
          initTime: '',
          interval: 0,
          snapshotMaxNum: 0
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      dialogVisible: this.showDialog,
      dialogTitle: '创建快照策略',
      selectedRow: this.currentRow,
      intervalUnit: 'm',
      timeUnit: [{ name: '分', value: 'm' }, { name: '时', value: 'h' }],
      form: {
        initTime: '',
        interval: 10,
        snapshotMaxNum: 12
      },
      rules: {
        initTime: [{
          required: true, message: '请选择时间', trigger: 'change'
        }],
        interval: [{
          required: true, message: '请选择间隔时间', trigger: 'change'
        }],
        snapshotMaxNum: [{
          required: true, message: '请选择快照数量', trigger: 'change'
        }]
      }
    }
  },
  watch: {
    currentRow(val) {
      this.selectedRow = val
    },
    actionType(val) {
      this.actionType = val
    },
    snapshotPolicyInfo(val) {
      this.snapshotPolicyInfo = val
    },
    showDialog(val) {
      this.dialogVisible = val
      if (val) {
        if (this.actionType === 2) {
          this.dialogTitle = '编辑快照策略'
          this.form = {
            initTime: this.snapshotPolicyInfo.initTime,
            interval: this.snapshotPolicyInfo.interval / 60,
            snapshotMaxNum: this.snapshotPolicyInfo.snapshotMaxNum
          }
        } else {
          this.dialogTitle = '创建快照策略'
        }
      }
    }
  },
  methods: {
    handleClose() {
      this.$refs['createSnapshotPolicyForm'].resetFields()
      this.$emit('handleDialogVisible', false)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          createSnapshotPolicy({
            initTime: this.form.initTime,
            interval: this.intervalUnit === 'm' ? this.form.interval * 60 : this.form.interval * 60 * 60,
            snapshotMaxNum: this.form.snapshotMaxNum,
            poolName: this.selectedRow.poolName,
            virDevName: this.selectedRow.name
          }).then(resp => {
            this.loading = false
            if (resp.rc === 0) {
              if (this.actionType === 1) {
                this.$message({ type: 'success', message: '快照策略创建成功' })
              } else {
                this.$message({ type: 'success', message: '快照策略编辑成功' })
              }
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
