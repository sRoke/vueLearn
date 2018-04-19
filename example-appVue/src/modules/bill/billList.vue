<template>
	<!-- <div class="bu-wrap"   :style="{'padding-top':(topHeight)?topHeight:0}"> -->
	<bu-view :config="configData">
		<!-- <div class="search-bar">
			<div class="search-div">
				<image class='search-img' :src="searchIcon"></image>
				<input type="text" class="input-items" placeholder="名称／手机号" v-model="items.name"  ref="name"></input>
			</div>
		</div> -->
		<!-- 头部小 -->

		<!-- <div class="fixtype"  v-if="itemshow"  :style="{top:(topHeight)?itemHeight:0}">
				<text class="font-gray99 font32">客户名称</text>
				<div class="item-right">
					<div class="right-year">
						<text class="font-gray99 font32">账龄</text>
						<image class="item-rank" :src="rankTop"></image>
					</div>
					<div class="right-cost">
						<text class="font-gray99 font32">总欠款</text>
						<div class="margin-r20"></div>
						<image class="item-rank" :src="rankBottom"></image>
					</div>
				</div>
		</div>
 -->
		<div class="summary-warp">
			<!-- 左侧 -->
			<div class="summary-item back-orange">
				<text class="font-white font24">总欠款数</text>
				<div style="margin-bottom:18px"></div>
				<div class="summary-item-money">
					<div  style="margin-top:20px">
						<!-- <text class="font-white font24">￥</text> -->
					</div>
					<text class="font-white font30">￥{{Math.round(allinfos['DEBT_MONEY']*100)/100}}</text>
					<div  style="margin-top:20px">
						<!-- <text class="font-white font24">.00</text>  -->
					</div>
				</div>
			</div>
			<!-- 左侧 -->
			<!-- 右侧 -->
			<div class="summary-item back-green">
				<text class="font-white font24">总收款</text>
				<div style="margin-bottom:18px"></div>
				<div class="summary-item-money">
					<div  style="margin-top:20px">
						<!-- <text class="font-white font24">￥</text> -->
					</div>
					<text class="font-white font30">￥{{Math.round(allinfos['GET_MONEY']*100)/100}}</text>
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
			<text class="font-gray99 font28 txt-center flex1" :class="[typelist==1?'ischoosed':'notchoosed']" @click="chosetype(1)">全部</text>
			<text class="font-gray99 font28 txt-center flex1" :class="[typelist==2?'ischoosed':'notchoosed']" @click="chosetype(2)">欠款</text>
			<text class="font-gray99 font28 txt-center flex1" :class="[typelist==3?'ischoosed':'notchoosed']" @click="chosetype(3)">收款</text>
		</div>
		<!-- 表头 -->
		<!-- 表体 -->
		<div class="list-warp">
			<div class="list-item" v-for="item in list">
					<text class="font-gray33 font30 w-half">{{item['MONEY_DETAIL.OPERATOR_NAME']}}</text>
					
					<text class="font-gray33 font36 w-half txt-right">￥{{Math.round(item['MONEY_DETAIL.MONEY']*100)/100}}</text>
					<text class="font-gray33 font24 w-whole">[{{item['MONEY_DETAIL.EVENT_INTRO']}}]</text>
					<text class="font-gray99 font24 w-half">{{item['MONEY_DETAIL.ADD_DATETIME']}}</text>
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
	.back-green{
		background-color: #49BA06
	}
	.w-whole{
		width: 702px;
		margin-top: 10px;
		margin-bottom: 10px;
	}
	.txt-right{
		text-align: right;
	}
	.w-half{
		width:351px;
	}
	.ischoosed{
		border-bottom-color:#CF411B;
		border-bottom-width: 1px;
		border-bottom-style: solid;
		height: 90px;
		line-height: 90px;
	}
	.notchoosed{
		border-bottom-color:#D6D7DC;
		border-bottom-width: 1px;
		border-bottom-style: solid;
		height: 90px;
		line-height: 90px;
	}
	.txt-center{
		text-align: center;

	}
	.flex1{
		flex: 1;
		border-bottom-color:#D6D7DC;
		border-bottom-width: 1px;
		border-bottom-style: solid;
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
		background-color:#FA7900;
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
		height:90px;
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
		width:340px;
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
		/*height:90px;*/
		padding-left  :24px;
		padding-right :24px;
	}
	.list-item{
		top:0px;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		width:702px;
		height:90px;
		margin-top: 25px;
		margin-bottom: 50px;
	}
	.item-right{
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		height:90px;
	}
	.right-year{
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width:90px;
		height:90px;
		margin-right:20px;
	}
	.right-cost{
		flex-direction: row;
		align-items: center;
		justify-content:flex-end;
		width:220px;
		height:90px;
	}
	.item-rank{
		width:15px;
		height:25px;
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
	      		getlistApi: '/money/detail/queryAll',
	      		moneydetailApi: '/money/detail/getMoneyDetailGroupInfo',
	      		typelist: 1,
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
	      		list       :[
	      			{'name':'待确认','year':'1','money':'￥1,000,000.00'},
	      			{'name':'已确认','year':'1','money':'￥1,000,000.00'},
	      			{'name':'已作废','year':'1','money':'￥1,000,000.00'},
	      		],
	      		items : {
	      			name: ''
	      		},
	      		configData:{
                    title: '往来帐款',
                    titleAlgin: 'left',
                    secondTitle:'',
                    bottom: '0px',
                    addEvent: '',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: 'refresh',
                    loadmore: false,
                    loadmoreEvent:''
                },
                allinfos: [],
                listType: '所有',
                pagesie: 10,
                currentPage: 1,
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
	    		url:this.moneydetailApi,
	    		body:{
	    				'$LOG':true
	    			  }
	    	},res =>{
	    		this.allinfos = res.data[0]
	    	})
	    	stream.fetch({
	    		method:'POST',
	    		url:this.getlistApi,
	    		body:{	
	    				'PAGE_SIZE':this.pagesie,
	    				'PN': this.currentPage,
	    				'EVENT_INFO':this.listType,
	    				'$LOG':true
	    			  }
	    	},res =>{
	    		this.list = res.data
	    		this.list.forEach(function(value,key) {
	    			value['MONEY_DETAIL.ADD_DATETIME'] = value['MONEY_DETAIL.ADD_DATETIME'].split(" ",1)[0]
	    		})
	    	})
	    },
	    
    	methods:{
    		refresh(){
    			this.currentPage++
    			stream.fetch({
		    		method:'POST',
		    		url:this.getlistApi,
		    		body:{	
		    				'PAGE_SIZE':this.pagesie,
		    				'PN': this.currentPage,
		    				'EVENT_INFO':this.listType,
		    				'$LOG':true
		    			  }
		    	},res =>{
		    		var x = res.data
		    		x.forEach(function(value,key) {
		    			value['MONEY_DETAIL.ADD_DATETIME'] = value['MONEY_DETAIL.ADD_DATETIME'].split(" ",1)[0]
		    		})
		    		this.list = this.list.concat(x)
		    	})
    		},
    		chosetype(key){
    			this.typelist = key
    			if(this.typelist==1){
    				this.listType = "所有"
    			} else if(this.typelist == 2){
    				this.listType = "欠款"
    			} else if(this.typelist== 3){
    				this.listType = "收款"
    			}
    			stream.fetch({
		    		method:'POST',
		    		url:this.getlistApi,
		    		body:{	
	    				'PAGE_SIZE':this.pagesie,
    					'PN': this.currentPage,
    					'EVENT_INFO':this.listType,
	    				'$LOG':true
		    			}
		    	},res =>{
		    		this.list = res.data
		    		this.list.forEach(function(value,key) {
		    			value['MONEY_DETAIL.ADD_DATETIME'] = value['MONEY_DETAIL.ADD_DATETIME'].split(" ",1)[0]
		    		})
		    	})
    		},
    		scrollHandler(e){
    			var self = this;
    			var offsetXOld = self.offsetY
    			self.offsetY = e.contentOffset.y;

    			if(self.offsetY < -120 && offsetXOld > self.offsetY){
    				self.headshow = false;
    			}else if(self.offsetY >= -120 && offsetXOld < self.offsetY){
					self.headshow = true;
    			}

    			if(self.offsetY < -380 && offsetXOld > self.offsetY){
    				self.itemshow = true;
    			}else if(self.offsetY >= -400 && offsetXOld < self.offsetY){
					self.itemshow = false;
					
    			}
    		},
    		inputText(e){
    			var self = this;
    			self.inputvalue = e.value;
    			console.log(self.inputvalue)
    		},
    		// 点击标签
    		clickTab(index){
    			var self = this;
    			self.tablist.forEach(function(ele){
    				ele['check'] = false;
    			})
    			self.tablist[index]['check'] = true


    		},
    	}
    };
</script>