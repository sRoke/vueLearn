<template>
  <div id="customerList"
       element-loading-text="正在加载中"
       v-loading.fullscreen.lock="fullscreenLoading">
  
    <div class="m-b-20 ovf-hd ">
  
      <div class="fr w-1200">
  
        <reset-btn class="fr m-l-10"
                   :reset="handleClearFilter"></reset-btn>
  
        <div class="fr w-250">
          <el-input v-model="keywords"
                    placeholder="输入公司、联系人、手机号">
            <el-button slot="append"
                       icon="search"
                       @click.prevent="select()"></el-button>
          </el-input>
        </div>
  
        <div class="fr publicClient m-l-10"
             v-if="canView">
          <el-select v-model="proValue"
                     @change="select()"
                     placeholder="请输入省">
            <el-option v-for="item in proOptions"
                       :label="item.label"
                       :value="item.label">
            </el-option>
          </el-select>
          <el-select v-model="cityValue"
                     placeholder="请输入市"
                     class="m-l-10"
                     @change="select()">
            <el-option v-for="item in cityOptions"
                       :label="item.label"
                       :value="item.label">
            </el-option>
          </el-select>
        </div>
  
        <div class="fr m-l-10">
          <el-date-picker v-model="return_visit"
                          @change="select()"
                          type="datetimerange"
                          placeholder="回访时间">
          </el-date-picker>
        </div>
  
        <div class="fr m-l-10">
          <el-date-picker v-model="follow_time"
                          @change="select()"
                          type="datetimerange"
                          placeholder="最新跟进时间">
          </el-date-picker>
        </div>
  
      </div>
  
      <div class="fl">
        <a class="btn-link-large del-btn"
           v-if="canBatch"
           @click="confirmRelease">批量释放</a>
      </div>
  
    </div>
  
    <el-table max-height="750"
              :data="tableData"
              row-class-name="tx-c"
              @clearSelection='clear'
              @filter-change="applyFilter"
              @selection-change="handleSelectionChange"
              v-if="canView && loadingDone">
      <el-table-column width="35"
                       type="selection"
                       :selectable='isSelect'
                       header-align="center"
                       :reserve-selection="true">
      </el-table-column>
      <el-table-column fixed
                       prop="num"
                       width="150"
                       label="编号"
                       header-align="center">
      </el-table-column>
      <el-table-column prop="name"
                       width="240"
                       label="公司名称"
                       header-align="center">
      </el-table-column>
      <el-table-column label="联系人"
                       width="150"
                       v-if="canEdit"
                       prop="p_contact"
                       header-align="center">
      </el-table-column>
      <el-table-column label="手机号"
                       width="130"
                       v-if="canEdit"
                       prop="p_phone"
                       header-align="center">
      </el-table-column>
      <el-table-column label="省市"
                       width="130"
                       prop="city"
                       header-align="center">
        <template scope="scope">{{ `${scope.row.province}${scope.row.city}` }}</template>
      </el-table-column>
      <el-table-column width="120"
                       prop="register"
                       label="是否注册"
                       column-key="register"
                       :filter-multiple="false"
                       :filters="registerOption"
                       header-align="center">
        <template scope="scope">{{ scope.row.dsu_id ? '是' : '否' }}</template>
      </el-table-column>
      <el-table-column label="客户级别"
                       width="150"
                       prop="p_ranking"
                       :filter-multiple="false"
                       :filters="clientLevels"
                       column-key="p_ranking"
                       header-align="center">
      </el-table-column>
      <el-table-column label="跟进人员"
                       prop="p_name"
                       width="150"
                       column-key="follow"
                       :filter-multiple="false"
                       :filters="sturdyMen"
                       header-align="center">
      </el-table-column>
      <el-table-column label="跟进状态"
                       width="150"
                       prop="followStatus"
                       :filter-multiple="false"
                       :filters="followStatus"
                       column-key="followStatus"
                       header-align="center">
      </el-table-column>
      <el-table-column label="最新跟进时间"
                       width="150"
                       header-align="center"
                       prop="follow_time">
      </el-table-column>
      <el-table-column label="回访时间"
                       width="150"
                       header-align="center"
                       prop="return_visit">
      </el-table-column>
      <el-table-column label="操作"
                       fixed="right"
                       inline-template
                       :width="150"
                       header-align="center">
        <div>
          <router-link class="btn-link edit-btn"
                       :to="{ name: 'myClientDetail', params: { id: row.id, path }, query: queryParams}">
            查看
          </router-link>
          <router-link class="btn-link edit-btn"
                       v-if="canEdit"
                       :to="{ name: 'myClientEdit', params: { id: row.id, path }, query: queryParams}">
            编辑
          </router-link>
        </div>
      </el-table-column>
    </el-table>
  
    <div class="pos-rel p-t-20"
         v-show="hasNextPage > 0 && loadingDone">
      <div class="block pages m-b-10">
        <el-pagination :total="dataCount"
                       :page-size="pageSize"
                       :current-page="currentPage"
                       :page-sizes="[15, 30, 50, 100]"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<style scoped>
.el-dropdown-menu__item:not(.is-disabled):hover {
  background-color: transparent;
}

#customerList .el-tag {
  background-color: transparent;
  border: none;
  border-radius: 0px;
  color: #000;
  padding: 0px;
  font-size: 14px;
}

#customerList .up-and-down:hover {
  color: #20A0FF;
}

#customerList .el-table-filter__checkbox-group .el-checkbox {
  margin-left: 5px;
}

.el-table-filter__bottom {
  text-align: center;
}

#customerList .ellips {
  width: 250px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

#customerList .myClient .el-select {
  width: 100%;
}

#customerList .publicClient {
  margin-right: 10px;
}

#customerList .publicClient .el-select {
  width: 120px
}
</style>
<script>
import address from 'assets/js/address'
import resetBtn from 'common/reset.vue'
import http from 'assets/js/http'
import registerOption from 'assets/json/register_status.json'
export default {
  data() {
    return {
      show: Lockr.get('authList'),
      keywords: '',
      currentPage: 1,
      dataCount: 0,
      dataPages: 0,
      pageSize: 15,
      tableData: [],
      customer: '',
      status: '',
      customerStatus: [
        { name: '有订单客户', num: '1' },
        { name: '无订单客户', num: '2' },
        { name: '所有客户', num: '3' }
      ],
      clientLevels: [
        { text: '全部', value: '' },
        { text: 'A热门客户', value: '1' },
        { text: 'B普通客户', value: '2' },
        { text: 'C潜在客户', value: '3' },
        { text: 'D无法沟通', value: '4' }
      ],
      followStatus: [
        { text: '全部', value: '' },
        { text: '未联系', value: '0' },
        { text: '已跟进', value: '1' },
        { text: '无效', value: '2' },
        { text: '需回访', value: '3' }
      ],
      sturdyMen: [],
      follow: '',
      isEmpty: false,
      isNull: false,
      register: null,
      level: '',
      return_visit: null,
      follow_time: null,
      isFirst: true,
      cityValue: '',
      proValue: '',
      proOptions: address.pro,
      cityOptions: address['city']['广东省'],
      path: '',
      selList: [],
      fullscreenLoading: false
    }
  },
  watch: {
    '$route'(to, from) { // 监听路由改变
      this.init()
    },
    proValue(val) {  // 监听省份的选择，以更新城市选项
      this.cityOptions = address['city'][val]
      this.proValue = val
      if (!this.isFirst) {
        this.cityValue = ''
      } else {
        this.isFirst = false
      }
    }
  },
  methods: {
    clear(selection) {
      // console.log(selection)
    },
    isSelect(row) {
      let canRelease = false
      let peoples = row.followPeople || []
      for (let item of peoples) {
        if (canRelease) return canRelease
        canRelease = item.id == sessionStorage.getItem('u_id')
      }
      return canRelease
    },
    confirmRelease() { // 释放确认框
      if (this.selList.length <= 0) {
        return _g.toastMsg(this, 'warning', '请勾选数据')
      }
      this.$confirm('确认释放?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.batchRelease()
      }).catch(() => {
        // do cancel
      })
    },
    batchRelease() { // 执行批量释放
      let data = { id: this.selList }
      this.apiPost('customers/free_follow', data).then(res => {
        if (res.code == 200) {
          this.getCustomerList()
          _g.toastMsg(this, 'success', '释放成功')
        } else {
          _g.dealError(this, res)
        }
      })
    },
    handleSelectionChange(val) { // 批量选择事件
      this.selList = []
      _(val).forEach((res, key) => {
        this.selList.push(res.id)
      })
    },
    select() { // 通过路由的参数保存页面的状态
      let { keywords: keyword, currentPage: page, proValue: province, cityValue: city } = this
      let { follow, customer, level, status, pageSize, register, return_visit, follow_time } = this
      let query = {}
      page ? query.page = page : null
      city ? query.city = city : null
      level ? query.level = level : null
      follow ? query.follow = follow : null
      status ? query.status = status : null
      keyword ? query.keyword = keyword : null
      province ? query.province = province : null
      customer ? query.customer = customer : null
      pageSize ? query.pageSize = pageSize : null
      register ? query.register = register : null
      return_visit ? query.return_visit = return_visit : null
      follow_time ? query.follow_time = follow_time : null
      router.push({ query })
    },
    init(params = null) {
      this.fullscreenLoading = true
      this.path = this.$route.fullPath
      if (params) {
        this.keywords = params.keyword || null
        this.currentPage = Number(params.page) || 1
        this.proValue = params.province || null
        this.cityValue = params.city || null
        this.follow = Number(params.follow) || null
        this.pageSize = Number(params.pageSize) || null
        this.register = Number(params.register) || null
      }
      this.getFollowStaff()
      this.getCustomerList()
    },
    applyFilter(filter) { // 根据条件刷选
      if (filter.p_ranking) { // 客户级别
        if (filter.p_ranking.length === 0) {
          this.level = ''
        } else if (filter.p_ranking.length > 0) {
          this.level = filter.p_ranking[0]
        }
      }
      if (filter.followStatus) { // 跟进状态
        if (filter.followStatus.length === 0) {
          this.status = ''
        } else if (filter.followStatus.length > 0) {
          this.status = filter.followStatus[0]
        }
      }
      if (filter.register) { // 跟进状态
        if (filter.register.length === 0) {
          this.register = ''
        } else if (filter.register.length > 0) {
          this.register = filter.register[0]
        }
      }
      if (filter.follow) { // 跟进状态
        if (filter.follow.length === 0) {
          this.follow = ''
        } else if (filter.follow.length > 0) {
          this.follow = filter.follow[0]
        }
      }
      this.select()
    },
    handleCurrentChange(val) {  // 分页的选择
      this.currentPage = val
      this.select()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.select()
    },
    handleClearFilter() {
      this.keywords = ''
      this.proValue = ''
      this.cityValue = ''
      this.follow = ''
      this.return_visit = ''
      this.follow_time = ''
      this.getCustomerList()
    },
    getCustomerList() {  // 获取客户列表
      this.fullscreenLoading = true
      var self = this
      if (!self.canView) {
        return
      }
      let params = {
        isAuth: 'all',
        demandOrService: this.demandOrService,
        keyword: this.keywords,
        page: this.currentPage,
        pagesize: this.pageSize,
        status: this.status,
        follow: this.follow,
        level: this.level,
        register: this.register,
        province: this.proValue,
        city: this.cityValue
      }
      if (this.return_visit && this.return_visit[0] && this.return_visit[1]) {
        let start = moment(this.return_visit[0]).format('YYYY-MM-DD HH:mm:ss')
        let end = moment(this.return_visit[1]).format('YYYY-MM-DD HH:mm:ss')
        params.return_visit = `${start} - ${end}`
      }
      if (this.follow_time && this.follow_time[0] && this.follow_time[1]) {
        let start = moment(this.follow_time[0]).format('YYYY-MM-DD HH:mm:ss')
        let end = moment(this.follow_time[1]).format('YYYY-MM-DD HH:mm:ss')
        params.follow_time = `${start} - ${end}`
      }
      self.apiGet('customers/mine', { params }).then((res) => {
        this.fullscreenLoading = false
        self.customerData(res)
      })
    },
    customerData(res) { // 对获取的客户列表的信息进行处理
      var self = this
      if (res.code != 200) {
        _g.dealError(self, res)
      } else {
        let { list } = res.data
        self.tableData = list
        self.currentPage = res.data.current_page
        self.dataCount = res.data.total_count
        self.dataPages = res.data.total_pages
        if (list) {
          for (var j = 0; j < list.length; j++) {
            const arr = ['', 'A热门客户', 'B普通客户', 'C潜在客户', 'D无法沟通']
            self.tableData[j].p_ranking = arr[list[j].level]
            if (list[j].followPeople.length != 0) {
              for (var i = 0; i < list[j].followPeople.length; i++) {
                if (i == 0) {
                  self.tableData[j].p_name = list[j].followPeople[i].name
                } else {
                  self.tableData[j].p_name += '、' + list[j].followPeople[i].name
                }
              }
            }
            if (list[j].demandServiceContacts) {
              self.canEdit ? self.tableData[j].p_contact = list[j].demandServiceContacts.name : null
              self.canEdit ? self.tableData[j].p_phone = list[j].demandServiceContacts.phone : null
            }
            if (list[j].followRecord) {
              self.tableData[j].p_content = list[j].followRecord.content
            }
          }
        }
      }
    },
    getFollowStaff() { // 获取跟进人员
      var self = this
      if (!self.canView) {
        return
      }
      self.apiGet('customers/customer_follow_list').then((res) => {
        if (res.code != 200) {
          _g.dealError(self, res)
        } else {
          self.sturdyMen = res.data.map(item => {
            return { value: item.id, text: item.name }
          })
          // self.sturdyMen.unshift({ name: '全部', id: '0' })
        }
      })
    }
  },
  computed: {
    loadingDone() {
      return !this.fullscreenLoading
    },
    hasNextPage() {
      return this.dataPages > 1
    },
    canBatch() { // 拥有批量释放
      return this.show == null || this.show['customers_batchFree']
    },
    canView() { // 拥有查看
      return this.show == null || this.show['myClient_view']
    },
    canViewAll() { // 拥有查看全部
      return this.show == null || this.show['myClient_viewAll']
    },
    canEdit() { // 拥有编辑
      return this.show == null || this.show['myClient_edit']
    },
    demandOrService() { // // 需求方或服务方
      return this.$route.name === 'myClientDemandList' ? 1 : 2
    },
    queryParams() {
      return { ...this.$route.query, type: this.demandOrService, isMine: 1 }
    }
  },
  created() {
    this.registerOption = registerOption
    let queryParams = this.$route.query
    let hasQuery = Object.keys(queryParams).length > 0 // 是否有查询参数
    hasQuery ? this.init(queryParams) : this.init()
  },
  components: {
    'reset-btn': resetBtn
  },
  mixins: [http]
}
</script>