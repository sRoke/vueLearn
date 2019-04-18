<template>
  <section v-if="listQuery.total !== 0" class="l-pagination-container">
    <el-pagination
      :current-page="listQuery.page"
      :page-sizes="pageSizes"
      :page-size="listQuery.limit"
      :total="listQuery.total"
      :layout="layout"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"/>
  </section>
</template>

<script>
export default {
  name: 'Index',
  props: {
    tableTotal: {
      type: Number,
      default: 0
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 15
    },
    pageSizes: {
      type: Array,
      default: () => {
        return [10, 20, 30]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    }
  },
  data() {
    return {
      listQuery: {
        page: this.currentPage, // 页码 { Number }
        limit: this.pageSize, // 页大小 { Number }
        total: this.tableTotal // 总数 { Number }
      }
    }
  },
  watch: {
    tableTotal(val) {
      this.listQuery.total = val
    },
    currentPage(val) {
      this.listQuery.page = val
    },
    pageSize(val) {
      this.listQuery.limit = val
    },
    pageSizes(val) {
      this.pageSizes = val
    }
  },
  methods: {
    handleSizeChange(pageSize) {
      this.$emit('handleSizeChange', pageSize)
    },
    handleCurrentChange(currentPage) {
      this.$emit('handleCurrentChange', currentPage)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .l-pagination-container {
    margin: 20px auto 10px;
    text-align: center;
  }
</style>

