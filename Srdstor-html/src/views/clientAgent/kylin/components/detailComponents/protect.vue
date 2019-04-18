<template>
  <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" :before-close="handleClose" append-to-body title="保护磁盘" width="500px">
    <el-form v-loading="loading" ref="protectDiskForm" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="保护类型" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio label="1">远端保护</el-radio>
          <el-radio label="2">本地保护</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.type === '2'" label="选择镜像磁盘" prop="disk">
        <el-select v-model="form.disk">
          <el-option v-for="item in disk_list" :key="item.dev" :label="item.dev" :value="item.diskid"/>
        </el-select>
      </el-form-item>
      <el-form-item label-width="0" style="text-align: right;">
        <el-button type="primary" @click="submitForm('protectDiskForm')">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { getDisks, remoteProtect, protect, getSysDisk } from '@/api/SRDstor/clientAgent'

export default {
  name: 'Protect',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    diskData: {
      type: Object,
      default: () => {
        return null
      }
    },
    sysDiskName: {
      type: String,
      default: null
    },
    ip: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      form: {
        type: '1',
        disk: null
      },
      disk_list: [],
      rules: {
        type: [{
          required: true, message: '请选择保护类型', trigger: 'blur'
        }],
        ip: [{
          required: true, message: '选择镜像磁盘', trigger: 'change'
        }]
      }
    }
  },
  watch: {
    diskData(val) {},
    dialogVisible(val) {
      if (val) {
        console.log('aaaaaaaaaaaaaa============', this.sysDiskName)
        // this.getdetail(process.env.BASE_API)
        this.getDisks()
        // this.getSysDisk()
      }
    }
  },
  methods: {
    getSysDisk() {
      getSysDisk(`${this.ip}:8888`).then(resp => {
        if (Number(resp.retcode) === 0) {
          console.log('系统磁盘==============', resp.data)
        }
      })
    },
    getDisks() {
      const self = this
      self.disk_list = []
      getDisks(
        {
          cmdcode: 0,
          filter: 0
        },
        `${this.ip}:8888`
      ).then(resp => {
        if (Number(resp.retcode) === 0) {
          resp.data.forEach((item) => {
            if (item.status === 'NORMAL' && item.diskid !== self.diskData.diskid) {
              self.disk_list.push(item)
            }
          })
        }
      })
    },
    submitForm(formName) {
      const self = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          self.loading = true
          if (self.form.type === '1') {
            remoteProtect(
              {
                name: self.diskData.dev,
                ip: self.$store.getters.srdstorIp
              },
              `${self.ip}:8888`
            ).then(resp => {
              self.loading = false
              if (resp.retcode === 0) {
                console.log('系统磁盘==============', self.sysDiskName, self.diskData.dev)
                if (self.sysDiskName === self.diskData.dev) {
                  self.$message({ type: 'success', message: '保护成功,需重启后生效' })
                } else {
                  self.$message({ type: 'success', message: '保护成功' })
                }
                self.$emit('updateData', false)
                self.handleClose()
              }
            }).catch(() => {
              self.loading = false
            })
          } else if (self.form.type === '2') {
            protect(
              {
                cmdcode: 11,
                master: self.diskData.diskid,
                slave: self.form.disk
              },
              `${self.ip}:8888`
            ).then(resp => {
              self.loading = false
              if (resp.retcode === 0) {
                self.$message({ type: 'success', message: '保护成功' })
                self.$emit('updateData', false)
                self.handleClose()
              }
            }).catch(() => {
              self.loading = false
              self.$message({ type: 'error', message: '保护失败' })
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleClose() {
      this.$refs['protectDiskForm'].resetFields()
      this.$emit('handleDialogVisible', false)
    }
  }
}
</script>

<style scoped>

</style>
