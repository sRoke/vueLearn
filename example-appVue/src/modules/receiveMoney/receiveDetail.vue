<template>
	<bu-view :config="configData" @event="eventName">
		<div class="summary-warp">
			<!-- 左侧 -->
			<div class="summary-item back-purple">
				<text class="font-white font24">预存款账户</text>
				<div style="margin-bottom:18px"></div>
				<div class="summary-item-money">
					<div  style="margin-top:20px">
						<text class="font-white font24">￥</text>
					</div>
					<text class="font-white font46">{{Math.round(preaccount['USER_ACCOUNT_SUB.USABLE_MONEY']*100)/100}}</text>
					<div  style="margin-top:20px">
						<!-- <text class="font-white font24">.00</text>  -->
					</div>
				</div>
			</div>
			<!-- 左侧 -->
			<!-- 右侧 -->
			<div class="summary-item back-blue">
				<text class="font-white font24">返点账户</text>
				<div style="margin-bottom:18px"></div>
				<div class="summary-item-money">
					<div  style="margin-top:20px">
						<text class="font-white font24">￥</text>
					</div>
					<text class="font-white font46">{{Math.round(backaccount['USER_ACCOUNT_SUB.USABLE_MONEY']*100)/100}}</text>
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
		<div class="list-item-title" >
				<text class="font-gray66 font28 txt-center flex1" :class="[typelist==1?'ischoosed':'notchoosed']" @click="chosetype(1)">全部</text>
				<text class="font-gray66 font28 txt-center flex1" :class="[typelist==2?'ischoosed':'notchoosed']" @click="chosetype(2)">收入</text>
				<text class="font-gray66 font28 txt-center flex1" :class="[typelist==3?'ischoosed':'notchoosed']" @click="chosetype(3)">支出</text>
				<text class="font-gray66 font28 txt-center flex1" :class="[typelist==4?'ischoosed':'notchoosed']" @click="chosetype(4)">挂账</text>
			</div>
		<!-- 表头 -->
		<!-- 表体 -->
		<div class="list-warp">
			<div class="list-item" v-for="item in list">
					<text class="font-gray33 font30 w-half">{{item['MONEY_DETAIL.EVENT_INTRO']}}</text>
					
					<text class="font-gray33 font30 w-half txt-right">{{item['MONEY_DETAIL.MONEY']}}</text>
					<text class="font-gray99 font30 w-half">{{item['MONEY_DETAIL.ADD_DATETIME']}}   {{item['MONEY_DETAIL.ACCOUNT_NAME']}}</text>
					<text class="font-gray99 font30 w-half txt-right">{{item['MONEY_DETAIL.ACCOUNT_BALANCE']}}</text>
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
	.txt-right{
		text-align: right;
	}
	.w-half{
		width:351px;
		white-space: wrap;
	}
	.ischoosed{
		border-bottom-color:#CF411B;
		border-bottom-width: 3px;
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
	.font36{
		font-size: 36px;
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
		margin-top: 40px;
		margin-bottom: 0px;
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
	      		getoneApi: '/money/detail/queryAll',
	      		getdetailApi: '/user/account/getAccountInfoByUid',
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
	      		list       :[],
	      		items : {
	      			name: ''
	      		},
	      		configData:{
                    title: '应收款详细',
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
                infos: [],
                preaccount: {},
                backaccount: {},
                listType: '所有',
                pagesize: 10,
                currentpage: 1,
                currentId: null
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
	    	var self = this
	    	var bundleUrl = self.$getConfig().bundleUrl
	    	this.currentId = self.getDataByUrl('id',bundleUrl)
	    	stream.fetch({
	    		method:'POST',
	    		url:'/user/account/getAccountInfoByUid?USER_ACCOUNT.UID='+this.currentId,
	    	},res =>{
	    		var that = this
	    		res.extraData['subAccountList'].forEach(function(value,key) {
	    			if(value['USER_ACCOUNT_TYPE.ACCOUNT_NAME'] == '预付款账户'){
	    				that.preaccount = value
	    			}else if(value['USER_ACCOUNT_TYPE.ACCOUNT_NAME'] == '返点账户'){
	    				that.backaccount = value
	    			}
	    		})
	    		this.configData.title = res.data[0]['USER.NAME']
	    		console.log(this.preaccount)
	    		console.log(this.backaccount)
	    	})
	    	stream.fetch({
	    		method:'POST',
	    		url:this.getoneApi,
	    		body: {
	    			'MONEY_DETAIL.UID': self.getDataByUrl('id',bundleUrl),
	    			'EVENT_INFO': this.listType,
	    			'PAGE_SIZE': this.pagesize,
	    			'PN': this.currentpage
	    		}
	    	},res =>{
	    		this.list = res.data
	    		this.list.forEach(function(value,index) {
	    			value['MONEY_DETAIL.ADD_DATETIME'] = value['MONEY_DETAIL.ADD_DATETIME'].split(' ',1)[0]
	    		})
	    	})
	    },
    	methods:{
    		eventName(name,call){
    			this[name](call)
    		},
    		getDataByUrl: function (name, url) {
			  name = name.replace(/[\[\]]/g, "\\$&");
			  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			  results = regex.exec(url); 
			  if (!results) return null;
			  if (!results[2]) return '';
			  return decodeURIComponent(results[2].replace(/\+/g, " "));
			},
    		refresh(call){
    			this.currentpage++
    			stream.fetch({
		    		method:'POST',
		    		url:this.getoneApi,
		    		body: {
		    			'MONEY_DETAIL.UID': this.currentId,
		    			'EVENT_INFO': this.listType,
		    			'PAGE_SIZE': this.pagesize,
		    			'PN': this.currentpage
		    		}
		    	},res =>{
		    		var  x= res.data
		    		x.forEach(function(value,index) {
		    			value['MONEY_DETAIL.ADD_DATETIME'] = value['MONEY_DETAIL.ADD_DATETIME'].split(' ',1)[0]
		    		})
		    		this.list = this.list.concat(x)
		    	},res=>{
		    		call()
		    	})
    		},
    		chosetype(key){
    			this.configData['pageRender'] = true;
    			this.currentpage =  1;
    			this.typelist = key
    			if(key == 1){
    				this.listType = '所有'
    			} else if(key == 2){
    				this.listType = '收入'
    			} else if(key == 3){
    				this.listType = '支出'
    			} else if(key == 4){
    				this.listType = '挂账'
    			}
    			var self = this
	    		var bundleUrl = self.$getConfig().bundleUrl
    			stream.fetch({
		    		method:'POST',
		    		url:this.getoneApi,
		    		body: {
		    			'MONEY_DETAIL.UID': self.getDataByUrl('id',bundleUrl),
		    			'EVENT_INFO': this.listType,
		    			'PAGE_SIZE': this.pagesize,
		    			'PN': this.currentpage
		    		}
		    	},res =>{
		    		this.configData['pageRender'] = false;
		    		this.list = res.data
		    		this.list.forEach(function(value,index) {
		    			value['MONEY_DETAIL.ADD_DATETIME'] = value['MONEY_DETAIL.ADD_DATETIME'].split(' ',1)[0]
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