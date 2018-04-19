<template>
  <el-dialog ref="dialog" title="选择跟进人员" v-model="dialogVisible" class="staff-dialog" style="min-width: 800px;">
    <div class="fr w-300 dialog-search m-b-20" >
      <el-input placeholder="请输入员工姓名" v-model="keywords" style="display: inline-table;">
        <el-button slot="append" icon="search" @click.prevent="searchStaff()"></el-button>
      </el-input>
    </div>
    
    <el-row style="margin-top: 35px;margin-left: 40px;">
      <el-col :span="4"><div class="staff" :class="{'staffActive': saleActive}" @click="clickSelect('salesman')">销售人员</div></el-col>
      <el-col :span="4"><div class="staff" :class="{'staffActive': serviceActive}" @click="clickSelect('serviceman')">客服</div></el-col>
      <el-col :span="4"><div class="staff" :class="{'staffActive': pushActive}" @click="clickSelect('pushman')">地推</div></el-col>
    </el-row>
    
    <div style="height: 300px;border: 1px solid #ccc;margin: 0 40px;color: #169BD9;">
      <div v-show="saleActive" v-for="item in staffList">
        <el-row style="margin: 20px 0 0 50px;float: left;">
          <el-col :span="4"><el-button type="text" class="tx-c cur-pointer w-80" @click.prevent="selectStaff(item,'销售人员')">{{ item.name }}</el-button></el-col>
        </el-row>
      </div>

      <div v-show="serviceActive" v-for="item in staffList">
        <el-row style="margin: 20px 0 0 50px;float: left;">
          <el-col :span="4"><el-button type="text" class="tx-c cur-pointer w-80" @click.prevent="selectStaff(item,'客服')">{{ item.name }}</el-button></el-col>
        </el-row>
      </div>

      <div v-show="pushActive" v-for="item in staffList">
        <el-row style="margin: 20px 0 0 50px;float: left;">
          <el-col :span="4"><el-button type="text" class="tx-c cur-pointer w-80" @click.prevent="selectStaff(item,'地推')">{{ item.name }}</el-button></el-col>
        </el-row>
      </div>

      <div class="block fr pag" >
        <el-pagination
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :total="dataCount">
        </el-pagination>
      </div>
    </div>
    <el-row style="margin-top: 10px;">
      <el-col :span="2"><div class="tx-c">已选人员</div></el-col>
      <el-col :span="4"><div class="tx-c">销售人员：<el-tag type="gray" v-show="saleStaff">{{ saleStaff }}</el-tag></div></el-col>
      <el-col :span="4"><div class="tx-c">客服：<el-tag type="gray" v-show="serviceStaff">{{ serviceStaff }}</el-tag></div></el-col>
      <el-col :span="4"><div class="tx-c">地推：<el-tag type="gray" v-show="pushStaff">{{ pushStaff }}</el-tag></div></el-col>
    </el-row>

    <span slot="footer" class="dialog-footer" style="padding-top: 0;">
      <el-button @click="cancel()">取 消</el-button>
      <el-button type="primary" @click="submit()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<style>
  .staff{
    text-align: center;
    cursor: pointer;
  }
  .pag{
    margin-right: 20px; 
    clear: both; 
    position: absolute; 
    right: 60px; 
    bottom: 120px;
  }
  .staffActive{
    border: 1px solid #ccc;
    border-bottom: 2px solid #fff;
    margin-bottom: -2px;
    color: #3399FF;
  }
  .staff-dialog .el-dialog {
    min-width: 960px
  }
  .staff-dialog .el-dialog__body{
    padding-bottom: 0;
  }
  .dialog-search{
    margin-right: 40px;
  }
  .cur-pointer{
    cursor: pointer;
  }
</style>

<script>
  import http from '../../../assets/js/http'
  // import info from './info.vue'
  export default {
    props: ['followPeople'],
    data() {
      return {
        dialogVisible: false,
        saleActive: true,
        serviceActive: false,
        pushActive: false,
        staffList: [],
        currentPage: 1,
        dataCount: 10,
        keywords: '',
        saleStaff: '',
        saleStaffId: '',
        serviceStaff: '',
        serviceStaffId: '',
        pushStaff: '',
        pushStaffId: '',
        selectedStaff: [],
        staffName: '',
        pageType: 'salesman'
      }
    },
    methods: {
      handleCurrentChange(val) { // 分页的选择
        var self = this
        self.currentPage = val
        self.clickSelect(self.pageType)
      },
      open() { // 打开模态框
        var self = this
        self.$refs.dialog.open()
      },
      close() { // 关闭模态框
        var self = this
        self.$refs.dialog.close()
      },
      cancel() { // 关闭模态框
        var self = this
        self.dialogVisible = false
        self.saleStaff = ''
        self.serviceStaff = ''
        self.pushStaff = ''
        for (var i = 0; i < self.followPeople.length; i++) {
          if (self.followPeople[i].label == '销售人员') {
            self.saleStaff = self.followPeople[i].name
            self.saleStaffId = self.followPeople[i].id
          } else if (self.followPeople[i].label == '客服') {
            self.serviceStaff = self.followPeople[i].name
            self.serviceStaffId = self.followPeople[i].id
          } else if (self.followPeople[i].label == '地推') {
            self.pushStaff = self.followPeople[i].name
            self.pushStaffId = self.followPeople[i].id
          }
        }
      },
      submit() { // 确定选择的跟进人员
        var self = this
        var saleStaffs = ''
        var serviceStaffs = ''
        var pushStaffs = ''
        self.dialogVisible = false
        if (self.saleStaff) {
          saleStaffs = { 'name': self.saleStaff, 'id': self.saleStaffId, 'label': '销售人员' }
        } else {
          saleStaffs = ''
        }
        if (self.serviceStaff) {
          serviceStaffs = { 'name': self.serviceStaff, 'id': self.serviceStaffId, 'label': '客服' }
        } else {
          serviceStaffs = ''
        }
        if (self.pushStaff) {
          pushStaffs = { 'name': self.pushStaff, 'id': self.pushStaffId, 'label': '地推' }
        } else {
          pushStaffs = ''
        }
        if (saleStaffs && serviceStaffs && pushStaffs) {
          self.selectedStaff = [saleStaffs, serviceStaffs, pushStaffs]
        } else if (saleStaffs && serviceStaffs && !pushStaffs) {
          self.selectedStaff = [saleStaffs, serviceStaffs]
        } else if (saleStaffs && !serviceStaffs && pushStaffs) {
          self.selectedStaff = [saleStaffs, pushStaffs]
        } else if (saleStaffs && !serviceStaffs && !pushStaffs) {
          self.selectedStaff = [saleStaffs]
        } else if (!saleStaffs && serviceStaffs && pushStaffs) {
          self.selectedStaff = [serviceStaffs, pushStaffs]
        } else if (!saleStaffs && serviceStaffs && !pushStaffs) {
          self.selectedStaff = [serviceStaffs]
        } else if (!saleStaffs && !serviceStaffs && pushStaffs) {
          self.selectedStaff = [pushStaffs]
        } else {
          self.selectedStaff = []
        }
        self.$emit('selectedStaff', self.selectedStaff)
      },
      clickSelect(str) { // 点击tab选择角色
        var self = this
        self.pageType = str
        if (str == 'salesman') {
          self.saleActive = true
          self.serviceActive = false
          self.pushActive = false
          self.getStaff('销售人员')
        } else if (str == 'serviceman') {
          self.saleActive = false
          self.serviceActive = true
          self.pushActive = false
          self.getStaff('客服')
        } else {
          self.saleActive = false
          self.serviceActive = false
          self.pushActive = true
          self.getStaff('地推')
        }
      },
      getStaff(str) { // 根据角色获取人员
        var self = this
        self.staffList = []
        self.staffName = str
        self.apiGet('demand_user/follow_people?role=' + str + '&page=' + self.currentPage).then((res) => {
          // console.log('3333333res', _g.j2s(res))
          if (res.code == 200) {
            self.staffList = res.data.list
            self.dataCount = res.data.total_pages * 10
            // console.log('4444444444res=', _g.j2s(self.staffList))
          } else {
            _g.dealError(this, res)
          }
        })
      },
      searchStaff() { // 搜索人员
        var self = this
        self.staffList = []
        self.apiGet('demand_user/follow_people?role=' + self.staffName + '&page_size=' + '&page=' + self.currentPage + '&keyword=' + self.keywords).then((res) => {
          // console.log('3333333res', _g.j2s(res))
          if (res.code == 200) {
            self.staffList = res.data.list
            self.dataCount = res.data.total_pages * 10
            // console.log('666res=', _g.j2s(self.staffList))
          } else {
            _g.dealError(this, res)
          }
        })
      },
      selectStaff(item, str) { // 选择人员
        var self = this
        if (str == '销售人员') {
          if (item.follow_num > item.count) {
            self.saleStaff = item.name
            self.saleStaffId = item.id
          } else {
            _g.toastMsg(self, 'warning', '该跟进人员的跟进客户数已达上限！')
          }
        } else if (str == '客服') {
          if (item.follow_num > item.count) {
            self.serviceStaff = item.name
            self.serviceStaffId = item.id
          } else {
            _g.toastMsg(self, 'warning', '该跟进人员的跟进客户数已达上限！')
          }
        } else if (str == '地推') {
          if (item.follow_num > item.count) {
            self.pushStaff = item.name
            self.pushStaffId = item.id
          } else {
            _g.toastMsg(self, 'warning', '该跟进人员的跟进客户数已达上限！')
          }
        }
      }
    },
    created() {
      var self = this
      self.getStaff('销售人员')
      for (var i = 0; i < self.followPeople.length; i++) { // 对获取到的父级页面的跟进人员进行处理
        if (self.followPeople[i].label == '销售人员') {
          self.saleStaff = self.followPeople[i].name
          self.saleStaffId = self.followPeople[i].id
        } else if (self.followPeople[i].label == '客服') {
          self.serviceStaff = self.followPeople[i].name
          self.serviceStaffId = self.followPeople[i].id
        } else if (self.followPeople[i].label == '地推') {
          self.pushStaff = self.followPeople[i].name
          self.pushStaffId = self.followPeople[i].id
        }
      }
    },
    mounted() {
      var self = this
    },
    components: {
      // info
    },
    mixins: [http]
  }
</script>