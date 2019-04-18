<template>
  <main class = "l-san-client-container">
    <section class="l-san-client-container__header">
      <el-button icon="iconfont icon-create" size="small" type="primary" @click="visible.createSanClientDialog = true">创建
      </el-button>
      <el-button icon="iconfont icon-edit" plain size="small" @click="handleEditSanClientDialogVisible">
        编辑
      </el-button>
      <el-button icon="iconfont icon-info" plain size="small" @click="handleSanClientStatisticsDialogVisible">
        详情
      </el-button>
      <el-button icon="iconfont icon-del" plain size="small" @click="deleteSanClient">
        删除
      </el-button>
      <el-button icon="iconfont icon-assign" plain size="small" @click="handleAssignSanClientDialogVisible">
        分配
      </el-button>
      <el-button icon="iconfont icon-unassign" plain size="small" @click="handleUnassignSanClientDialogVisible">
        取消分配
      </el-button>
      <el-button icon="iconfont icon-iscsitargetlist" plain size="small" @click="handleiSCSITargetsDialogVisible">
        iSCSI目标列表
      </el-button>
      <el-button icon="iconfont icon-create" plain size="small" @click="handleCreateiSCSITargetDialogVisible">
        创建iSCSI目标
      </el-button>
      <el-button icon="iconfont icon-refresh" plain size="small" @click="getSanClients">
        刷新
      </el-button>
    </section>
    <san-client-table
      :table-data = "tableData"
      :current-page = "currentPage"
      :page-size = "pageSize"
      @handleSelectionChange="handleSelectionChange"/>
    <san-client-pagination
      :table-total = "tableData.length"
      :current-page = "currentPage"
      :page-size = "pageSize"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"/>
    <create-san-client
      :show-dialog="visible.createSanClientDialog"
      @handleDialogVisible="visible.createSanClientDialog = false"
      @updateData="getSanClients"/>
    <edit-san-client
      :current-row="currentRow"
      :show-dialog="visible.editSanClientDialog"
      @handleDialogVisible="visible.editSanClientDialog = false"
      @updateData="getSanClients"/>
    <san-client-statistics
      :current-row="currentRow"
      :show-dialog="visible.sanClientStatisticsDialog"
      @handleDialogVisible="visible.sanClientStatisticsDialog = false"/>
    <assign-san-client
      :current-row="currentRow"
      :show-dialog="visible.assignSanClientDialog"
      @handleDialogVisible="visible.assignSanClientDialog = false"
      @updateData="getSanClients"/>
    <unassign-san-client
      :current-row="currentRow"
      :show-dialog="visible.unassignSanClientDialog"
      @handleDialogVisible="visible.unassignSanClientDialog = false"
      @updateData="getSanClients"/>
    <iscsi-target-list
      :current-row="currentRow"
      :show-dialog="visible.iSCSITargetsDialog"
      @handleDialogVisible="visible.iSCSITargetsDialog = false"
      @updateData="getSanClients"/>
    <create-iscsi-target
      :current-row="currentRow"
      :show-dialog="visible.createiSCSITargetDialog"
      @handleDialogVisible="visible.createiSCSITargetDialog = false"
      @updateData="getSanClients"/>
  </main>
</template>

<script>
import { queryStatusOfClientUsedByAutoRecover } from '@/api/SRDstor/autoRecover'
import { getSanClients, deleteSanClient } from '@/api/SRDstor/client/sanClients'
import SanClientTable from './components/table'
import SanClientPagination from '@/components/Pagination/index'
import CreateSanClient from './components/create'
import EditSanClient from './components/edit'
import SanClientStatistics from './components/statistics'
import AssignSanClient from './components/assign'
import UnassignSanClient from './components/unassign'
import IscsiTargetList from '../iSCSITarget/list'
import CreateIscsiTarget from '../iSCSITarget/components/create'
export default {
  name: 'Index',
  components: {
    SanClientTable,
    SanClientPagination,
    CreateSanClient,
    EditSanClient,
    SanClientStatistics,
    AssignSanClient,
    UnassignSanClient,
    IscsiTargetList,
    CreateIscsiTarget
  },
  data() {
    return {
      tableData: [], // 表格信息 { Array }
      currentPage: 1, // 当前页码 { Number }
      pageSize: 10, // 当前页面尺寸 { Number }
      listLoading: true, // 加载状态 { Boolean }
      currentRow: null, // 所选中表格信息 { Array }
      visible: {
        createSanClientDialog: false,
        editSanClientDialog: false,
        sanClientStatisticsDialog: false,
        assignSanClientDialog: false,
        unassignSanClientDialog: false,
        iSCSITargetsDialog: false,
        createiSCSITargetDialog: false
      }
    }
  },
  watch: {
    tableData: {
      handler: function(val, oldVal) {
        const _this = this
        _this.tableData = val
      },
      deep: true
    }
  },
  created() {
    this.getSanClients()
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.getSanClients()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getSanClients()
    },
    getSanClients() {
      getSanClients({ pagesize: this.pageSize, currpage: this.currentPage }).then(resp => {
        if (resp.rc === 0) {
          this.tableData = resp.data
          this.tableData.forEach((item, index) => {
            queryStatusOfClientUsedByAutoRecover(item.id)
              .then(resp => {
                if (Number(resp.rc) === 0) {
                  item.assign = resp.data.assign
                  item.scriptNameList = resp.data.scriptNameList
                }
                this.$set(this.tableData, index, item)
              })
          })
        }
      })
    },
    handleSelectionChange(selection) {
      this.currentRow = selection
    },
    queryCurrentRow() {
      if (this.currentRow === null) {
        this.$message({ type: 'warning', message: '请选择客户端' })
        return false
      }
      return true
    },
    handleEditSanClientDialogVisible() {
      if (!this.queryCurrentRow()) {
        return false
      }
      this.visible.editSanClientDialog = true
    },
    handleSanClientStatisticsDialogVisible() {
      if (!this.queryCurrentRow()) {
        return false
      }
      this.visible.sanClientStatisticsDialog = true
    },
    formatMessageBox(action, type, id, params, name, request) {
      const h = this.$createElement
      this.$msgbox({
        title: `${action}${type}`,
        message: h('p', null, [
          h('span', null, `确定${action}${type}`),
          h('i', { style: 'color: red' }, name),
          h('span', null, `?`)
        ]),
        showCancelButton: true,
        cancelButtonClass: 'btn-custom-cancel',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            request(id, params).then(resp => {
              instance.confirmButtonLoading = false
              instance.confirmButtonText = '确定'
              if (resp.rc === 0) {
                done()
                this.getSanClients()
                this.currentRow = null
              } else {
                this.$message({ type: 'error', message: `${type}${action}失败` })
              }
            }).catch(e => {
              instance.confirmButtonLoading = false
              instance.confirmButtonText = '确定'
            })
          } else {
            done()
          }
        }
      }).then(() => {
        this.$message({
          type: 'success',
          message: `${type}${action}成功`
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: `已取消${action}操作`
        })
      })
    },
    deleteSanClient() {
      if (!this.queryCurrentRow()) {
        return false
      }
      if (this.currentRow.assign) {
        this.$message({ type: 'error', message: `当前客户端正在被一键恢复脚本${this.currentRow.scriptNameList}使用, 请先删除对应脚本` })
        return false
      }
      this.formatMessageBox('删除', '客户端', this.currentRow.id, {}, this.currentRow.name, deleteSanClient)
    },
    handleAssignSanClientDialogVisible() {
      if (!this.queryCurrentRow()) {
        return false
      }
      this.visible.assignSanClientDialog = true
    },
    handleUnassignSanClientDialogVisible() {
      if (!this.queryCurrentRow()) {
        return false
      }
      this.visible.unassignSanClientDialog = true
    },
    handleiSCSITargetsDialogVisible() {
      if (!this.queryCurrentRow()) {
        return false
      }
      this.visible.iSCSITargetsDialog = true
    },
    handleCreateiSCSITargetDialogVisible() {
      if (!this.queryCurrentRow()) {
        return false
      }
      this.visible.createiSCSITargetDialog = true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .l-san-client-container {
    background: #fff;
    margin: 20px;
    padding: 20px;
    &__header {
      padding-bottom: 20px;
      /*.el-button--primary.is-plain {*/
        /*color: #767676;*/
        /*background: #fff;*/
        /*border-color: #d0d0d0;*/
        /*height: 36px;*/
      /*}*/
    }
  }
</style>
