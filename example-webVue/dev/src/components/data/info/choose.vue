<template>
    <el-dialog title="选择服务方" ref="dialog" class="bingo">
      <div class="fr w-300 dialog-search m-b-20" >
        <el-input placeholder="请输入服务方" v-model="keyword" style="display: inline-table;">
          <el-button slot="append" icon="search" @click.prevent="getData()"></el-button>
        </el-input>
      </div>
      <el-table
    ref="t1"
    class='m-w-100'
    max-height="600"
      :data="tableData"
     @selection-change="handleSelectionChange">
      <el-table-column
      label="选择"
      type="selection"
      :selectable='isSelect'
      :filter-multiple=false
      width="200">
    </el-table-column>
      <el-table-column
       label="服务方">
       <template scope="scope">
         <span>{{ scope.row.name }}</span>
       </template>
     </el-table-column>
      </el-table>
      <div class="pos-rel p-t-20" v-show="isPage">
    <div class="block pages m-b-10">
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[15, 30, 50, 100]"
      :page-size="pageSize"
      :current-page="currentPage"
      :total="dataCount">
      </el-pagination>
    </div>
  </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary"  @click="cancel()">返回</el-button>
        <el-button type="primary"  :disabled="disable" @click="yes()" :loading="isLoading">确认</el-button>
      </div>
    </el-dialog>
</template>
<style>
  .bingo .el-dialog{
    min-width: 650px;
  }
  .bingo .el-table__header-wrapper span .el-checkbox__inner{
    display: none;
  }

</style>
<script>
import http from '../../../assets/js/http'
export default{
  props: ['company'],
  data() {
    return {
      disable: false,
      infos: {
      },
      currentPage: 1,
      pageSize: 15,
      dataCount: null,
      isPage: false,
      tableData: [],
      keyword: '',
      delList: []
    }
  },
  methods: {
    yes() {
      if (this.delList.length == 0) {
        _g.toastMsg(this, 'warning', '请选择服务方')
      } else {
        this.$refs.dialog.close()
        this.$emit('delList', this.delList)
      }
    },
    cancel() {
      this.$refs.dialog.close()
    },
    open() {
      // this.apiGet('service_user/basic?page=' + this.currentPage + '&pagesize=' + this.pageSize + '&keyword=' + this.keyword).then((res) => {
      //   if (res.code == 200) {
      //     console.log(res.data)
      //     // this.options1 = res.data
      //     // console.log(this.form.dsuId)
      //   } else {
      //     _g.dealError(this, res)
      //     // console.log('列表页失败')
      //   }
      // })
      this.keyword = ''
      this.getData()
      this.$refs.dialog.open()
      console.log(this.delList)
      if (this.delList.length) {
        this.$refs.t1.clearSelection(this.tableData)
      }
    },
    isSelect(row, index) {
      return true
    },
    getData() {
      console.log(this.keyword)
      // console.log('获取数据')
      this.apiGet('service_user/basic?page=' + this.currentPage + '&pagesize=' + this.pageSize + '&keyword=' + encodeURI(this.keyword)).then((res) => {
        if (res.code == 200) {
          this.isPage = true
          console.log(res.data)
          this.tableData = res.data.list
          this.dataCount = res.data.total_count
          console.log(this.tableData)
        } else {
          _g.dealError(this, res)
          // console.log('列表页失败')
        }
      })
    },
    handleSelectionChange(val) {
      this.delList = val
      if (this.delList.length == 2) {
        this.$refs.t1.toggleRowSelection(this.delList[0], false)
      }
      // console.log(val)
      // _(val).forEach((res, key) => {
      //   this.delList.push(res.id)
      // })
      console.log(this.delList)
    },

    handleCurrentChange(val) {
      this.currentPage = val
      this.getData()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getData()
      // console.log(`每页 ${val} 条`)
    }
  },
  created() {
  },
  mixins: [http]
}
</script>