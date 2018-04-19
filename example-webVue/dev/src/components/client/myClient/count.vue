<template>
  <div class="count" v-if="isCom" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="正在加载中">
    <el-row> 
      <el-col :span="24"><div class="m-b-20 count-title">客户统计</div></el-col>
    </el-row>
    <el-row>
      <el-col :span="8" :offset="8">
        <div class="tx-c">
          <div class="cus-num">{{ count_all }}</div>
          <div>客户总数</div>
        </div>
      </el-col>
     <!--  <el-col :span="8">
        <div class="tx-c">
          <div class="cus-num">{{ count }}</div>
          <div>有订单客户数</div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="tx-c">
          <div class="cus-num">{{ rate }}</div>
          <div>有订单客户占比</div>
        </div>
      </el-col> -->
    </el-row>
    <el-row> 
      <el-col :span="24"><div class="m-b-20 count-title">跟进统计</div></el-col>
    </el-row>
    <el-row v-if="isViewAll">
      <el-table border
        :data="customerCountList"
        v-show="!fullscreenLoading"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="员工">
        </el-table-column>
      
        <el-table-column
          label="跟进客户数"
          prop="count_all"
          sortable>
          <template scope="scope">
            <router-link :to="{ name: 'myClientList', params: { id: scope.row.id, name: scope.row.name, customer: '所有客户' }}" class="clor">
              {{ scope.row.count_all }}
            </router-link>
          </template>
        </el-table-column>
        
        <!-- <el-table-column
          label="有订单客户数"
          prop="count"
          sortable>
          <template scope="scope">
            <router-link :to="{ name: 'myClientList', params: { id: scope.row.id, name: scope.row.name, customer: '有订单客户' }}" class="clor">
              {{ scope.row.count }}
            </router-link>
          </template>
        </el-table-column>
       
        <el-table-column
          prop="ratio"
          label="订单客户占比"
          sortable>
        </el-table-column> -->
      </el-table>
    </el-row>

    <el-row v-if="isView">
      <el-table
        :data="customerCountList"
        border
        style="width: 100%">
        <el-table-column
          prop="name"
          label="员工">
        </el-table-column>
      
        <el-table-column
          label="跟进客户数"
          prop="count_all">
          <template scope="scope">
            <router-link :to="{ name: 'myClientList', params: { id: scope.row.id, name: scope.row.name, customer: '所有客户' }}" class="clor">
              {{ scope.row.count_all }}
            </router-link>
          </template>
        </el-table-column>
        
        <!--<el-table-column
          label="有订单客户数"
          prop="count">
          <template scope="scope">
            <router-link :to="{ name: 'myClientList', params: { id: scope.row.id, name: scope.row.name, customer: '有订单客户' }}" class="clor">
              {{ scope.row.count }}
            </router-link>
          </template>
        </el-table-column>
       
        <el-table-column
          prop="ratio"
          label="订单客户占比">
        </el-table-column>-->
      </el-table>
    </el-row>
  </div>
</template>

<style>
  .count .el-table th>.cell,
  .count .el-table td>.cell{
    text-align: center;
  }
  .count-title{
    width: 100%;
    height: 30px;
    line-height: 30px; 
    font-size: 14px; 
    color: #999;
  }
  .cus-num{
    font-size: 55px;
    font-weight: bold;
  }
  .clor {
    color: #20A0FF;
  }
</style>

<script>
  import http from '../../../assets/js/http'

  export default {
    data() {
      return {
        show: Lockr.get('authList'),
        count_all: '',
        count: '',
        rate: '',
        customerCountList: [],
        myself: false,
        isEdit: false,
        isView: false,
        isViewAll: false,
        isCom: false,
        fullscreenLoading: false
      }
    },
    methods: {
      getCustomerCount() { // 获取统计客户的信息
        var self = this
        self.apiGet('customers/mine_statistic').then((res) => {
          this.fullscreenLoading = false
          // console.log('4444444444444444res = ', _g.j2s(res))
          if (res.code != 200) {
            _g.dealError(self, res)
          } else {
            self.customerCountList = res.data.list
            self.count_all = res.data.count_all
            self.count = res.data.count
            self.rate = res.data.rate + '%'
            for (var i = 0; i < res.data.list.length; i++) {
              self.customerCountList[i].ratio = res.data.list[i].rate + '%'
            }
            // self.tableData = self.tableData
            // console.log('5555555555555res = ', _g.j2s(self.customerCountList))
          }
        })
      }
    },
    created() {
      this.fullscreenLoading = true
      var self = this
      if (self.show == null || self.show['myClient_view']) {
        self.isView = true
        self.isCom = true
      }
      if (self.show == null || self.show['myClient_viewAll']) {
        self.isViewAll = true
        self.isView = false
        self.isCom = true
      }
      self.getCustomerCount()
    },
    mixins: [http]
  }
</script>
