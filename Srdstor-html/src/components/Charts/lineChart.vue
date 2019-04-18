<template>
  <ve-line
    ref="lineChart"
    :loading="loading"
    :data-empty="dataEmpty"
    :height = "height"
    :judge-width = "isjudgeWidth"
    :extend="extend"
    :after-config="afterConfig"
    :after-set-option-once="afterSetOptinOnce"
    :data="chartData"
    :settings="settings"/>
</template>

<script>
import VeLine from 'v-charts/lib/line.common'
export default {
  name: 'LineChart',
  components: {
    VeLine
  },
  props: {
    chartData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    chartHeight: {
      type: String,
      default: '364px'
    },
    chartSettings: {
      type: Object,
      default: () => {
        return {
          axisVisible: true,
          area: true,
          scale: [true]
        }
      }
    },
    chartExtend: {
      type: Object,
      default: () => {
        return {
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
            top: 20,
            formatter: function(name) {
              return name
            },
            data: [{
              name: '发送速率',
              icon: 'circle'
            }, {
              name: '接受速率',
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
                color: '#666',
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
                color: '#666',
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
                color: '#666',
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
                color: '#666',
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
            color: '#0ce977'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 1,
              x2: 0,
              y2: 0,
              colorStops: [{
                offset: 0, color: '#0ce977' // 0% 处的颜色
              }, {
                offset: 0.5, color: '#0ce977'
              }, {
                offset: 1, color: '#0ce977' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            },
            opacity: 0.5
          },
          smoothMonotone: 'none',
          smooth: true
        }
      }
    }
  },
  data() {
    return {
      chartdata: this.chartData,
      height: this.chartHeight,
      settings: this.chartSettings,
      extend: this.chartExtend,
      chartLog: false, /** 在控制台打印内部生成的echarts options */
      isjudgeWidth: true, /** 是否处理生成图表时的宽度问题 */
      loading: true,
      dataEmpty: true
    }
  },
  watch: {
    chartData(val, oldVal) {
      this.chartdata = val
    },
    chartSettings(val) {
      this.settings = val
    },
    chartExtend(val) {
      this.extend = val
    },
    chartHeight(val) {
      this.chartHeight = val
      this.height = val
    }
  },
  beforeDestroy() {
    this.$refs['lineChart'].echarts.clear()
  },
  methods: {
    afterConfig(options) {
      options.legend.textStyle = {
        color: '#333'
      }
      return options
    },
    afterSetOptinOnce() {
      this.loading = false
      this.dataEmpty = false
    }
  }
}
</script>

<style scoped>

</style>
