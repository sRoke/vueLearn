<template>
  <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" :before-close="handleClose" title="开始脚本" width="500px">
    <el-form v-loading="loading" ref="startTaskForm" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="系统盘快照" prop="sysDiskSnapshotName">
        <el-select v-model="form.sysDiskSnapshotName" style="display: block;">
          <el-option v-for="item in snapshots" :key="item.name" :label="item.name" :value="item.name" :disabled="!item.isAvailable"/>
        </el-select>
      </el-form-item>
      <el-form-item
        v-for="(snapshots, index) in dataDiskSnapshotList"
        :label="'数据磁盘快照' + index"
        :key="index"
        :prop="'dataDiskSnapshotMap.' + index"
        :rules="{required: true, message: '数据磁盘快照不能为空', trigger: 'blur'}">
        <el-select v-model="form.dataDiskSnapshotMap[index]" style="display: block;" @change="handleSelectChange($event)">
          <el-option v-for="item in snapshots" :key="item.name" :label="item.name" :value="item.guid" :disabled="!item.isAvailable"/>
        </el-select>
      </el-form-item>
      <el-form-item label-width="0" style="text-align: right;">
        <el-button type="primary" @click="submitForm('startTaskForm')">确  定</el-button>
        <el-button @click="handleClose">取  消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { deepClone } from '@/utils/index'
import { getSanpshots } from '@/api/SRDstor/logicalResources/snapshot'
import { getSanResources } from '@/api/SRDstor/logicalResources/sanResources'
import { getScript, startTask } from '@/api/SRDstor/autoRecover'
export default {
  name: 'Start',
  props: {
    dialogVisible: {
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
      form: {
        autoRecoverScriptId: -1,
        sysDiskSnapshotName: '',
        dataDiskSnapshotMap: []
      },
      rules: {
        sysDiskSnapshotName: [{
          required: true, message: '请选择系统盘快照', trigger: 'change'
        }]
      },
      sanResources: {},
      sysDiskId: '',
      snapshots: [],
      dataDiskList: [],
      dataDiskSnapshotList: []
    }
  },
  watch: {
    currentRow(val) {
      this.currentRow = val
    },
    dialogVisible(val) {
      this.dialogVisible = val
      this.form.autoRecoverScriptId = this.currentRow.id
      if (val) {
        this.getScript()
      }
    }
  },
  methods: {
    handleSelectChange(val) {
      console.log(val)
    },
    handleClose() {
      this.form.dataDiskSnapshotMap = []
      this.$refs['startTaskForm'].resetFields()
      this.$emit('handleDialogVisible', false)
    },
    getScript() {
      this.dataDiskList = []
      this.dataDiskSnapshotList = []
      this.form.dataDiskSnapshotMap = []
      this.snapshots = {}
      getScript(this.currentRow.id)
        .then(resp => {
          if (Number(resp.rc) === 0) {
            this.sysDiskId = resp.data.sysDiskId
            this.dataDiskList = resp.data.dataDiskList === null ? [] : resp.data.dataDiskList
            this.getSanResources()
          }
        })
    },
    getSanResources() {
      const self = this
      self.sanResources = {}
      getSanResources()
        .then(resp => {
          if (resp.rc === 0) {
            const sanResourceList = resp.Data.virtualDevices === null ? [] : resp.Data.virtualDevices
            sanResourceList.forEach(item => {
              self.sanResources[item.guid] = { virDevName: item.name, poolName: item.poolName }
            })
            this.dataDiskList.forEach(item => {
              if (typeof self.sanResources[item.dataDiskId] === 'object') {
                getSanpshots(self.sanResources[item.dataDiskId])
                  .then(resp => {
                    if (resp.rc === 0) {
                      // const snapshots = []
                      resp.data.snapshots.forEach(snapshotItem => {
                        snapshotItem.guid = snapshotItem.name + '__' + item.dataDiskId
                      })
                      self.dataDiskSnapshotList.push(resp.data.snapshots)
                      self.form.dataDiskSnapshotMap = new Array(self.dataDiskSnapshotList.length)
                      // self.dataDiskSnapshotList.push({ snapshots: resp.data.snapshots, guid: item.dataDiskId })
                      // self.form.dataDiskSnapshotMap[item.dataDiskId] = ''
                    }
                  })
              }
            })
            if (typeof self.sanResources[self.sysDiskId] === 'object') {
              getSanpshots(self.sanResources[self.sysDiskId])
                .then(resp => {
                  if (resp.rc === 0) {
                    self.snapshots = resp.data.snapshots
                  }
                })
            }
          }
        })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          const params = deepClone(this.form)
          const dataDiskSnapshotMap = {}
          params.dataDiskSnapshotMap.forEach(item => {
            if (typeof item === 'string') {
              const [name, guid] = [item.split('__')[0], item.split('__')[1]]
              dataDiskSnapshotMap[guid] = name
            }
          })
          if (JSON.stringify(dataDiskSnapshotMap) === '{}') {
            delete params.dataDiskSnapshotMap
          } else {
            params.dataDiskSnapshotMap = dataDiskSnapshotMap
          }
          startTask(params).then(resp => {
            this.loading = false
            if (Number(resp.rc) === 0) {
              this.$message({ type: 'success', message: '任务开始成功' })
              this.$emit('updateData', false)
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
