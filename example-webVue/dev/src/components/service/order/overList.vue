<template>
  <div>
    <div class="m-b-20 ovf-hd">
      <div class="fr m-r-5 w-300">
        <el-input placeholder="请输入订单、交易方名称搜索" v-model="keyword" class="w-250">
          <el-button slot="append" icon="search" @click="newPage(1)"></el-button>
        </el-input>
        <reset-btn class="fr"
                 :reset="handleClearFilter"></reset-btn>
      </div>
      <div class="fr w-250 m-r-5">
        <el-input placeholder="请输入订单编号查询" v-model="number">
          <el-button slot="append" icon="search" @click="newPage(1)"></el-button>
        </el-input>
      </div>
      <div class="block fr m-r-5">
        <el-date-picker
          v-model="time"
          type="daterange"
          placeholder="选择日期范围"
          @change="timeSel()">
        </el-date-picker>
      </div>
      <div class="fr m-r-5 w-120">
        <el-select v-model="coo_model" placeholder="合作模式" @change="newPage(1)">
          <el-option
            v-for="item in modelOptions"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="fr m-r-5 w-120">
        <el-select v-model="status" placeholder="订单状态" @change="newPage(1)">
          <el-option
            v-for="item in statusList"
            :label="item.name"
            :value="item.status">
          </el-option>
        </el-select>
      </div>
    </div>
    <el-table
    :data="tableData"
    style="width: 100%"
    @selection-change="handleSelectionChange" v-loading.lock="fullscreenLoading" element-loading-text="正在加载中">
      <el-table-column
        type="selection"
        width="55"
        v-if="showDelete">
      </el-table-column>
      <el-table-column
      prop="number"
      label="订单编号">
      </el-table-column>
      <el-table-column
      prop="title"
      label="订单标题">
      </el-table-column>
      <el-table-column
      prop="coo_model"
      label="合作模式" width="100px">
      </el-table-column>
      <el-table-column
      prop="total_amount"
      label="金额" width="100px">
      </el-table-column>
      <el-table-column
      prop="demander"
      label="需求方">
      </el-table-column>
      <el-table-column
      prop="servicer"
      label="服务方">
      </el-table-column>
      <el-table-column
      prop="create_time"
      label="建立时间">
      </el-table-column>
      <el-table-column
      prop="status_name"
      label="状态">
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template scope="scope">
          <el-button size="small" type="primary" @click="openEdit(scope.row)">查看</el-button>
          <el-button  class="m-l-5" size="small" type="danger" @click="sureDel(scope.row)" v-if='allEdit'>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="fl m-t-10" v-if='allEdit'>
      <el-button type="primary" size="small" v-show='!showDelete' @click='multiDelete'>批量删除</el-button>
      <el-button type="primary" size="small" v-show='showDelete' @click='cancelDel'>取消</el-button>
      <el-button type="danger" size="small" v-show='showDelete' @click='sureDel()'>确定删除</el-button>
    </div>
    <div class="pos-rel p-t-20" v-show="isPage">
      <div class="block pages m-b-10">
        <el-pagination
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[15, 30, 50, 100]"
        :page-size="pagesize"
        :current-page="currentPage"
        :total="dataCount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import http from '../../../assets/js/http'
  import resetBtn from '../../common/reset.vue'
  export default {
    data() {
      return {
        fullscreenLoading: false,
        tableData: [],
        currentPage: 1,
        pagesize: 15,
        dataCount: null,
        keyword: '',
        number: null,
        time: '',
        statusList: [],
        modelOptions: [
          {
            value: '0',
            label: '全部'
          },
          {
            value: '1',
            label: '项目制'
          },
          {
            value: '2',
            label: '销量提成'
          }
        ],
        coo_model: '',
        endT: '',
        startT: '',
        isPage: false,
        status: '',
        deleteAll: [],
        showDelete: false,
        allEdit: false
      }
    },
    methods: {
      handleClearFilter() {
        this.keyword = ''
        this.number = ''
        // this.start_time = ''
        // this.end_time = ''
        this.time = []
        this.startT = ''
        this.endT = ''
        this.status = ''
        this.coo_model = ''
        this.newPage(1)
      },
      handleSelectionChange(val) {
        this.deleteAll = []
        _(val).forEach((res, key) => {
          this.deleteAll.push(res.id)
        })
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.newPage()
      },
      handleSizeChange(val) {
        this.pagesize = val
        this.newPage(1)
      },
      getStatus() {
        this.apiGet('orders/status_list?type=1').then((res) => {
          console.log(res)
          if (res.code == 200) {
            this.statusList = res.data
            this.statusList.unshift({ name: '全部', status: 0 })
            this.getMatch()
          } else {
            _g.dealError(this, res)
          }
        })
      },
      getData() {
        let data = {
          params: {
            is_history: 1,
            page_size: this.pagesize,
            page: this.currentPage,
            keyword: this.keyword,
            coo_model: this.coo_model,
            status: this.status,
            start_time: this.startT,
            end_time: this.endT,
            number: this.number
          }
        }
        this.apiGet('orders', data).then((res) => {
          this.fullscreenLoading = false
          console.log(res)
          if (res.code == 200) {
            if (res.data.list.length > 0) {
              this.isPage = true
            } else {
              this.isPage = false
            }
            this.tableData = res.data.list
            this.dataCount = res.data.page.total_count
          } else {
            _g.dealError(this, res)
          }
        })
      },
      openEdit(row) {
        location.hash = '/service/order/overdetail/' + row.id
      },
      newPage(num) {
        if (num) {
          this.currentPage = 1
        }
        router.push({
          path: '/service/order/overList',
          query: {
            page: this.currentPage,
            pagesize: this.pagesize,
            model: this.coo_model,
            status: this.status,
            startT: this.startT,
            endT: this.endT,
            keyword: this.keyword,
            number: this.number
          }
        })
      },
      timeSel() {
        if (this.time.length > 0) {
          this.startT = moment(this.time[0]).format('YYYY-MM-DD')
          this.endT = moment(this.time[1]).format('YYYY-MM-DD')
          this.newPage(1)
        }
      },
      init() {
        this.fullscreenLoading = true
        this.getStatus()
      },
      getMatch() {
        if (this.$route.query.length != 0) {
          if (this.$route.query.startT) {
            this.time = []
            this.startT = this.$route.query.startT
            this.endT = this.$route.query.endT
            this.time.push(moment(this.startT, moment.ISO_8601)._d)
            this.time.push(moment(this.endT, moment.ISO_8601)._d)
          }
          if (this.$route.query.keyword) {
            this.keyword = this.$route.query.keyword
          }
          if (this.$route.query.number) {
            this.number = this.$route.query.number
          }
          if (this.$route.query.model) {
            this.coo_model = this.$route.query.model
          }
          if (this.$route.query.status) {
            this.status = Number(this.$route.query.status)
          } else if (this.$route.query.status == 0) {
            this.status = this.$route.query.status
          } else {
            this.status = ''
          }
          if (this.$route.query.pagesize) {
            this.pagesize = Number(this.$route.query.pagesize)
          }
          if (this.$route.query.page) {
            this.currentPage = Number(this.$route.query.page)
          }
          this.getData()
        }
      },
      multiDelete() {
        this.showDelete = true
      },
      sureDel(row) {
        if (row) {
          this.deleteAll = []
          this.deleteAll.push(row.id)
        }
        if (this.deleteAll.length != 0) {
          this.$confirm('删除订单同时，将删除关联的需求、订单和财务信息，确认继续操作？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.apiDelete('orders/', this.deleteAll.join(',')).then((res) => {
              if (res.code == 200) {
                this.getData()
                _g.toastMsg(this, 'success', '删除成功')
              } else {
                _g.dealError(self, res)
              }
            })
          }).catch(() => {
          })
        } else {
          _g.toastMsg(this, 'warning', '请勾选数据')
        }
      },
      cancelDel() {
        this.showDelete = false
      }
    },
    watch: {
      '$route' (to, from) {
        let auth = Lockr.get('authList')
        if (auth) {
          if (auth.order_edit) {
            this.allEdit = true
          } else {
            this.allEdit = false
          }
        } else if (auth == null) {
          this.allEdit = true
        }
        this.init()
      }
    },
    created() {
      let auth = Lockr.get('authList')
      if (auth) {
        if (auth.order_edit) {
          this.allEdit = true
        } else {
          this.allEdit = false
        }
      } else if (auth == null) {
        this.allEdit = true
      }
      this.init()
    },
    computed: {
    },
    components: {
      'reset-btn': resetBtn
    },
    mixins: [http]
  }
</script>