<template>
  <main class="l-dashboard-grid">
    <el-row :gutter="5">
      <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="5" class="hidden-md-and-down">
        <div class="l-dashboard-grid__item">
          <div class="l-dashboard-grid__item--title">
            <i class="iconfont icon-product l-dashboard-grid__icon"/>
            概要
          </div>
          <el-row class="c-product">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="c-product__title">DX200</el-col>
            <el-col :xs="12" :sm="12" :md="12" :lg="24" :xl="24" class="c-product__img">
              <img src = "@/assets/product.png" width = "176" height = "85">
            </el-col>
            <el-col :xs="12" :sm="12" :md="12" :lg="24" :xl="24" class="c-product__content">
              <div class="c-product__text"><span class="c-product__text--property">版本号</span>V1.0</div>
              <div class="c-product__text"><span class="c-product__text--property">硬件序号</span>123456</div>
              <div class="c-product__text"><span class="c-product__text--property">现在时间</span>{{ product.nowTime }}</div>
              <div class="c-product__text"><span class="c-product__text--property">运行时间</span>{{ product.runTime }}</div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="5">
        <div class="l-dashboard-grid__item">
          <div class="l-dashboard-grid__item--title">
            <i class="iconfont icon-storageusage l-dashboard-grid__icon"/>
            存储使用率
            <div v-show="storagePoolList.length > 0" style="display: inline-block; float: right; margin-right: 20px;">
              <el-select v-model="selectedStoragePool" @change="handleStoragePoolListSelectChange">
                <el-option v-for="item in storagePoolList" :key="item.altName" :label="item.altName" :value="item.altName"/>
              </el-select>
            </div>
          </div>
          <div v-show="storagePoolList.length === 0" class="c-storage-pool__hint">
            <i class="el-icon-warning"/>
            存储池暂未创建
          </div>
          <ring-chart
            v-show="storagePoolList.length > 0"
            :chart-data = "storagePool.chartData"
            :chart-settings="storagePool.chartSettings"
            :chart-extend="storagePool.chartExtend"
            chart-height="300px"/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="5">
        <div class="l-dashboard-grid__item">
          <div class="l-dashboard-grid__item--title">
            <i class="iconfont icon-memory l-dashboard-grid__icon"/>
            内存使用率
          </div>
          <ring-chart
            :chart-data = "memory.chartData"
            :chart-settings="memory.chartSettings"
            :chart-extend="memory.chartExtend"
            chart-height="300px"/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="9">
        <div class="l-dashboard-grid__item l-dashboard-grid__item--cpu">
          <div class="l-dashboard-grid__item--title">
            <i class="iconfont icon-cpu l-dashboard-grid__icon"/>
            CPU使用率
          </div>
          <div class="c-line-chart">
            <line-chart
              :chart-data = "cpu.chartData"
              :chart-extend="cpu.chartExtend"
              :chart-settings="cpu.chartSettings"
              :chart-height="cpuChartHeight"/>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="10">
        <div class="l-dashboard-grid__item l-dashboard-grid__item--disk">
          <div class="l-dashboard-grid__item--title">
            <i class="iconfont icon-disk l-dashboard-grid__icon"/>
            磁盘速率
          </div>
          <div class="c-line-chart">
            <line-chart
              :chart-data = "disk.chartData"
              :chart-extend="disk.chartExtend"
              :chart-settings="disk.chartSettings"
              chart-height = "200px"/>
          </div>
        </div>
        <div class="l-dashboard-grid__item l-dashboard-grid__item--network">
          <div class="l-dashboard-grid__item--title">
            <i class="iconfont icon-network l-dashboard-grid__icon"/>
            网络速率
          </div>
          <div class="c-line-chart">
            <line-chart
              :chart-data = "network.chartData"
              :chart-extend="network.chartExtend"
              :chart-settings="network.chartSettings"
              chart-height = "200px"/>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="14">
        <div class="l-dashboard-grid__item l-dashboard-grid__item--client">
          <div class="l-dashboard-grid__item--title">
            <i class="iconfont icon-disasterclient l-dashboard-grid__icon"/>
            容灾客户端
          </div>
          <div class="l-dashboard-grid__item--client-table">
            <san-client-table
              :table-data = "clientTableData"
              :current-page = "currentPage"
              :page-size = "pageSize"/>
            <san-client-pagination
              :table-total = "clientTableData.length"
              :current-page = "currentPage"
              :page-size = "pageSize"
              @handleSizeChange="handleSizeChange"
              @handleCurrentChange="handleCurrentChange"/>
          </div>
        </div>
      </el-col>
    </el-row>
  </main>
</template>

<script>
import { formatBytes, parseTime } from '@/utils/index'
import { getPerformance } from '@/api/SRDstor/systemManage'
import { getStoragePools } from '@/api/SRDstor/physicalResources/storagePools'
import { getSanClients } from '@/api/SRDstor/client/sanClients'
import RingChart from '@/components/Charts/ringChart'
import LineChart from '@/components/Charts/lineChart'
import SanClientTable from '@/views/client/sanClients/components/table'
import SanClientPagination from '@/components/Pagination/index'
export default {
  name: 'Dashboard',
  components: {
    RingChart,
    LineChart,
    SanClientTable,
    SanClientPagination
  },
  data() {
    return {
      product: {
        nowTime: '',
        runTime: ''
      },
      clientTableData: [],
      pageSize: 10,
      currentPage: 1,
      storagePoolList: [],
      selectedStoragePool: '',
      storagePool: {
        chartData: {},
        chartTitle: {},
        chartExtend: {},
        chartSettings: {}
      },
      memory: {
        chartData: {},
        chartTitle: {},
        chartExtend: {},
        chartSettings: {}
      },
      cpu: {
        chartData: {
          columns: ['索引', 'CPU利用率'],
          rows: []
        },
        chartTitle: {},
        chartExtend: {},
        chartSettings: {}
      },
      cpuChartHeight: '300px',
      screenWidth: document.documentElement.clientWidth,
      disk: {
        chartData: {
          columns: ['索引', '读速率', '写速率'],
          rows: []
        },
        chartTitle: {},
        chartExtend: {},
        chartSettings: {}
      },
      network: {
        chartData: {
          columns: ['索引', '发送速率', '接收速率'],
          rows: []
        },
        chartTitle: {},
        chartExtend: {},
        chartSettings: {}
      }
    }
  },
  watch: {
    screenWidth: function(val) {
      const self = this
      if (val <= 1900 && val >= 1200) {
        self.cpuChartHeight = '430px'
      } else {
        self.cpuChartHeight = '300px'
      }
    }
  },
  created() {
    const self = this
    window.onresize = function() {
      self.screenWidth = document.documentElement.clientWidth
      if (self.screenWidth <= 1900 && self.screenWidth >= 1200) {
        self.cpuChartHeight = '430px'
      } else {
        self.cpuChartHeight = '300px'
      }
    }
    let time = new Date().getTime()
    let timeList = new Array(50)
    for (let i = 0; i < timeList.length; i++) {
      timeList[i] = Number(time)
      time = Number(time) - 6000
    }
    timeList = timeList.reverse()
    this.cpu.chartData.rows = new Array(50)
    this.disk.chartData.rows = new Array(50)
    this.network.chartData.rows = new Array(50)
    for (let i = 0; i < timeList.length; i++) {
      this.cpu.chartData.rows[i] = { '索引': parseTime(timeList[i]), 'CPU利用率': '0' }
      this.disk.chartData.rows[i] = { '索引': parseTime(timeList[i]), '读速率': '0', '写速率': '0' }
      this.network.chartData.rows[i] = { '索引': parseTime(timeList[i]), '发送速率': '0', '接收速率': '0' }
    }
    this.$store.dispatch('GetStoragePoolMapTable')
    this.getStoragePools()
    this.getPerformance()
    this.getSanClients()
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    getSanClients() {
      getSanClients({ pagesize: this.pageSize, currpage: this.currentPage }).then(resp => {
        if (resp.rc === 0) {
          this.clientTableData = resp.data
        }
      })
    },
    /**
    *  FIXME
    **/
    getPerformance() {
      const self = this
      const COLORS_MAP = {
        '已用': '#41b4fd',
        '可用': '#e5e6ea'
      }
      getPerformance().then(resp => {
        if (resp.rc === 0) {
          this.product.runTime = resp.runtime
          this.product.nowTime = resp.nowtime
          const free = resp.data.memusg.free
          const used = resp.data.memusg.used
          const freeBytes = this.formatMemoryToByte(free)
          // const usedBytes = this.formatMemoryToByte(used)
          const freePercent = parseFloat(freeBytes / this.formatMemoryToByte(resp.data.memusg.total) * 100).toFixed(4)
          const level = 100 - parseInt(freePercent)
          if (level <= 70) {
            COLORS_MAP['已用'] = '#67c23a'
          } else if (level <= 90 && level > 70) {
            COLORS_MAP['已用'] = '#e6a23c'
          } else {
            COLORS_MAP['已用'] = '#e96661'
          }
          this.memory.chartData = {
            columns: ['类型', '百分率'],
            rows: [
              { '类型': '已用', '百分率': (100 - parseFloat(freePercent)), '容量': used },
              { '类型': '可用', '百分率': freePercent, '容量': free }
            ]
          }
          this.memory.chartSettings = {
            // roseType: 'radius',
            radius: ['55%', '60%'],
            offsetY: 115,
            labelLine: {
              show: false
            },
            label: {
              show: false
            }
          }
          this.memory.chartExtend = {
            /** 直角坐标系内绘图网格 */
            grid: {
              show: false,
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              containLabel: false
            },
            center: ['0', '100%'],
            /** 图例 */
            legend: {
              show: true,
              left: 'center',
              top: '80%',
              formatter: function(name) {
                if (self.memory.chartData !== null) {
                  if (name === '可用') {
                    return name + ' ' + self.memory.chartData.rows[self.memory.chartData.rows.length - 1]['容量']
                  } else if (name === '已用') {
                    return name + ' ' + self.memory.chartData.rows[self.memory.chartData.rows.length - 2]['容量']
                  }
                }
                return name
              },
              data: [{
                name: '已用',
                // 强制设置图形为圆。
                icon: 'circle',
                // 设置文本为#f63763
                textStyle: {
                  color: '#333'
                }
              }, {
                name: '可用',
                // 强制设置图形为圆。
                icon: 'circle',
                // 设置文本为#44494e
                textStyle: {
                  color: '#333'
                }
              }]
            },
            /** 系列列表 */
            series(series) {
              series.forEach(seriesItem => {
                // seriesItem.name = "可用"
                seriesItem.data = seriesItem.data.map(data => {
                  return {
                    name: data.name,
                    value: data.value,
                    itemStyle: {
                      color: COLORS_MAP[data.name]
                    }
                  }
                })
              })
              return series
            },
            title: {
              text: (100 - freePercent).toFixed(2) + '%',
              subtext: '使用率',
              left: 'center',
              top: '30%',
              textStyle: {
                color: '#333',
                fontWeight: 'bold',
                fontSize: 30
              },
              subtextStyle: {
                color: '#999',
                fontSize: 14
              }
            }
          }
          this.cpu.chartData.rows.shift()
          this.cpu.chartData.rows.push({ '索引': parseTime(new Date().getTime()), 'CPU利用率': 100 - parseInt(resp.data.cpuinfo.cpuusg.idlpc) })
          this.cpu.chartExtend = {
            grid: {
              left: 0,
              bottom: 20,
              right: 0,
              top: 20, // here
              containLabel: false,
              show: false
            },
            legend: {
              show: true,
              right: 5,
              top: -5,
              formatter: function(name) {
                if (self.cpu.chartData !== null) {
                  return name + ' ' + parseFloat(self.cpu.chartData.rows[self.cpu.chartData.rows.length - 1][name]).toFixed(2) + '%'
                }
                return name
              },
              data: [{
                name: 'CPU利用率',
                icon: 'circle'
              }]
            },
            // tooltip: {
            //   formatter: '{a0}: {c0}'
            // },
            xAxis: {
              show: true,
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#ccc',
                  type: 'dashed',
                  opacity: 0.5
                }
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                show: false
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#ccc',
                  type: 'dashed',
                  opacity: 0.5
                }
              }
            },
            yAxis: {
              show: true,
              max: 100,
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#ccc',
                  type: 'dashed',
                  opacity: 0.5
                }
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                show: false
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#ccc',
                  type: 'dashed',
                  opacity: 0.5
                }
              }
            },
            series: {
              type: 'line',
              symbol: 'none'
            },
            lineStyle: {
              color: '#78ffa0'
            },
            itemStyle: {
              color: '#78ffa0'
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 1,
                x2: 0,
                y2: 0,
                colorStops: [{
                  offset: 0, color: '#78ffa0' // 0% 处的颜色
                }, {
                  offset: 0.5, color: '#78ffa0'
                }, {
                  offset: 1, color: '#78ffa0' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              },
              opacity: 0.3
            },
            smoothMonotone: 'none',
            smooth: true
          }
          this.cpu.chartSettings = {
            axisVisible: true,
            area: true,
            scale: [true]
          }
          const ColorArr = ['#61e2c3', '#f9e883']
          self.disk.chartData.rows.push({
            '索引': parseTime(new Date().getTime()),
            '读速率': self.formatMemoryToByte(resp.data.bandwidth.diskio.read),
            '写速率': self.formatMemoryToByte(resp.data.bandwidth.diskio.write) })
          self.disk.chartData.rows.shift()
          self.disk.chartExtend = {
            grid: {
              left: 0,
              bottom: 20,
              right: 0,
              top: 20, // here
              containLabel: false,
              show: false
            },
            legend: {
              show: true,
              right: 5,
              top: -5,
              formatter: function(name) {
                if (self.disk.chartData !== null) {
                  return name + ' ' + formatBytes(self.disk.chartData.rows[self.disk.chartData.rows.length - 1][name]) + '/s'
                }
                return name
              },
              data: [{
                name: '读速率',
                icon: 'circle'
              }, {
                name: '写速率',
                icon: 'circle'
              }]
            },
            // tooltip: {
            //   formatter: '{a0}: {c0}<br />{a1}: {c1}'
            // },
            xAxis: {
              show: true,
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#ccc',
                  type: 'dashed',
                  opacity: 0.5
                }
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                show: false
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#ccc',
                  type: 'dashed',
                  opacity: 0.5
                }
              }
            },
            yAxis: {
              show: true,
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#ccc',
                  type: 'dashed',
                  opacity: 0.5
                }
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                show: false
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#ccc',
                  type: 'dashed',
                  opacity: 0.5
                }
              }
            },
            series(v) {
              v.forEach((e, idx) => {
                e.lineStyle = {
                  color: ColorArr[idx], // 线条颜色
                  width: 2 // 线条宽度
                }
                e.itemStyle = {
                  borderWidth: 0,
                  color: ColorArr[idx],
                  borderType: 'solid',
                  opacity: 0
                }
                e.areaStyle = {
                  color: ColorArr[idx],
                  opacity: 0.3
                }
              })
              return v
            },
            smoothMonotone: 'none',
            smooth: true
          }
          self.disk.chartSettings = {
            axisVisible: true,
            area: true,
            scale: [true]
          }
          const ColorArr2 = ['#fda5a1', '#97caff']
          self.network.chartData.rows.push({
            '索引': parseTime(new Date().getTime()),
            '发送速率': self.formatMemoryToByte(resp.data.bandwidth.netio.send),
            '接收速率': self.formatMemoryToByte(resp.data.bandwidth.netio.recv) })
          self.network.chartData.rows.shift()
          self.network.chartExtend = {
            grid: {
              left: 0,
              bottom: 20,
              right: 0,
              top: 20, // here
              containLabel: false,
              show: false
            },
            legend: {
              show: true,
              right: 5,
              top: -5,
              formatter: function(name) {
                if (self.network.chartData !== null) {
                  return name + ' ' + formatBytes(self.network.chartData.rows[self.network.chartData.rows.length - 1][name])
                }
                return name
              },
              data: [{
                name: '发送速率',
                icon: 'circle'
              }, {
                name: '接收速率',
                icon: 'circle'
              }]
            },
            // tooltip: {
            //   formatter: '{a0}: {c0}<br />{a1}: {c1}'
            // },
            xAxis: {
              show: true,
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#ccc',
                  type: 'dashed',
                  opacity: 0.5
                }
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                show: false
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#ccc',
                  type: 'dashed',
                  opacity: 0.5
                }
              }
            },
            yAxis: {
              show: true,
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#ccc',
                  type: 'dashed',
                  opacity: 0.5
                }
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                show: false
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#ccc',
                  type: 'dashed',
                  opacity: 0.5
                }
              }
            },
            series(v) {
              v.forEach((e, idx) => {
                e.lineStyle = {
                  color: ColorArr2[idx], // 线条颜色
                  width: 2 // 线条宽度
                }
                e.itemStyle = {
                  borderWidth: 0,
                  color: ColorArr2[idx],
                  borderType: 'solid',
                  opacity: 0
                }
                e.areaStyle = {
                  color: ColorArr2[idx],
                  opacity: 0.3
                }
              })
              return v
            },
            smoothMonotone: 'none',
            smooth: true
          }
          self.network.chartSettings = {
            axisVisible: true,
            area: true,
            scale: [true]
          }
        }
        const timer = setTimeout(() => {
          this.getPerformance()
        }, 6000)
        this.$once('hook:beforeDestroy', () => {
          clearTimeout(timer)
        })
      })
    },
    handleStoragePoolListSelectChange(val) {
      this.storagePoolList.forEach(item => {
        if (item.altName === val) {
          this.getStoragePool(item.free, item.allocated, item.size)
        }
      })
    },
    getStoragePool(free, allocated, size) {
      const self = this
      const COLORS_MAP = {
        '已用': '#f57277',
        '可用': '#e5e6ea'
      }
      const level = allocated / size * 100
      if (level <= 70) {
        COLORS_MAP['已用'] = '#67c23a'
      } else if (level <= 90 && level > 70) {
        COLORS_MAP['已用'] = '#e6a23c'
      } else {
        COLORS_MAP['已用'] = '#e96661'
      }
      this.storagePool.chartData = {
        columns: ['类型', '百分率'],
        rows: [
          { '类型': '已用', '百分率': allocated, '容量': allocated },
          { '类型': '可用', '百分率': free, '容量': free }
        ]
      }
      this.storagePool.chartSettings = {
        // roseType: 'radius',
        radius: ['55%', '60%'],
        offsetY: 115,
        labelLine: {
          show: false
        },
        label: {
          show: false
        }
      }
      this.storagePool.chartExtend = {
        /** 直角坐标系内绘图网格 */
        grid: {
          show: false,
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          containLabel: false
        },
        center: ['0', '100%'],
        /** 图例 */
        legend: {
          show: true,
          left: 'center',
          top: '80%',
          formatter: function(name) {
            if (self.storagePool.chartData !== null) {
              if (name === '可用') {
                return name + ' ' + formatBytes(parseInt(self.storagePool.chartData.rows[self.storagePool.chartData.rows.length - 1]['容量']))
              } else if (name === '已用') {
                return name + ' ' + formatBytes(parseInt(self.storagePool.chartData.rows[self.storagePool.chartData.rows.length - 2]['容量']))
              }
            }
            return name
          },
          data: [{
            name: '已用',
            // 强制设置图形为圆。
            icon: 'circle',
            // 设置文本为#f63763
            textStyle: {
              color: '#333'
            }
          }, {
            name: '可用',
            // 强制设置图形为圆。
            icon: 'circle',
            // 设置文本为#44494e
            textStyle: {
              color: '#333'
            }
          }]
        },
        /** 系列列表 */
        series(series) {
          series.forEach(seriesItem => {
            // seriesItem.name = "可用"
            seriesItem.data = seriesItem.data.map(data => {
              return {
                name: data.name,
                value: data.value,
                itemStyle: {
                  color: COLORS_MAP[data.name]
                }
              }
            })
          })
          return series
        },
        title: {
          text: parseFloat(allocated / size * 100).toFixed(2) + '%',
          subtext: '使用率',
          left: 'center',
          top: '30%',
          textStyle: {
            color: '#333',
            fontWeight: 'bold',
            fontSize: 30
          },
          subtextStyle: {
            color: '#999',
            fontSize: 14
          }
        }
      }
    },
    // 获取存储池列表 默认展示第一位
    getStoragePools() {
      getStoragePools().then(resp => {
        let free = 0
        let allocated = 0
        let size = 100
        if (resp.rc === 0 && resp.data.storagepools !== null && resp.data.storagepools.length > 0) {
          free = resp.data.storagepools[0].free
          allocated = resp.data.storagepools[0].allocated
          size = resp.data.storagepools[0].size
          resp.data.storagepools.forEach(item => {
            item.altName = this.$store.getters.storagePoolNameMap[item.name]
          })
          this.selectedStoragePool = resp.data.storagepools[0].altName
          this.storagePoolList = resp.data.storagepools
          this.getStoragePool(free, allocated, size)
        }
      })
    },
    formatMemoryToByte(str) {
      const val = str.replace(/[^0-9.]/ig, '')
      const unit = str.replace(/[^a-z]+/ig, '').toUpperCase()
      const size = {
        'B': 0,
        'K': 10,
        'M': 20,
        'G': 30,
        'T': 40,
        'KB': 10,
        'MB': 20,
        'GB': 30,
        'TB': 40
      }
      return val * Math.pow(2, size[unit] || 0)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.l-dashboard-grid {
  color: hsl(0, 0%, 40%);
  font-size: 14px;
  margin: 10px;
  &__icon {
    padding:0 5px;
    font-size: 14px;
  }
  &__item {
    height: 360px;
    margin: 10px;
    background: #fff;
    /*box-shadow: 0 4px 6px 0 hsla(0, 0%, 0%, 0.2);*/
    &--title {
      padding: 10px 0;
    }
    &--disk {
      height: 230px;
      margin-bottom: 20px;
    }
    &--network {
      height: 230px;
    }
    &--client {
      height: auto;
      padding:0 5px 20px 5px;
    }
    &--client-table {
      padding: 0 25px;
    }
  }
}
.c-storage-pool {
  &__hint {
    text-align: center;
    margin-top: 120px;
    color: hsl(0, 0%, 17%);
    font-size: 16px;
  }
}
.c-product {
  &__title {
    text-align: center;
    font-size: 20px;
    font-weight: 600;
    color: hsl(0, 0%, 26%);
  }
  &__img {
    text-align: center;
    padding: 10px 0;
  }
  &__text {
    padding: 10px 0;
    width: 200px;
    margin: 0 auto;
    &--property {
      display: inline-block;
      width: 60px;
    }
  }
}
.c-line-chart {
  padding: 0 28px;
}
@media only screen and (min-width: 1200px) {
  .l-dashboard-grid__item--cpu {
    height: 480px;
  }
}
@media only screen and (min-width: 1920px) {
  .l-dashboard-grid__item--cpu {
    height: 360px;
  }
}
</style>
