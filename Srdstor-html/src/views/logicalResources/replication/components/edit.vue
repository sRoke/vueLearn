<template>
  <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" :before-close="handleClose" title="编辑复制" width="500px">
    <el-form v-loading="loading" ref="updateReplicationForm" :model="form" :rules="rules" label-width="100px">
      <el-form-item prop="periodprotect.period" label="间隔时间">
        <el-input-number v-model="form.periodprotect.period" :min="1" style="width: 158px;"/>
        <el-select v-model="periodUnit" style="width: 60px;">
          <el-option v-for="item in timeUnit" :key="item.value" :label="item.name" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label-width="0" style="text-align: right;">
        <el-button type="primary" @click="submitForm('updateReplicationForm')">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { deepClone } from '@/utils/index'
import { updateReplication } from '@/api/SRDstor/logicalResources/replication'
export default {
  name: 'Edit',
  props: {
    // 是否显示弹窗
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
      dialogVisible: this.showDialog, // 是否显示弹窗 {Boolean}
      loading: false, // 是否显示加载动画 {Boolean}
      periodUnit: 'h',
      timeUnit: [{
        name: '时',
        value: 'h'
      }, {
        name: '分',
        value: 'm'
      }, {
        name: '秒',
        value: 's'
      }],
      form: {
        name: '', // 逻辑卷
        localpoolname: '', // 本地存储池名
        remotepoolname: '', // 远端存储池名
        ip: '',
        username: '',
        password: '',
        onetime: false, // 是否开启定时复制
        base: false, // 是否复制增量快照
        periodprotect: {
          origin: '',
          period: '',
          lastsync: ''
        },
        cancel: false, // 是否取消定时复制 编辑时使用
        pause: false, // 是否暂停复制
        datasize: 0, // 总大小
        currentSend: 0, // 已经传输
        status: '',
        host: '' // 主机名
      },
      rules: {
        'periodprotect.period': [{
          required: true, message: '请选择间隔时间', trigger: 'blur'
        }]
      }
    }
  },
  watch: {
    showDialog(val) {
      this.dialogVisible = val
    },
    currentRow(val) {
      this.currentRow = val
      if (val !== null) {
        const form = deepClone(val)
        this.form = form
        this.periodUnit = this.form.periodprotect.period.replace(/[^a-zA-Z]/g, '')
        this.form.periodprotect.period = parseInt(this.form.periodprotect.period)
      }
    }
  },
  methods: {
    handleClose() {
      this.$refs['updateReplicationForm'].resetFields()
      this.$emit('handleDialogVisible', false)
    },
    submitForm(formName) {
      const _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.loading = true
          // 处理表单数据
          const params = deepClone(this.form)
          params.periodprotect.period = params.periodprotect.period + this.periodUnit
          updateReplication(params)
            .then((resp) => {
              _this.loading = false
              if (resp.rc === 0) {
                _this.handleClose()
                this.$emit('updateData', true)
                _this.$message({ type: 'success', message: '编辑复制作业成功' })
              } else {
                _this.$message({ type: 'error', message: '编辑复制作业失败' })
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
