<template>
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
    <el-table-column prop="num"
                     width="150"
                     label="编号"
                     header-align="center">
    </el-table-column>
    <el-table-column fixed
                     prop="name"
                     width="240"
                     label="公司名称"
                     header-align="center">
    </el-table-column>
    <el-table-column width="120"
                     prop="reg"
                     label="是否注册"
                     :filter-multiple="false"
                     :filters="registerOption"
                     header-align="center">
    </el-table-column>
    <el-table-column label="客户级别"
                     width="150"
                     prop="p_ranking"
                     :filter-multiple="false"
                     :filters="levelOptions"
                     column-key="p_ranking"
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
    <el-table-column label="跟进状态"
                     width="150"
                     prop="followStatus"
                     :filter-multiple=false
                     :filters="followStatus"
                     column-key="followStatus"
                     header-align="center">
    </el-table-column>
    <el-table-column label="跟进人员"
                     prop="p_name"
                     width="150"
                     header-align="center">
    </el-table-column>
    <el-table-column label="跟进记录"
                     width="200"
                     prop="p_content"
                     show-overflow-tooltip
                     header-align="center">
    </el-table-column>
    <el-table-column label="最新跟进时间"
                     width="150"
                     header-align="center"
                     prop="followRecord.create_time">
    </el-table-column>
    <el-table-column label="回访时间"
                     width="150"
                     header-align="center"
                     prop="followRecord.create_time">
    </el-table-column>
    <el-table-column label="操作"
                     fixed="right"
                     inline-template
                     :width="getOprWidth"
                     header-align="center">
      <div>
        <router-link class="btn-link edit-btn"
                     :to="{ name: 'myClientDetail', params: { id: row.id, path }}">
          查看
        </router-link>
        <router-link class="btn-link edit-btn"
                     v-if="canEdit"
                     :to="{ name: 'myClientEdit', params: { id: row.id, path }}">
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
</template>
<style >

</style>
<script>
import http from 'assets/js/http'
import levelOptions from 'assets/json/client_level.json'
import followOptions from 'assets/json/follow_status.json'
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
      levelOptions: levelOptions,
      followOptions: followOptions,
      sturdyMen: [],
      sturdyMan: '',
      follow: '',
      isEmpty: false,
      isNull: false,
      isRegister: null,
      level: '',
      returnView: '',
      lastFollowView: '',
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
      let { follow, sturdyMan, customer, level, status, pageSize } = this
      let query = {}
      page ? query.page = page : null
      city ? query.city = city : null
      level ? query.level = level : null
      follow ? query.follow = follow : null
      status ? query.status = status : null
      keyword ? query.keyword = keyword : null
      province ? query.province = province : null
      sturdyMan ? query.sturdyMan = sturdyMan : null
      customer ? query.customer = customer : null
      pageSize ? query.pageSize = pageSize : null
      router.push({ path: '/client/myClient/list', query })
    },
    init(params = null) {
      this.fullscreenLoading = true
      this.path = this.$route.fullPath
      if (params) {
        this.keywords = params.keyword || ''
        this.currentPage = Number(params.page) || 1
        this.proValue = params.province || ''
        this.cityValue = params.city || ''
        this.sturdyMan = Number(params.sturdyMan) || ''
        this.follow = Number(params.sturdyMan) || ''
        this.pageSize = Number(params.pageSize) || ''
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
      this.select()
    },
    handleCurrentChange(val) {  // 分页的选择
      this.currentPage = val
      this.select()
    },
    handleSizeChange(val) { // 分页大小
      this.pageSize = val
      this.select()
    },
    handleClearFilter() { // 重置筛选条件
      this.keywords = ''
      this.proValue = ''
      this.cityValue = ''
      this.follow = ''
      this.sturdyMan = ''
    },
    getCustomerList() {  // 获取客户列表
      this.fullscreenLoading = true
      if (!this.canView) {
        return
      }
      this.apiGet(this.fetchAPI, { params: this.fetchParams })
        .then((res) => {
          this.fullscreenLoading = false
          this.customerData(res)
        })
    },
    customerData(res) { // 对获取的客户列表的信息进行处理
      if (res.code != 200) {
        _g.dealError(this, res)
      } else {
        let { list } = res.data
        this.tableData = list
        this.currentPage = res.data.current_page
        this.dataCount = res.data.total_count
        this.dataPages = res.data.total_pages
        if (list) {
          for (let item of list) {
            let arr = this.levelOptions.map(item => item.label).unshirt('')
            this.tableData[j].p_ranking = arr[item.level]
            if (this.tableData.followPeople.length != 0) {
              for (var i = 0; i < item.followPeople.length; i++) {
                if (i == 0) {
                  this.tableData[j].p_name = item.followPeople[i].name
                } else {
                  this.tableData[j].p_name += '、' + item.followPeople[i].name
                }
              }
            }
          }
        }
      }
    }
  },
  computed: {
    getOprWidth() { // 动态宽度
      return this.canEdit ? 150 : 75
    },
    loadingDone() { // 加载是否完成
      return !this.fullscreenLoading
    },
    hasNextPage() { // 是否有下一页
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
    fetchAPI() { // 请求数据的API接口
      let parameter = this.$route.name === 'myClientList' ? '/mine' : null
      let api = `customers${parameter}?isAuth=all`
      return api
    },
    fetchParams() { // 请求携带的参数
      let params = {
        keyword: this.keywords,
        page: this.currentPage,
        pagesize: this.pageSize,
        status: this.status,
        follow: this.follow,
        level: this.level,
        province: this.proValue,
        city: this.cityValue
      }
      return params
    }
  },
  created() {
    // this.levelOptions = levelOptions
    // this.followOptions = followOptions
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