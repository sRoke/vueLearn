<template>
  <main class = "l-storage-pool-container">
    <section class = "l-storage-pool-container__main">
      <section v-if="storagePoolslist.length === 0">
        <!-- 创建存储池视图 -->
        <div v-loading="loading" >
          <div class="c-storage-pool__warning"><i class="el-icon-info"/> 当前不存在存储池,请先创建存储池:</div>
          <create-form :table-data = "tableData" @handleViewVisible = "handleViewVisible('storagePoolChartView')" @updateData = "getStoragePools"/>
        </div>
      </section>
      <el-carousel v-else :autoplay = "false" :loop = "false" height = "100%" class="c-storage-pool" @change="handleViewVisible('storagePoolChartView')">
        <el-carousel-item v-for="item in storagePoolslist" :key="item.name">
          <section v-loading="loading" class="c-storage-pool__item">
            <el-row class = "c-storage-pool__header">
              <el-col v-show = "visible.storagePoolChartView || visible.storagePoolStatisticsView" :span="22">
                <el-button icon="iconfont icon-create" size="small" type="primary" @click = "handleViewVisible('createStoragePoolView')">创建</el-button>
                <el-button
                  icon="iconfont icon-edit"
                  plain
                  size="small"
                  @click = "handleEditStoragePoolDialogVisible(item.altName, item.name, item.property.isAutoReplace, item.devTree.hotSpareDeviceAry)">
                  编辑
                </el-button>
                <el-button
                  :disabled="item.raid === 2"
                  icon="iconfont icon-expand"
                  plain
                  size="small"
                  @click = "handleExpandStoragePoolDialogVisible(item.altName, item.name, item.raid, item.devTree.blockDevicesAry)">
                  扩容
                </el-button>
                <el-button icon="iconfont icon-info" plain size="small" @click = "handleViewVisible('storagePoolStatisticsView')">详情</el-button>
                <el-button icon="iconfont icon-del" plain size="small" @click = "deleteStoragePool(item.name, item.altName)">删除</el-button>
                <el-button icon="iconfont icon-refresh" plain size="small" @click = "getStoragePools">刷新</el-button>
              </el-col>
              <el-col :span="2">
                <el-button
                  v-show = "visible.createStoragePoolView || visible.storagePoolStatisticsView"
                  icon="el-icon-back"
                  type="text"
                  @click = "handleViewVisible('storagePoolChartView')">
                  返 回
                </el-button>
              </el-col>
            </el-row>
            <div v-show = "visible.storagePoolStatisticsView">
              <statistics
                v-if = "item.id.length !== 0"
                :info = "item"
                @updateData = "getStoragePools"
                @getShowChartViewFlag = "handleViewVisible('storagePoolChartView')"/>
            </div>
            <!-- 创建存储池视图 -->
            <div v-show = "visible.createStoragePoolView">
              <create-form :table-data = "tableData" @handleViewVisible = "handleViewVisible('storagePoolChartView')" @updateData = "getStoragePools"/>
            </div>
            <!-- 图表信息 -->
            <div v-show = "visible.storagePoolChartView">
              <div class = "c-storage-pool__chart-header" v-text = "item.altName"/>
              <div class = "c-storage-pool__chart-main">
                <ring-chart
                  :chart-data = "item.chartData"
                  :chart-settings="item.chartSettings"
                  :chart-extend="item.chartExtend"
                  chart-height="340px"/>
              </div>
              <storage-pool-details v-if = "item.id.length !== 0" :details = "item"/>
            </div>
          </section>
        </el-carousel-item>
      </el-carousel>
    </section>

    <edit-storage-pool
      :storage-pool-name = "storagePoolName"
      :show-dialog = "visible.editStoragePoolDialog"
      :is-auto-replace="isAutoReplace"
      :hot-spare-device-ary="hotSpareDeviceAry"
      @handleDialogVisible = "visible.editStoragePoolDialog = false"
      @updateData="getStoragePools"/>
    <expand-storage-pool
      :storage-pool-name = "storagePoolName"
      :raid-type="storagePoolRaidLevel"
      :block-devices-ary="blockDevicesAry"
      :show-dialog = "visible.expandStoragePoolDialog"
      @handleDialogVisible = "visible.expandStoragePoolDialog = false"
      @updateData="getStoragePools"/>
  </main>

</template>

<script>
import {
  deleteStoragePool,
  getStoragePools,
  getStoragePool,
  getStoragePoolNameMap
} from '@/api/SRDstor/physicalResources/storagePools'
import { getDisks, getLightStatus } from '@/api/SRDstor/physicalResources/physicalDevices'
import axios from 'axios'
import { formatBytes } from '@/utils/index'
import RingChart from '@/components/Charts/ringChart'
import Statistics from './components/statistics'
import StoragePoolDetails from './components/details'
import CreateForm from './components/create'
import EditStoragePool from './components/edit'
import ExpandStoragePool from './components/expand'

export default {
  name: 'Index',
  components: {
    RingChart,
    Statistics,
    StoragePoolDetails,
    CreateForm,
    EditStoragePool,
    ExpandStoragePool
  },
  data() {
    return {
      tableData: [], // 磁盘数据 {Array}
      storagePoolslist: [], // 存储池列表 {Array}
      loading: false, // 是否显示加载动画 {Boolean}
      storagePoolName: null, // 存储池名称，传递给编辑弹窗 {String}
      storagePoolRaidLevel: 0,
      hotSpareDeviceAry: [],
      blockDevicesAry: [],
      isAutoReplace: '',
      visible: {
        createStoragePoolView: false, // 是否显示创建表单 { Boolean }
        storagePoolChartView: true, // 是否显示存储池图表 { Boolean }
        storagePoolStatisticsView: false, // 是否显示存储池详情 { Boolean }
        editStoragePoolDialog: false, // 是否显示编辑存储池弹窗 { Boolean }
        expandStoragePoolDialog: false // 是否显示扩展存储池弹窗 { Boolean }
      },
      storagePoolNameMap: null
    }
  },
  created() {
    this.getStoragePools()
    this.loading = true
    this.$store.dispatch('GetPhysicalDevice').then(resp => {
      this.loading = false
    }).catch(() => {
      this.loading = false
    })
  },
  methods: {
    handleViewVisible(val) {
      for (var i in this.visible) {
        this.visible[i] = false
      }
      this.visible[val] = true
      if (val === 'createStoragePoolView') {
        this.getDisksAndLightStatus()
      }
    },
    /**
     * 显示编辑存储池弹窗
     * @param name {String} 存储池名称
     */
    handleEditStoragePoolDialogVisible(altName, orgName, isAutoReplace, hotSpareDeviceAry) {
      this.hotSpareDeviceAry = hotSpareDeviceAry === null ? [] : hotSpareDeviceAry
      this.isAutoReplace = isAutoReplace
      this.visible.editStoragePoolDialog = true
      this.storagePoolName = { altName: altName, orgName: orgName }
    },
    handleExpandStoragePoolDialogVisible(altName, orgName, raidLevel, blockDevicesAry) {
      this.visible.expandStoragePoolDialog = true
      this.storagePoolName = { altName: altName, orgName: orgName }
      this.storagePoolRaidLevel = raidLevel
      this.blockDevicesAry = blockDevicesAry
    },
    deleteStoragePool(orgName, altName) {
      const h = this.$createElement
      this.$msgbox({
        title: `删除存储池`,
        message: h('p', null, [
          h('span', null, `确定删除存储池`),
          h('i', { style: 'color: #e96661' }, altName),
          h('span', null, '?'),
          h('span', { style: 'color: #e96661' }, '(基于存储池的逻辑卷会被清除)')
        ]),
        showCancelButton: true,
        cancelButtonClass: 'btn-custom-cancel',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            deleteStoragePool({ name: orgName }).then(resp => {
              instance.confirmButtonLoading = false
              instance.confirmButtonText = '确定'
              if (resp.rc === 0) {
                done()
                this.getStoragePools()
              } else {
                this.$message({ type: 'error', message: `存储池${altName}删除失败` })
              }
            }).catch(() => {
              instance.confirmButtonLoading = false
              instance.confirmButtonText = '确定'
            })
          } else {
            done()
          }
        }
      }).then(() => {
        this.$message({
          type: 'success',
          message: `存储池${altName}删除成功`
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: `已取消删除存储池${altName}操作`
        })
      })
      // const _this = this
      // _this.$confirm(`确定永久删除存储池${altName}吗?`, '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonClass: 'btn-custom-cancel',
      //   confirmButtonClass: 'el-button--form',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   this.loading = true
      //   deleteStoragePool({ name: orgName }).then(resp => {
      //     if (resp.rc === 0) {
      //       _this.$message({ type: 'success', message: `存储池删除${altName}成功` })
      //       _this.getStoragePools()
      //     } else {
      //       _this.$message({ type: 'failure', message: `存储池删除${altName}失败` })
      //     }
      //     this.loading = false
      //   })
      // }).catch(() => {
      //   _this.$message({ type: 'info', message: '取消删除存储池' })
      // })
    },
    /**
     * 获取存储池信息
     * @param item {Object} 对应存储池
     * @param index {Number} 存储池数组索引
     * @param array {Array} 存储池列表
     */
    getStoragePool(item, index, array) {
      const _this = this
      getStoragePool({ name: item.name }).then(resp => {
        if (resp.rc === 0) {
          // TODO 后期需要调整处理数据的方式
          _this.storagePoolslist[index].property = resp.data.property
          _this.storagePoolslist[index].devTree = resp.data.devTree
          _this.storagePoolslist[index].id = resp.data.id
          _this.$set(_this.storagePoolslist, index, _this.storagePoolslist[index])
        }
      })
    },
    /**
     * 获取磁盘信息以及其点亮状况
     */
    getDisksAndLightStatus() {
      const _this = this
      _this.loading = true
      axios.all([getDisks(), getLightStatus()]).then(axios.spread(function(disksResp, ligthResp) {
        _this.loading = false
        if (disksResp.rc === 0) {
          const diskList = []
          disksResp.Data.disks.forEach(item => {
            if (item.slot !== '') {
              diskList.push(item)
            }
          })
          _this.tableData = diskList
          _this.tableData = _this.tableData.map((item, index, array) => {
            item.details = {
              vendor: '',
              product: '',
              firmwareRev: '',
              sn: ''
            }
            item.isLight = false
            return item
          })
          if (ligthResp.rc === 0) {
            if (Array.isArray(ligthResp.data)) {
              ligthResp.data.forEach((item, index, array) => {
                // _this.tableData[item].isLight = true
                _this.tableData.forEach(item2 => {
                  if (item2.slot === item) {
                    item2.isLight = true
                  }
                })
              })
            }
          }
        }
      }))
        .catch(() => {
          _this.loading = false
        })
    },
    /**
     * 初始化存储池信息
     */
    getStoragePools() {
      const _this = this
      // _this.loading = true
      // FIXME 并发处理会导致麒麟版本服务崩溃，因为底层栈溢出
      getStoragePoolNameMap()
        .then(resp => {
          if (resp.rc === 0) {
            this.storagePoolNameMap = {}
            if (resp.poolmap.orgname !== null) {
              resp.poolmap.orgname.forEach((orgNameItem, index) => {
                this.storagePoolNameMap[orgNameItem] = resp.poolmap.altname[index]
              })
            }
          }
          getStoragePools().then(resp => {
            // _this.loading = false
            if (resp.rc === 0) {
              if (resp.data.storagepools === null) {
                _this.storagePoolslist = []
                _this.getDisksAndLightStatus()
              } else {
                _this.storagePoolslist = resp.data.storagepools
                _this.storagePoolslist.forEach((item, index, array) => {
                  item.property = {
                    isReadOnly: ''
                  }
                  item.devTree = {
                    blockDevicesAry: [],
                    hotSpareDeviceAry: []
                  }
                  item.id = ''
                  item.altName = _this.storagePoolNameMap[item.name]
                  _this.getStoragePool(item, index, array)
                  const COLORS_MAP = {
                    '已用': '#f57277',
                    '可用': '#e5e6ea'
                  }
                  const free = item.free
                  const allocated = item.allocated
                  const size = item.size
                  const level = allocated / size * 100
                  if (level <= 70) {
                    COLORS_MAP['已用'] = '#67c23a'
                  } else if (level <= 90 && level > 70) {
                    COLORS_MAP['已用'] = '#e6a23c'
                  } else {
                    COLORS_MAP['已用'] = '#e96661'
                  }
                  item.chartData = {
                    columns: ['类型', '百分率'],
                    rows: [
                      { '类型': '已用', '百分率': allocated, '容量': allocated },
                      { '类型': '可用', '百分率': free, '容量': free }
                    ]
                  }
                  item.chartSettings = {
                    // roseType: 'radius',
                    radius: ['50%', '60%'],
                    offsetY: 130,
                    labelLine: {
                      show: false
                    },
                    label: {
                      show: false
                    }
                  }
                  item.chartExtend = {
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
                        if (item.chartData !== null) {
                          if (name === '可用') {
                            return name + ' ' + formatBytes(parseInt(item.chartData.rows[item.chartData.rows.length - 1]['容量']))
                          } else if (name === '已用') {
                            return name + ' ' + formatBytes(parseInt(item.chartData.rows[item.chartData.rows.length - 2]['容量']))
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
                })
              }
            }
          })
        })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .l-storage-pool-container {
    display: flex;
    height: calc(100vh - 90px);
    margin: 20px;
    background: #f9f9f9;
    overflow: auto;
    &__main {
      width: 1146px;
      height: 650px;
      margin: auto;
      overflow: hidden;
    }
    .c-storage-pool {
      height: 650px;
      overflow: hidden;
      &__item {
        width: 966px;
        height: 644px;
        margin: 0 auto;
        /*box-shadow: 0 4px 6px 0 hsla(0, 0%, 0%, 0.2);*/
        box-shadow: 0px 2px 7px 3px rgba(0,87,255,0.1);
        background: #fff;
      }
      &__warning {
        padding: 90px 0 0 95px;
      }
      &__header {
        padding: 24px 27px;
      }
      &__chart-header {
        text-align: center;
        color: hsl(0, 0%, 17%);
        font-size: 18px;
        font-weight: 700;
        padding-top: 20px;
      }
      &__chart-main {
        height: 340px;
      }
    }
  }

  .el-carousel {
    /deep/ .el-carousel__item {
      /*background: #fff;*/
    }
    /deep/ .el-carousel__item h3 {
      color: #475669;
      font-size: 18px;
      opacity: 0.75;
      line-height: 300px;
      margin: 0;
    }
    /deep/ .el-carousel__arrow {
      width: 60px;
      height: 60px;
    }
    /deep/ .el-carousel__arrow i {
      cursor: pointer;
      font-size: 18px;
      color: #666;
    }
    /deep/ .el-carousel__button {
      background-color: #999;
    }
    /deep/ .el-carousel__indicators {
      display: none;
    }
  }
</style>
