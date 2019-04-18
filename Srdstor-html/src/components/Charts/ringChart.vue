<template>
  <ve-ring
    ref="ringChart"
    :data="chartdata"
    :settings = "settings"
    :extend="extend"
    :height = "height"
    :judge-width = "isjudgeWidth"
    :log = "chartLog"
    style = "margin: 0 auto;"/>
</template>

<script>
import VeRing from 'v-charts/lib/ring.common.min'
export default {
  name: 'RingChart',
  components: {
    VeRing
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
      default: '400px'
    },
    chartExtend: {
      type: Object,
      default: () => {
        return {}
      }
    },
    chartSettings: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      chartdata: this.chartData,
      settings: this.chartSettings,
      height: this.chartHeight,
      extend: this.chartExtend,
      chartLog: false, /** 在控制台打印内部生成的echarts options */
      isjudgeWidth: true /** 是否处理生成图表时的宽度问题 */
    }
  },
  watch: {
    chartData(val, oldVal) {
      this.chartdata = val
    },
    chartExtend(val) {
      this.extend = val
    },
    chartSettings(val) {
      this.settings = val
    }
  },
  beforeDestroy() {
    this.$refs['ringChart'].echarts.clear()
  }
}
</script>

<style scoped>

</style>
