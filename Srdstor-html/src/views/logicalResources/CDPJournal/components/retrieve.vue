<template>
  <el-dialog
    v-el-drag-dialog
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    width="800px"
    title="查看CDP">
    <el-form ref="retrieveCDPJournalForm" :rules="rules" :model="form" label-width="50px">
      <!--<el-form-item label="类型" style="display: inline-block;">-->
      <!--<el-select v-model="form.timeRange.type">-->
      <!--<el-option v-for="item in timeRangeType" :key="item.value" :label="item.name" :value="item.value"/>-->
      <!--</el-select>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="日期" style="display: inline-block;">-->
      <!--<el-select v-model="form.timeRange.timeMark.ymd" @change="getSnapshot">-->
      <!--<el-option v-for="item in ymd" :key="item" :label="item" :value="item"/>-->
      <!--</el-select>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="快照" style="display: inline-block;">-->
      <!--<el-select v-model="form.timeRange.snapshotMark" @change="handleTimeRangeSelectionChange(2)">-->
      <!--<el-option v-for="item in snapshots" :key="item" :label="item" :value="item"/>-->
      <!--</el-select>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="小时" style="display: inline-block;">-->
      <!--<el-select v-model="form.timeRange.timeMark.hour" @change="handleTimeRangeSelectionChange(3)">-->
      <!--<el-option v-for="item in hour" :key="item" :label="item" :value="item"/>-->
      <!--</el-select>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="分" style="display: inline-block;">-->
      <!--<el-select v-model="form.timeRange.timeMark.min" @change="handleTimeRangeSelectionChange(4)">-->
      <!--<el-option v-for="item in min" :key="item" :label="item" :value="item"/>-->
      <!--</el-select>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="秒" style="display: inline-block;">-->
      <!--<el-select v-model="form.timeRange.timeMark.sec" @change="handleTimeRangeSelectionChange(5)">-->
      <!--<el-option v-for="item in sec" :key="item" :label="item" :value="item"/>-->
      <!--</el-select>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="毫秒" style="display: inline-block;">-->
      <!--<el-select v-model="form.timeRange.timeMark.msec" @change="handleTimeRangeSelectionChange(6)">-->
      <!--<el-option v-for="item in msec" :key="item" :label="item" :value="item"/>-->
      <!--</el-select>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="起始" style="display: inline-block;">-->
      <!--<el-input-number-->
      <!--v-model="form.timeRange.beginAddr"-->
      <!--:min="0"-->
      <!--:step="10"-->
      <!--placeholder="选择起始"-->
      <!--@change="handleBeginAddrChange"/>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="数量" style="display: inline-block;">-->
      <!--<el-input-number-->
      <!--v-model="form.timeRange.count"-->
      <!--:min="1"-->
      <!--:step="10"-->
      <!--placeholder="选择数量"-->
      <!--@change="handleCountChange"/>-->
      <!--</el-form-item>-->
      <el-form-item label-width="20px" style="display: inline-block;">
        <!--<el-button type="primary" icon="el-icon-search" @click="retrieveCDPJournal">查 询</el-button>-->
        <el-button icon="iconfont icon-extract" type="primary" @click="handleExtractCDPJournalDialogVisible">触发提取</el-button>
        <el-button icon="iconfont icon-tag" plain @click="addTag">标 记</el-button>
        <el-button icon="iconfont icon-refresh" plain @click="reset(1)">重 置</el-button>
      </el-form-item>
      <el-form-item label-width="0" style="text-align: right;">
        <el-button icon="el-icon-back" type="primary" @click="goBack">返回上一级</el-button>
      </el-form-item>
    </el-form>
    <ve-histogram v-loading="loading" :extend="chartExtend" :events="chartEvents" :data="chartData" :settings="chartSettings"/>
    <cdp-journal-table
      :table-data = "tableData"
      :current-page = "currentPage"
      :page-size = "pageSize"
      @handleSelectionChange="handleSelectionChange"/>
    <cdp-journal-pagination
      :table-total = "tableTotal"
      :current-page = "currentPage"
      :page-size = "pageSize"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"/>
    <extract-cdp-journal
      :show-dialog="visible.extractCDPJournalDialog"
      :current-row="selectedRow"
      :selected-san-resource="currentRow"
      @handleDialogVisible="closeExtractCdpJournal"/>
  </el-dialog>
</template>

<script>
import { deepClone } from '@/utils/index'
import { retrieveCDPJournal, addTag } from '@/api/SRDstor/logicalResources/CDPJournal'
import CdpJournalTable from './table'
import CdpJournalPagination from '@/components/Pagination/index'
import ExtractCdpJournal from './extract'
// 嘻嘻 又写了一堆狗屎
export default {
  name: 'Retrieve',
  components: {
    CdpJournalTable,
    CdpJournalPagination,
    ExtractCdpJournal
  },
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
    this.chartSettings = {
      dimension: ['日期'],
      metrics: ['大小']
    }
    this.chartClickFlag = 1
    var self = this
    this.chartExtend = {
      dataZoom: {
        type: 'slider'
      }
    }
    this.chartEvents = {
      dblclick: function(e) {
        console.log(e)
        if (self.chartClickFlag === 1) {
          // 点击日期 获取小时
          self.chartData.rows = []
          self.tableData = []
          self.hourTableData = []
          for (let i = 1; i <= 24; i++) {
            self.chartData.rows.push({ '日期': i, '大小': 0 })
          }
          self.ymdList[e.name].snapshotMask.forEach(item => {
            self.getHour(e.name, item)
          })
        } else if (self.chartClickFlag === 2) {
          // 点击小时 获取分
          self.chartData.rows = []
          self.tableData = []
          self.minuteTableData = []
          for (let i = 1; i <= 60; i++) {
            self.chartData.rows.push({ '日期': i, '大小': 0 })
          }
          let name = ''
          if (parseInt(e.name) < 10) {
            name = '0' + e.name
          } else {
            name = e.name
          }
          self.hourList[name].snapshotMask.forEach(item => {
            self.getMinute(name, self.hourList[name].ymd, item)
          })
        } else if (self.chartClickFlag === 3) {
          // 点击分 获取秒
          self.chartData.rows = []
          self.tableData = []
          self.secondTableData = []
          for (let i = 1; i <= 60; i++) {
            self.chartData.rows.push({ '日期': i, '大小': 0 })
          }
          let name = ''
          if (parseInt(e.name) < 10) {
            name = '0' + e.name
          } else {
            name = e.name
          }
          self.minuteList[name].snapshotMask.forEach(item => {
            self.getSecond(name, self.minuteList[name].hour, self.minuteList[name].ymd, item)
          })
        } else if (self.chartClickFlag === 4) {
          // 点击秒 获取毫秒
          self.chartData.rows = []
          self.tableData = []
          self.milliSecondTableData = []
          for (let i = 1; i <= 1000; i++) {
            self.chartData.rows.push({ '日期': i, '大小': 0 })
          }
          let name = ''
          if (parseInt(e.name) < 10) {
            name = '0' + e.name
          } else {
            name = e.name
          }
          self.secondList[name].snapshotMask.forEach(item => {
            self.getMilliSecond(name, self.secondList[name].minute, self.secondList[name].hour, self.secondList[name].ymd, item)
          })
        } else if (self.chartClickFlag === 5) {
          // 点击毫秒 获取微妙
          self.chartData.rows = []
          self.tableData = []
          for (let i = 1; i <= 1000; i++) {
            self.chartData.rows.push({ '日期': i, '大小': 0 })
          }
          let name = ''
          if (parseInt(e.name) < 10) {
            name = '00' + e.name
          } else if (parseInt(e.name) < 100 && parseInt(e.name) >= 10) {
            name = '0' + e.name
          } else {
            name = e.name
          }
          self.milliSecondList[name].snapshotMask.forEach(item => {
            self.getMicroSecond(name, self.milliSecondList[name].second, self.milliSecondList[name].minute, self.milliSecondList[name].hour, self.milliSecondList[name].ymd, item)
          })
        }
      }
    }
    return {
      loading: false,
      dialogVisible: this.showDialog,
      timeRangeType: [
        { name: '精确至天', value: 0 },
        { name: '精确至快照名', value: 1 },
        { name: '精确至时', value: 2 },
        { name: '精确至分', value: 3 },
        { name: '精确至秒', value: 4 },
        { name: '精确至毫秒', value: 5 },
        { name: '精确至微秒', value: 6 }],
      snapshots: [],
      ymd: [],
      hour: [],
      min: [],
      sec: [],
      msec: [],
      tableData: [],
      tableTotal: 0,
      currentPage: 1,
      pageSize: 10,
      selectedRow: null,
      form: {
        name: '',
        poolName: '',
        timeRange: {
          type: 0,
          timeMark: {
            ymd: '',
            hour: '',
            min: '',
            sec: '',
            msec: ''
          },
          snapshotMark: '',
          beginAddr: 0,
          count: 10
        }
      },
      visible: {
        extractCDPJournalDialog: false
      },
      rules: {
      },
      ymdList: {},
      snapshotList: {},
      hourList: {},
      minuteList: {},
      secondList: {},
      milliSecondList: {},
      microSecondList: {},
      ymdChartData: [],
      hourChartData: [],
      minuteChartData: [],
      secondChartData: [],
      milliSecondChartData: [],
      microSecondChartData: [],
      hourTableData: [],
      minuteTableData: [],
      secondTableData: [],
      milliSecondTableData: [],
      microSecondTableData: [],
      chartData: {
        columns: ['日期', '大小'],
        rows: []
      }
    }
  },
  watch: {
    currentRow(val) {
      this.currentRow = val
      if (this.currentRow !== null) {
        this.form.name = this.currentRow.name
        this.form.poolName = this.currentRow.poolName
      }
    },
    showDialog(val) {
      this.dialogVisible = val
      if (val) {
        this.getDate()
      }
    }
  },
  created() {
    for (let i = 1; i <= 24; i++) {
      this.chartData.rows.push({ '日期': i, '大小': 0 })
    }
  },
  methods: {
    sortByTimestamp(a, b) {
      const timestampA = a.timestamp
      const timestampB = b.timestamp
      if (timestampA < timestampB) {
        return -1
      }
      if (timestampA > timestampB) {
        return 1
      }
      return 0
    },
    reset(val) {
      this.chartData.rows = []
      this.ymdList = {}
      this.snapshotList = {}
      this.hourList = {}
      this.minuteList = {}
      this.secondList = {}
      this.milliSecondList = {}
      this.microSecondList = {}
      this.ymdChartData = []
      this.hourChartData = []
      this.minuteChartData = []
      this.secondChartData = []
      this.milliSecondChartData = []
      this.microSecondChartData = []
      this.hourTableData = []
      this.minuteTableData = []
      this.secondTableData = []
      this.milliSecondTableData = []
      this.microSecondTableData = []
      this.tableData = []
      this.tableTotal = 0
      this.chartClickFlag = 1
      if (val === 1) {
        this.getDate()
      }
    },
    handleBeginAddrChange(val) {
      this.currentPage = val / 10 + 1
      if (this.form.timeRange.type === 6) {
        this.retrieveCDPJournal()
      }
    },
    handleCountChange(val) {
      if (this.form.timeRange.type === 6) {
        this.retrieveCDPJournal()
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    handleSelectionChange(selection) {
      this.selectedRow = selection
    },
    // 关闭触发提取弹窗时关闭查看CDP弹窗
    closeExtractCdpJournal() {
      this.visible.extractCDPJournalDialog = false
      this.handleClose()
    },
    handleClose() {
      this.reset(0)
      this.$emit('handleDialogVisible', false)
    },
    handleTimeRangeSelectionChange(selection, val) {
      this.form.timeRange.type = selection
      this.retrieveCDPJournal()
    },
    handleExtractCDPJournalDialogVisible() {
      if (this.selectedRow === null) {
        this.$message({ info: 'warning', message: '请选择时间戳' })
        return false
      }
      this.visible.extractCDPJournalDialog = true
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
            request(params)
              .then(resp => {
                instance.confirmButtonLoading = false
                instance.confirmButtonText = '确定'
                if (resp.rc === 0) {
                  done()
                } else {
                  this.$message({ type: 'error', message: `${type}${action}失败` })
                }
              })
              .catch(() => {
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
    addTag() {
      if (this.selectedRow === null) {
        this.$message({ info: 'warning', message: '请选择时间戳' })
        return false
      }
      this.formatMessageBox('添加', '标记', {
        name: this.currentRow.name,
        poolName: this.currentRow.poolName,
        info: {
          timestamp: this.selectedRow.timestamp,
          snapshotId: this.selectedRow.guid
        }
      }, '', addTag)
    },
    getDate() {
      const self = this
      const params = deepClone(self.form)
      params.timeRange.type = 0
      params.timeRange.beginAddr = 0
      params.timeRange.count = 1000
      retrieveCDPJournal(params)
        .then(resp => {
          if (resp.rc === 0) {
            self.ymd = resp.data.labels
            if (resp.data.labels === null) {
              this.$message({ type: 'warning', message: '日期数据为空' })
            } else {
              // 格式化图表
              self.chartData.rows = []
              resp.data.labels.forEach(item => {
                self.chartData.rows.push({ '日期': item.labelName, '大小': item.totalSize })
                self.ymdList[item.labelName] = { ymd: item.labelName, ymdSize: item.totalSize }
                // FIXME
                // if (typeof self.ymdList[item.labelName]['ymd'] === 'undefined') {
                //   self.ymdList[item.labelName]['ymd'] = item.labelName
                // }
                // self.ymdList[item.labelName]['ymd'] = item.labelName
                // self.ymdList[item.labelName]['ymdSize'] = item.totalSize
              })
              self.ymdChartData = self.chartData.rows.map(val => val)
              for (const i in self.ymdList) {
                this.getSnapshot(i)
              }
            }
          }
        })
    },
    getSnapshot(ymd) {
      const self = this
      const params = deepClone(self.form)
      self.loading = true
      params.timeRange.type = 1
      params.timeRange.timeMark.ymd = ymd
      params.timeRange.beginAddr = 0
      params.timeRange.count = 1000
      retrieveCDPJournal(params)
        .then(resp => {
          if (resp.rc === 0) {
            resp.data.labels.forEach(item => {
              if (Array.isArray(self.ymdList[ymd].snapshotMask)) {
                self.ymdList[ymd].snapshotMask.push(item.labelName)
              } else {
                self.ymdList[ymd].snapshotMask = []
                self.ymdList[ymd].snapshotMask.push(item.labelName)
              }
            })
            self.loading = false
          }
        })
    },
    getHour(ymd, snapshotMask) {
      const self = this
      const params = deepClone(this.form)
      params.timeRange.type = 2
      params.timeRange.timeMark.ymd = ymd
      params.timeRange.snapshotMark = snapshotMask
      params.timeRange.beginAddr = 0
      params.timeRange.count = 24
      self.loading = true
      retrieveCDPJournal(params)
        .then(resp => {
          if (resp.rc === 0) {
            if (resp.data.labels === null) {
              self.$message({ type: 'warning', message: '小时数据为空' })
            } else {
              resp.data.labels.forEach(item => {
                // FIXME 需要判断对象是否存在 不然会重新赋值覆盖掉原有的值
                // self.hourList[item.labelName] = { hour: item.labelName, ymd: ymd }
                if (typeof self.hourList[item.labelName] !== 'object') {
                  self.hourList[item.labelName] = { hour: item.labelName, ymd: ymd }
                }
                if (Array.isArray(self.hourList[item.labelName].snapshotMask)) {
                  self.hourList[item.labelName].snapshotMask.push(snapshotMask)
                } else {
                  self.hourList[item.labelName].snapshotMask = []
                  self.hourList[item.labelName].snapshotMask.push(snapshotMask)
                }
              })
              resp.data.labels.forEach(labelItem => {
                self.chartData.rows.forEach(rowItem => {
                  if (rowItem['日期'] === parseInt(labelItem.labelName)) {
                    rowItem['大小'] = rowItem['大小'] + labelItem.totalSize
                  }
                })
                const timestamp = resp.data.timeRange.timeMark.ymd + ' ' + labelItem.labelName + ':00:00.000000'
                self.hourTableData.push({ timestamp: timestamp, guid: resp.data.timeRange.snapshotMark, size: labelItem.totalSize })
              })
              self.hourChartData = self.chartData.rows.map(val => val)
            }
            self.hourTableData = self.hourTableData.sort(self.sortByTimestamp)
            self.tableData = self.hourTableData.map(val => val)
            self.tableTotal = self.tableData.length
            self.loading = false
            self.chartClickFlag = 2
          }
        })
    },
    getMinute(hour, ymd, snapshotMask) {
      const self = this
      const params = deepClone(this.form)
      params.timeRange.type = 3
      params.timeRange.timeMark.hour = hour
      params.timeRange.timeMark.ymd = ymd
      params.timeRange.snapshotMark = snapshotMask
      params.timeRange.beginAddr = 0
      params.timeRange.count = 60
      self.loading = true
      retrieveCDPJournal(params)
        .then(resp => {
          if (resp.rc === 0) {
            if (resp.data.labels === null) {
              self.$message({ type: 'warning', message: '分数据为空' })
            } else {
              resp.data.labels.forEach(item => {
                // self.minuteList[item.labelName] = { minute: item.labelName, hour: hour, ymd: ymd }
                if (typeof self.minuteList[item.labelName] !== 'object') {
                  self.minuteList[item.labelName] = { minute: item.labelName, hour: hour, ymd: ymd }
                }
                if (Array.isArray(self.minuteList[item.labelName].snapshotMask)) {
                  self.minuteList[item.labelName].snapshotMask.push(snapshotMask)
                } else {
                  self.minuteList[item.labelName].snapshotMask = []
                  self.minuteList[item.labelName].snapshotMask.push(snapshotMask)
                }
              })
              resp.data.labels.forEach(labelItem => {
                self.chartData.rows.forEach(rowItem => {
                  if (rowItem['日期'] === parseInt(labelItem.labelName)) {
                    rowItem['大小'] = rowItem['大小'] + labelItem.totalSize
                  }
                })
                const timestamp = resp.data.timeRange.timeMark.ymd + ' ' + resp.data.timeRange.timeMark.hour + ':' + labelItem.labelName + ':00.000000'
                self.minuteTableData.push({ timestamp: timestamp, guid: resp.data.timeRange.snapshotMark, size: labelItem.totalSize })
              })
              self.minuteChartData = self.chartData.rows.map(val => val)
            }
            self.minuteTableData = self.minuteTableData.sort(self.sortByTimestamp)
            self.tableData = self.minuteTableData.map(val => val)
            self.tableTotal = self.tableData.length
            self.loading = false
            self.chartClickFlag = 3
          }
        })
    },
    getSecond(minute, hour, ymd, snapshotMask) {
      const self = this
      const params = deepClone(self.form)
      params.timeRange.type = 4
      params.timeRange.timeMark.ymd = ymd
      params.timeRange.timeMark.hour = hour
      params.timeRange.snapshotMark = snapshotMask
      params.timeRange.timeMark.min = minute
      params.timeRange.beginAddr = 0
      params.timeRange.count = 60
      self.loading = true
      retrieveCDPJournal(params)
        .then(resp => {
          if (resp.rc === 0) {
            if (resp.data.labels === null) {
              self.$message({ type: 'warning', message: '秒数据为空' })
            } else {
              resp.data.labels.forEach(item => {
                // self.secondList[item.labelName] = { second: item.labelName, minute: minute, hour: hour, ymd: ymd }
                if (typeof self.secondList[item.labelName] !== 'object') {
                  self.secondList[item.labelName] = { second: item.labelName, minute: minute, hour: hour, ymd: ymd }
                }
                if (Array.isArray(self.secondList[item.labelName].snapshotMask)) {
                  self.secondList[item.labelName].snapshotMask.push(snapshotMask)
                } else {
                  self.secondList[item.labelName].snapshotMask = []
                  self.secondList[item.labelName].snapshotMask.push(snapshotMask)
                }
              })
              resp.data.labels.forEach(labelItem => {
                self.chartData.rows.forEach(rowItem => {
                  if (rowItem['日期'] === parseInt(labelItem.labelName)) {
                    rowItem['大小'] = rowItem['大小'] + labelItem.totalSize
                  }
                })
                const timestamp = resp.data.timeRange.timeMark.ymd + ' ' +
                  resp.data.timeRange.timeMark.hour + ':' + resp.data.timeRange.timeMark.min + ':' + labelItem.labelName + '.000000'
                self.secondTableData.push({ timestamp: timestamp, guid: resp.data.timeRange.snapshotMark, size: labelItem.totalSize })
              })
              self.secondChartData = self.chartData.rows.map(val => val)
            }
            self.secondTableData = self.secondTableData.sort(self.sortByTimestamp)
            self.tableData = self.secondTableData.map(val => val)
            self.tableTotal = self.tableData.length
            self.loading = false
            self.chartClickFlag = 4
          }
        })
    },
    getMilliSecond(second, minute, hour, ymd, snapshotMask) {
      const self = this
      const params = deepClone(self.form)
      params.timeRange.type = 5
      params.timeRange.timeMark.ymd = ymd
      params.timeRange.timeMark.hour = hour
      params.timeRange.snapshotMark = snapshotMask
      params.timeRange.timeMark.min = minute
      params.timeRange.timeMark.sec = second
      params.timeRange.beginAddr = 0
      params.timeRange.count = 1000
      self.loading = true
      retrieveCDPJournal(params)
        .then(resp => {
          if (resp.rc === 0) {
            if (resp.data.labels === null) {
              self.$message({ type: 'warning', message: '毫秒数据为空' })
            } else {
              resp.data.labels.forEach(item => {
                // self.milliSecondList[item.labelName] = { millisecond: item.labelName, second: second, minute: minute, hour: hour, ymd: ymd }
                if (typeof self.milliSecondList[item.labelName] !== 'object') {
                  self.milliSecondList[item.labelName] = { millisecond: item.labelName, second: second, minute: minute, hour: hour, ymd: ymd }
                }
                if (Array.isArray(self.milliSecondList[item.labelName].snapshotMask)) {
                  self.milliSecondList[item.labelName].snapshotMask.push(snapshotMask)
                } else {
                  self.milliSecondList[item.labelName].snapshotMask = []
                  self.milliSecondList[item.labelName].snapshotMask.push(snapshotMask)
                }
              })
              resp.data.labels.forEach(labelItem => {
                self.chartData.rows.forEach(rowItem => {
                  if (rowItem['日期'] === parseInt(labelItem.labelName)) {
                    rowItem['大小'] = rowItem['大小'] + labelItem.totalSize
                  }
                })
                const timestamp = resp.data.timeRange.timeMark.ymd + ' ' +
                  resp.data.timeRange.timeMark.hour + ':' + resp.data.timeRange.timeMark.min + ':' + resp.data.timeRange.timeMark.sec + '.' + labelItem.labelName + '000'
                self.milliSecondTableData.push({ timestamp: timestamp, guid: resp.data.timeRange.snapshotMark, size: labelItem.totalSize })
              })
              self.milliSecondChartData = self.chartData.rows.map(val => val)
            }
            self.milliSecondTableData = self.milliSecondTableData.sort(self.sortByTimestamp)
            self.tableData = self.milliSecondTableData.map(val => val)
            self.tableTotal = self.tableData.length
            self.loading = false
            self.chartClickFlag = 5
          }
        })
    },
    getMicroSecond(milliSecond, second, minute, hour, ymd, snapshotMask) {
      const self = this
      const params = deepClone(self.form)
      params.timeRange.type = 6
      params.timeRange.timeMark.hour = hour
      params.timeRange.snapshotMark = snapshotMask
      params.timeRange.timeMark.min = minute
      params.timeRange.timeMark.sec = second
      params.timeRange.timeMark.msec = milliSecond
      params.timeRange.timeMark.ymd = ymd
      params.timeRange.beginAddr = 0
      params.timeRange.count = 1000
      retrieveCDPJournal(params)
        .then(resp => {
          if (resp.rc === 0) {
            self.chartData.rows = []
            for (let i = 100; i <= 1000; i = i + 100) {
              self.chartData.rows.push({ '日期': i, '大小': 0 })
            }
            const sum = {
              100: 0,
              200: 0,
              300: 0,
              400: 0,
              500: 0,
              600: 0,
              700: 0,
              800: 0,
              900: 0,
              1000: 0
            }
            self.tableData = resp.data.cdpInfo.records === null ? [] : resp.data.cdpInfo.records.sort(self.sortByTimestamp)
            self.tableTotal = resp.data.total
            if (resp.data.cdpInfo.records === null) {
              this.$message({ type: 'warning', message: '微秒数据为空' })
            } else {
              resp.data.cdpInfo.records.forEach(recordItem => {
                const dataName = parseInt(recordItem.dataName)
                if (dataName <= 100) {
                  sum[100] += recordItem.size
                } else if (dataName > 100 && dataName <= 200) {
                  sum[200] += recordItem.size
                } else if (dataName > 200 && dataName <= 300) {
                  sum[300] += recordItem.size
                } else if (dataName > 300 && dataName <= 400) {
                  sum[400] += recordItem.size
                } else if (dataName > 400 && dataName <= 500) {
                  sum[500] += recordItem.size
                } else if (dataName > 500 && dataName <= 600) {
                  sum[600] += recordItem.size
                } else if (dataName > 600 && dataName <= 700) {
                  sum[700] += recordItem.size
                } else if (dataName > 700 && dataName <= 800) {
                  sum[800] += recordItem.size
                } else if (dataName > 800 && dataName <= 900) {
                  sum[900] += recordItem.size
                } else if (dataName > 900 && dataName <= 1000) {
                  sum[1000] += recordItem.size
                }
              })
              for (const i in sum) {
                self.chartData.rows.forEach(item => {
                  if (item['日期'] === parseInt(i)) {
                    item['大小'] = sum[parseInt(i)]
                  }
                })
              }
            }
            self.chartClickFlag = 6
          }
        })
    },
    goBack() {
      if (this.chartClickFlag === 6) {
        // 微秒 -> 毫秒
        this.tableData = this.milliSecondTableData
        this.chartData.rows = this.milliSecondChartData
        this.chartClickFlag = 5
      } else if (this.chartClickFlag === 5) {
        // 毫秒 -> 妙
        this.tableData = this.secondTableData
        this.chartData.rows = this.secondChartData
        this.chartClickFlag = 4
      } else if (this.chartClickFlag === 4) {
        // 秒 -> 分
        this.tableData = this.minuteTableData
        this.chartData.rows = this.minuteChartData
        this.chartClickFlag = 3
      } else if (this.chartClickFlag === 3) {
        // 分 -> 时
        this.tableData = this.hourTableData
        this.chartData.rows = this.hourChartData
        this.chartClickFlag = 2
      } else if (this.chartClickFlag === 2) {
        this.tableData = []
        this.chartData.rows = this.ymdChartData
        this.chartClickFlag = 1
      }
      this.tableTotal = this.tableData.length
    },
    retrieveCDPJournal() {
      const self = this
      retrieveCDPJournal(self.form)
        .then(resp => {
          if (resp.rc === 0) {
            const type = self.form.timeRange.type
            if (type === 0) {
              self.ymd = resp.data.labels
              this.$message('日期加载成功')
            } else if (type === 1) {
              self.snapshotList = resp.data.labels
              self.form.timeRange.type = 2
              self.snapshotList.forEach(item => {
                self.form.timeRange.snapshotMark = item
                self.retrieveCDPJournal()
              })
              self.snapshots = resp.data.labels
              this.$message('快照加载成功')
            } else if (type === 2) {
              // 小时加载
              resp.data.labels.forEach(item => {
                self.hour.push(item)
                if (Array.isArray(self.hourList[item])) {
                  // TODO 快照ID
                  self.hourList[item].push(resp.data.timeRange.snapshotMark)
                } else {
                  self.hourList[item] = []
                  // TODO 快照ID
                  self.hourList[item].push(resp.data.timeRange.snapshotMark)
                }
                // self.hourList[item]
              })
              // self.hour = resp.data.labels
              this.$message('小时加载成功')
            } else if (type === 3) {
              // 分加载
              resp.data.labels.forEach(item => {
                self.min.push(item)
              })
              // TODO 判断小时对应分的数量

              // self.min = resp.data.labels
              this.$message('分加载成功')
            } else if (type === 4) {
              self.sec = resp.data.labels
              this.$message('秒加载成功')
            } else if (type === 5) {
              self.msec = resp.data.labels
              this.$message('毫秒加载成功')
            } else if (type === 6) {
              self.tableData = resp.data.cdpInfo.records
              self.tableTotal = resp.data.total
              this.$message('微秒加载成功')
            }
            if (resp.data.labels === null) {
              this.$message('无记录')
            }
          }
        })
    }
  }
}
</script>

<style scoped>

</style>
