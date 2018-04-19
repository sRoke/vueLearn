<template>
	<div class="item" v-if="show == 2">
		<div class="date-bar">
			<div class="nextday-div" @click="choooseday(-1)">
				<image class="predayIcon" :src="preday"></image>
			</div>
			<text class="dateTxt">{{datetime}}</text>
			<div class="nextday-div" @click="choooseday(1)" >
				<image class="nextdayIcon" :src="nextday" v-if="today!=datetime"></image>
			</div>
		</div>
		<div class="summary-warp">
			<!-- 左侧 -->
			<div class="summary-item back-purple">
				<text class="font-white font24">业务员</text>
				<div style="margin-bottom:18px"></div>
				<div class="summary-item-money">
					<text class="font-white font46">{{list.length}}/{{infos['SALEMANCOUNT']}}</text>
					<div >
						<text class="font-white font24 padd18">人</text>
					</div>
				</div>
			</div>
			<!-- 左侧 -->
			<!-- 右侧 -->
			<div class="summary-item back-orange">
				<text class="font-white font24">收款</text>
				<div style="margin-bottom:18px"></div>
				<div class="summary-item-money">
					<div  style="margin-top:20px">
						<text class="font-white font24">￥</text>
					</div>
					<text class="font-white font46" :class="[(Math.round(300.2*100)/100).toString().length>6?'font28':'font46']">{{Math.round(infos['PAY_MONEY']*100)/100}}</text>
					<div  style="margin-top:20px">
						<!-- <text class="font-white font24">.00</text>  -->
					</div>
				</div>
			</div>
			<div class="summary-item back-blue">
				<text class="font-white font24">订单</text>
				<div style="margin-bottom:18px"></div>
				<div class="summary-item-money">
					<div  style="margin-top:20px">
						<text class="font-white font24">￥</text>
					</div>
					<text class="font-white " :class="[(Math.round(300.2*100)/100).toString().length>6?'font28':'font46']">{{Math.round(infos['ORDER_MONEY']*100)/100}}</text>
					<div  style="margin-top:20px">
						<!-- <text class="font-white font24">.00</text>  -->
					</div>
				</div>
			</div>
			<!-- 右侧 -->
		</div>
		<!-- 列表 -->
		<!-- 表头 -->
		<div class="list-item-title"   v-if="!itemshow">
			<text class="font-gray99 font28 w120">业务员</text>
			<div class="item-right">
				<div class="w-95">
					<text class="font-gray99 font28 text-r">拜访</text>
					<image class="item-rank" :src="rankTop"></image>
				</div>
				<div class="w-140">
					<text class="font-gray99 font28">￥收款</text>
					<div></div>
					<image class="item-rank" :src="rankBottom"></image>
				</div>
				<div class="right-cost">
					<text class="font-gray99 font28">￥退款</text>
					<div></div>
					<image class="item-rank" :src="rankBottom"></image>
				</div>
				<div class="right-cost">
					<text class="font-gray99 font28">¥订单</text>
					<div></div>
					<image class="item-rank" :src="rankBottom"></image>
				</div>
			</div>
		</div>
		<!-- 表头 -->
		<!-- 表体 -->
		<div class="list-warp">
			<div class="list-item" v-for="item in list" @click="checkdetail(item)">
				<text class="font-gray33 username font30">{{item['VISIT_LIST.USER_NAME']}}</text>
				<div class="item-right">
					<div class="w-95">
						<text class="font32 text-r" ng-if="list.length!=0">{{item['VISIT_COUNT']}}</text>
					</div>
					<div class="w-140">
						<text class="font32 text-r"  ng-if="list.length!=0">{{item['PAY_MONEY']}}</text>
					</div>
					<div class="right-cost">
						<text class="font32 text-r" ng-if="list.length!=0">{{item['RETURN_MONEY']}}</text>
					</div>
					<div class="right-cost">
						<text class="font32"  ng-if="list.length!=0">{{item['ORDER_MONEY']}}</text>
						<image class="head-right-icon" :src="torightIcon"></image></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>		
<style  scoped>
	.item{
        width: 750px;
        align-items: center;
    }
	.history{
		width: 47px;
		height: 47px;
	}
	.btn-txt1{
		text-align: center;
		font-size: 20px;
		color:#CF411B;
	}
	.btn-txt{
		text-align: center;
		font-size: 20px;
		color: #666;
	}
	.historyVisit{
		height: 96px;
		width: 100px;
		flex-direction: column;
		align-items: center;
		padding-top: 15px;
	}
	.bottom-btn{
		width: 750px;
		height: 96px;
		border-top-style: solid;
		border-top-width: 1px;
		border-top-color: #D8D8D8;
		padding-right: 30px;
		padding-left: 30px;
		flex-direction: row;
		justify-content: space-between;
		position: absolute;
		bottom: 0;
	}
	.date-bar{
		height: 110px;
		width: 690px;
		margin-left: 30px;
		flex-direction: row;
		justify-content: space-between;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		border-bottom-color: #D8D8D8;
		align-items: center;
	}
	.dateTxt{
		color: #333;
		font-size: 28px;
		text-align: center;
		align-items: center;
		flex: 1;
	}
	.predayIcon{
		width: 47px;
		height: 47px;
	}
	.nextdayIcon{
		width: 47px;
		height: 47px;
		margin-left: 53px;
	}
	.w120{
		width: 120px;
		text-align:left;
	}
	.padd18{
		padding-top: 18px
	}
	.username{
		white-space: nowrap;
		width: 120px;
		overflow:hidden;
		text-overflow:ellipsis;
		lines: 2;
	}
	.font-red{
		color: #CF411B
	}
	.text-r{
		text-align: right;
		flex:1;
	}
	.head-right-icon{
		width: 14px;
		height: 24px;
		margin-left: 5px;
	}
	.input-items{
		background-color: #F3F3F3;
		flex: 1;
		font-size: 28px;
	}
	.search-img{
		width: 30px;
		height: 30px;
		margin-right: 10px;
	}
	.search-div{
		background-color: #F3F3F3;
		border-bottom-left-radius:5px;
		border-bottom-right-radius :5px;
		border-top-left-radius :5px;
		border-top-right-radius:5px;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		border-bottom-color: #979797;
		border-top-style: solid;
		border-top-width: 1px;
		border-top-color: #979797;
		border-left-style: solid;
		border-left-width: 1px;
		border-left-color: #979797;
		border-right-style: solid;
		border-right-width: 1px;
		border-right-color: #979797;
		height: 66px;
		flex-direction: row;
		justify-content: start;
    	-webkit-box-pack: justify;
    	-webkit-box-align: center;
    	align-items: center;
    	flex-wrap:wrap;
    	padding-left: 20px;
    	padding-right: 20px;
	}
	.search-bar{
		width: 750px;
		padding-left: 30px;
		padding-right: 30px;
	}
	.title{
		flex: 1;
		text-align: center;
	}
	/*公共样式*/
	.font24{
		font-size: 24px;
	}
	.font26{
		font-size: 26px;
	}
	.font28{
		font-size: 28px;
	}
	.font30{
		font-size: 30px;
	}
	.font32{
		font-size: 32px;
	}
	.font34{
		font-size:34px;
	}
	.font40{
		font-size:40px;
	}
	.font42{
		font-size: 42px;
	}
	.font46{
		font-size: 46px
	}
	.font34{
		font-size: 34px;
	}
	.font60{
		font-size:60px;
	}
	.font-gray33{
		color:#333;
	}
	.font-gray66{
		color:#666;
	}
	.font-gray99{
		color:#999;
	}
	.font-white{
		color:#fff;
	}
	.font-red{
		color:#CF411B;
	}
	.margin-r20{
		margin-right: 20px;
	}
	.margin-r10{
		margin-right: 10px;
	}
	.margin-b18{
		margin-bottom: 18px;
	}
	.back-purple{
		background-color:#9839e6;
	}
	.back-orange{
		background-color:#fa7900;
	}
	.back-blue{
		background-color: #0048FF
	}
	.bu-scroller{
		position: absolute;
		top:0;
		bottom:0;
		left:0;
		right:0;
		width:750px;
	}
	.fixtype{
		position:fixed;
		top:78px;
		width:750px;
		padding-left:24px;
		padding-right:24px;
		background-color: #fff;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
	.column{
		flex-direction: column;
	}
/*二级标题*/
	.sub-title{
		flex-direction : row;
		justify-content: center;
		align-items    : center;
		width :702px;
		height:160px;
	}
/*标签*/
	.item-detail{
		flex-direction: row;
		align-items: center;
		height:60px;
		padding-left:30px;
		padding-right:30px;
		margin-bottom: 30px;
		margin-right: 30px;
		border-style:solid;
		border-color: #f5f6f5;
		border-width:1px;
		background-color:#f5f6f5;
	}
	.item-detail-check{
		flex-direction: row;
		align-items: center;
		height:60px;
		padding-left:30px;
		padding-right:30px;
		margin-bottom: 30px;
		margin-right: 30px;
		border-style:solid;
		border-color: #CF411B;
		border-width:1px;
		background-color:#f5f6f5;
	}
	.check{
		width:23px;
		height:13px;
		margin-left:8px !important;
	}
	.row-c{
		flex-direction: row;
		align-items: center;
	}
	.text-elli{
		overflow: hidden; 
		white-space: nowrap; 
		text-overflow: ellipsis;
	}
/*公共样式*/
	

/*头部-标签栏*/
.bu-tabbar{
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	width:750px;
	height:90px;
	padding-left:24px;
	padding-right:24px;
	background-color: #fff;
}


/*头部-标签栏*/
/*说明框*/
	.summary-warp{
		position:relative;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		width:750px;
		padding-left  :24px;
		padding-right :24px;
		padding-top:60px;
		padding-bottom:60px;
		border-bottom-color:#d6d6d6;
		border-bottom-width:1px;
		border-bottom-style:solid;
	}
	.summary-item{
		flex-direction: column;
		width:220px;
		height:163px;
		border-radius: 10px;
		padding:20px;
	}
	.summary-item-money{
		flex-direction: row;
	}
/*说明框*/
/*信息列表*/
	.list-warp{
		width:750px;
		padding-left  :24px;
		padding-right :24px;
		padding-bottom:60px;
	}
	.list-item-title{
		position:relative;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width:750px;
		padding-top: 25px;
		padding-bottom: 25px;
		padding-left  :24px;
		padding-right :24px;

	}
	.list-item{
		top:0px;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width:702px;
		margin-top: 25px;
		margin-bottom:25px
	}
	.item-right{
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		flex: 1
	}
	.right-year{
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width:90px;
		/*margin-right:20px;*/
	}
	.right-cost{
		flex-direction: row;
		align-items: center;
		justify-content:flex-end;
		width:170px;
		/*height:90px;*/
	}
	.item-rank{
		width:15px;
		height:25px;
		margin-left: 5px;
	}
	.w-95{
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 95px;
	}
	.w-140{
		flex-direction: row;
		align-items: center;
		justify-content:flex-end;
		width: 140px
	}
/*信息列表*/


</style>
<script>
  	import modal from '../../../common/modal.js'
  	import navigator from '../../../common/navigator.js'
  	import stream     from '../../../common/stream.js'
  	import icon      from '../../tagSection/icon/icon.js'

  	const getEvent  = weex.requireModule('event');
	export default {
	    data() {
	      	return {
	      		camerainfo: icon.camerainfo,
	      		historyvisit: icon.historyvisit,
	      		staticcheck: icon.staticcheck,
	      		todetailPage: '/modules/receiveMoney/receiveDetail',
	      		photolistPage: '/modules/visiting/photoList',
	      		visitrecordPage: '/modules/visiting/visitRecord',
	      		trackPage: '/modules/visiting/visitTrack',
	      		torightIcon : icon.torightIcon,
	      		getinfoApi: '/visit/list/visitRegion',
	      		getalllistApi: '/user/account/getAccountGroupInfo',
	      		searchIcon: icon.searchIcon,
	      		back       : icon.backIcon,
	      		search     : icon.searchIcon,
	      		rankTop    : icon.rankTopIcon,
	      		rankBottom : icon.rankBottomIcon,
	      		nextday: icon.nextday,
	      		preday: icon.preday,
	      		headshow   : true,
	      		title      :'客户账单',
	      		inputholder:'名称/手机号',
	      		inputvalue :'',
	      		offsetY    : 0,
	      		itemshow   : false,
	      		itemHeight : 78,
	      		topHeight  : 0,
	      		// list       :[],
	      		items : {
	      			name: ''
	      		},
	      		configData:{
                    title: '拜访统计',
                    titleAlgin: 'left',
                    secondTitle:'',
                    bottom: '0px',
                    addEvent: '',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: '',
                    loadmore: false,
                    loadmoreEvent:'refresh'
                },
                currentpage: 1,
                pagesize: 30,
                datetime: '',
                today: '',
                nowtime: '',
                infos: {
                	'PAY_MONEY': 0,
                	'ORDER_MONEY': 0,
                	'SALEMANCOUNT': 0
                },
                list: []
	      	};
	    },
	    props:['show'],
    	methods:{
    		topage(key){
    			if(key == 1){
    				navigator.push({
	    				url: this.visitrecordPage,
	    				// query: '?from=receivelistPage'
	    			},res=>{})
    			} else if(key==2){
    				navigator.push({
	    				url: this.photolistPage,
	    				// query: '?from=receivelistPage'
	    			},res=>{})
    			}
    		},
    		eventName(name,call){
    			this[name](call)
    		},
    		checkdetail(value){
    			navigator.push({
    				url: this.trackPage,
    				query: '?id='+value['VISIT_LIST.UID']
    			},res=>{})
    		},
    		getdata(){
    			var date = new Date();
		    	this.nowtime = new Date();
		        var seperator1 = "-";
		        var year = date.getFullYear();
		        var month = date.getMonth() + 1;
		        var strDate = date.getDate();
		        if (month >= 1 && month <= 9) {
		            month = "0" + month;
		        }
		        if (strDate >= 0 && strDate <= 9) {
		            strDate = "0" + strDate;
		        }
		        var currentdate = year + seperator1 + month + seperator1 + strDate;
		        this.datetime = currentdate;
		        this.today = currentdate;
		    	stream.fetch({
		    		method:'POST',
		    		url:'/visit/list/visitRegion',
		    		body:{
		    			'START_DATE': this.datetime,
		    			'END_DATE': this.datetime
		    		}
		    	},res =>{
		    		this.infos = res.data[0]
		    	})
		    	stream.fetch({
		    		method:'POST',
		    		url:'/visit/list/visitReport',
		    		body:{	
		    				'START_DATE': this.datetime,
		    				'END_DATE': this.datetime,
		    				'SORT_FLAG': 'VISIT_COUNT'
		    			}
		    	},res =>{
		    		this.list = res.data
		    	})
    		},
    		choooseday(key){
    			if(key==1){
    				if(this.datetime!=this.today){
						this.nowtime.setDate(this.nowtime.getDate()+1);
						var seperator1 = "-";
				        var year = this.nowtime.getFullYear();
				        var month = this.nowtime.getMonth() + 1;
				        var strDate = this.nowtime.getDate();
				        if (month >= 1 && month <= 9) {
				            month = "0" + month;
				        }
				        if (strDate >= 0 && strDate <= 9) {
				            strDate = "0" + strDate;
				        }
				        var currentdate = year + seperator1 + month + seperator1 + strDate;
				        // if(this.today == this.datetime){
				        // 	this.datetime = '昨天';
				        // }else{
				        	this.datetime = currentdate;
				        // }
				        stream.fetch({
				    		method:'POST',
				    		url:'/visit/list/visitRegion',
				    		body: {
				    			'START_DATE': this.datetime,
				    			'END_DATE': this.datetime,
				    		}
				    	},res =>{
				    		this.infos= res.data[0]
				    	})
				    	stream.fetch({
				    		method:'POST',
				    		url:'/visit/list/visitReport',
				    		body:{	
				    				'START_DATE': this.datetime,
				    				'END_DATE': this.datetime,
				    				'SORT_FLAG': 'VISIT_COUNT'
				    			}
				    	},res =>{
				    		this.list = res.data
				    	})
    				}
    			}else if(key == -1){
					this.nowtime.setDate(this.nowtime.getDate()-1);
					var seperator1 = "-";
			        var year = this.nowtime.getFullYear();
			        var month = this.nowtime.getMonth() + 1;
			        var strDate = this.nowtime.getDate();
			        if (month >= 1 && month <= 9) {
			            month = "0" + month;
			        }
			        if (strDate >= 0 && strDate <= 9) {
			            strDate = "0" + strDate;
			        }
			        var currentdate = year + seperator1 + month + seperator1 + strDate;
			        // if(this.today == this.datetime){
			        // 	this.datetime = '昨天';
			        // }else{
			        	this.datetime = currentdate;
			        // }
			        stream.fetch({
			    		method:'POST',
			    		url:'/visit/list/visitRegion',
			    		body: {
			    			'START_DATE': this.datetime,
			    			'END_DATE': this.datetime
			    		}
			    	},res =>{
			    		this.infos= res.data[0]
			    	})
			    	stream.fetch({
			    		method:'POST',
			    		url:'/visit/list/visitReport',
			    		body:{	
			    				'START_DATE': this.datetime,
			    				'END_DATE': this.datetime,
			    				'SORT_FLAG': 'VISIT_COUNT'
			    			}
			    	},res =>{
			    		this.list = res.data
			    	})
    			}
    		},
    		
    	}
    };
</script>