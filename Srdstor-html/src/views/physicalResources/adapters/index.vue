<template>
  <main v-loading="loading" class="l-adapter-container">
    <div class="l-adapter-container__header">
      <el-button icon="iconfont icon-refresh" type="primary" size="small" @click="getPCIDevices">刷新</el-button>
    </div>
    <adapter-table
      :table-data = "tableData"
      :current-page = "currentPage"
      :page-size = "pageSize"/>
    <adapter-pagination
      :table-total = "tableData.length"
      :current-page = "currentPage"
      :page-size = "pageSize"
      @handleSizeChange="handlePaginationSizeChange"
      @handleCurrentChange="handlePaginationCurrentChange"/>
  </main>
</template>

<script>
import { getPCIDevices } from '@/api/SRDstor/physicalResources/adapters'
import AdapterTable from './components/table'
import AdapterPagination from '@/components/Pagination/index'
export default {
  name: 'Index',
  components: {
    AdapterTable,
    AdapterPagination
  },
  data() {
    return {
      tableData: [], // 表格数据 { Array }
      currentPage: 1, // 当前页码 { Number }
      pageSize: 10, // 当前页面尺寸 { Number }
      loading: true // 加载状态 { Boolean }
    }
  },
  created() {
    // 初始化表格
    this.getPCIDevices()
  },
  methods: {
    getPCIDevices() {
      this.loading = true
      getPCIDevices()
        .then(resp => {
          if (resp.rc === 0) {
            this.loading = false
            this.tableData = resp.data
          }
        }).catch(() => {
          this.loading = false
        })
    },
    handlePaginationSizeChange(val) {
      this.pageSize = val
    },
    handlePaginationCurrentChange(val) {
      this.currentPage = val
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .l-adapter-container {
    background: #fff;
    margin: 20px;
    padding: 20px;
    &__header {
      padding-bottom: 20px;
    }
  }
</style>
