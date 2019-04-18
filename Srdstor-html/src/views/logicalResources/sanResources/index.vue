<template>
  <main class = "l-san-resource-container">
    <section class = "l-san-resource-container__header">
      <el-button icon="iconfont icon-create" size="small" type="primary" @click="handleCreateSanResourceDialogVisible(true)">
        创建
      </el-button>
      <el-button icon="iconfont icon-edit" plain size="small" @click="handleEditSanResourceDialogVisible(true)">
        编辑
      </el-button>
      <el-button icon="iconfont icon-del" plain size="small" @click="deleteSanResource">
        删除
      </el-button>
      <el-button icon="iconfont icon-info" plain size="small" @click="handleSanResourceInfoDialogVisible(true)">
        详情
      </el-button>
      <el-button icon="iconfont icon-refresh" plain size="small" @click="updateData">
        刷新
      </el-button>
      <el-dropdown
        v-show="currentRow !== null && currentRow.type === 2"
        style="padding-left: 10px;"
        size="medium"
        trigger="click"
        @command="handleCommandSnapshot">
        <el-button icon="iconfont icon-timeview" plain size="small">
          快照视图<i class="el-icon-arrow-down el-icon-right"/>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="edit">
            <span style="display: inline-block; width: 100%;">编辑快照视图</span>
          </el-dropdown-item>
          <el-dropdown-item command="view">
            <span style="display: inline-block; width: 100%;">查看快照视图</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown
        v-show="currentRow !== null && currentRow.type === 1"
        style="padding-left: 10px;"
        size="medium"
        trigger="click"
        @command="handleCommandSnapshots">
        <el-button icon="iconfont icon-snapshot" plain size="small">
          快照<i class="el-icon-arrow-down el-icon-right"/>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="create">
            <span>创建快照</span>
          </el-dropdown-item>
          <el-dropdown-item command="list">
            <span>快照列表</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown
        v-show="currentRow !== null && currentRow.type === 1"
        style="padding-left: 10px; padding-right: 10px;"
        size="medium"
        trigger="click"
        @command="handleCommandSnapshotStrategy">
        <el-button icon="iconfont icon-snapshotstrategy" plain size="small">
          快照策略<i class="el-icon-arrow-down el-icon-right"/>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="create">
            <span>创建</span>
          </el-dropdown-item>
          <el-dropdown-item command="edit">
            <span>编辑</span>
          </el-dropdown-item>
          <el-dropdown-item command="details">
            <span>详情</span>
          </el-dropdown-item>
          <el-dropdown-item command="delete">
            <span>删除</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button
        v-show="currentRow !== null && currentRow.type === 1 && currentRow.cdp === 'off'"
        icon="iconfont icon-create"
        plain
        size="small"
        @click="handleCreateCDPJournalDialogVisible(1)">
        创建CDP
      </el-button>
      <el-dropdown
        v-show="currentRow !== null && currentRow.type === 1 && currentRow.cdp !== 'off'"
        size="medium"
        trigger="click"
        @command="handleCommandCDP">
        <el-button icon="iconfont icon-migration" plain size="small">
          CDP<i class="el-icon-arrow-down el-icon-right"/>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <!--<el-dropdown-item>-->
          <!--<span style="display: inline-block; width: 100%;" @click="handleCreateCDPJournalDialogVisible(1)">创建</span>-->
          <!--</el-dropdown-item>-->
          <el-dropdown-item command="stop">
            <span style="display: inline-block; width: 100%;">暂停</span>
          </el-dropdown-item>
          <el-dropdown-item v-show="currentRow !== null && currentRow.type === 1 && currentRow.cdp === 'suspen'" command="resume">
            <span style="display: inline-block; width: 100%;">恢复</span>
          </el-dropdown-item>
          <el-dropdown-item command="delete">
            <span style="display: inline-block; width: 100%;">移除</span>
          </el-dropdown-item>
          <el-dropdown-item command="retrieve">
            <span style="display: inline-block; width: 100%;">触发提取</span>
          </el-dropdown-item>
          <el-dropdown-item command="tagList">
            <span>标记列表</span>
          </el-dropdown-item>
          <el-dropdown-item command="view">
            <span>查看策略</span>
          </el-dropdown-item>
          <el-dropdown-item command="update">
            <span>更新策略</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button
        v-show="currentRow !== null && currentRow.type === 1"
        style="margin-left: 10px;"
        icon="iconfont icon-create"
        plain
        size="small"
        @click="handleManageReplicationDialogVisible()">
        创建复制
      </el-button>
    </section>
    <san-resource-table
      v-loading="loading"
      :table-data = "tableData"
      :current-page = "currentPage"
      :page-size = "pageSize"
      @handleSelectionChange="handleSelectionChange"/>
    <san-resource-pagination
      :table-total = "tableData.length"
      :current-page = "currentPage"
      :page-size = "pageSize"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"/>
    <create-san-resource
      :show-dialog="visible.createSanResourceDialog"
      @updateData="updateData"
      @handleDialogVisible="handleCreateSanResourceDialogVisible"/>
    <edit-san-resource
      :show-dialog="visible.editSanResourceDialog"
      :current-row="currentRow"
      @handleDialogVisible="visible.editSanResourceDialog = false"
      @updateData="updateData"/>
    <san-resource-info
      :show-dialog="visible.sanResourceInfoDialog"
      :current-row="currentRow"
      @handleDialogVisible="visible.sanResourceInfoDialog = false"/>
    <create-snapshot
      :show-dialog="visible.createSnapshotDialog"
      :current-row="currentRow"
      @handleDialogVisible="visible.createSnapshotDialog = false"/>
    <snapshot-list
      :show-dialog="visible.snapshotListDialog"
      :current-row="currentRow"
      @handleDialogVisible="visible.snapshotListDialog = false"/>
    <create-snapshot-policy
      :show-dialog="visible.createSnapshotPolicyDialog"
      :current-row="currentRow"
      :action-type="snapshotPolicyActionType"
      :snapshot-policy-info="snapshotPolicyInfo"
      @handleDialogVisible="visible.createSnapshotPolicyDialog = false"/>
    <snapshot-policy-info
      :show-dialog="visible.snapshotPolicyInfoDialog"
      :current-row="currentRow"
      :info="snapshotPolicyInfo"
      @handleDialogVisible="visible.snapshotPolicyInfoDialog = false"/>
    <create-cdp-journal
      :show-dialog="visible.createCDPJournalDialog"
      :current-row="currentRow"
      :action-type="manageCDPJournalType"
      @handleDialogVisible="visible.createCDPJournalDialog = false"
      @updateData="updateData"/>
    <cdp-journal-properties
      :show-dialog="visible.CDPJournalPropertiesDialog"
      :current-row="currentRow"
      @handleDialogVisible="visible.CDPJournalPropertiesDialog = false"/>
    <tag-list
      :show-dialog="visible.tagListDialog"
      :current-row="currentRow"
      @handleDialogVisible="visible.tagListDialog = false"/>
    <retrieve-cdp-journal
      :show-dialog="visible.retrieveCDPJournalDialog"
      :current-row="currentRow"
      @handleDialogVisible="visible.retrieveCDPJournalDialog = false"/>
    <edit-time-view
      :show-dialog="visible.editTimeViewDialog"
      :current-row="currentRow"
      @updateData="updateData"
      @handleDialogVisible="visible.editTimeViewDialog = false"/>
    <time-view-statistics
      :show-dialog="visible.timeViewStatisticsDialog"
      :current-row="currentRow"
      @handleDialogVisible="visible.timeViewStatisticsDialog = false"/>
    <create-replication
      :show-dialog="visible.manageReplicationDialog"
      :current-row="currentRow"
      @handleDialogVisible="visible.manageReplicationDialog = false"/>
  </main>
</template>

<script>
import { getTimeViews } from '@/api/SRDstor/logicalResources/timeView'
import { getSanResources, deleteSanResource } from '@/api/SRDstor/logicalResources/sanResources'
import { deleteSnapshotPolicy, getSnapshotPolicy } from '@/api/SRDstor/logicalResources/snapshotPolicy'
import { deleteCDPJournal, suspendCDPJournal, resumeCDPJournal } from '@/api/SRDstor/logicalResources/CDPJournal'
import { queryTimeViewUsedStatus } from '@/api/SRDstor/autoRecover'
import SanResourcePagination from '@/components/Pagination/index'
import SanResourceTable from './components/table'
import CreateSanResource from './components/create'
import EditSanResource from './components/edit'
import SanResourceInfo from './components/info'
import CreateSnapshot from '../snapshot/components/create'
import SnapshotList from '../snapshot/list'
import CreateSnapshotPolicy from '../snapshotPolicy/components/action'
import SnapshotPolicyInfo from '../snapshotPolicy/components/info'
import CreateCdpJournal from '../CDPJournal/components/action'
import CdpJournalProperties from '../CDPJournal/components/statistics'
import RetrieveCdpJournal from '../CDPJournal/components/retrieve'
import TagList from '../CDPJournal/tag/list'
import EditTimeView from '../timeView/components/edit'
import TimeViewStatistics from '../timeView/components/info'
import CreateReplication from '../replication/components/create'
export default {
  name: 'Index',
  components: {
    SanResourceTable,
    SanResourcePagination,
    CreateSanResource,
    SanResourceInfo,
    CreateSnapshot,
    SnapshotList,
    CreateSnapshotPolicy,
    SnapshotPolicyInfo,
    EditSanResource,
    CreateCdpJournal,
    CdpJournalProperties,
    TagList,
    RetrieveCdpJournal,
    EditTimeView,
    TimeViewStatistics,
    CreateReplication
  },
  data() {
    return {
      tableData: [], // 表格信息 { Array }
      currentPage: 1, // 当前页码 { Number }
      pageSize: 10, // 当前页面尺寸 { Number }
      loading: true, // 加载状态 { Boolean }
      currentRow: null, // 所选中表格信息 { Object }
      visible: {
        createSanResourceDialog: false,
        sanResourceInfoDialog: false,
        createSnapshotDialog: false,
        snapshotListDialog: false,
        timeViewListDialog: false,
        createSnapshotPolicyDialog: false,
        snapshotPolicyInfoDialog: false,
        editSanResourceDialog: false,
        createCDPJournalDialog: false,
        CDPJournalPropertiesDialog: false,
        tagListDialog: false,
        retrieveCDPJournalDialog: false,
        editTimeViewDialog: false,
        timeViewStatisticsDialog: false,
        manageReplicationDialog: false
      },
      manageCDPJournalType: 1,
      snapshotPolicyInfo: {
        poolName: '',
        virDevName: '',
        initTime: '',
        interval: 0,
        snapshotMaxNum: 0
      },
      snapshotPolicyActionType: 1
    }
  },
  created() {
    this.updateData()
    this.$store.dispatch('GetStoragePoolMapTable')
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    updateData() {
      this.tableData = []
      this.currentPage = 1
      this.pageSize = 10
      this.getSanResourcesAndTimeViews()
    },
    getSanResourcesAndTimeViews() {
      const self = this
      self.loading = true
      getSanResources()
        .then(resp => {
          if (resp.rc === 0) {
            const sanResourceList = resp.Data.virtualDevices === null ? [] : resp.Data.virtualDevices
            sanResourceList.forEach(item => {
              item.type = 1
              self.tableData.push(item)
            })
            self.getTimeViews()
          } else {
            self.loading = false
          }
        })
        .catch(() => {
          self.loading = false
        })
    },
    getTimeViews() {
      const self = this
      getTimeViews()
        .then(resp => {
          self.loading = false
          if (resp.rc === 0) {
            const timeViews = resp.data === null ? [] : resp.data
            timeViews.forEach(item => {
              item.type = 2
              self.tableData.push(item)
            })
            self.tableData.forEach(item => {
              if (item.type === 2) {
                queryTimeViewUsedStatus(item.guid)
                  .then(resp => {
                    if (Number(resp.rc) === 0) {
                      item.assign = resp.data.assign
                      item.scriptName = resp.data.scriptName
                    }
                  })
              }
            })
          }
        })
        .catch(() => {
          self.loading = false
        })
    },
    handleSelectionChange(selection) {
      this.currentRow = selection.row
      if (selection.action === 1) {
        this.handleSanpshotListDialogVisible()
      } else if (selection.action === 2) {
        this.handleTimeViewStatisticsDialogVisible()
      } else if (selection.action === 3) {
        this.handleSnapshotPolicyInfoDialogVisible()
      }
    },
    queryCurrentRow() {
      if (this.currentRow === null) {
        this.$message({ type: 'info', message: '请选择逻辑卷' })
        return false
      }
      return true
    },
    handleSanResourceInfoDialogVisible(val) {
      if (!this.queryCurrentRow()) {
        return false
      }
      if (this.currentRow.type === 2) {
        this.$message({ type: 'warning', message: '请选择逻辑卷' })
        return false
      }
      this.visible.sanResourceInfoDialog = true
    },
    handleCreateSanResourceDialogVisible(val) {
      this.visible.createSanResourceDialog = val
    },
    handleEditSanResourceDialogVisible(val) {
      if (!this.queryCurrentRow()) {
        return false
      }
      if (this.currentRow.type === 2) {
        this.$message({ type: 'warning', message: '请选择逻辑卷' })
        return false
      }
      this.visible.editSanResourceDialog = true
    },
    handleCreateSnapshotDialogVisible(val) {
      if (!this.queryCurrentRow()) {
        return false
      }
      this.visible.createSnapshotDialog = true
    },
    handleSanpshotListDialogVisible(val) {
      if (!this.queryCurrentRow()) {
        return false
      }
      this.visible.snapshotListDialog = true
    },
    handleCreateSnapshotPolicyDialogVisible(val, type) {
      if (!this.queryCurrentRow()) {
        return false
      }
      this.snapshotPolicyActionType = type
      if (type === 1) {
        this.visible.createSnapshotPolicyDialog = true
      } else {
        getSnapshotPolicy({ virDevName: this.currentRow.name, poolName: this.currentRow.poolName }).then(resp => {
          if (resp.rc === 0) {
            this.snapshotPolicyInfo = resp.data
            this.visible.createSnapshotPolicyDialog = true
          } else {
            this.$message({ type: 'warning', message: '清先创建快照策略' })
            this.visible.createSnapshotPolicyDialog = false
          }
        }).catch(() => {
          this.visible.createSnapshotPolicyDialog = false
        })
      }
    },
    handleSnapshotPolicyInfoDialogVisible(val) {
      if (!this.queryCurrentRow()) {
        return false
      }
      getSnapshotPolicy({ virDevName: this.currentRow.name, poolName: this.currentRow.poolName }).then(resp => {
        if (resp.rc === 0) {
          this.snapshotPolicyInfo = resp.data
          this.visible.snapshotPolicyInfoDialog = true
        } else {
          this.visible.snapshotPolicyInfoDialog = false
        }
      }).catch(() => {
        this.visible.snapshotPolicyInfoDialog = false
      })
    },
    handleCreateCDPJournalDialogVisible(val) {
      if (!this.queryCurrentRow()) {
        return false
      }
      this.manageCDPJournalType = val
      this.visible.createCDPJournalDialog = true
    },
    handleCDPJournalPropertiesDialogVisible() {
      if (!this.queryCurrentRow()) {
        return false
      }
      this.visible.CDPJournalPropertiesDialog = true
    },
    handleRetrieveCDPJournalDialogVisible() {
      if (!this.queryCurrentRow()) {
        return false
      }
      this.visible.retrieveCDPJournalDialog = true
    },
    handleTagListDialogVisible() {
      if (!this.queryCurrentRow()) {
        return false
      }
      this.visible.tagListDialog = true
    },
    handleEditTimeViewDialogVisible() {
      if (!this.queryCurrentRow()) {
        return false
      }
      if (this.currentRow.type === 1) {
        this.$message({ type: 'warning', message: '请选择快照视图' })
        return false
      }
      this.visible.editTimeViewDialog = true
    },
    handleTimeViewStatisticsDialogVisible() {
      if (!this.queryCurrentRow()) {
        return false
      }
      if (this.currentRow.type === 1) {
        this.$message({ type: 'warning', message: '请选择快照视图' })
        return false
      }
      this.visible.timeViewStatisticsDialog = true
    },
    handleManageReplicationDialogVisible() {
      if (!this.queryCurrentRow()) {
        return false
      }
      if (this.currentRow.type === 2) {
        this.$message({ type: 'warning', message: '请选择逻辑卷' })
        return false
      }
      this.visible.manageReplicationDialog = true
    },
    handleCommandSnapshot(command) {
      if (command === 'edit') {
        this.handleEditTimeViewDialogVisible()
      } else if (command === 'view') {
        this.handleTimeViewStatisticsDialogVisible()
      }
    },
    handleCommandSnapshots(command) {
      if (command === 'create') {
        this.handleCreateSnapshotDialogVisible(true)
      } else if (command === 'list') {
        this.handleSanpshotListDialogVisible(true)
      }
    },
    handleCommandSnapshotStrategy(command) {
      const commandList = {
        'create': () => {
          this.handleCreateSnapshotPolicyDialogVisible(true, 1)
        },
        'edit': () => {
          this.handleCreateSnapshotPolicyDialogVisible(true, 2)
        },
        'details': () => {
          this.handleSnapshotPolicyInfoDialogVisible(true)
        },
        'delete': () => {
          this.deleteSnapshotPolicy()
        }
      }
      commandList[command]()
    },
    handleCommandCDP(command) {
      const commandList = {
        'stop': () => {
          this.suspendCDPJournal()
        },
        'resume': () => {
          this.resumeCDPJournal()
        },
        'retrieve': () => {
          this.handleRetrieveCDPJournalDialogVisible()
        },
        'delete': () => {
          this.deleteCDPJournal()
        },
        'tagList': () => {
          this.handleTagListDialogVisible()
        },
        'view': () => {
          this.handleCDPJournalPropertiesDialogVisible()
        },
        'update': () => {
          this.handleCreateCDPJournalDialogVisible(2)
        }
      }
      commandList[command]()
    },
    formatMessageBox(action, type, params, name, request) {
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
            request(params).then(resp => {
              instance.confirmButtonLoading = false
              instance.confirmButtonText = '确定'
              if (Number(resp.rc) === 0) {
                done()
                this.updateData()
              } else {
                this.$message({ type: 'error', message: `${type}${action}失败` })
              }
            }).catch(() => {
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
    deleteSanResource() {
      if (!this.queryCurrentRow()) {
        return false
      }
      let name = '逻辑卷'
      if (this.currentRow.type === 1) {
        name = '逻辑卷'
      } else {
        name = '快照视图'
      }
      if (this.currentRow.type === 1 && this.currentRow.cdp === 'on') {
        this.$message({ type: 'warning', message: '请先关闭CDP' })
        return false
      }
      if (this.currentRow.type === 2 && this.currentRow.assign) {
        this.$message({ type: 'warning', message: `请先删除脚本${this.currentRow.scriptName}` })
        return false
      }
      this.formatMessageBox(
        '删除',
        name,
        { name: this.currentRow.name, poolName: this.currentRow.poolName },
        this.currentRow.name,
        deleteSanResource)
    },
    deleteSnapshotPolicy() {
      if (!this.queryCurrentRow()) {
        return false
      }
      this.formatMessageBox(
        '删除',
        '快照策略',
        { virDevName: this.currentRow.name, poolName: this.currentRow.poolName },
        '',
        deleteSnapshotPolicy)
    },
    deleteCDPJournal() {
      if (!this.queryCurrentRow()) {
        return false
      }
      this.formatMessageBox('删除', 'CDP', { name: this.currentRow.name, poolName: this.currentRow.poolName }, '', deleteCDPJournal)
    },
    suspendCDPJournal() {
      if (!this.queryCurrentRow()) {
        return false
      }
      this.formatMessageBox('暂停', 'CDP', { name: this.currentRow.name, poolName: this.currentRow.poolName }, '', suspendCDPJournal)
    },
    resumeCDPJournal() {
      if (!this.queryCurrentRow()) {
        return false
      }
      this.formatMessageBox('恢复', 'CDP', { name: this.currentRow.name, poolName: this.currentRow.poolName }, '', resumeCDPJournal)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .l-san-resource-container {
    background: #fff;
    margin: 20px;
    padding: 20px;
    &__header{
      padding-bottom: 20px;
    }
  }
</style>
