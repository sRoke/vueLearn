<template>
  <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" :before-close="handleClose" append-to-body title="添加设备" width="500px">
    <el-form v-loading="loading" ref="addPhysicalDeviceForm" :model="form" :rules="rules" label-width="60px">
      <el-form-item label="名称">
        <el-input v-model="altName" readonly/>
      </el-form-item>
      <el-form-item label="	设备" prop="disks">
        <el-select
          v-model = "form.disks"
          multiple
          style="display: block;">
          <el-option v-for="item in blockDeviceList" :disabled = "item.usedFlag || checkDevice(item.baseInfo.size)" :key="item.name" :label="item.slot" :value="item.name"/>
        </el-select>
      </el-form-item>
      <el-form-item label-width="0" style="text-align: right;">
        <el-button type="primary" @click="submitForm('addPhysicalDeviceForm')">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { deepClone } from '@/utils/index'
import { getDisks } from '@/api/SRDstor/physicalResources/physicalDevices'
import { addPhysicalDevice } from '@/api/SRDstor/physicalResources/storagePools'

export default {
  name: 'AddPhysicalDevice',
  props: {
    // 是否显示弹窗
    showDialog: {
      type: Boolean,
      default: false
    },
    // 存储池名称
    storagePoolName: {
      type: Object,
      default: () => {
        return null
      }
    },
    // 存储池磁盘数组
    blockDevicesAry: {
      type: Array,
      default: () => {
        return []
      }
    },
    physicalDeviceType: {
      type: String,
      default: 'spare'
    }
  },
  data() {
    return {
      dialogVisible: this.showDialog, // 是否显示弹窗 {Boolean}
      form: {
        name: this.storagePoolName.name,
        type: this.physicalDeviceType,
        disks: []
      },
      altName: this.storagePoolName.altName,
      maxDiskSize: 0, // 最大磁盘大小
      rules: {
        disks: [
          { required: true, message: '请选择块设备', trigger: 'change' }
        ]
      }, // 表单验证
      blockDeviceList: [],
      loading: false
    }
  },
  watch: {
    storagePoolName(val) {
      if (val !== null) {
        this.form.name = val.orgName
        this.altName = val.altName
      }
    },
    physicalDeviceType(val) {
      this.form.type = val
    },
    showDialog(val) {
      this.dialogVisible = val
      if (val) {
        this.getDisks()
      }
    }
  },
  methods: {
    handleClose() {
      this.$refs['addPhysicalDeviceForm'].resetFields()
      this.$emit('handleDialogVisible', false)
    },
    checkDevice(device) {
      return device < this.maxDiskSize
    },
    getDisks() {
      this.loading = true
      getDisks()
        .then(resp => {
          this.loading = false
          if (resp.rc === 0) {
            this.blockDeviceList = resp.Data.disks.filter(item => {
              return (item.slot !== '')
            })
            this.blockDeviceList = this.blockDeviceList.sort((a, b) => Number(a.slot) - Number(b.slot))
            this.getMaxDiskSize()
          }
        })
        .catch(() => {
          this.loading = false
          this.$message({ type: 'error', message: '获取设备信息失败' })
        })
    },
    getMaxDiskSize() {
      const _this = this
      _this.blockDevicesAry[0].map(function(item) {
        _this.blockDeviceList.map(function(value) {
          if (value.name === item.substring(item.lastIndexOf('/') + 1)) {
            _this.maxDiskSize = _this.maxDiskSize < value.baseInfo.size ? value.baseInfo.size : _this.maxDiskSize
            return true
          }
        })
      })
    },
    submitForm(formName) {
      const _this = this

      // 处理表单数据
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.loading = true
          const params = deepClone(this.form)
          addPhysicalDevice(params)
            .then((resp) => {
              _this.loading = false
              if (resp.rc === 0) {
                _this.handleClose()
                this.$emit('updateData', true)
                _this.$message({ type: 'success', message: '添加物理设备成功' })
              } else {
                _this.$message({ type: 'error', message: '添加物理设备失败' })
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

<style scoped>

</style>
