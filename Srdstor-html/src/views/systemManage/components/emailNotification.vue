<template>
  <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" :before-close="handleClose" title="邮件通知" width="500px">
    <el-form v-loading="loading" ref="setEmailForm" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="服务器IP" prop="serverip">
        <el-input v-model="form.serverip"/>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" show-password/>
      </el-form-item>
      <el-form-item label="发送者" prop="sender">
        <el-input v-model="form.sender"/>
      </el-form-item>
      <el-form-item label="接收者" prop="receiver">
        <el-input v-model="form.receiver">
          <el-button slot="append" icon="el-icon-circle-plus-outline" @click.prevent="addReceiver()"/>
        </el-input>
      </el-form-item>
      <el-form-item
        v-for="(receiver, index) in form.receivers"
        :label="'接收者' + index"
        :key="index">
        <el-input v-model="receiver.value">
          <el-button slot="append" icon="el-icon-delete" @click.prevent="removeReceiver(receiver)"/>
        </el-input>
      </el-form-item>
      <el-form-item label="转发接收者" prop="ccaddress">
        <el-input v-model="form.ccaddress">
          <el-button slot="append" icon="el-icon-circle-plus-outline" @click.prevent="addCcaddress()"/>
        </el-input>
      </el-form-item>
      <el-form-item
        v-for="(ccaddress, index) in form.ccaddresses"
        :label="'转发接收者' + index"
        :key="(index+1)*2">
        <el-input v-model="ccaddress.value">
          <el-button slot="append" icon="el-icon-delete" @click.prevent="removeCcaddress(ccaddress)"/>
        </el-input>
      </el-form-item>
      <el-form-item label="端口" prop="serverport">
        <el-input-number v-model="form.serverport"/>
      </el-form-item>
      <el-form-item label-width="0" style="text-align: right;">
        <el-button type="primary" @click="submitForm('setEmailForm')">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { deepClone } from '@/utils/index'
import { setEmailNotification, getEmailConfig } from '@/api/SRDstor/systemManage'
export default {
  name: 'SetEmail',
  props: {
    // 是否显示弹窗
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: this.showDialog, // 是否显示弹窗 {Boolean}
      loading: false, // 是否显示加载动画 {Boolean}
      form: {
        username: 'send@hzrorke.mail.com',
        password: 'password',
        serverip: '192.168.0.243',
        sender: 'rorke——test',
        receiver: 'receiv1@hzrorke.mail.com',
        receivers: [],
        ccaddress: 'receiv2@hzrorke.mail.com',
        ccaddresses: [],
        serverport: 465
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        serverip: [
          { required: true, message: '请输入服务器IP', trigger: 'blur' }
        ],
        sender: [
          { required: true, message: '请输入发送者', trigger: 'blur' }
        ],
        receiver: [
          { required: true, message: '请输入接收者', trigger: 'blur' }
        ],
        ccaddress: [
          { required: true, message: '请输入转发接收者', trigger: 'blur' }
        ],
        serverport: [
          { required: true, message: '请输入端口', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    showDialog(val) {
      this.dialogVisible = val
      if (val) {
        this.getEmailConfig()
      }
    }
  },
  methods: {
    handleClose() {
      this.form.receivers = []
      this.form.ccaddresses = []
      this.$refs['setEmailForm'].resetFields()
      this.$emit('handleDialogVisible', false)
    },
    getEmailConfig() {
      getEmailConfig()
        .then(resp => {
          if (resp.rc === 0) {
            const conf = resp.conf
            this.form.sender = conf.sender
            this.form.serverport = conf.serverport
            this.form.username = conf.username
            this.form.serverip = conf.serverip
            this.form.password = conf.password
            if (conf.receiver.length > 0) {
              this.form.receiver = conf.receiver[0]
              for (let i = 1; i < conf.receiver.length; i++) {
                this.form.receivers.push({ value: conf.receiver[i], key: i })
              }
            }
            if (conf.ccaddress.length > 0) {
              this.form.ccaddress = conf.ccaddress[0]
              for (let i = 1; i < conf.ccaddress.length; i++) {
                this.form.ccaddresses.push({ value: conf.ccaddress[i], key: i })
              }
            }
          }
        })
    },
    addReceiver() {
      this.form.receivers.push({
        value: '',
        key: Date.now()
      })
    },
    removeReceiver(item) {
      var index = this.form.receivers.indexOf(item)
      if (index !== -1) {
        this.form.receivers.splice(index, 1)
      }
    },
    addCcaddress() {
      this.form.ccaddresses.push({
        value: '',
        key: Date.now()
      })
    },
    removeCcaddress(item) {
      var index = this.form.ccaddresses.indexOf(item)
      if (index !== -1) {
        this.form.ccaddresses.splice(index, 1)
      }
    },
    handleParams() {
      const form = deepClone(this.form)
      const params = {
        username: form.username,
        password: form.password,
        serverip: form.serverip,
        sender: form.sender,
        receiver: [form.receiver],
        ccaddress: [form.ccaddress],
        serverport: form.serverport
      }
      form.receivers.forEach(item => {
        params.receiver.push(item.value)
      })
      form.ccaddresses.forEach(item => {
        params.ccaddress.push(item.value)
      })
      return params
    },
    submitForm(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.loading = true
          // 处理表单数据
          setEmailNotification(_this.handleParams())
            .then((resp) => {
              _this.loading = false
              if (resp.rc === 0) {
                _this.handleClose()
                _this.$message({ type: 'success', message: '编辑邮件信息成功' })
              } else {
                _this.$message({ type: 'error', message: '编辑邮件信息失败' })
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
