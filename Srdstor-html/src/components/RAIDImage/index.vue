<template>
  <div class="c-raid">
    <div v-if="slotNumber === 12">
      <div class = "c-raid__aside--12 c-raid__aside--12--left hidden-md-and-down"/>
      <div class="c-raid__main--12">
        <div v-for = "(item, index) in disksList" :key="index" class="c-raid__disk-enclosure">
          <el-tooltip v-if = "item.status" placement="right" effect="light">
            <div slot="content">
              <div><span class="c-raid__slot--text">槽位:</span><span v-text = "item.slot"/></div>
              <div><span class="c-raid__slot--text">容量:</span><span>{{ item.baseInfo.size | bytesFormatter }}</span></div>
              <div><span class="c-raid__slot--text">状态:</span><span>{{ item.status | statusFormatter }}</span></div>
              <div><span class="c-raid__slot--text">使用:</span><span>{{ item.usedFlag | usedFlagFormatter }}</span></div>
              <div v-if="item.details.vendor !== ''" ><span class="c-raid__slot--text">品牌:</span><span v-text = "item.details.vendor"/></div>
              <div v-if="item.details.product !== ''"><span class="c-raid__slot--text">型号:</span><span v-text = "item.details.product"/></div>
              <div v-if="item.details.sn !== ''"><span class="c-raid__slot--text">序列号:</span><span v-text = "item.details.sn"/></div>
            </div>
            <div
              ref = "slot"
              :class="[item.status && item.isLight ? 'c-raid__slot--11' : '',
                       item.status && !item.isLight ? 'c-raid__slot--10': '',
                       !item.status && item.isLight ? 'c-raid__slot--01' : '',
                       !item.status && !item.isLight ? 'c-raid__slot--00' : '',
                       item.isChosen ? 'c-raid__slot--is-chosen': '']"
              class="c-raid__slot"
              @click = "chooseSlot(item, index)"/>
          </el-tooltip>
          <div v-else class="c-raid__slot c-raid__slot--empty" />
        </div>
      </div>
      <div class = "c-raid__aside--12 c-raid__aside--12--right hidden-md-and-down"/>
    </div>
    <div v-else-if="slotNumber === 16">
      <div class = "c-raid__aside--16 c-raid__aside--16--left hidden-md-and-down"/>
      <div class="c-raid__main--16">
        <div v-for = "(item, index) in disksList" :key="index" class="c-raid__disk-enclosure">
          <el-tooltip v-if = "item.status" placement="right" effect="light">
            <div slot="content">
              <div><span class="c-raid__slot--text">槽位:</span><span v-text = "item.slot"/></div>
              <div><span class="c-raid__slot--text">容量:</span><span>{{ item.baseInfo.size | bytesFormatter }}</span></div>
              <div><span class="c-raid__slot--text">状态:</span><span>{{ item.status | statusFormatter }}</span></div>
              <div><span class="c-raid__slot--text">使用:</span><span>{{ item.usedFlag | usedFlagFormatter }}</span></div>
              <div v-if="item.details.vendor !== ''" ><span class="c-raid__slot--text">品牌:</span><span v-text = "item.details.vendor"/></div>
              <div v-if="item.details.product !== ''"><span class="c-raid__slot--text">型号:</span><span v-text = "item.details.product"/></div>
              <div v-if="item.details.sn !== ''"><span class="c-raid__slot--text">序列号:</span><span v-text = "item.details.sn"/></div>
            </div>
            <div
              ref = "slot"
              :class="[item.status && item.isLight ? 'c-raid__slot--11' : '',
                       item.status && !item.isLight ? 'c-raid__slot--10': '',
                       !item.status && item.isLight ? 'c-raid__slot--01' : '',
                       !item.status && !item.isLight ? 'c-raid__slot--00' : '',
                       item.isChosen ? 'c-raid__slot--is-chosen': '']"
              class="c-raid__slot"
              @click = "chooseSlot(item, index)"/>
          </el-tooltip>
          <div v-else class="c-raid__slot c-raid__slot--empty" />
        </div>
      </div>
      <div class = "c-raid__aside--16 c-raid__aside--16--right hidden-md-and-down"/>
    </div>
    <div v-else-if="slotNumber === 20">
      <div class = "c-raid__aside--20 c-raid__aside--20--left hidden-md-and-down"/>
      <div class="c-raid__main--20">
        <div v-for = "(item, index) in disksList" :key="index" class="c-raid__disk-enclosure">
          <el-tooltip v-if = "item.status" placement="top" effect="light">
            <div slot="content">
              <div><span class="c-raid__slot--text">槽位:</span><span v-text = "item.slot"/></div>
              <div><span class="c-raid__slot--text">容量:</span><span>{{ item.baseInfo.size | bytesFormatter }}</span></div>
              <div><span class="c-raid__slot--text">状态:</span><span>{{ item.status | statusFormatter }}</span></div>
              <div><span class="c-raid__slot--text">使用:</span><span>{{ item.usedFlag | usedFlagFormatter }}</span></div>
              <div v-if="item.details.vendor !== ''" ><span class="c-raid__slot--text">品牌:</span><span v-text = "item.details.vendor"/></div>
              <div v-if="item.details.product !== ''"><span class="c-raid__slot--text">型号:</span><span v-text = "item.details.product"/></div>
              <div v-if="item.details.sn !== ''"><span class="c-raid__slot--text">序列号:</span><span v-text = "item.details.sn"/></div>
            </div>
            <div
              ref = "slot"
              :class="[item.status && item.isLight ? 'c-raid__aside--20--11' : '',
                       item.status && !item.isLight ? 'c-raid__aside--20--10': '',
                       !item.status && item.isLight ? 'c-raid__aside--20--01' : '',
                       !item.status && !item.isLight ? 'c-raid__aside-20--00' : '',
                       item.isChosen ? 'c-raid__slot--is-chosen': '']"
              class="c-raid__aside--20"
              @click = "chooseSlot(item, index)"/>
          </el-tooltip>
          <div v-else class="c-raid__aside--20 c-raid__aside--20--empty" />
        </div>
      </div>
      <div class = "c-raid__aside--20 c-raid__aside--20--right hidden-md-and-down"/>
    </div>
    <div v-else>显示失败</div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  props: {
    disksStatus: {
      type: Array,
      default: () => {
        return []
      }
    },
    slotNumber: {
      type: Number,
      default: 12
    }
  },
  data() {
    return {
      disksList: new Array(this.slotNumber).fill({ name: '', status: '' }),
      isChosen: { border: '2px solid #2cd78e' }
    }
  },
  watch: {
    slotNumber(val) {
      this.slotNumber = val
      this.disksList = new Array(val).fill({ name: '', status: '' })
    },
    disksStatus: {
      handler: function(val, oldVal) {
        this.disksList = new Array(this.slotNumber).fill({ name: '', status: '' })
        val.forEach((item, index, array) => {
          if (item.slot !== '') {
            this.$set(this.disksList, parseInt(item.slot) - 1, item)
          }
        })
      },
      deep: true
    }
  },
  methods: {
    sortBy(field) {
      return function(a, b) {
        return a[field] - b[field]
      }
    },
    chooseSlot(item, index) {
      if (!item.usedFlag) {
        item.isChosen = !item.isChosen
        this.$set(this.disksList, index, item)
        this.$emit('handleSlotChange', this.disksList[index])
      } else {
        this.$message({ message: `槽位${item.slot}已被使用`, type: 'warning' })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .c-raid {
    &__aside--12 {
      background-size: 100% 100%;
      background-repeat: no-repeat;
      display: inline-block;
      position: relative;
      top: -4px;
      width: 34px;
      height: 130px;
      &--left {
        background-image: url('../../assets/physicalResources/physicalDevices/raidSideLeft.png');
      }
      &--right {
        background-image: url('../../assets/physicalResources/physicalDevices/raidSideRight.png');
      }
    }
    &__main--12 {
      display: inline-block;
      width: 672px;
    }
    &__aside--16 {
      background-size: 100% 100%;
      background-repeat: no-repeat;
      display: inline-block;
      position: relative;
      top: -28px;
      width: 34px;
      height: 130px;
      &--left {
        background-image: url('../../assets/physicalResources/physicalDevices/raidSideLeft.png');
      }
      &--right {
        background-image: url('../../assets/physicalResources/physicalDevices/raidSideRight.png');
      }
    }
    &__main--16 {
      display: inline-block;
      width: 672px;
    }
    &__aside--20 {
      background-size: 100% 100%;
      background-repeat: no-repeat;
      display: inline-block;
      width: 34px;
      height: 130px;
      &--left {
        background-image: url('../../assets/physicalResources/physicalDevices/raidSideLeft.png');
      }
      &--right {
        background-image: url('../../assets/physicalResources/physicalDevices/raidSideRight.png');
      }
      &--11 {
        background-image: url('../../assets/physicalResources/physicalDevices/20-11.png');
      }
      &--10 {
        background-image: url('../../assets/physicalResources/physicalDevices/20-10.png');
      }
      &--01 {
        background-image: url('../../assets/physicalResources/physicalDevices/20-01.png');
      }
      &--00 {
        background-image: url('../../assets/physicalResources/physicalDevices/20-00.png');
      }
      &--empty {
        background-image: url('../../assets/physicalResources/physicalDevices/20-empty.png');
      }
    }
    &__main--20 {
      display: inline-block;
      width: 680px;
    }
    &__disk-enclosure {
      display: inline-block;
    }
    &__slot {
      background-size: 100% 100%;
      background-repeat: no-repeat;
      display: block;
      border-radius: 4px;
      min-height: 36px;
      width: 168px;
      height: 44px;
      &--text {
        color: #999;
        line-height: 18px;
      }
      &--10 {
        background-image: url('../../assets/physicalResources/physicalDevices/10.png');
      }
      &--01 {
        background-image: url('../../assets/physicalResources/physicalDevices/01.png');
      }
      &--11 {
        background-image: url('../../assets/physicalResources/physicalDevices/11.png');
      }
      &--00 {
        background-image: url('../../assets/physicalResources/physicalDevices/00.png');
      }
      &--empty {
        background-image: url('../../assets/physicalResources/physicalDevices/empty.png');
      }
      &--is-chosen {
        border: 2px solid #2cd78e;
      }
    }
  }
  .el-tooltip__popper.is-light {
    /deep/ .popper__arrow {
      border-right-color: #aaa;
    }
  }
</style>
<style>
  .el-tooltip__popper.is-light {
    border-color: #aaa;
  }
</style>
