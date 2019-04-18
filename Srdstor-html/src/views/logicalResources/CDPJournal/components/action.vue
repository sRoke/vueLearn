<template>
  <el-dialog
    v-el-drag-dialog
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    :title="dialogTitle"
    width="600px">
    <el-form v-loading="loading" ref="createCDPJournalForm" :rules="rules" :model="form" label-width="120px">
      <el-form-item label="存储池" prop="policy.storage.cdpPoolName">
        <el-select v-model="form.policy.storage.cdpPoolName">
          <el-option v-for="item in storagePoollist" :key="item.name" :label="item.name" :value="item.name"/>
        </el-select>
      </el-form-item>
      <el-form-item prop="policy.storage.max" label="存储区域最大值">
        <el-input-number v-model="form.policy.storage.max" :min="1"/>
        <el-select v-model="maxUnit" style="width: 65px;">
          <el-option v-for="item in memoryUnit" :key="item" :value="item" :label="item"/>
        </el-select>
      </el-form-item>
      <el-form-item label="精简配置">
        <el-switch v-model="form.policy.storage.sPolicy.enable"/>
      </el-form-item>
      <el-form-item label="存储区域初始值">
        <el-input-number v-model="form.policy.storage.sPolicy.initSize" :min="1"/>
        <el-select v-model="initSizeUnit" style="width: 65px;">
          <el-option v-for="item in memoryUnit" :key="item" :value="item" :label="item"/>
        </el-select>
      </el-form-item>
      <el-form-item label="自动扩容率">
        <el-input-number v-model="form.policy.storage.sPolicy.expandRate" :min="1"/>
      </el-form-item>
      <el-form-item prop="policy.retain.rPolicy" label="保留时间">
        <el-input-number v-model="form.policy.retain.rPolicy" :min="1"/><el-tag style="margin-left: 5px;" type="info">天</el-tag>
      </el-form-item>
      <el-form-item label-width="0" style="text-align: right;">
        <el-button type="primary" @click.native="submitForm('createCDPJournalForm')">创  建</el-button>
        <el-button @click="handleClose(false)">取  消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { deepClone } from '@/utils/index'
import { getStoragePools } from '@/api/SRDstor/physicalResources/storagePools'
import { createCDPJournal, getCDPJournalProperties, updateCDPJournalProperties } from '@/api/SRDstor/logicalResources/CDPJournal'
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
    actionType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      dialogTitle: '开启CDP',
      loading: false,
      dialogVisible: this.showDialog,
      selectedRow: this.currentRow,
      storagePoolNameMap: null,
      storagePoollist: [],
      memoryUnit: ['M', 'G', 'T'],
      maxUnit: 'M',
      initSizeUnit: 'M',
      form: {
        name: '',
        poolName: '',
        policy: {
          storage: {
            max: 1,
            cdpPoolName: '',
            sPolicy: {
              enable: false,
              initSize: 1,
              expandRate: 0
            }
          },
          retain: {
            rPolicy: 5
          }
        }
      },
      rules: {
        'policy.storage.max': [{
          required: true, message: '请输入', trigger: 'blur'
        }],
        'policy.retain.rPolicy': [{
          required: true, message: '请输入', trigger: 'blur'
        }],
        'policy.storage.cdpPoolName': [{
          required: true, message: '请选择', trigger: 'change'
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
    showDialog(val) {
      this.dialogVisible = val
      if (val) {
        this.form.name = this.selectedRow.name
        this.form.poolName = this.selectedRow.poolName
        if (this.actionType === 2) {
          this.dialogTitle = '更新CDP策略'
          this.getCDPJournalProperties()
        } else {
          this.dialogTitle = '开启CDP'
        }
        this.getStoragePools()
      }
    }
  },
  methods: {
    handleClose(status) {
      this.$refs['createCDPJournalForm'].resetFields()
      this.$emit('handleDialogVisible', false)
      if (status) {
        this.$emit('updateData')
      }
    },
    submitForm(formName) {
      const self = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          const params = deepClone(self.form)
          params.policy.storage.max = params.policy.storage.max.toString() + self.maxUnit
          params.policy.storage.sPolicy.initSize = params.policy.storage.sPolicy.initSize.toString() + self.initSizeUnit
          if (this.actionType === 1) {
            createCDPJournal(params).then(resp => {
              this.loading = false
              if (resp.rc === 0) {
                this.$message({ type: 'success', message: '开启CDP成功' })
                this.handleClose(true)
              }
            }).catch(() => {
              this.loading = false
            })
          } else {
            updateCDPJournalProperties(params).then(resp => {
              this.loading = false
              if (resp.rc === 0) {
                this.$message({ type: 'success', message: '更新CDP策略成功' })
                this.handleClose(true)
              }
            }).catch(() => {
              this.loading = false
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getCDPJournalProperties() {
      getCDPJournalProperties({ name: this.selectedRow.name, poolName: this.selectedRow.poolName }).then(resp => {
        if (resp.rc === 0) {
          this.maxUnit = resp.data.policy.storage.max.substring(resp.data.policy.storage.max.length - 1)
          this.initSizeUnit = resp.data.policy.storage.sPolicy.initSize.substring(resp.data.policy.storage.sPolicy.initSize.length - 1)
          resp.data.policy.storage.max = parseInt(resp.data.policy.storage.max)
          resp.data.policy.storage.sPolicy.initSize = parseInt(resp.data.policy.storage.sPolicy.initSize)
          this.form = deepClone(resp.data)
        }
      })
    },
    getStoragePools() {
      const self = this
      getStoragePools().then(resp => {
        if (resp.rc === 0) {
          self.storagePoollist = resp.data.storagepools === null ? [] : resp.data.storagepools
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
