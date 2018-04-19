<template>
	<bu-view :config="configData" @event="eventName">
		<div class="search-bar">
			<div class="search-div">
				<image class='search-img' :src="searchIcon"></image>
				<input type="text" class="input-items" placeholder="客户名" v-model="items.name"  ref="name"></input>
			</div>
		</div>
		<div class="summary-warp">
			<!-- 左侧 -->
			<div class="summary-item back-purple">
				<text class="font-white font24">总预存款</text>
				<div style="margin-bottom:18px"></div>
				<div class="summary-item-money">
					<div >
						<text class="font-white font24">￥</text>
					</div>
					<text class="font-white " :class="[(Math.round(allinfo['USABLE_MONEY']*100)/100).toString().length>6?'font28':'font46']">{{Math.round(allinfo['USABLE_MONEY']*100)/100}}</text>
				</div>
			</div>
			<!-- 左侧 -->
			<!-- 右侧 -->
			<div class="summary-item back-orange">
				<text class="font-white font24">总欠款</text>
				<div style="margin-bottom:18px"></div>
				<div class="summary-item-money">
					<div  style="margin-top:20px">
						<text class="font-white font24">￥</text>
					</div>
					<text class="font-white " :class="[(Math.round(allinfo['DEBT_MONEY']*100)/100).toString().length>6?'font28':'font46']">{{Math.round(allinfo['DEBT_MONEY']*100)/100}}</text>
					<div  style="margin-top:20px">
						<!-- <text class="font-white font24">.00</text>  -->
					</div>
				</div>
			</div>
			<div class="summary-item back-blue">
				<text class="font-white font24">总返点</text>
				<div style="margin-bottom:18px"></div>
				<div class="summary-item-money">
					<div  style="margin-top:20px">
						<text class="font-white font24">￥</text>
					</div>
					<text class="font-white " :class="[(Math.round(allinfo['REBACK_MONEY']*100)/100).toString().length>6?'font28':'font46']">{{Math.round(allinfo['REBACK_MONEY']*100)/100}}</text>
					<div  style="margin-top:20px">
						<!-- <text class="font-white font24">.00</text>  -->
					</div>
				</div>
			</div>
			<!-- 右侧 -->
		</div>
		<!-- 摘要框	 -->
		<!-- 列表 -->
		<!-- 表头 -->
		<div class="list-item-title"   v-if="!itemshow">
				<text class="font-gray99 font28">客户名称</text>
				<div class="item-right">
					<div class="right-year">
						<text class="font-gray99 font28 text-r">{{moneytype}}</text>
						<image class="item-rank" :src="rankTop"></image>
					</div>
					<div class="right-cost">
						<text class="font-gray99 font28">返点</text>
						<div></div>
						<image class="item-rank" :src="rankBottom"></image>
					</div>
				</div>
			</div>
		<!-- 表头 -->
		<!-- 表体 -->
		<div class="list-warp">
			<div class="list-item" v-for="item in list" @click="checkdetail(item)">
				<text class="font-gray33 username font30">{{item['USER.NAME']}}</text>
				<div class="item-right">
					<div class="right-year">
						<text class="font32 text-r" :class="[parseInt(item['USER_ACCOUNT.YFK_ACCOUNT'])>=0?'font-gray33':'font-red']" ng-if="list.length!=0">{{item['USER_ACCOUNT.YFK_ACCOUNT']}}</text>
					</div>
					<div class="right-cost">
						<text class="font32" :class="[parseInt(item['USER_ACCOUNT.FD_ACCOUNT'])>=0?'font-gray33':'font-red']" ng-if="list.length!=0">{{item['USER_ACCOUNT.FD_ACCOUNT']}}</text>
						<image class="head-right-icon" :src="torightIcon"></image></div>
					</div>
				</div>
			</div>
		</div>	
		<!-- 表体 -->
		<!-- 列表 -->
		<!-- </scroller> -->
	</bu-view>
	<!-- </div> -->
</template>		
<style  scoped>
	.username{
		white-space: nowrap;
		flex: 1;
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
		height: 66px;
	}
	.search-img{
		width: 30px;
		height: 30px;
		margin-right: 10px;
	}
	.search-div{
		background-color: #F3F3F3;
		border-bottom-left-radius:10px;
		border-bottom-right-radius :10px;
		border-top-left-radius :10px;
		border-top-right-radius:10px;
		/*border-bottom-style: solid;
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
		border-right-color: #979797;*/
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
		margin-top: 25px;
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
		height:220px;
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
	}
	.right-year{
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width:200px;
		margin-right:20px;
	}
	.right-cost{
		flex-direction: row;
		align-items: center;
		justify-content:flex-end;
		width:155px;
		/*height:90px;*/
	}
	.item-rank{
		width:15px;
		height:25px;
		margin-left: 5px;
	}
/*信息列表*/


</style>
<script>
	import buView from '../../components/bu-view.vue'
  	import navigator from '../../common/navigator.js'
  	import modal     from '../../common/modal.js'
  	import stream    from '../../common/stream.js'
  	import icon      from '../tagSection/icon/icon.js'

  	const getEvent  = weex.requireModule('event');
	export default {
		components: {
			buView
		 },
	    data() {
	      	return {
	      		todetailPage: '/modules/receiveMoney/receiveDetail',
	      		torightIcon : icon.torightIcon,
	      		getlistApi: '/user/account/getUserAccountAndSubAccount',
	      		getalllistApi: '/user/account/getAccountGroupInfo',
	      		searchIcon: icon.searchIcon,
	      		back       : icon.backIcon,
	      		search     : icon.searchIcon,
	      		rankTop    : icon.rankTopIcon,
	      		rankBottom : icon.rankBottomIcon,
	      		headshow   : true,
	      		title      :'客户账单',
	      		inputholder:'名称/手机号',
	      		inputvalue :'',
	      		offsetY    : 0,
	      		itemshow   : false,
	      		itemHeight : 78,
	      		topHeight  : 0,
	      		list       :[],
	      		sortType: 'ASC',
	      		items : {
	      			name: ''
	      		},
	      		configData:{
                    title: '客户账款',
                    titleAlgin: 'left',
                    secondTitle:'',
                    bottom: '0px',
                    addEvent: '',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: '',
                    loadmore: true,
                    loadmoreEvent:'refresh'
                },
                allinfo: {
                'USABLE_MONEY':0,
                'REBACK_MONEY':0,
                'DEBT_MONEY':0
                },
                moneytype: '预付款',
                currentpage: 1,
                pagesize: 30,
	      	};
	    },
	    created(){
	    	var self = this;
	    	if(typeof(getEvent.getHight) == "function"){
		        getEvent.getHight("jjj",function(res){
		          self.topHeight = parseInt(res)
		          self.itemHeight=self.itemHeight+parseInt(res)
		        })
		    }
	    },
	    mounted(){
	    	stream.fetch({
	    		method:'POST',
	    		url:this.getalllistApi,
	    	},res =>{
	    		if(res.data.length!=0){
	    			this.allinfo = res.data[0]
	    		}
	    	})
	    	stream.fetch({
	    		method:'POST',
	    		url:this.getlistApi,
	    		body:{	
	    				'PAGE_SIZE':this.pagesize,
	    				'PN': this.currentpage,
	    				'ORDER_TYPE':this.sortType,
	    			  }
	    	},res =>{
	    		this.list = res.data
	    	})
	    },
	    watch :{
	    	items: {  
	            handler: function() { 
	                stream.fetch({
			    		method:'POST',
			    		url:this.getlistApi,
			    		body:{	
		    				'PAGE_SIZE':this.pagesize,
		    				'PN': 1,
		    				'ORDER_TYPE':this.sortType,
		    				'NAME': this.items.name
		    			  }
			    	},res =>{
			    		this.list = res.data
			    	})
	            },  
	            deep: true 
           }  
	    },
    	methods:{
    		eventName(name,call){
    			this[name](call)
    		},
    		checkdetail(value){
    			navigator.push({
    				url: this.todetailPage,
    				query: '?id='+value['USER_ACCOUNT.UID']
    			},res=>{})
    		},
    		refresh(call){
    			this.currentpage++
    			stream.fetch({
		    		method:'POST',
		    		url:this.getlistApi,
		    		body:{	
		    				'PAGE_SIZE':this.pagesize,
		    				'PN': this.currentpage,
		    				'ORDER_TYPE':this.sortType,
		    			  }
		    	},res =>{
		    		this.list = this.list.concat(res.data)
		    	},res=>{
		    		call()
		    	})
		    	
    		},
    		
    	}
    };
</script>