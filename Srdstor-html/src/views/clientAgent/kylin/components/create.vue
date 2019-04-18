<template>
  <el-dialog
    v-el-drag-dialog
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    title="创建客户端管理"
    width="600px">
    <el-form v-loading="loading" ref="addDiskForm" :rules="rules" :model="form" label-width="100px">
      <el-form-item prop="name" label="客户端名称">
        <el-input v-model="form.name"/>
      </el-form-item>
      <el-form-item prop="ip" label="客户端IP">
        <el-input v-model="form.ip"/>
      </el-form-item>
      <el-form-item prop="userName" label="用户名称">
        <el-input v-model="form.userName"/>
      </el-form-item>
      <el-form-item prop="password" label="用户密码">
        <el-input v-model="form.password"/>
      </el-form-item>
      <el-form-item prop="protocol" label="协议">
        <el-select v-model="form.protocol">
          <el-option v-for="item in protocol_list" :key="item" :label="item" :value="item"/>
        </el-select>
      </el-form-item>
      <el-form-item label-width="0" style="text-align: right;">
        <el-button type="primary" @click.native="submitForm('addDiskForm')">创  建</el-button>
        <el-button @click="handleClose">取  消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { addAppSafe } from '@/api/SRDstor/clientAgent'
export default {
  name: 'CreateDisk',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: this.showDialog,
      loading: false,
      rules: {
        name: [{
          required: true, message: '请输入名称', trigger: 'blur'
        }],
        ip: [{
          required: true, message: '请输入客户端IP', trigger: 'change'
        }],
        userName: [{
          required: true, message: '请输入用户名称', trigger: 'change'
        }],
        password: [{
          required: true, message: '请输入用户密码', trigger: 'change'
        }],
        protocol: [{
          required: true, message: '请选择协议', trigger: 'change'
        }]
      },
      form: {
        name: '',
        ip: null,
        userName: null,
        password: null,
        protocol: 'iscsi'
      },
      protocol_list: [
        'iscsi'
      ]
    }
  },
  watch: {
    showDialog(val) {
      this.dialogVisible = val
    }
  },
  methods: {
    handleClose() {
      this.$refs['addDiskForm'].resetFields()
      this.$emit('handleDialogVisible', false)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          addAppSafe(
            {
              server: {
                ip: this.$store.getters.srdstorIp,
                protocol: this.form.protocol
              },
              protectedIp: this.form.ip,
              name: this.form.name,
              user: {
                name: this.form.userName,
                password: this.form.password
              }
            },
            `${this.form.ip}:8888`
          ).then(resp => {
            this.loading = false
            if (resp.retcode === 0) {
              this.$message({ type: 'success', message: '创建成功' })
              this.$emit('updateData', false)
              this.handleClose()
            }
          }).catch(() => {
            this.loading = false
            this.$message({ type: 'error', message: '创建失败' })
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
