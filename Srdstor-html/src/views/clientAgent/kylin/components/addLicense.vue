<template>
  <el-dialog
    v-el-drag-dialog
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    title="注册许可"
    width="600px">
    <el-form v-loading="loading" ref="addLicense" :rules="rules" :model="form" label-width="100px">
      <el-form-item prop="name" label="客户端名称">
        <el-input v-model="form.name" disabled/>
      </el-form-item>
      <el-form-item prop="ip" label="客户端IP">
        <el-input v-model="form.ip" disabled/>
      </el-form-item>
      <el-form-item prop="mcode" label="机械码">
        <div style="display: flex">
          <el-input id="input-mcode" v-model="form.mcode" disabled/>
          <el-button id="input-mcode-copy" :data-clipboard-text="form.mcode" style="margin-left: 20px" @click="copy">复制</el-button>
        </div>
      </el-form-item>
      <el-form-item prop="sn" label="注册码">
        <el-input v-model="form.sn"/>
      </el-form-item>
      <el-form-item label-width="0" style="text-align: right;">
        <el-button type="primary" @click.native="submitForm('addLicense')">注 册</el-button>
        <el-button @click="handleClose">取  消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { getMcode, addLicense, getLicenseInfo } from '@/api/SRDstor/clientAgent'
import Clipboard from 'clipboard'
export default {
  name: 'AddLicense',
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
    }
  },
  data() {
    return {
      dialogVisible: this.showDialog,
      loading: false,
      rules: {
        sn: [{
          required: true, message: '请输入注册码', trigger: 'blur'
        }]
      },
      form: {
        name: '',
        ip: null,
        mcode: null,
        sn: null
      },
      protocol_list: [
        'iscsi'
      ]
    }
  },
  watch: {
    showDialog(val) {
      this.dialogVisible = val
      if (val) {
        console.log('AAAAAA===', this.currentRow)
        this.form.name = this.currentRow.name
        this.form.ip = this.currentRow.ip
        this.getMcode()
      }
    }
  },
  methods: {
    handleClose() {
      this.$refs['addLicense'].resetFields()
      this.$emit('handleDialogVisible', false)
    },
    copy() {
      const self = this
      var clipboard = new Clipboard('#input-mcode-copy')
      clipboard.on('success', e => {
        self.$message({ type: 'success', message: `复制成功` })
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        self.$message({ type: 'error', message: `该浏览器不支持自动复制` })
        clipboard.destroy()
      })
    },
    getMcode() {
      const self = this
      getMcode({ cmdcode: 80 }, `${self.currentRow.ip}:8888`).then(resp => {
        if (resp.retcode === 0) {
          self.form.mcode = resp.data.mcode
        }
      }).catch(() => {

      })
    },
    getInfo() {
      const self = this
      getLicenseInfo({ cmdcode: 82 }, `${self.currentRow.ip}:8888`).then(resp => {
        if (resp.retcode === 0) {
          if (resp.data.status === 0) {
            self.$message({ type: 'success', message: `新增成功` })
            self.$emit('updateData', false)
            self.handleClose()
          } else {
            self.$emit('updateData', false)
            self.$message({ type: 'error', message: `新增失败` })
          }
        } else {
          self.$message({ type: 'error', message: `新增失败` })
        }
      }).catch(() => {
        self.$message({ type: 'error', message: `新增失败` })
      })
    },
    submitForm(formName) {
      const self = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          self.loading = true
          addLicense(
            {
              cmdcode: 81,
              sn: self.form.sn
            },
            `${self.currentRow.ip}:8888`
          ).then(resp => {
            self.loading = false
            if (resp.retcode === 0) {
              self.getInfo()
              // self.$message({ type: 'success', message: '创建成功' })
              // self.$emit('updateData', false)
              // self.handleClose()
            }
          }).catch(() => {
            self.loading = false
            self.$message({ type: 'error', message: `新增失败` })
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
