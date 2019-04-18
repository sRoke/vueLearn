<template>
  <main class="l-history-container">
    <section class="l-history-container__header">
      <el-button icon="iconfont icon-refresh" type="primary" size="small" @click="getHistory">刷新</el-button>
    </section>
    <history-table
      v-loading="loading"
      :table-data = "tableData"
      :current-page = "currentPage"
      :page-size = "pageSize"
      @handleSelectionChange="handleSelectionChange"/>
    <history-pagination
      :table-total = "tableTotal"
      :current-page = "currentPage"
      :page-size = "pageSize"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"/>
  </main>
</template>

<script>
import store from '@/store/index'
import { getHistory } from '@/api/SRDstor/history'
import HistoryTable from './components/table'
import HistoryPagination from '@/components/Pagination/index'
export default {
  name: 'Index',
  components: {
    HistoryTable,
    HistoryPagination
  },
  data() {
    return {
      loading: false,
      tableData: [],
      tableTotal: 0,
      currentPage: 1,
      pageSize: 10,
      currentRow: null
    }
  },
  created() {
    this.getHistory()
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.getHistory()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getHistory()
    },
    handleSelectionChange(selection) {
      this.currentRow = selection
    },
    getHistory() {
      const self = this
      self.tableData = []
      self.loading = true
      getHistory({ page: this.currentPage, lines: this.pageSize })
        .then(resp => {
          self.loading = false
          if (resp.rc === 0) {
            resp.loginfo.forEach((item, index) => {
              const time = item.substring(0, item.indexOf('.'))
              const returnCode = item.substring(item.indexOf('\"rc\":') + 4, item.indexOf('\"rc\":') + 11).replace(/[^0-9]/ig, '')
              // self.tableData.push({ time: time, returnCode: store.state.returnCode.rcList[returnCode] })
              self.$set(self.tableData, index, { time: time, returnCode: store.state.returnCode.rcList[returnCode] })
            })
            self.tableTotal = resp.total
          }
        })
        .catch(() => {
          self.loading = false
        })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .l-history-container {
    background: #fff;
    margin: 20px;
    padding: 20px;
    &__header {
      padding-bottom: 20px;
    }
  }
</style>
