<template>
	<div id='serviceDetail'>
		<div class='num record-num'>{{order}}</div>
		<div class='num order-num'>{{match}}</div>
		<el-tabs v-model="activeName" @tab-click="handleClick" ref='tab'>
		    <el-tab-pane label="服务方信息" name="first">
				<serviceInfo ref='serviceInfo' :id='serviceId'></serviceInfo>
			</el-tab-pane>
		    <el-tab-pane label="需求匹配记录"  name="second" class='marrl-5'>
				<serviceRecord ref='serviceRecord' :serviceid='serviceId'></serviceRecord>
			</el-tab-pane>
			<el-tab-pane label="订单记录" name="third">
				<serviceOrder ref='serviceOrder' :serviceid='serviceId'></serviceOrder>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<style type="text/css">
	
	#serviceDetail .el-tabs__item{
		border: 1px solid #d3dce6;
		border-bottom: 0px;
		border-radius: 5px;
		margin-right: 8px;
	}
	#serviceDetail .el-tabs__active-bar{
		display: none;
	}
	#serviceDetail .record-num{
		top: 12px;
		left: 329px;
	}
	#serviceDetail .order-num{
		top: 12px;
		left: 231px;
	}
	#serviceDetail .num{
		display: inline;
	    position: absolute;
	    height: 25px;
	    z-index: 99;
	    line-height: 25px;
	    width: 25px;
	    font-size: 12px;
	    border:1px solid #fff;
	    border-radius: 50%;
	    box-shadow: 0px 0px 5px #888888;
	    text-align: center;
	    color: #fff;
	    background: #20a0ff;
	}
</style>
<script>
  import serviceInfo from './serviceInfo.vue'
  import serviceOrder from './serviceOrder.vue'
  import serviceRecord from './serviceRecord.vue'
  export default {
    data() {
      return {
        activeName: 'first',
        serviceId: 0,
        order: '',
        match: ''
      }
    },
    methods: {
      handleClick(tab, event) {
        router.push({ name: 'serviceDetail', query: { index: tab.name }})
      },
      getMatch(res) {
        this.match = res
      },
      getOrder(res) {
        this.order = res
      }
    },
    created() {
      this.serviceId = this.$route.params.id
      if (this.$route.query.index) {
        this.activeName = this.$route.query.index
      }
    },
    components: {
      serviceInfo,
      serviceOrder,
      serviceRecord
    }
  }
</script>