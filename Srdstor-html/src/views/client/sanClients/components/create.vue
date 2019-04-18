<template>
  <el-dialog v-el-drag-dialog :visible.sync="dialogVisible" :before-close="handleClose" title="创建客户端" width="600px">
    <el-tabs v-loading="loading" v-model="activeName">
      <el-tab-pane label="通用协议" name="1">
        <el-form ref="createSanClientForm" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name"/>
          </el-form-item>
          <el-form-item label="IP地址" prop="ip">
            <el-input v-model="form.ip"/>
          </el-form-item>
          <el-form-item label="系统类型">
            <el-select v-model="form.os_type">
              <el-option
                v-for="item in osType"
                :key="item"
                :label="item"
                :value="item">
                <span style="float: left">{{ item }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="协议">
            <el-tag type="info">{{ form.protocol_type[0] }}</el-tag>
          </el-form-item>
          <el-form-item label="描述">
            <el-input :rows="2" v-model="form.description" type="textarea" placeholder="请输入内容"/>
          </el-form-item>
        </el-form>
        <el-form ref="createiSCSITargetForm" :model="iSCSITargetForm" :rules="iSCSITargetRules" label-width="120px">
          <el-form-item label-width="80px">
            <el-switch v-model="isCreateiSCSITarget" active-text="默认创建iSCSI目标"/>
          </el-form-item>
          <el-form-item v-if="isCreateiSCSITarget" label="iSCSI目标IP" prop="ip">
            <el-select v-model="iSCSITargetForm.ip">
              <el-option v-for="item in targetIps" :key="item" :label="item" :value="item"/>
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="网络协议" name="2">
        <el-button
          icon="iconfont icon-create"
          type="primary"
          style="margin-bottom: 20px;"
          @click="visible.createiSCSIInitiatorDialog = true">
          创建iSCSI启动器
        </el-button>
        <div style="padding-bottom: 20px;">
          <el-tag type="danger">请选择未分配的iSCSI启动器!</el-tag>
        </div>
        <iscsi-client-initiator-table
          :table-data="tableData"
          :current-page="currentPage"
          :page-size="pageSize"
          @handleSelectionChange="handleSelectionChange"/>
        <iscsi-client-initiator-pagination
          :table-total="tableToal"
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="pageSizes"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"/>
      </el-tab-pane>
    </el-tabs>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm('createSanClientForm')">创 建</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </span>
    <create-iscsi-initiator
      :show-dialog="visible.createiSCSIInitiatorDialog"
      @updateData="getiSCSIClientInitiators({ pagesize: pageSize, currpage: currentPage })"
      @handleDialogVisible="visible.createiSCSIInitiatorDialog = false"/>
  </el-dialog>
</template>
<script>
import { deepClone } from '@/utils/index'
import { getIPs } from '@/api/SRDstor/systemManage'
import { createiSCSITarget } from '@/api/SRDstor/client/iSCSITarget'
import { createSanClient } from '@/api/SRDstor/client/sanClients'
import { getiSCSIClientInitiators } from '@/api/SRDstor/client/sanClients'
import IscsiClientInitiatorTable from '../iSCSIClientInitiators/components/table'
import IscsiClientInitiatorPagination from '@/components/Pagination/index'
import CreateIscsiInitiator from '../iSCSIClientInitiators/components/create'
export default {
  name: 'Create',
  components: {
    IscsiClientInitiatorTable,
    IscsiClientInitiatorPagination,
    CreateIscsiInitiator
  },
  props: {
    // 是否显示弹窗
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      osType: ['Windows', 'Linux', 'Unix', 'MacOS', 'Kylin'],
      form: {
        name: '',
        ip: '',
        os_type: 'Windows',
        protocol_type: ['iscsi'],
        description: '',
        iscsipolicy: {
          initiators: [] // {'iqn': '', hostIp: ''}
        }
      },
      iSCSITargetForm: {
        client_id: '',
        ip: []
      },
      targetIps: [],
      targetIp: '',
      iSCSITargetName: '',
      dialogVisible: this.showDialog, // 是否显示弹窗 {Boolean}
      rules: {
        name: [
          { required: true, message: '请输入客户端名称', trigger: 'blur' }
        ],
        ip: [
          { required: true, message: '请输入IP地址', trigger: 'blur' }
        ]
      }, // 表单验证
      iSCSITargetRules: {
        ip: [
          { required: true, message: '请输入IP地址', trigger: 'blur' }
        ]
      },
      loading: false, // 是否显示加载动画 {Boolean}
      activeName: '1',
      tableData: [],
      tableToal: 0,
      currentPage: 1,
      pageSize: 5,
      pageSizes: [5, 10, 15],
      currentRow: [],
      visible: {
        createiSCSIInitiatorDialog: false
      },
      isCreateiSCSITarget: false
    }
  },
  watch: {
    showDialog(val) {
      this.dialogVisible = val
      if (val) {
        this.activeName = '1'
        this.getiSCSIClientInitiators({ pagesize: this.pageSize, currpage: this.currentPage })
        this.getIPs()
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.getiSCSIClientInitiators({ pagesize: this.pageSize, currpage: this.currentPage })
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getiSCSIClientInitiators({ pagesize: this.pageSize, currpage: this.currentPage })
    },
    handleSelectionChange(selection) {
      if (selection !== null && !(selection.client_id)) {
        this.currentRow = [selection]
      } else {
        this.$message({ type: 'warning', message: '请选择未分配的iSCSI启动器' })
        this.currentRow = []
      }
    },
    /**
       * 关闭弹窗
       */
    handleClose() {
      this.$refs['createSanClientForm'].resetFields()
      this.$emit('handleDialogVisible', false)
    },
    handleParams() {
      const params = deepClone(this.form)
      this.currentRow.forEach(item => {
        params.iscsipolicy.initiators.push(item.name)
      })
      return params
    },
    /**
       * 提交编辑表单
       * @param formName
       */
    submitForm(formName) {
      const self = this
      if (this.currentRow.length === 0) {
        self.$message({ type: 'warning', message: '请选择网络协议中的未分配的iSCSI启动器' })
        return false
      }
      self.$refs[formName].validate((valid) => {
        if (valid) {
          self.loading = true
          // 处理表单数据
          createSanClient(self.handleParams())
            .then((resp) => {
              self.loading = false
              if (resp.rc === 0) {
                self.handleClose()
                self.$emit('updateData', true)
                self.$message({ type: 'success', message: '创建客户端成功' })
                self.iSCSITargetForm.client_id = resp.data
                if (self.isCreateiSCSITarget) {
                  self.createiSCSITarget()
                }
              } else {
                self.$message({ type: 'error', message: '创建客户端失败' })
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
    },
    getIPs() {
      getIPs()
        .then(resp => {
          if (resp.rc === 0) {
            this.targetIps = resp.data
            if (resp.data.length > 0) {
              this.iSCSITargetForm.ip = resp.data[0]
            }
          }
        })
    },
    getiSCSIClientInitiators(params) {
      getiSCSIClientInitiators(params).then(resp => {
        if (resp.rc === 0) {
          this.tableData = resp.data
          this.tableToal = resp.page_info.total_num
        }
      })
    },
    createiSCSITarget() {
      const _this = this
      _this.$refs['createiSCSITargetForm'].validate((valid) => {
        if (valid) {
          _this.loading = true
          // 处理表单数据
          const params = deepClone(this.iSCSITargetForm)
          createiSCSITarget(params)
            .then((resp) => {
              _this.loading = false
              if (resp.rc === 0) {
                _this.handleClose()
                _this.$emit('updateData', true)
                // _this.$message({ type: 'success', message: '创建iSCSI目标成功' })
              } else {
                // _this.$message({ type: 'error', message: '创建iSCSI目标失败' })
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

<style rel="stylesheet/scss" scoped lang="scss">
</style>
