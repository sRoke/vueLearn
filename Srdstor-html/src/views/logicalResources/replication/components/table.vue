<template>
  <el-table
    :data="tableList.slice((listQuery.page-1)*listQuery.limit,listQuery.page*listQuery.limit)"
    :default-sort = "{prop: 'slot', order: 'ascending'}"
    fit
    border
    highlight-current-row
    @current-change="handleCurrentChange">
    <el-table-column type="index" align="center" width="50"/>
    <el-table-column label="卷名称" prop="name" sortable show-overflow-tooltip/>
    <el-table-column label="复制次数" prop="onetime" show-overflow-tooltip>
      <template slot-scope="scope">
        {{ scope.row.onetime ? '单次复制' : '定时复制' }}
      </template>
    </el-table-column>
    <el-table-column label="复制类型" prop="base" show-overflow-tooltip>
      <template slot-scope="scope">
        {{ scope.row.base ? '复制基本快照' : '复制增量快照' }}
      </template>
    </el-table-column>
    <el-table-column label="卷大小" prop="datasize">
      <template slot-scope="scope">
        {{ scope.row.datasize | bytesFormatter }}
      </template>
    </el-table-column>
    <el-table-column label="已传输" prop="currentsend">
      <template slot-scope="scope">
        {{ scope.row.currentsend | bytesFormatter }}
      </template>
    </el-table-column>
    <el-table-column label="进度">
      <template slot-scope="scope">
        <el-progress :percentage="scope.row.percentage"/>
      </template>
    </el-table-column>
    <el-table-column label="状态" prop="status" show-overflow-tooltip>
      <template slot-scope="scope">
        {{ scope.row.status | formatStatus }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'Table',
  filters: {
    formatStatus: (val) => {
      const statusList = {
        'prepare': '预备阶段',
        'inprocess': '正在复制中',
        'success': '复制成功',
        'failed': '复制失败',
        'fail': '复制失败'
      }
      return statusList[val] || ''
    }
  },
  props: {
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 12
    }
  },
  data() {
    return {
      tableList: this.tableData,
      listQuery: {
        page: this.currentPage,
        limit: this.pageSize
      }
    }
  },
  watch: {
    tableData(val, oldVal) {
      this.tableList = val.concat()
      this.tableList.forEach(item => {
        item.percentage = item.datasize === 0 ? 0 : Math.round(item.currentsend / item.datasize * 100)
      })
    },
    currentPage(val, oldVal) {
      this.listQuery.page = val
    },
    pageSize(val, oldVal) {
      this.listQuery.limit = val
    }
  },
  methods: {
    handleCurrentChange(selection) {
      this.$emit('handleSelectionChange', selection)
    }
  }
}
</script>

<style scoped>

</style>
