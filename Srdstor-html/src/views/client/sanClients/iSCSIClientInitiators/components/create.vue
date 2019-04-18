<template>
  <el-dialog
    v-el-drag-dialog
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    append-to-body
    title="新增iSCSI启动器"
    width="700px">
    <el-form v-loading="loading" ref="createiSCSIInitiatorForm" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="服务器名称" style="display: inline-block;">
        <el-input v-model="form.iqn" style="width: 80px;" readonly/>
        <!--<strong>.</strong>-->
        <!--<el-input v-model="form.date" style="display: inline-block; width: 100px;"/>-->
        <!--<strong>.</strong>-->
        <!--<el-input v-model="form.domainName" style="display: inline-block; width: 80px;"/>-->
        <!--<strong>.</strong>-->
        <!--<el-input v-model="form.number" style="display: inline-block; width: 100px;"/>-->
        <!--<strong>:</strong>-->
        <!--<el-input v-model="form.commission" style="display: inline-block; width: 140px;"/>-->
      </el-form-item>
      <strong>.</strong>
      <el-form-item label-width="0" prop="date" style="display: inline-block;">
        <el-input v-model="form.date" style="width: 140px;"/>
      </el-form-item>
      <strong>.</strong>
      <el-form-item label-width="0" prop="domainName" style="display: inline-block;">
        <el-input v-model="form.domainName" style="width: 80px;"/>
      </el-form-item>
      <strong>.</strong>
      <el-form-item label-width="0" prop="number" style="display: inline-block;">
        <el-input v-model="form.number" style="width: 100px;"/>
      </el-form-item>
      <strong>.</strong>
      <el-form-item label-width="0" prop="commission" style="display: inline-block;">
        <el-input v-model="form.commission" style="width: 120px;"/>
      </el-form-item>
      <el-form-item label-width="0" style="text-align: right;margin-top: 20px;">
        <el-button type="primary" @click="submitForm('createiSCSIInitiatorForm')">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { deepClone } from '@/utils/index'
import { createiSCSIClientInitator } from '@/api/SRDstor/client/sanClients'
export default {
  name: 'Create',
  props: {
    // 是否显示弹窗
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    var validateDate = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入日期,例: \'2019-03\''))
      } else {
        if (!(/^(\d{4})(-)(\d{2})$/).test(value)) {
          callback(new Error('请输入日期,例: \'2019-03\''))
        }
        callback()
      }
    }
    var vaildateLettersAndNumbers = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入'))
      } else {
        if (!(/^[A-Za-z0-9-:]+$/).test(value)) {
          callback(new Error('请输入字母、数字、-或者:'))
        }
        callback()
      }
    }
    return {
      dialogVisible: this.showDialog, // 是否显示弹窗 {Boolean}
      loading: false,
      form: {
        iqn: 'iqn',
        date: '',
        domainName: '',
        number: '',
        commission: ''
      },
      rules: {
        date: [{
          required: true, message: "请输入日期,例: '2019-03'", trigger: 'blur'
        }, {
          validator: validateDate, trigger: 'blur'
        }],
        domainName: [{
          required: true, message: '请输入域名', trigger: 'blur'
        }, {
          validator: vaildateLettersAndNumbers, trigger: 'blur'
        }],
        number: [{
          required: true, message: '请输入设备名', trigger: 'blur'
        }, {
          validator: vaildateLettersAndNumbers, trigger: 'blur'
        }],
        commission: [{
          required: true, message: '请输入设备名', trigger: 'blur'
        }, {
          validator: vaildateLettersAndNumbers, trigger: 'blur'
        }]
      }
    }
  },
  watch: {
    showDialog(val) {
      this.dialogVisible = val
    }
  },
  methods: {
    handleClose() {
      this.$refs['createiSCSIInitiatorForm'].resetFields()
      this.$emit('handleDialogVisible', false)
    },
    submitForm(formName) {
      const self = this
      self.$refs[formName].validate((valid) => {
        if (valid) {
          self.loading = true
          // 处理表单数据
          const params = deepClone(self.form)
          const iqn = { name: '' }
          iqn.name = `${params.iqn}.${params.date}.${params.domainName}.${params.number}:${params.commission}`
          createiSCSIClientInitator(iqn)
            .then((resp) => {
              self.loading = false
              if (resp.rc === 0) {
                self.handleClose()
                self.$emit('updateData', true)
                self.$message({ type: 'success', message: '创建iSCSI启动器成功' })
              } else {
                self.$message({ type: 'error', message: '创建iSCSI启动器失败' })
              }
            }).catch(e => {
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
