<template>
  <el-dialog
    v-el-drag-dialog
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    width="500px"
    title="创建复制">
    <el-form v-loading="loading" ref="manageReplicationForm" :rules="rules" :model="form" label-width="100px">
      <el-form-item prop="ip" label="IP地址">
        <el-input v-model="form.ip"/>
      </el-form-item>
      <el-form-item prop="port" label="端口">
        <el-input-number v-model="form.port"/>
      </el-form-item>
      <el-form-item prop="username" label="账号">
        <el-input v-model="form.username"/>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input v-model="form.password" type="password" show-password/>
      </el-form-item>
      <el-form-item>
        <el-button
          :disabled="form.port === '' || form.ip === '' || form.username === '' || form.password === ''"
          type="primary"
          icon="el-icon-tickets"
          @click="getStoragePools">
          获取存储池
        </el-button>
      </el-form-item>
      <el-form-item prop="remotepoolname" label="存储池">
        <el-select v-model="form.remotepoolname">
          <el-option v-for="item in storagePoolList" :key="item.name" :label="item.altName" :value="item.name"/>
        </el-select>
      </el-form-item>
      <el-form-item label="定时复制">
        <el-switch v-model="form.onetime"/>
      </el-form-item>
      <el-form-item prop="periodprotect.origin" label="初始时间">
        <el-date-picker
          v-model="form.periodprotect.origin"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间"/>
      </el-form-item>
      <el-form-item prop="periodprotect.period" label="间隔时间">
        <el-input-number v-model="form.periodprotect.period" :min="1" style="width: 158px;"/>
        <el-select v-model="periodUnit" style="width: 60px;">
          <el-option v-for="item in timeUnit" :key="item.value" :label="item.name" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label-width="0" style="text-align: right;">
        <el-button type="primary" @click.native="submitForm('manageReplicationForm')">创  建</el-button>
        <el-button @click="handleClose">取  消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { deepClone } from '@/utils/index'
import { createReplication, getHostname } from '@/api/SRDstor/logicalResources/replication'
export default {
  name: 'Create',
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
      loading: false,
      dialogVisible: this.showDialog,
      selectedRow: this.currentRow,
      storagePoolList: [],
      sanResourceList: [],
      periodUnit: 'm',
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
        ip: '192.168.0.83',
        port: 8081,
        username: 'root',
        password: 'password',
        onetime: true, // 是否开启定时复制
        base: true, // true表示复制包含逻辑卷的基本快照， false表示复制增量快照
        periodprotect: {
          origin: '2006-01-02 15:04:05',
          period: 1,
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
        ip: [{
          required: true, message: '请输入IP地址', trigger: 'blur'
        }],
        port: [{
          required: true, message: '请输入端口', trigger: 'blur'
        }],
        username: [{
          required: true, message: '请输入用户名', trigger: 'blur'
        }],
        password: [{
          required: true, message: '请输入密码', trigger: 'blur'
        }],
        remotepoolname: [{
          required: true, message: '请选择存储池', trigger: 'change'
        }],
        'periodprotect.origin': [{
          required: true, message: '请选择初始时间', trigger: 'blur'
        }],
        'periodprotect.period': [{
          required: true, message: '请选择间隔时间', trigger: 'blur'
        }]
      }
    }
  },
  watch: {
    showDialog(val) {
      this.dialogVisible = val
      if (val) {
        this.getHostname()
      }
    },
    currentRow(val) {
      this.selectedRow = val
      if (val !== null) {
        this.form.name = this.selectedRow.name
        this.form.localpoolname = this.selectedRow.poolName
      }
    }
  },
  methods: {
    getHostname() {
      getHostname()
        .then(resp => {
          if (resp.rc === 0) {
            this.form.host = resp.host
          }
        })
    },
    getStoragePools() {
      const self = this
      self.storagePoolList = []
      const storagePoolNameMap = {}
      // 请求登录接口获取token
      const xhrLogin = new XMLHttpRequest()
      xhrLogin.open('post', `http://${self.form.ip}:${self.form.port}/SRDStor/user/auth/login`, true)
      xhrLogin.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; application/json')
      xhrLogin.send(JSON.stringify({ 'username': self.form.username, 'password': self.form.password, 'server': '' }))
      xhrLogin.onreadystatechange = function() {
        if (xhrLogin.readyState === 4 && xhrLogin.status === 200) {
          const responseTextLogin = JSON.parse(xhrLogin.responseText)

          //  获取存储池映射表
          const xhrStoragePoolMapTable = new XMLHttpRequest()
          xhrStoragePoolMapTable.open('GET', `http://${self.form.ip}:${self.form.port}/SRDStor/physicalresource/storagepool/getmap`, true)
          xhrStoragePoolMapTable.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; application/json')
          xhrStoragePoolMapTable.setRequestHeader('token', responseTextLogin.data.id)
          xhrStoragePoolMapTable.send(null)
          xhrStoragePoolMapTable.onreadystatechange = function() {
            if (xhrStoragePoolMapTable.readyState === 4 && xhrStoragePoolMapTable.status === 200) {
              const storagePoolMapTable = JSON.parse(xhrStoragePoolMapTable.responseText)
              if (Array.isArray(storagePoolMapTable.poolmap.orgname)) {
                storagePoolMapTable.poolmap.orgname.forEach((orgNameItem, index) => {
                  storagePoolNameMap[orgNameItem] = storagePoolMapTable.poolmap.altname[index]
                })
              }

              //  获取存储池列表
              const xhrGetStoragePools = new XMLHttpRequest()
              xhrGetStoragePools.open('GET', `http://${self.form.ip}:${self.form.port}/SRDStor/physicalresource/storagepool/list`, true)
              xhrGetStoragePools.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; application/json')
              xhrGetStoragePools.setRequestHeader('token', responseTextLogin.data.id)
              xhrGetStoragePools.send(null)
              xhrGetStoragePools.onreadystatechange = function() {
                if (xhrGetStoragePools.readyState === 4 && xhrGetStoragePools.status === 200) {
                  const responseTextStoragePools = JSON.parse(xhrGetStoragePools.responseText)
                  if (responseTextStoragePools.data.storagepools !== null) {
                    responseTextStoragePools.data.storagepools.forEach(item => {
                      item['altName'] = storagePoolNameMap[item.name] || item.name
                    })
                  }
                  self.storagePoolList = responseTextStoragePools.data.storagepools === null ? [] : responseTextStoragePools.data.storagepools
                  self.$message({ type: 'success', message: `获取${self.form.ip}:${self.form.port}服务的存储池成功` })
                } else if (xhrLogin.status !== 200) {
                  self.$message({ type: 'error', message: `获取${self.form.ip}:${self.form.port}服务的存储池失败` })
                }
              }
            } else {
              console.log('获取存储池映射表失败')
            }
          }

          //  获取逻辑卷列表
          const xhrGetSanResources = new XMLHttpRequest()
          xhrGetSanResources.open('GET', `http://${self.form.ip}:${self.form.port}/SRDStor/logicalresource/sanresource/list`, true)
          xhrGetSanResources.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; application/json')
          xhrGetSanResources.setRequestHeader('token', responseTextLogin.data.id)
          xhrGetSanResources.send(null)
          xhrGetSanResources.onreadystatechange = function() {
            if (xhrGetSanResources.readyState === 4 && xhrGetSanResources.status === 200) {
              const responseTextSanResources = JSON.parse(xhrGetSanResources.responseText)
              self.sanResourceList = responseTextSanResources.Data.virtualDevices === null ? [] : responseTextSanResources.Data.virtualDevices
            } else {
              console.log('获取逻辑卷失败')
            }
          }
        } else if (xhrLogin.status !== 200) {
          self.$message({ type: 'error', message: `请求${self.form.ip}:${self.form.port}服务失败` })
        }
      }
    },
    handleClose() {
      this.periodUnit = 'm'
      this.$refs['manageReplicationForm'].resetFields()
      this.$emit('handleDialogVisible', false)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          const params = deepClone(this.form)
          delete params.port
          params.periodprotect.period = params.periodprotect.period + this.periodUnit
          let flag = false
          this.sanResourceList.forEach(item => {
            if (item.poolName === params.localpoolname) {
              if (item.name === 'rep_' + params.host + '_' + params.name) {
                flag = true
              }
            }
          })
          params.base = !flag
          params.onetime = !params.onetime
          createReplication(params).then(resp => {
            this.loading = false
            if (resp.rc === 0) {
              this.$message({ type: 'success', message: '复制作业创建成功' })
              this.handleClose()
            } else {
              this.$message({ type: 'error', message: '复制作业创建失败' })
            }
          }).catch(() => {
            this.loading = false
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
