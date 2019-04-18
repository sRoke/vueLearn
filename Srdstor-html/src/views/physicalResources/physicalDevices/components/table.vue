<template>
  <el-table
    ref="multipleTable"
    :data="list.slice((listQuery.page-1)*listQuery.limit,listQuery.page*listQuery.limit)"
    :default-sort = "{prop: 'slot', order: 'ascending'}"
    fit
    border
    stripe
    highlight-current-row
    @select="handleSelectionChange"
    @select-all="handleAllSelectionChange">
    <el-table-column
      type="selection"
      width="35"/>
    <el-table-column :sort-method="sortBySlot" label="槽位" prop="slot" sortable/>
    <el-table-column label="容量">
      <template slot-scope="scope">
        {{ scope.row.baseInfo.size | bytesFormatter }}
      </template>
    </el-table-column>
    <el-table-column label="状态">
      <template slot-scope="scope">
        {{ scope.row.status | statusFormatter }}
      </template>
    </el-table-column>
    <el-table-column label="是否使用">
      <template slot-scope="scope">
        {{ scope.row.usedFlag | usedFlagFormatter }}
      </template>
    </el-table-column>
    <el-table-column label="品牌" prop="details.vendor" show-overflow-tooltip/>
    <el-table-column label="型号" prop="details.product" show-overflow-tooltip/>
    <el-table-column label="序列号" prop="details.firmwareRev" show-overflow-tooltip/>
  </el-table>
</template>

<script>
export default {
  name: 'Table',
  props: {
    // 父组件传递过来的表格数据
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 父组件传递过来的当前页码
    currentPage: {
      type: Number,
      default: 1
    },
    // 父组件传递过来的当前页大小
    pageSize: {
      type: Number,
      default: 12
    }
  },
  data() {
    return {
      list: this.tableData, // 表格数据 {Array}
      listQuery: {
        page: this.currentPage, // 页码
        limit: this.pageSize // 页大小
      }
    }
  },
  watch: {
    // 监听父组件中表格数据的变化
    tableData(val, oldVal) {
      const _this = this
      _this.list = val.concat()
      _this.list = _this.list.sort((a, b) => Number(a.slot) - Number(b.slot))

      // 在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。
      _this.$nextTick(() => {
        _this.list.forEach((item, index, array) => {
          _this.$refs.multipleTable.toggleRowSelection(item, item.isChosen)
        })
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
    sortBySlot(a, b) {
      const aSlot = a.slot === '' ? -1 : parseInt(a.slot)
      const bSlot = b.slot === '' ? -1 : parseInt(b.slot)
      return (aSlot - bSlot)
    },
    /**
     * 初始化表格判断对应行是否可选
     * @param row
     * @param index
     * @returns {number}
     */
    checkSelectable(row, index) {
      return row.usedFlag ? 0 : 1
    },
    /**
     * 选择表格数据时将选中的数据{Object}传递给父组件
     * @param selection
     * @param row
     */
    handleSelectionChange(selection, row) {
      this.$emit('handleSelectionChange', row)
    },
    handleAllSelectionChange(selection) {
      this.$emit('handleAllSelectionChange', selection)
    }
  }
}
</script>

<style scoped>

</style>
