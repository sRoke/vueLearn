<template>
  <section class="l-details-container">
    <table>
      <tr>
        <td>存储池ID</td>
        <td>
          <el-tooltip placement="right-end" effect="light">
            <div slot="content">
              <span class = "c-basic-info__item--id" v-text = "details.id"/>
            </div>
            <div class = "c-basic-info__item--truncate-text" v-text = "details.id"/>
          </el-tooltip>
        </td>
        <td>只读</td>
        <td>{{ details.property.isReadOnly === 'off' ? '否' : '是' }}</td>
        <td>RAID级别</td>
        <td>{{ details.raid | raidLevel }}</td>
      </tr>
      <tr>
        <td>物理设备</td>
        <td>{{ details.devTree.blockDevicesAry.length }}</td>
        <td>热备盘</td>
        <td>{{ details.property.isAutoReplace === 'off' ? '未启动自动替换' : '已启动自动替换' }}</td>
        <td>状态</td>
        <td>{{ details.healthy === 'ONLINE' ? '在线' : '离线' }}</td>
      </tr>
    </table>
  </section>
  <!--<section class = "c-basic-info">-->
  <!--<div class="c-basic-info__item">-->
  <!--<div class = "c-basic-info__item&#45;&#45;text-justify">存储池ID-</div>-->
  <!--<div class = "c-basic-info__item&#45;&#45;text-justify">物理设备-</div>-->
  <!--</div>-->
  <!--<div class="c-basic-info__item">-->
  <!--<el-tooltip placement="right-end" effect="light">-->
  <!--<div slot="content">-->
  <!--<span class = "c-basic-info__item&#45;&#45;id" v-text = "details.id"/>-->
  <!--</div>-->
  <!--<div class = "c-basic-info__item&#45;&#45;truncate-text" v-text = "details.id"/>-->
  <!--</el-tooltip>-->
  <!--<div class="c-basic-info__item&#45;&#45;block-device-length c-basic-info__item&#45;&#45;text-justify" v-text = "details.devTree.blockDevicesAry.length"/>-->
  <!--</div>-->
  <!--<div class="c-basic-info__item">-->
  <!--<div class = "c-basic-info__item&#45;&#45;text-justify">只读-</div>-->
  <!--<div class = "c-basic-info__item&#45;&#45;text-justify">热备盘-</div>-->
  <!--</div>-->
  <!--<div class="c-basic-info__item">-->
  <!--<div class="c-basic-info__item&#45;&#45;text c-basic-info__item&#45;&#45;text-justify">-->
  <!--{{ details.property.isReadOnly === 'off' ? '否' : '是' }}-->
  <!--</div>-->
  <!--<div class="c-basic-info__item&#45;&#45;text c-basic-info__item&#45;&#45;text-justify">-->
  <!--{{ details.property.isAutoReplace === 'off' ? '未启动自动替换' : '已启动自动替换' }}-->
  <!--</div>-->
  <!--</div>-->
  <!--<div class="c-basic-info__item">-->
  <!--<div class = "c-basic-info__item&#45;&#45;text-justify">RAID级别-</div>-->
  <!--<div class = "c-basic-info__item&#45;&#45;text-justify">状态-</div>-->
  <!--</div>-->
  <!--<div class="c-basic-info__item">-->
  <!--<div class="c-basic-info__item&#45;&#45;text c-basic-info__item&#45;&#45;text-justify">{{ details.raid | raidLevel }}</div>-->
  <!--<div class="c-basic-info__item&#45;&#45;text c-basic-info__item&#45;&#45;text-justify">-->
  <!--{{ details.healthy === 'ONLINE' ? '在线' : '离线' }}-->
  <!--</div>-->
  <!--</div>-->
  <!--</section>-->
</template>

<script>
export default {
  name: 'Details',
  props: {
    details: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    details(val, oldVal) {
      console.log(val)
      this.details = val
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .l-details-container {
    font-size: 14px;
    width: 520px;
    margin: 0 auto;
    table {
      table-layout: fixed;
    }
    tr td:nth-child(odd) {
      width: 80px;
      padding-left: 10px;
      color: hsl(0, 0%, 45%);
    }
    tr td:nth-child(even) {
      color: hsl(0, 0%, 17%);
      font-weight: 600;
    }
    tr {
      height: 30px;
    }
  }
.c-basic-info {
  padding-top: 20px;
  width: 510px;
  margin: auto;
  &__item {
    color: hsl(0, 0%, 40%);
    font-size: 14px;
    padding: 5px;
    display: inline-block;
    &--text-justify {
      text-align:justify;
      text-justify:distribute-all-lines;/*ie6-8*/
      text-align-last:justify;/* ie9*/
      -moz-text-align-last:justify;/*ff*/
      -webkit-text-align-last:justify;/*chrome 20+*/
    }
    &--text {
      color: hsl(0, 0%, 17%);
    }
    &--block-device-length {
      color: #42a0e4;
    }
    &--id {
      display: block;
      background: #e6e7ec;
      color: #999;
      border-radius: 4px;
      padding: 4px;
    }
    &--truncate-text {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #42a0e4;
      width: 80px;
    }
  }
}
@media screen and (-webkit-min-device-pixel-ratio:0){/* chrome*/
  .c-basic-info__item--text-justify:after{
    content:".";
    display: inline-block;
    width:100%;
    overflow:hidden;
    height:0;
  }
}
</style>
