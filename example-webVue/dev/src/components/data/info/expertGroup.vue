<template>
<div>
  <el-row v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="正在加载中">
    <el-button class="m-b-20 btn-link-large add-btn f-l" @click="addExpert()">
      <i class="el-icon-plus"></i>&nbsp;&nbsp;添加
    </el-button>
    <div class="fr">
      <el-select v-model="status"  @change="select()">
        <el-option
          v-for="item in options"
          :label="item.label"
          :value="item.status">
        </el-option>
      </el-select>
        <el-input placeholder="请输入头衔、姓名查询" v-model="keyword" class="w-250">
          <el-button slot="append" icon="search" @click="select()"></el-button>
        </el-input>
        <reset-btn class="fr m-l-10"
                 :reset="handleClearFilter"></reset-btn>
    </div>
  </el-row>
  <el-table
  ref="t1"
  class='m-w-1280'
      :data="tableData"
     @sort-change="sorts"
     @selection-change="handleSelectionChange">
     <el-table-column
      type="selection"
      v-if='isMDel'
      :reserve-selection=true
      :selectable='isSelect'
      width="55">
    </el-table-column>
     <el-table-column
       label="序号">
       <template scope="scope">
         <span>{{ scope.row.num }}</span>
       </template>
     </el-table-column>
     <el-table-column
       label="图片"
       >
       <template scope="scope">
        <img :src='scope.row.cover'/>
       </template>
     </el-table-column>
     <el-table-column label="头衔">
     <template scope="scope">
          <span>{{ scope.row.title}}</span>
        </template>
     </el-table-column>
     <el-table-column
        label="姓名"
        >
        <template scope="scope">
          <span>{{ scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="简介"
      min-width="120"
      show-overflow-tooltip>
        <template scope="scope">
          <span>{{ scope.row.brief}}</span>
        </template>
      </el-table-column>
     <el-table-column
       label="状态"
       >
       <template scope="scope">
         <span>{{ scope.row.status}}</span>
       </template>
     </el-table-column>
     <el-table-column
       label="创建时间"
       >
       <template scope="scope">
         <span>{{ scope.row.create_time }}</span>
       </template>
     </el-table-column>
        <el-table-column
       label="排序"
        sortable="false"  prop="sort">
       <template scope="scope">
         <span>{{ scope.row.sort }}</span>
       </template>
     </el-table-column>
     <el-table-column label="操作">
       <template scope="scope">
         <el-button
           size="small"
           type="primary"
           @click="handleEdit( scope.row.id)">编辑</el-button>
         <el-button
           size="small"
           type="danger"
           @click="handleDelete(scope.row)">删除</el-button>
       </template>
     </el-table-column>
  </el-table>
  <addExpert ref="addExpert" :info="tableData"></addExpert>
  <editExpert ref="editExpert" :info="tableData"></editExpert>
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
  <div class="fl">
    <el-button type="primary" size="small" v-show='!isMDel' @click='multiDelete'>批量删除</el-button>
    <el-button type="primary" size="small" v-show='isMDel' @click='cancelDel'>取消</el-button>
    <el-button type="primary" size="small" v-show='isMDel' @click='sureDel'>确定删除</el-button>
  </div>
</div>
</template>
<style>
 .el-table .cell img{
  width: 50px;
  height: 50px;
 }
</style>
<script>
  import resetBtn from '../../common/reset.vue'
  import http from '../../../assets/js/http'
  import addExpert from './expert_add.vue'
  import editExpert from './expert_edit.vue'
  export default {
    watch: {
      '$route'(to, from) {
        var self = this
        self.init()
      }
    },
    methods: {
      handleClearFilter() {
        this.status = ''
        this.keyword = ''
        this.select()
      },
      select() {
        var self = this
        router.push({ path: '/data/info/expertgroup', query: { page: self.currentPage, pagesize: self.pageSize, keyword: self.keyword, status: self.status, sort: self.sort }})
      },
      init() {
        this.fullscreenLoading = true
        var self = this
        if (self.$route.fullPath == '/data/info/expertgroup') {
          self.currentPage = 1
          self.pageSize = 15
          self.keyword = ''
          self.status = ''
          self.sort = ''
        } else {
          self.currentPage = self.$route.query.page * 1
          self.pageSize = self.$route.query.pagesize * 1
          self.keyword = self.$route.query.keyword
          self.status = self.$route.query.status
          self.sort = self.$route.query.sort
        }
        self.getData()
      },
      getData() {
        this.apiGet('experts?page=' + this.currentPage + '&pagesize=' + this.pageSize + '&keyword=' + encodeURI(this.keyword) + '&status=' + this.status + '&sort=' + this.sort).then((res) => {
          this.fullscreenLoading = false
          console.log(res.data)
          if (res.code == 200) {
            if (res.data.list.length > 0) {
              this.isPage = true
            }
            let data = {}
            this.tableData = _(res.data.list).forEach((val, key) => {
              if (val.status == 1) {
                val.status = '已上架'
              } else if (val.status == 2) {
                val.status = '已下架'
              }
              if (val.cover) {
                val.cover = window.imgUrl + val.cover + '_155x200_.jpg'
              }
              if (res.data.cover) {
                let img = window.imgUrl + res.data.cover
                this.fileList.push({ name: '图片', url: img })
                this.tableData.cover = res.data.cover
                console.log('yessssss')
              }
            })
            this.dataCount = res.data.total_count
          } else {
            _g.dealError(this, res)
          }
        })
      },
      sorts() { // 排序
        if (this.x % 2 == 0) {
          this.sort = 2
          this.select()
          this.x ++
        } else {
          this.sort = 1
          this.select()
          this.x ++
        }
      },
      handleEdit(id) {
        console.log(id)
        this.tableData = this.tableData
        this.$refs.editExpert.open(id)
      },
      handleDelete(item) {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.apiDelete('experts/', item.id).then((res) => {
            if (res.code == 200) {
              _g.toastMsg(this, 'success', '删除成功')
              this.getData()
            } else {
              _g.dealError(this, res)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      addExpert() {
        this.$refs.addExpert.open()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.select()
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.currentPage = 1
        this.select()
        // console.log(`每页 ${val} 条`)
      },
      isSelect(row, index) {
        return true
      },
      multiDelete() {
        this.isMDel = true
      },
      sureDel() {
        console.log(JSON.stringify(this.delList))
        let asd = {
          delList: this.delList
          // delList: this.delList
        }
        // asd.push(asd)
        console.log(asd)
        if (this.delList.length == 0) {
          _g.toastMsg(this, 'warning', '请选择删除项')
        } else {
          console.log(asd)
          this.apiPost('experts/destroy', asd).then((res) => {
            if (res.code == 200) {
              _g.toastMsg(this, 'success', '删除成功')
              this.getData()
            } else {
              _g.dealError(this, res)
            }
          })
          this.isMDel = false
        }
        // console.log((this.delList))
      },
      cancelDel() {
        this.$refs.t1.clearSelection(this.tableData)
        this.isMDel = false
      },
      handleSelectionChange(val) {
        this.delList = []
        _(val).forEach((res, key) => {
          this.delList.push(res.id)
        })
      }
    },
    data() {
      return {
        sort: null,
        x: 1,
        tableData: [],
        options: [{
          status: '',
          label: '全部状态'
        }, {
          status: '1',
          label: '已上架'
        }, {
          status: '2',
          label: '已下架'
        }],
        keyword: '',
        currentPage: 1,
        pageSize: 15,
        dataCount: null,
        isPage: false,
        status: '',
        isMDel: false,
        delList: [],
        fullscreenLoading: false
      }
    },

    created() {
      this.init()
      let data = {}
      this.apiGet('experts', data).then((res) => {
        console.log('res = ', res)
      })
    },
    components: {
      'reset-btn': resetBtn,
      addExpert,
      editExpert
    },
    mixins: [http]
  }
</script>