<template>
  <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" :before-close="handleClose" title="取消分配客户端" width="500px">
    <el-form v-loading="loading" ref="unassignVirtualDeviceFromClientForm" :model="form" :rules="rules" label-width="70px">
      <!--<el-form-item label="iSCSITarget" prop="target_id">-->
      <!--<el-select v-model="form.target_id">-->
      <!--<el-option v-for="item in iSCSIDevices" :key="item.id" :label="item.name" :value="item.id"/>-->
      <!--</el-select>-->
      <!--</el-form-item>-->
      <el-form-item label="逻辑卷" prop="volumn_id">
        <el-select v-model="form.volumn_id" style="display: block;">
          <el-option v-for="item in iSCSIDevices" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label-width="0" style="text-align: right;">
        <el-button type="primary" @click="submitForm('unassignVirtualDeviceFromClientForm')">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { deepClone } from '@/utils/index'
import { getSanClient } from '@/api/SRDstor/client/sanClients'
import { unassignVirtualDeviceFromClient } from '@/api/SRDstor/client/sanClients'
import { getTimeViews } from '@/api/SRDstor/logicalResources/timeView'
import { getSanResources } from '@/api/SRDstor/logicalResources/sanResources'
export default {
  name: 'Unassign',
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
      iSCSIDevices: [],
      volumes: [],
      form: {
        target_id: '',
        volumn_id: ''
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
      }
    }
  },
  methods: {
    /**
       * 关闭弹窗
       */
    handleClose() {
      this.$refs['unassignVirtualDeviceFromClientForm'].resetFields()
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
            this.getTimeViewsAndSanClient()
          }
        })
        .catch(() => {
          _this.loading = false
        })
    },
    getTimeViewsAndSanClient() {
      const self = this
      getTimeViews()
        .then(resp => {
          if (resp.rc === 0) {
            const timeViews = resp.data === null ? [] : resp.data
            timeViews.forEach(item => {
              item.type = 2
              self.volumes.push(item)
            })
            self.getSanClient(self.currentRow.id)
          }
        })
    },
    getSanClient(id) {
      const self = this
      getSanClient(id)
        .then(resp => {
          if (resp.rc === 0) {
            const targetList = resp.data.iscsitargets.filter(item => item.iscsidevices.length > 0)
            const deviceList = []
            targetList.forEach(targetItem => {
              targetItem.iscsidevices.forEach(deviceItem => {
                deviceItem.targetId = targetItem.id
                deviceList.push(deviceItem)
              })
            })
            self.volumes.forEach(volumeItem => {
              deviceList.forEach(deviceItem => {
                if (deviceItem.id === volumeItem.guid) {
                  deviceItem.name = volumeItem.name
                }
              })
            })
            self.iSCSIDevices = deviceList
          }
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
          _this.iSCSIDevices.forEach(item => {
            if (item.id === params.volumn_id) {
              params.target_id = item.targetId
            }
          })
          unassignVirtualDeviceFromClient(params)
            .then((resp) => {
              _this.loading = false
              if (resp.rc === 0) {
                _this.handleClose()
                _this.$emit('updateData', true)
                _this.$message({ type: 'success', message: '取消分配客户端成功' })
              } else {
                _this.$message({ type: 'error', message: '取消分配客户端失败' })
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
