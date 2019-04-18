<template>
  <main class = "l-nas-resource-container">
    <section class="l-nas-resource-container__header">
      <el-button icon="el-icon-info" type="primary" @click="createNasResource">
        创建
      </el-button>
      <el-button icon="el-icon-refresh" type="primary" @click="deleteNasResource">
        删除
      </el-button>
      <el-button icon="el-icon-refresh" type="primary" @click="getNasResource">
        详情
      </el-button>
    </section>
    <nas-resources-table :table-data = "tableData" :current-page = "currentPage" :page-size = "pageSize" @handleSelectionChange="handleSelectionChange"/>
  </main>
</template>

<script>
import nasResourcesTable from './components/table'
import { getNasResources } from '@/api/SRDstor/logicalResources/nasResources'
export default {
  name: 'Index',
  components: {
    nasResourcesTable
  },
  data() {
    return {
      tableData: [], // 表格信息 { Array }
      currentPage: 1, // 当前页码 { Number }
      pageSize: 10, // 当前页面尺寸 { Number }
      listLoading: true, // 加载状态 { Boolean }
      multipleSelection: [] // 所选中表格信息 { Array }
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
    this.init()
  },
  methods: {
    init() {
      const _this = this
      _this.listLoading = true
      getNasResources()
        .then(resp => {
          _this.listLoading = false
          if (resp.rc === 0) {
            _this.tableData = resp.data.nasList
          }
        })
        .catch(() => {
          _this.listLoading = false
        })
    },
    handleSelectionChange(selection) {
      this.multipleSelection = selection
    },
    createNasResource() {
      console.log('创建NAS')
    },
    deleteNasResource() {
      console.log('删除NAS')
    },
    getNasResource() {
      console.log('获取NAS')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .l-nas-resource-container {
    background: #fff;
    margin: 20px;
    padding: 20px;
  &__header {
     padding-bottom: 20px;
   }
  }
</style>
