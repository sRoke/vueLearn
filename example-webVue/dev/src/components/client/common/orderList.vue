<template>
  <div>
    <el-row>
      <div class="m-b-20 ovf-hd">
        <div class="fr w-800 m-l-30">
          <el-row type='flex'
                  justify='end'
                  :gutter='18'>
            <el-col :span='5'>
              <el-select v-model="postData.o_coop_value"
                         placeholder="请选择合作模式"
                         @change="search">
                <el-option v-for="item in coop_options"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span='5'>
              <el-select v-model="postData.order_value"
                         placeholder="请选择订单状态"
                         @change="search">
                <el-option v-for="item in order_options"
                           :label="item.name"
                           :value="item.status">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span='9'>
              <el-input placeholder="输入订单名称、关联客户搜索"
                        v-model="postData.keyword">
                <el-button slot="append"
                           icon="search"
                           @click="search"></el-button>
              </el-input>
            </el-col>
            <reset-btn class="fr m-l-5 m-r-10"
                       :reset="handleClearFilter"></reset-btn>
          </el-row>
        </div>
      </div>
    </el-row>
    <el-table ref='t1'
              :data="tableData"
              @selection-change="handleSelectionChange"
              @row-click='toDetail'
              style="width: 100%">
      <el-table-column type="selection"
                       v-if='isMDel'
                       :reserve-selection=true
                       :selectable='isSelect'>
      </el-table-column>
      <el-table-column prop="num"
                       label="订单编号">
      </el-table-column>
      <el-table-column prop="title"
                       show-overflow-tooltip
                       label="订单标题">
      </el-table-column>
      <el-table-column prop="pattern"
                       label="合作模式">
      </el-table-column>
      <el-table-column prop="sum"
                       label="金额">
      </el-table-column>
      <el-table-column prop="client"
                       label="需求方"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="servicer"
                       show-overflow-tooltip
                       label="服务方">
      </el-table-column>
      <el-table-column prop="create_time"
                       show-overflow-tooltip
                       label="建立日期">
      </el-table-column>
      <el-table-column prop="status"
                       label="状态">
      </el-table-column>
    </el-table>
    <div class="pos-rel p-t-20 h-50">
      <div class="block pages">
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       layout="total, sizes, prev, pager, next, jumper"
                       :page-size="postData.pagesize"
                       :page-sizes="[15, 30, 50, 100]"
                       :current-page="postData.current_page"
                       :total="total_count">
        </el-pagination>
      </div>
    </div>
    <div class="fl"
         v-if='service_edit'>
      <el-button type="primary"
                 size="small"
                 v-show='!isMDel'
                 @click='multiDelete'>批量删除</el-button>
      <el-button type="primary"
                 size="small"
                 v-show='isMDel'
                 @click='cancelDel'>取消</el-button>
      <el-button type="primary"
                 size="small"
                 v-show='isMDel'
                 @click='sureDel'>确定删除</el-button>
    </div>
  </div>
</template>
<style type="text/css">
.page-part {
  margin-top: 10px;
}
</style>

<script>
import http from '../../../assets/js/http'
import resetBtn from '../../common/reset.vue'
export default {
  props: ['serviceid'],
  data() {
    return {
      postData: {
        current_page: 1,
        keyword: '',
        o_coop_value: '',  // 合作模式
        order_value: '' // 订单状态
      },
      isMDel: false,
      delList: [],
      total_count: 0,
      tableData: [],
      coop_options: [{
        value: '0',
        label: '不限'
      }, {
        value: '1',
        label: '项目制'
      }, {
        value: '2',
        label: '销售提成'
      }],
      start_fullPath: '',
      fullscreenLoading: false,
      order_options: []
    }
  },
  watch: {
    $route() {
      var pagesize = this.postData.pagesize
      if (this.$route.fullPath == this.start_fullPath) {
        this.postData = {
          current_page: 1,
          pagesize: pagesize,
          o_coop_value: '',
          order_value: '',
          keyword: ''
        }
      } else {
        this.postData = {
          pagesize: pagesize,
          current_page: this.$route.query.page * 1 || 1,
          o_coop_value: this.$route.query.o_coop_value || '',
          order_value: this.$route.query.order_value * 1 || '',
          keyword: this.$route.query.keyword || ''
        }
      }
    }
  },
  methods: {
    handleClearFilter() {
      this.postData.o_coop_value = ''
      this.postData.o_coop_valuepostData = ''
      this.postData.keywor = ''
    },
    isSelect(row, index) {
      return true
    },
    multiDelete() {
      this.isMDel = true
    },
    handleSelectionChange(val) {
      this.delList = []
      _(val).forEach((res, key) => {
        this.delList.push(res.id)
      })
    },
    toDetail(row) {
      location.hash = '/data/service/orderDetail/' + row.id
    },
    search() {
      if (this.postData.order_value == '0') {
        this.postData.order_value = ''
      }
      if (this.postData.o_coop_value == '0') {
        this.postData.o_coop_value = ''
      }
      var query = {
        index: this.$route.query.index,
        page: this.postData.current_page,
        keyword: this.postData.keyword,
        o_coop_value: this.postData.o_coop_value,
        order_value: this.postData.order_value
      }
      router.push({ path: this.$route.path, query: query })
      this.getData()
    },
    getData() {
      this.fullscreenLoading = true
      let { dsu_id } = this.$route.query
      var data = {
        params: {
          keyword: this.postData.keyword,
          page: this.postData.current_page,
          pagesize: this.postData.pagesize,
          status: this.postData.order_value,
          pattern: this.postData.o_coop_value
        }
      }
      this.apiGet('orders/service/' + dsu_id, data).then((res) => {
        this.fullscreenLoading = false
        if (res.code == 200) {
          this.tableData = res.data.list
          this.total_count = res.data.total_count
        } else {
          _g.dealError(this, res)
        }
      })
    },
    handleSizeChange(val) {
      this.postData.pagesize = val
      if (this.postData.page != 1) {
        this.postData.page = 1
        this.search()
      }
      this.getData()
    },
    handleCurrentChange(val) {
      this.postData.current_page = val
      this.search()
    }
  },
  created() {
    this.start_fullPath = this.$route.fullPath
    this.postData = {
      current_page: this.$route.query.page * 1 || 1,
      o_coop_value: this.$route.query.o_coop_value || '',
      order_value: this.$route.query.order_value * 1 || '',
      keyword: this.$route.query.keyword || ''
    }
    // 订单状态获取
    this.apiGet('orders/status_list?type=0').then((res) => {
      if (res.code == 200) {
        this.order_options = res.data
        this.order_options.unshift({ 'status': '0', 'name': '不限' })
        this.getData()
      } else {
        _g.dealError(this, res)
      }
    })
  },
  components: {
    'reset-btn': resetBtn
  },
  mixins: [http]
}
</script>