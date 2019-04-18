<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    :title="dialogTitle"
    width="500px">
    <el-tabs v-model="activeName">
      <el-tab-pane label="通用" name="1">
        <el-form v-loading="loading" ref="basicOptionsForm" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="脚本名称" prop="scriptName">
            <el-input v-model="form.scriptName"/>
          </el-form-item>
          <el-form-item label="主机" prop="clientId">
            <el-select v-model="form.clientId" style="display: block;" @change="handleClientChange">
              <el-option v-for="item in clients" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="磁盘" prop="sysDiskId">
            <el-select v-model="form.sysDiskId" style="display: block;" @change="setDiskUsedStatus">
              <el-option v-for="item in devices" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="数据磁盘">
            <el-select v-model="form.dataDiskId" multiple style="display: block;">
              <el-option v-for="item in devices" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled"/>
            </el-select>
          </el-form-item>
          <el-form-item label="系统类型" prop="systemType">
            <el-select v-model="form.systemType">
              <el-option v-for="item in systems" :key="item.value" :label="item.name" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="系统架构" prop="arch">
            <el-select v-model="form.arch">
              <el-option v-for="item in arch" :key="item.value" :label="item.name" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="系统位数" prop="bitmode">
            <el-select v-model="form.bitmode">
              <el-option v-for="item in bitmode" :key="item.value" :label="item.name" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="转换类型" prop="transferType">
            <el-select v-model="form.transferType">
              <el-option v-for="item in transferType" :key="item.value" :label="item.name" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="登录账号" prop="vmUsername">
            <el-input v-model="form.vmUsername"/>
          </el-form-item>
          <el-form-item label="登录密码" prop="vmPassword">
            <el-input v-model="form.vmPassword" type="password" show-password/>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="虚拟机配置" name="2">
        <el-form v-loading="loading" ref="VMConfigForm" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="虚拟机名称" prop="vmName">
            <el-input v-model="form.vmName"/>
          </el-form-item>
          <el-form-item label="CPU数" prop="cpus">
            <el-input-number v-model="form.cpus" :min="1"/>
          </el-form-item>
          <el-form-item label="内存" prop="ram">
            <el-input-number v-model="form.ram" :min="2"/>
          </el-form-item>
          <el-form-item label="内网IP" prop="vmIp">
            <el-input v-model="form.vmIp"/>
          </el-form-item>
          <el-form-item label="子网掩码" prop="vmNetmask">
            <el-input v-model="form.vmNetmask"/>
          </el-form-item>
          <el-form-item label="网关" prop="vmGateway">
            <el-input v-model="form.vmGateway"/>
          </el-form-item>
          <el-form-item label="grub文件路径">
            <el-input v-model="form.grubPath"/>
          </el-form-item>
          <el-form-item label="lvm文件路径">
            <el-input v-model="form.lvmPath"/>
          </el-form-item>
          <el-form-item label="fstab文件路径">
            <el-input v-model="form.fstabPath"/>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="自动化作业" name="3">
        <el-form v-loading="loading" ref="automaticScriptForm" :model="form" :rules="rules" label-width="180px">
          <el-form-item label="支持自动接管">
            <el-switch v-model="form.isAuto"/>
          </el-form-item>
          <el-form-item label="客户端IP" prop="clientIp">
            <el-input v-model="form.clientIp"/>
          </el-form-item>
          <el-form-item label="PING重试次数" prop="retryNumber">
            <el-input-number v-model="form.retryNumber" :max="5" :min="1"/>
          </el-form-item>
          <el-form-item label="正常间隔时间/分" prop="normalInterval">
            <el-input-number v-model="form.normalInterval" :max="59" :min="1"/>
          </el-form-item>
          <el-form-item label="PING失败后重试时间/秒" prop="failureInterval">
            <el-input-number v-model="form.failureInterval" :max="59" :min="1"/>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm('basicOptionsForm', 'VMConfigForm', 'automaticScriptForm')">确 定</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { validateIP } from '@/utils/validate'
import { deepClone } from '@/utils/index'
import { getSanClients, getSanClient } from '@/api/SRDstor/client/sanClients'
import { getSanResources } from '@/api/SRDstor/logicalResources/sanResources'
import { createScript, getScript, updateScript } from '@/api/SRDstor/autoRecover'
export default {
  name: 'Action',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    actionType: {
      type: Number,
      default: 1
    },
    currentRow: {
      type: Object,
      default: () => {
        return null
      }
    }
  },
  data() {
    var isValidateIP = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入IP地址'))
      } else if (!validateIP(value)) {
        callback(new Error('请输入正确的IP地址格式'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      dialogVisible: this.showDialog,
      dialogTitle: '创建脚本',
      activeName: '1',
      clients: [],
      devices: [],
      dataDiskList: [],
      systems: [{
        name: 'kylin',
        value: 'kylin'
      }],
      // systems: [{
      //   name: 'win2003',
      //   value: '2k3'
      // }, {
      //   name: 'win2008',
      //   value: '2k8'
      // }, {
      //   name: 'win2008R2',
      //   value: '2k8r2'
      // }, {
      //   name: 'win2012',
      //   value: '2k12'
      // }, {
      //   name: 'win2012R2',
      //   value: '2k12r2'
      // }, {
      //   name: 'win2016',
      //   value: '2k16'
      // }, {
      //   name: 'windows7',
      //   value: 'w7'
      // }, {
      //   name: 'win8',
      //   value: 'w8'
      // }, {
      //   name: 'win8.1',
      //   value: 'w8.1'
      // }, {
      //   name: 'win10',
      //   value: 'w10'
      // }, {
      //   name: 'winxp',
      //   value: 'xp'
      // }, {
      //   name: 'linux',
      //   value: 'linux'
      // }, {
      //   name: 'kylin',
      //   value: 'kylin'
      // }],
      // arch: [{
      //   name: 'X86_64',
      //   value: '0'
      // }, {
      //   name: 'ARM64',
      //   value: '1'
      // }],
      arch: [{
        name: 'ARM64',
        value: '1'
      }],
      // bitmode: [{
      //   name: '32bit',
      //   value: '0'
      // }, {
      //   name: '64bit',
      //   value: '1'
      // }],
      bitmode: [{
        name: '64bit',
        value: '1'
      }],
      transferType: [{
        name: 'p2v',
        value: 0
      }],
      // transferType: [{
      //   name: 'p2v',
      //   value: 0
      // }, {
      //   name: 'v2v',
      //   value: 1
      // }, {
      //   name: 'v2p',
      //   value: 2
      // }, {
      //   name: 'p2p',
      //   value: 3
      // }],
      sanResources: {},
      form: {
        scriptName: 'Auto-Recover-Script-',
        clientId: '',
        sysDiskId: '',
        dataDiskId: [],
        systemType: 'kylin',
        bitmode: '1',
        arch: '1',
        transferType: 0,
        vmUsername: 'root',
        vmPassword: 'password',
        vmName: 'Auto-Recover-Script-VM-',
        cpus: 4,
        ram: 4096,
        vmIp: '192.168.0.',
        vmNetmask: '255.255.255.0',
        vmGateway: '192.168.0.1',
        grubPath: '',
        lvmPath: '',
        fstabPath: '',
        isAuto: false,
        clientIp: '192.168.0.123',
        retryNumber: 3,
        normalInterval: 1,
        failureInterval: 1
      },
      rules: {
        scriptName: [{
          required: true, message: '请输入脚本名称', trigger: 'blur'
        }],
        clientId: [{
          required: true, message: '请选择主机', trigger: 'change'
        }],
        sysDiskId: [{
          required: true, message: '请选择设备', trigger: 'change'
        }],
        systemType: [{
          required: true, message: '请选择系统类型', trigger: 'change'
        }],
        arch: [{
          required: true, message: '请选择系统架构', trigger: 'change'
        }],
        bitmode: [{
          required: true, message: '请选择系统位数', trigger: 'change'
        }],
        transferType: [{
          required: true, message: '请选择转换类型', trigger: 'change'
        }],
        vmUsername: [{
          required: true, message: '请输入登录账号', trigger: 'blur'
        }],
        vmPassword: [{
          required: true, message: '请输入登录密码', trigger: 'blur'
        }],
        vmName: [{
          required: true, message: '请输入虚拟机名称', trigger: 'blur'
        }],
        cpus: [{
          required: true, message: '请输入CPU数量', trigger: 'blur'
        }],
        ram: [{
          required: true, message: '请输入内存', trigger: 'blur'
        }],
        vmIp: [{
          required: true, message: '请输入IP地址', trigger: 'blur'
        }, {
          validator: isValidateIP, trigger: 'blur'
        }],
        vmNetmask: [{
          required: true, message: '请输入子网掩码', trigger: 'blur'
        }, {
          validator: isValidateIP, trigger: 'blur'
        }],
        vmGateway: [{
          required: true, message: '请输入网关', trigger: 'blur'
        }, {
          validator: isValidateIP, trigger: 'blur'
        }],
        grubPath: [{
          required: true, message: '请输入grub文件路径', trigger: 'blur'
        }],
        lvmPath: [{
          required: true, message: '请输入lvm文件路径', trigger: 'blur'
        }],
        fstabPath: [{
          required: true, message: '请输入fstab文件路径', trigger: 'blur'
        }],
        clientIp: [{
          required: true, message: '请输入客户端IP', trigger: 'blur'
        }, {
          validator: isValidateIP, trigger: 'blur'
        }],
        retryNumber: [{
          required: true, message: '请输入PING重试次数', trigger: 'blur'
        }],
        normalInterval: [{
          required: true, message: '请输入正常间隔时间', trigger: 'blur'
        }],
        failureInterval: [{
          required: true, message: '请输入PING失败后重试时间', trigger: 'blur'
        }]
      }
    }
  },
  watch: {
    actionType(val) {
      this.actionType = val
    },
    currentRow(val) {
      this.currentRow = val
    },
    showDialog(val) {
      const self = this
      this.dialogVisible = val
      if (val) {
        // this.getSanResources()
        // this.getSanResourcesAndDisk()
        this.getSanClients()
        if (this.actionType === 2) {
          this.dialogTitle = '编辑脚本'
          // TODO
          getScript(this.currentRow.id)
            .then(resp => {
              if (Number(resp.rc) === 0) {
                const form = deepClone(resp.data)
                const dataDiskList = []
                if (JSON.stringify(form.dataDiskList) !== '{}') {
                  form.dataDiskList.forEach(item => {
                    dataDiskList.push(item.dataDiskId)
                  })
                }
                this.form = {
                  scriptName: form.scriptName,
                  clientId: form.clientId,
                  sysDiskId: form.sysDiskId,
                  dataDiskId: dataDiskList,
                  systemType: form.systemType.toString(),
                  bitmode: form.bitmode.toString(),
                  arch: form.arch.toString(),
                  transferType: form.transferType,
                  vmUsername: form.vmUsername,
                  vmPassword: form.vmPassword,
                  vmName: form.vmName,
                  cpus: form.cpus,
                  ram: form.ram,
                  vmIp: form.vmIp,
                  vmNetmask: form.vmNetmask,
                  vmGateway: form.vmGateway,
                  grubPath: typeof form.grubPath === 'object' ? '' : form.grubPath,
                  lvmPath: typeof form.lvmPath === 'object' ? '' : form.lvmPath,
                  fstabPath: typeof form.fstabPath === 'object' ? '' : form.fstabPath,
                  isAuto: form.isAuto,
                  clientIp: form.clientIp,
                  retryNumber: form.retryNumber,
                  normalInterval: form.normalInterval / 60000,
                  failureInterval: form.failureInterval / 1000
                }
                // self.devices = []
                // getSanClient(form.clientId)
                //   .then(resp => {
                //     if (resp.rc === 0) {
                //       resp.data.iscsitargets.forEach(targetItem => {
                //         targetItem.iscsidevices.forEach(deviceItem => {
                //           self.devices.push({ id: deviceItem.id, name: self.sanResources[deviceItem.id] })
                //         })
                //       })
                //     }
                //   })
                self.getSanResourcesAndDisk(form.clientId, self.actionType)
              }
            })
        } else {
          this.dialogTitle = '创建脚本'
          this.getSanResourcesAndDisk()
        }
      }
    }
  },
  methods: {
    handleClose() {
      this.devices = []
      this.clients = []
      this.activeName = '1'
      this.form.isAuto = false
      this.form.dataDiskId = []
      this.form.grubPath = ''
      this.form.lvmPath = ''
      this.form.fstabPath = ''
      this.$refs['basicOptionsForm'].resetFields()
      this.$refs['VMConfigForm'].resetFields()
      this.$refs['automaticScriptForm'].resetFields()
      this.$emit('handleDialogVisible', false)
    },
    getSanClients() {
      const self = this
      getSanClients()
        .then(resp => {
          if (resp.rc === 0) {
            self.clients = resp.data
          }
        })
    },
    handleClientChange(val) {
      this.devices = []
      this.form.sysDiskId = ''
      this.form.dataDiskId = []
      this.clients.forEach(item => {
        if (Number(item.id) === Number(val)) {
          this.form.clientIp = item.ip
        }
      })
      this.getDisk(val)
    },
    getDisk(val, type) {
      const self = this
      // self.devices = []
      getSanClient(val)
        .then(resp => {
          self.loading = false
          if (resp.rc === 0) {
            // self.form.sysDiskId = ''
            // self.form.dataDiskId = []
            resp.data.iscsitargets.forEach(targetItem => {
              targetItem.iscsidevices.forEach(deviceItem => {
                self.devices.push({ id: deviceItem.id, name: self.sanResources[deviceItem.id] })
              })
            })
            if (type === 2) {
              for (const i in self.devices) {
                if (self.devices[i].id === self.form.sysDiskId) {
                  self.devices[i].disabled = true
                } else {
                  self.devices[i].disabled = false
                }
              }
            }
          }
        })
        .catch(() => {
          self.loading = false
        })
    },
    getSanResourcesAndDisk(val, type) {
      const self = this
      self.sanResources = {}
      self.loading = true
      getSanResources()
        .then(resp => {
          if (resp.rc === 0) {
            const sanResourceList = resp.Data.virtualDevices === null ? [] : resp.Data.virtualDevices
            sanResourceList.forEach(item => {
              self.sanResources[item.guid] = item.name
            })
            if (typeof val === 'number') {
              self.getDisk(val, type)
            } else {
              self.loading = false
            }
          }
        })
        .catch(() => {
          self.loading = false
        })
    },
    setDiskUsedStatus(val) {
      const self = this
      for (const i in self.devices) {
        if (self.devices[i].id === val) {
          self.devices[i].disabled = true
        } else {
          self.devices[i].disabled = false
        }
      }
      self.form.dataDiskId.forEach((item, index) => {
        if (item === val) {
          self.form.dataDiskId.splice(index, 1)
        }
      })
    },
    organizeForm() {
      const params = deepClone(this.form)
      params.dataDiskList = []
      params.dataDiskId.forEach(item => {
        params.dataDiskList.push({
          dataDiskId: item
        })
      })
      delete params.dataDiskId
      params.failureInterval = params.failureInterval * 1000
      params.normalInterval = params.normalInterval * 60000
      return params
    },
    submitForm(formName1, formName2, formName3) {
      let formName1Valid = false
      let formName2Valid = false
      let formName3Valid = false
      this.$refs[formName1].validate((valid) => {
        formName1Valid = valid
      })
      this.$refs[formName2].validate((valid) => {
        formName2Valid = valid
      })
      this.$refs[formName3].validate((valid) => {
        formName3Valid = valid
      })
      if (formName1Valid && formName2Valid && formName3Valid) {
        this.loading = true
        if (this.actionType === 1) {
          createScript(this.organizeForm()).then(resp => {
            this.loading = false
            if (Number(resp.rc) === 0) {
              this.$message({ type: 'success', message: '创建脚本成功' })
              this.$emit('updateData', false)
              this.handleClose()
            }
          }).catch(() => {
            this.loading = false
          })
        } else {
          updateScript(this.currentRow.id, this.organizeForm()).then(resp => {
            this.loading = false
            if (Number(resp.rc) === 0) {
              this.$message({ type: 'success', message: '编辑脚本成功' })
              this.$emit('updateData', false)
              this.handleClose()
            }
          }).catch(() => {
            this.loading = false
          })
        }
      } else {
        console.log('error submit!!')
        return false
      }
    }
  }
}
</script>

<style scoped>

</style>
