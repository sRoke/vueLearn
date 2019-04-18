<template>
  <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" :before-close="handleClose" append-to-body title="删除设备" width="500px">
    <el-form v-loading="loading" ref="removePhysicalDevice" :model="form" :rules="rules" label-width="70px">
      <el-form-item label="名称">
        <el-input v-model="altName" readonly/>
      </el-form-item>
      <el-form-item label="	设备" prop="disks">
        <el-select
          v-model = "form.disks"
          multiple
          style="display: block;">
          <el-option v-for="item in devices" :key="item.name" :label="item.slot" :value="item.name">
            <!--<span>{{ item | formatDeviceNameToSlot }}</span>-->
            <span>{{ item.slot }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="0" style="text-align: right;">
        <el-button type="primary" @click="submitForm('removePhysicalDevice')">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import store from '@/store/index'
import { deepClone } from '@/utils/index'
import { removePhysicalDevice, editStoragePool } from '@/api/SRDstor/physicalResources/storagePools'
export default {
  name: 'RemovePhysicalDevice',
  filters: {
    formatDeviceNameToSlot: function(value) {
      return store.getters.physicalDevice[value] || value
    }
  },
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
    deviceList: {
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
      rules: {
        disks: [
          { required: true, message: '请选择块设备', trigger: 'change' }
        ]
      }, // 表单验证
      devices: [],
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
    deviceList(val) {
      if (val.length > 0) {
        let devices = []
        devices = val.map(item => {
          return { name: item, slot: store.getters.physicalDevice[item] || item }
        })
        this.devices = devices
      }
    },
    showDialog(val) {
      this.dialogVisible = val
    }
  },
  methods: {
    handleClose() {
      this.$refs['removePhysicalDevice'].resetFields()
      this.$emit('handleDialogVisible', false)
    },
    submitForm(formName) {
      const self = this

      // 处理表单数据
      self.$refs[formName].validate((valid) => {
        if (valid) {
          self.loading = true
          const params = deepClone(this.form)
          removePhysicalDevice(params)
            .then((resp) => {
              self.loading = false
              if (resp.rc === 0) {
                if (self.physicalDeviceType === 'spare' && params.disks.length === self.devices.length) {
                  editStoragePool({
                    name: self.storagePoolName.name,
                    autoReplace: 'off',
                    reName: ''
                  }).then(resp => {
                    if (resp.rc === 0) {
                      self.$emit('updateData', true)
                    }
                  })
                }
                self.handleClose()
                self.$emit('updateData', true)
                self.$message({ type: 'success', message: '删除物理设备成功' })
              } else {
                self.$message({ type: 'error', message: '删除物理设备失败' })
              }
            })
            .catch(() => {
              self.loading = false
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
