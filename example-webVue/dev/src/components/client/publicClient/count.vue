<template>
  <div class="common_count"
       v-if="isView"
       v-loading.fullscreen.lock="fullscreenLoading"
       element-loading-text="正在加载中">
    <div class="block fr m-r-5 m-b-20">
      <el-date-picker v-model="time"
                      type="daterange"
                      placeholder="选择日期范围"
                      format="yyyy-MM-dd"
                      @change="searchCount()">
      </el-date-picker>
    </div>
    <div id="main"
         ref="main"
         v-show="is_echarts"></div>
    <el-table border
              v-if="loadingDone"
              :data="tableData"
              style="width: 100%">
  
      <el-table-column prop="all"
                       label="公海客户数"
                       :span="4">
      </el-table-column>
  
      <el-table-column prop="notComfirm"
                       label="未联系"
                       :span="4">
      </el-table-column>
  
      <el-table-column prop="followed"
                       label="已跟进"
                       :span="4">
      </el-table-column>
  
      <el-table-column prop="needVisit"
                       label="需回访"
                       :span="4">
      </el-table-column>
  
      <el-table-column prop="invalid"
                       label="无效"
                       :span="4">
      </el-table-column>
  
      <el-table-column prop="ratio"
                       label="有效率"
                       :span="4">
      </el-table-column>
  
    </el-table>
  </div>
</template>

<style>
#main {
  width: 600px;
  height: 400px;
  margin: auto;
}

.common_count .el-table th>.cell,
.common_count .el-table td>.cell {
  text-align: center;
}
</style>

<script>
import http from 'assets/js/http'
import echarts from 'assets/js/echarts.min'
export default {
  data() {
    return {
      fullscreenLoading: false,
      tableData: [],
      time: '',
      is_echarts: true,
      startT: '',
      endT: '',
      isView: false,
      show: Lockr.get('authList')
    }
  },
  methods: {
    getCustomerCount() { // 获取统计客户的信息
      var self = this
      self.apiGet('customers/customer_statistic').then((res) => {
        // console.log('res = ', _g.j2s(res))
        this.fullscreenLoading = false
        if (res.code != 200) {
          _g.dealError(self, res)
        } else {
          if (res.data) {
            for (let key in res.data) {
              res.data[key] = res.data[key] || 0
            }
            res.data.ratio = res.data.ratio + '%'
          }
          self.tableData.push(res.data)
        }
      })
    },
    getData() { // 通过时间刷选统计的客户的信息
      var self = this
      self.tableData = []
      self.apiGet('customers/customer_statistic?time=' + self.startT + ' - ' + self.endT).then((res) => {
        this.fullscreenLoading = false
        if (res.code != 200) {
          _g.dealError(self, res)
        } else {
          if (res.data) {
            res.data.ratio = res.data.ratio + '%'
          }
          self.tableData.push(res.data)
        }
        self.echartCircle()
      })
    },
    searchCount() { // 转换日期的格式
      var self = this
      // alert(self.time[0])
      if (self.time != null) {
        self.startT = moment(self.time[0]).format('YYYY-MM-DD')
        self.endT = moment(self.time[1]).format('YYYY-MM-DD')
        self.getData()
      } else {
        return
      }
    },
    echartCircle() { // 以扇形的方式展示客户信息
      // 引入 ECharts 主模块
      // var echarts = require('echarts')
      var self = this
      var notComfirmData = '未联系'
      var followedData = '已跟进'
      var invalidData = '无效'
      var needVisitData = '需回访'
      var data = []
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'))
      if (!self.tableData[0].all) {
        self.is_echarts = false
        return
      }
      self.is_echarts = true
      if (self.tableData[0].followed) {
        data.push(followedData)
      }
      if (self.tableData[0].notComfirm) {
        data.push(notComfirmData)
      }
      if (self.tableData[0].invalid) {
        data.push(invalidData)
      }
      if (self.tableData[0].needVisit) {
        data.push(needVisitData)
      }
      // console.log('data=' + _g.j2s(data))
      // 绘制图表
      myChart.setOption({
        color: ['#999999', '#00CC00', '#FF0000', '#199ED8'],
        title: {
          text: '公海客户数' + '\n\n' + self.tableData[0].all + '\n\n' + '有效率：' + self.tableData[0].ratio,
          x: 'center',
          y: 'center',
          itemGap: 20,
          textStyle: {
            color: '#000',
            fontFamily: '微软雅黑',
            fontSize: 20,
            fontWeight: 'bolder'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} <br/> 数量：{c} </br> 占比：{d}%'
        },
        legend: {
          orient: 'vertical',
          x: 'right',
          y: 'center',
          selectedMode: false,
          data: data
        },
        calculable: true,
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['55%', '70%'],
            itemStyle: {
              normal: {
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              },
              emphasis: {
                label: {
                  show: true,
                  position: 'center',
                  textStyle: {
                    fontSize: '20',
                    fontWeight: 'bold'
                  }
                }
              }
            },
            data: [
              { value: self.tableData[0].notComfirm, name: '未联系' },
              { value: self.tableData[0].followed, name: '已跟进' },
              { value: self.tableData[0].invalid, name: '无效' },
              { value: self.tableData[0].needVisit, name: '需回访' }
            ]
          }
        ]
      })
      this.fullscreenLoading = false
    },
    echartShow() {
      var self = this
      var time = ''
      if (self.tableData.length) {
        clearTimeout(time)
        self.echartCircle()
      } else {
        time = setTimeout(function () {
          self.echartShow()
        }, 1000)
      }
    }
  },
  computed: {
    loadingDone() {
      return !this.fullscreenLoading
    }
  },
  created() {
    this.fullscreenLoading = true
    if (this.show == null || this.show['publicClient_view'] || this.show['publicClient_edit'] || this.show['publicClient_button']) {
      this.isView = true
    }
    this.getCustomerCount()
  },
  mounted() {
    this.echartShow()
  },
  mixins: [http]
}
</script>