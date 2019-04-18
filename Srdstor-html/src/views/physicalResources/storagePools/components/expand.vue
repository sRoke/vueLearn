<template>
  <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" :before-close="handleClose" title="扩容存储池" width="500px">
    <el-form v-loading="loading" ref="expandStoragePoolForm" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" readonly/>
      </el-form-item>
      <el-form-item v-if="raidType !== 1 && Array.isArray(blockDevicesAry[0])">
        <div>
          <el-tag type="warning">请选择{{ blockDevicesAry[0].length }}块盘</el-tag>
        </div>
      </el-form-item>
      <el-form-item label="	块设备" prop="disks">
        <el-select
          v-model = "form.disks"
          multiple
          style="display: block;">
          <el-option v-for="item in blockDeviceList" :disabled = "item.usedFlag" :key="item.name" :label="item.slot" :value="item.name"/>
        </el-select>
      </el-form-item>
      <el-form-item label-width="0" style="text-align: right;">
        <el-button type="primary" @click="submitForm('expandStoragePoolForm')">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

</template>
<script>
import { deepClone } from '@/utils/index'
import { getDisks } from '@/api/SRDstor/physicalResources/physicalDevices'
import { expandStoragePool } from '@/api/SRDstor/physicalResources/storagePools'
export default {
  name: 'Expand',
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
    blockDevicesAry: {
      type: Array,
      default: () => {
        return []
      }
    },
    raidType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      form: {
        name: '', // 存储池名称 {String}
        type: this.raidType,
        disks: []
      },
      blockDeviceList: [],
      dialogVisible: this.showDialog, // 是否显示弹窗 {Boolean}
      rules: {
        name: [
          { required: true, message: '请输入存储池名称', trigger: 'blur' }
        ],
        disks: [
          { required: true, message: '请选择块设备', trigger: 'change' }
        ]
      }, // 表单验证
      loading: false // 是否显示加载动画 {Boolean}
    }
  },
  watch: {
    showDialog(val) {
      this.dialogVisible = val
      if (val) {
        this.getDisks()
      }
    },
    storagePoolName(val) {
      if (val !== null) {
        this.form.name = val.altName
      }
    },
    raidType(val) {
      this.form.type = val
    },
    blockDevicesAry(val) {
      this.blockDevicesAry = val
    }
  },
  methods: {
    /**
       * 关闭弹窗
       */
    handleClose() {
      this.$refs['expandStoragePoolForm'].resetFields()
      this.$emit('handleDialogVisible', false)
    },
    /**
       * 提交编辑表单
       * @param formName
       */
    submitForm(formName) {
      const _this = this

      // 处理表单数据
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.loading = true
          const params = deepClone(this.form)
          params.name = _this.storagePoolName.orgName
          params.disks = [params.disks]
          expandStoragePool(params)
            .then((resp) => {
              _this.loading = false
              if (resp.rc === 0) {
                _this.handleClose()
                _this.$emit('updateData', true)
                _this.$message({ type: 'success', message: '扩容存储池成功' })
              } else {
                _this.$message({ type: 'error', message: '扩容存储池失败' })
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
          }
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
