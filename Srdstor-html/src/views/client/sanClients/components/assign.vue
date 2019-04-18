<template>
  <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" :before-close="handleClose" title="分配客户端" width="500px">
    <el-form v-loading="loading" ref="assignDeviceToSanClientForm" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="iSCSI目标" prop="target_id">
        <el-select v-model="form.target_id" style="display: block;">
          <el-option v-for="item in iSCSITargets" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="逻辑卷" prop="volumn_id">
        <el-select v-model="form.volumn_id" style="display: block;">
          <el-option v-for="item in volumes" v-if="distribution.indexOf(item.guid) === -1" :key="item.guid" :label="item.name" :value="item.guid"/>
        </el-select>
      </el-form-item>
      <el-form-item label-width="0" style="text-align: right;">
        <el-button type="primary" @click="submitForm('assignDeviceToSanClientForm')">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { deepClone } from '@/utils/index'
import { getTimeViews } from '@/api/SRDstor/logicalResources/timeView'
import { getSanClient } from '@/api/SRDstor/client/sanClients'
import { assignVirtualDeviceToClient, getDeviceStatus } from '@/api/SRDstor/client/sanClients'
import { getSanResources } from '@/api/SRDstor/logicalResources/sanResources'
export default {
  name: 'Assign',
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
      iSCSITargets: [],
      volumes: [],
      distribution: [],
      form: {
        target_id: '',
        volumn_id: '',
        volumn_name: '',
        pool_name: ''
      },
      dialogVisible: this.showDialog, // 是否显示弹窗 {Boolean}
      rules: {
        target_id: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        volumn_id: [
          { required: true, message: '请选择', trigger: 'blur' }
        ]
      }, // 表单验证
      loading: false, // 是否显示加载动画 {Boolean}
      selectedRow: null
    }
  },
  watch: {
    currentRow(val) {
      this.currentRow = val
    },
    showDialog(val) {
      this.dialogVisible = val
      if (val) {
        this.getSanResourcesAndTimeViews()
        this.getSanClient(this.currentRow.id)
      }
    }
  },
  methods: {
    /**
       * 关闭弹窗
       */
    handleClose() {
      this.$refs['assignDeviceToSanClientForm'].resetFields()
      this.$emit('handleDialogVisible', false)
    },
    getSanResourcesAndTimeViews() {
      const _this = this
      _this.loading = true
      getSanResources()
        .then(resp => {
          if (resp.rc === 0) {
            _this.loading = false
            _this.volumes = resp.Data.virtualDevices
            if (_this.volumes === null) {
              _this.volumes = []
            }
            this.getTimeViews()
          }
        })
        .catch(() => {
          _this.loading = false
        })
    },
    getTimeViews() {
      const self = this
      getTimeViews()
        .then(resp => {
          if (resp.rc === 0) {
            const timeViews = resp.data === null ? [] : resp.data
            timeViews.forEach(item => {
              item.type = 2
              self.volumes.push(item)
            })
            self.getDeviceStatus()
          }
        })
    },
    getSanClient(id) {
      getSanClient(id)
        .then(resp => {
          if (resp.rc === 0) {
            this.iSCSITargets = resp.data.iscsitargets
          }
        })
    },
    getDeviceStatus() {
      const self = this
      self.distribution = []
      self.volumes.map(item => {
        getDeviceStatus(item.guid).then((resp) => {
          if (resp.rc === 0) {
            if (resp.data) {
              self.distribution.push(item.guid)
            }
          }
        })
      })
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
          _this.volumes.forEach(item => {
            if (item.guid === params.volumn_id) {
              params.volumn_name = item.name
              params.pool_name = item.poolName
            }
          })
          assignVirtualDeviceToClient(params)
            .then((resp) => {
              _this.loading = false
              if (resp.rc === 0) {
                _this.handleClose()
                _this.$emit('updateData', true)
                _this.$message({ type: 'success', message: '分配客户端成功' })
              } else {
                _this.$message({ type: 'error', message: '分配客户端失败' })
              }
            })
            .catch(() => {
              _this.loading = false
              _this.$message({ type: 'error', message: '分配客户端失败' })
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
