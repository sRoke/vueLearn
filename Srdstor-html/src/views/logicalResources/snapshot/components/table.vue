<template>
  <el-table
    :data="tableList.slice((listQuery.page-1)*listQuery.limit,listQuery.page*listQuery.limit)"
    :default-sort = "{prop: 'creation', order: 'ascending'}"
    fit
    border
    highlight-current-row
    @current-change="handleCurrentChange">
    <el-table-column label="名称" prop="name"/>
    <el-table-column label="创建时间" sortable prop="creation"/>
    <el-table-column label="可用" prop="isAvailable">
      <template slot-scope="scope">
        {{ scope.row.isAvailable === true ? '是' : '否' }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'Table',
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
      this.tableList = this.tableList.sort((a, b) => {
        const creationA = a.creation
        const creationB = b.creation
        if (creationA < creationB) {
          return -1
        }
        if (creationA > creationB) {
          return 1
        }
        return 0
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
    handleCurrentChange(currentRow) {
      this.$emit('handleSelectionChange', currentRow)
    }
  }
}
</script>

<style scoped>

</style>
