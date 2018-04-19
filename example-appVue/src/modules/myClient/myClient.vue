<template>	
		<!-- 头部大 -->
<bu-view :config="configData" ref="views" @event="viewEvent">
		<div class="search-bar">
			<div class="search-div">
				<image class='search-img' :src="searchIcon"></image>
				<input type="text" class="input-items" placeholder="客户名／地址" v-model="items.name"  ref="name"></input>
				<div class="filter-div" @click="tofilter">
					<image class='filterIcon-img' :src="filterIcon"></image>
				</div>
			</div>
		</div>
		<div class="choose-back" v-if="isfilter" slot="footer" :style="{top:bartop+'px'}">
			<scroller class='filter-scrol' show-scrollbar="false">
				<div class="mark-warp-filter">
					<div class="lable-all">
						<div class="label-group" v-for="(item1,key1) in labelGroup">
							<div class="group-name-div"><text class="group-name">{{item1['BUYER_TAG_GROUP.BUYER_TAG_GROUP_NAME']}}</text>
							</div>
							<div class="label-indexs">
								<div class="label-index" @click="ifchoose(key1,key2)" v-for="(item2,key2) in item1['BUYER_TAG_GROUP.BUYER_TAG_LIST']" :class="[item2['ifchoose']?'ischoosed':'notchoosed']">
									<text class="label-text1">{{item2['BUYER_TAG.BUYER_TAG_NAME']}}</text>
									<image class="choose-img" :src="redgouIcon" v-if="item2['ifchoose']"></image>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="bottom-index1">
					<div class="reset" @click="recondition">
						<text class="save-text1">重置</text>
					</div>
					<div class="savebtn" @click="savelabel">
						<text class="save-text">确定</text>
					</div>
				</div>
			</scroller>
			<div class="white-block" @click="closeFilter"></div>
		</div>
		<div class="sort-filtrate">
			<div class="sort-filtrate-div">
				<div class="sort-div" :class="[!allchecked?'nochecked':'ischecked']" @click="choosenear(1)"><text class='sort-text' :class="[!allchecked?'filtrate-text':'filtrate-text-red']" >所有客户</text></div>
				<div class="filtrate-div" :class="[allchecked?'nochecked':'ischecked']" @click="choosenear(2)"><image class="location-img" :src="locationGray" v-if="allchecked"></image><image class="location-img" :src="locationRed" v-if="!allchecked"></image><text class="sort-text" :class="[allchecked?'filtrate-text':'filtrate-text-red']">附近客户</text></div>
			</div>
		</div>
		<!-- <scroller class='scrol' show-scrollbar="false" > -->
			<!-- 标签列表 -->
			<div class="client-indexs" v-if="allchecked">
				<div class="visit-div" v-if="isvisit" @click='tovisit'>
					<div class="visit-tip-div">
						<text class="visit-tip">拜访中</text>
					</div>
					<text class='clientname'>{{clientname}}</text>
					<image class='torightIcon' :src='torightIcon'></image>
				</div>
				<div class="client-index" v-for="(item3,index3) in clientGroups" @click="todetail(item3)">
					<div class="client-name">
						<text class="client-name-text">{{item3['BUYER.BUYER_NAME']}}</text>
					</div>
					<div class="client-location">
						<text class="client-location-text">{{item3['BUYER.DELIVERY_ADDR_DETAIL']}}</text>
						<!-- <text class="client-location-text2">3.5km</text> -->
					</div>
					<div class="label-indexs">
						<div class="label-index1" v-for="(item31,index31) in labelList[item3['BUYER.BUYER_ID']]"><text class="label-text">{{item31['BUYER_TAG.BUYER_TAG_NAME']}}</text></div>
					</div>
				</div>
				<div class="noData" v-if="!haveDatas">
					<div class="warn-div"><image class="warn-icon" :src="warnIcon"></image></div>
					<text class="noData-text">暂无客户</text>
				</div>
			</div>
			<!-- 标签列表 -->
		<!-- </scroller> -->
		<div v-if="!allchecked">
			<!-- 标签列表 -->
			<div class="mark-warp" >
				<div class="visit-div" v-if="isvisit" @click='tovisit'>
					<div class="visit-tip-div">
						<text class="visit-tip">拜访中</text>
					</div>
					<text class='clientname'>{{clientname}}</text>
					<image class='torightIcon' :src='torightIcon'></image>
				</div>
				<div class="noData" v-if="!haveData">
					<div class="warn-div"><image class="warn-icon" :src="warnIcon"></image></div>
					<text class="noData-text">{{tipTxt}}</text>
				</div>
				
				<div class="client-index" v-for="(item4,index4) in clientGroups1" @click="todetail(item4)" v-if="haveData">
					<div class="client-name">
						<text class="client-name-text">{{item4['BUYER.BUYER_NAME']}}</text>
					</div>
					<div class="client-location">
						<text class="client-location-text">{{item4['BUYER.DELIVERY_ADDR_DETAIL']}}</text>
						<text class="client-location-text2">{{item4['BUYER.DISTANCE_INFO']}}</text>
					</div>
					<div class="label-indexs">
						<div class="label-index1" v-for="(item41,index41) in labelList1[item4['BUYER.BUYER_ID']]"><text class="label-text">{{item41['BUYER_TAG.BUYER_TAG_NAME']}}</text></div>
<!-- 						<div class="label-index1"><text class="label-text">待沟通</text></div>
						<div class="label-index1"><text class="label-text">待沟通</text></div> -->
					</div>
				</div>
			</div>
			<!-- 标签列表 -->
		</div>
		<div class="bottom-index" slot="footer" v-if="!allchecked&&!this.isfilter">
			<div class="savebtn" @click="choosenear(3)" v-if='showbtn'>
				<text class="save-text">定位</text>
			</div>
		</div>
		
		<!-- <div class="choose-back1" v-if="islocation">
			<div class="locationing">
				<text class="tips">『定位中』</text>
			</div>
		</div> -->
</bu-view>
	<!-- </div> -->
</template>	

<style  scoped>
	.white-block{
		flex:1;
	}
	.torightIcon{
		width: 11px;
		height: 19px;
	}
	.clientname{
		font-size: 30px;
		color: #333;
		flex: 1;
		text-align: center;
		white-space: nowrap;;
		overflow:hidden;
		text-overflow:ellipsis;
		lines: 1;
	}
	.visit-tip{
		font-size: 18px;
		color: #333;
		flex:1;
		text-align: center;
		line-height: 69px;
	}
	.visit-tip-div{
		width: 69px;
		height: 69px;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		border-bottom-color: #CF411B;
		border-top-style: solid;
		border-top-width: 1px;
		border-top-color: #CF411B;
		border-left-style: solid;
		border-left-width: 1px;
		border-left-color: #CF411B;
		border-right-style: solid;
		border-right-width: 1px;
		border-right-color: #CF411B;
		border-bottom-left-radius:69px;
		border-bottom-right-radius :69px;
		border-top-left-radius :69px;
		border-top-right-radius:69px;
	}
	.visit-div{
		width: 474px;
		height: 87px;
		background-color: #F5F5F5;
		border-bottom-left-radius:41px;
		border-bottom-right-radius :41px;
		border-top-left-radius :41px;
		border-top-right-radius:41px;
		flex-direction: row;
		padding-left:25px;
		padding-right: 25px;
		align-items: center;
		margin-left: 108px;
		margin-top: 60px;
		margin-bottom: 30px;
	}
	.tips{
		text-align: center;
		color: #333;
		font-size: 32px;
	}
	.locationing{
		height: 350px;
		background-color: #fff;
		top: 160px;
		padding-left: 30px;
		padding-right: 30px;
		padding-top: 120px;
		padding-bottom: 100px;
	}
	.location-img{
		width: 25px;
		height: 32px;
		margin-top: 28px;
		margin-right: 5px;
		margin-left: 89px
	}
	.label-group:first-child{
		margin-top: 50px
	}
	.label-group{
		margin-top: 30px
	}
	.group-name{
		font-size: 32px;
		color: #333;
		font-weight: bold
	}
	.label-indexs{
		margin-top: 30px;
		flex-direction: row;
		justify-content: start;
    	-webkit-box-pack: justify;
    	-webkit-box-align: center;
    	align-items: center;
    	flex-wrap:wrap;
	}
	.mark-warp-filter{
		/*width: 750px;*/
		padding-right: 30px;
		padding-left: 30px;
		/*height: 710px;*/
		min-height: 200px;
		/*margin-bottom: 1px;*/
		margin-bottom: 10px;
	}
	.filter-div{
		width: 55px;
		height: 65px;
		padding-left: 28px;
		padding-top: 19px
	}
	.save-text{
		text-align: center;
		font-size: 	30px;
		color: #fff;
		line-height: 80px;
	}
	.save-text1{
		text-align: center;
		font-size: 	30px;
		color: #CF411B;
		line-height: 80px;
	}
	.bottom-index{
		width: 750px;
		padding-left: 30px;
		padding-right: 30px;
		margin-top: 20px;
		position: absolute;
		bottom: 25px
	}
	.bottom-index1{
		width: 750px;
		padding-left: 30px;
		padding-right: 30px;
		margin-top: 20px;
		position: fixed;
		top:860px;
		flex-direction: row;
		justify-content: space-between;
	}
	.savebtn{
		height: 80px;
		background-color: #cf411b;
		border-bottom-left-radius:10px;
		border-bottom-right-radius :10px;
		border-top-left-radius :10px;
		border-top-right-radius:10px;
	}
	.save:active{
		background-color: #CF320A;
	}
	.savebtn{
		height: 80px;
		background-color: #cf411b;
		border-bottom-left-radius:10px;
		border-bottom-right-radius :10px;
		border-top-left-radius :10px;
		border-top-right-radius:10px;
		flex: 1
	}
	.reset{
		height: 80px;
		background-color: #FFF;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		border-bottom-color: #CF411B;
		border-top-style: solid;
		border-top-width: 1px;
		border-top-color: #CF411B;
		border-left-style: solid;
		border-left-width: 1px;
		border-left-color: #CF411B;
		border-right-style: solid;
		border-right-width: 1px;
		border-right-color: #CF411B;
		border-bottom-left-radius:10px;
		border-bottom-right-radius :10px;
		border-top-left-radius :10px;
		border-top-right-radius:10px;
		flex: 1;
		margin-right: 20px;
	}
	.warn-div{
		align-items: center;
	}
	.warn-icon{
		width: 137px;
		height:137px;
		margin-top: 170px;
	}
	.label-text{
		color: #CF411B;
		font-size: 22px;
		text-align: center;
	}
	.choose-img{
		width:23px;
		height: 23px;
		margin-top: 4px;
    	margin-left: 5px;
	}
	.label-text1{
		color: #666;
		font-size: 28px;
	}
	.label-text-choosed{
		color: #CF411B;
		font-size: 28px;
	}
	.ischoosed{
		padding-right: 15px;
		padding-left: 15px;
		background-color: #fff;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		border-bottom-color: #CF411B;
		border-top-style: solid;
		border-top-width: 1px;
		border-top-color: #CF411B;
		border-left-style: solid;
		border-left-width: 1px;
		border-left-color: #CF411B;
		border-right-style: solid;
		border-right-width: 1px;
		border-right-color: #CF411B;
	}
	.notchoosed{
		padding-right: 29px;
		padding-left: 29px;
		background-color: #F5F6F5;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		border-bottom-color: #F5F6F5;
		border-top-style: solid;
		border-top-width: 1px;
		border-top-color: #F5F6F5;
		border-left-style: solid;
		border-left-width: 1px;
		border-left-color: #F5F6F5;
		border-right-style: solid;
		border-right-width: 1px;
		border-right-color: #F5F6F5;
	}
	.label-index:first-child{
		margin-left: 0;
	}
	.label-index1{
		border-bottom-style: solid;
		border-bottom-width: 1px;
		border-bottom-color: #CF411B;
		border-top-style: solid;
		border-top-width: 1px;
		border-top-color: #CF411B;
		border-left-style: solid;
		border-left-width: 1px;
		border-left-color: #CF411B;
		border-right-style: solid;
		border-right-width: 1px;
		border-right-color: #CF411B;
		padding-top: 5px;
		padding-right: 5px;
		padding-left: 5px;
		padding-bottom: 5px;
		border-bottom-left-radius:3px;
		border-bottom-right-radius :3px;
		border-top-left-radius :3px;
		border-top-right-radius:3px;
		margin-right: 10px;
		margin-top: 5px;
	}
	.label-index{
		padding-top: 15px;
		padding-bottom: 15px;
		margin-right: 30px;
		margin-bottom: 30px;
		
		flex-direction: row;
		justify-content: space-between;
	}
	.label-indexs{
		flex-direction: row;
		justify-content: start;
    	-webkit-box-pack: justify;
    	-webkit-box-align: center;
    	align-items: center;
    	flex-wrap:wrap;
    	margin-top: 5px;
	}
	.client-location-text2{
		width: 	170px;
		font-size: 28px;
		color: #999;
		text-align: right;
	}
	.client-location-text{
		flex: 1;
		font-size: 28px;
		color: #666
	}
	.client-location{
		flex-direction: row;
		justify-content: start;
    	-webkit-box-pack: justify;
    	-webkit-box-align: center;
    	align-items: center;
    	flex-wrap:wrap;
	}
	.client-name-text{
		font-weight: bold;
		font-size: 	34px;
		color: #333
	}
	.client-index{
		border-bottom-width: 1px;
		border-bottom-style: solid;
		border-bottom-color: #EBEBEB;
		padding-top: 30px;
		padding-bottom: 30px;
	}
	.client-indexs{
		width: 750px;
		padding-left: 30px;
		padding-right: 30px;
	}
	.filterIcon-img{
		width: 27px;
		height: 27px;
	}
	.tobottom{
		width: 18px;
		height: 9px
	}
	.sort-text{
		text-align: center;
		line-height: 90px;
		font-size: 32px;
	}
	.filtrate-text-red{
		color: #CF411B;
	}
	.filtrate-text{
		text-align: center;
		line-height: 90px;
		font-size: 32px;
		color: #666
	}
	.nochecked{
		border-bottom-color: #D8D8D8;
		border-bottom-width: 1px;
	}
	.ischecked{
		border-bottom-color: #CF411B;
		border-bottom-width: 3px;
	}
	.filtrate-div{
		flex: 1;
		text-align: center;
		/*border-bottom-width: 1px;*/
		border-bottom-style: solid;
		flex-direction: row;
		height: 90px;
	}
	.sort-div{
		flex:1;
		text-align: center;
		/*border-bottom-width: 1px;*/
		border-bottom-style: solid;
		height: 90px;
	}
	.sort-filtrate-div{
		height: 90px;
		flex-direction: row;
		justify-content: start;
    	-webkit-box-pack: justify;
    	-webkit-box-align: center;
    	align-items: center;
    	flex-wrap:wrap;
	}
	.sort-filtrate{
		padding-left: 30px;
		padding-right: 30px;
		width: 750px;
	}
	.input-items{
		background-color: #F3F3F3;
		flex: 1;
		height: 66px;
	}
	.search-img{
		width: 30px;
		height: 30px;
		margin-right: 10px;
	}
	.search-div{
		background-color: #F3F3F3;
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
		margin-top: 30px;
	}
	.noData{
		margin-top: 50px;
	}
	.noData-text{
		font-size: 32px;
    	color: #666;
    	text-align: center;
    	margin-top: 30px
	}
	.scrol{
		position: absolute;
		top: 336px;
		bottom:0;
		left: 0;
		width: 750px;
		padding-bottom: 18px;
	}
	.filter-scrol{
		/*position: absolute;*/
		top: -1px;
		height: 710px;
		padding-bottom: 105px;
		background-color: #fff;
	}
	.choose-back{
		position: absolute;
		width: 750px;
		background-color: rgba(0,0,0,0.5);
		bottom: 0;
		flex-direction: column;
	}
	.label-text{
		flex-direction: row;
    	justify-content: space-between;
    	-webkit-box-pack: justify;
    	-webkit-box-align: center;
    	align-items: center;
	}
	.mark-warp{
		position:relative;
		width:750px;
		padding-left:30px;
		padding-right:30px;
	}
	
</style>
<script>
	import buView from '../../components/bu-view.vue'
  	import navigator from '../../common/navigator.js'
  	import modal     from '../../common/modal.js'
  	import stream    from '../../common/stream.js'
  	import icon      from '../tagSection/icon/icon.js'
  	const getEvent  = weex.requireModule('event');
  	const locationEvent = weex.requireModule('locationEvent');
	const globalEvent = weex.requireModule('globalEvent');
	const storage = weex.requireModule('storage');
	export default {
		components:{
            buView
        },
	    data() {
	      	return {
	      		showbtn: false,
	      		tipTxt: '定位中',
	      		isvisit: false,
	      		clientname: '',
	      		pages:{
	      			"visit": '/modules/visiting/clientOperate',
	      			'addjustPage': '/modules/receipt/receiptAdjust',
	      			'bill': '/modules/bill/billList',
	      			'receivelistPage': '/modules/receipt/pay',
	      			'ADD_ORDER': '/modules/orderKing/addOrder/add-order',
	      			'RETURN_ORDER': '/modules/orderKing/returnOrder/return-order',
	      			'detailPage':'/modules/myClient/detailClient',
	      		},
	      		islocation: false,
	      		redgouIcon : icon.redgouIcon,
	      		allchecked : true, 
	      		filterIcon: icon.filterIcon,
	      		tobottom : icon.tobottom,
	      		redtobottom : icon.redtobottom,
	      		warnIcon :icon.warnIcon,
	      		items : {
	      			name: ''
	      		},
	      		locationGray: icon.locationGray,
	      		locationRed : icon.locationRed,
	      		searchIcon: icon.searchIcon,
	      		addIcon  : icon.addIcon,
	      		groupIcon: icon.groupIcon,
	      		back     : icon.backIcon,
	      		okIcon   : icon.okIcon,
	      		delIcon  : icon.delIcon,
	      		movedownIcon : icon.movedownIcon,
	      		moveupIcon : icon.moveupIcon,
	      		openIcon : icon.openIcon,
	      		torightIcon : icon.torightIcon,
	      		headshow : true,
	      		title    : '我的客户',
	      		getallApi: '/buyer/queryBuyerInSaleGroup',
	      		labelApi : '/business/buyer/tag/map/queryTagForBusiBySaleMan',
	      		labelGroup: [],
	      		haveData   : false,
	      		haveDatas  :true,
	      		visitpage: '/modules/visiting/clientOperate',
	      		addPage  : '/modules/myClient/addClient',
	      		modifyPage : '/modules/myClient/modifyClient',
	      		isfilter : false,
	      		checklabelList: [],
	      		clientGroups : [],
	      		longitude : null,
	      		latitude : null,
	      		clientGroups1: [],
	      		configData:{
                    title: '我的客户',
                    titleAlgin: 'left',
                    secondTitle:'',
                    bottom: '0px',
                    addEvent: 'toadd',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: '',
                    loadmore: true,
                    loadmoreEvent:'refresh',
                    viewappear: 'getData',
                },
                currentpage: 1,
                pagesize: 30,
                bartop: 0,
                firstEnter: true
	      	};
	    },
	    created(){
	    	var self = this;
	    	
	    },
	    mounted(){
	    	var that = this
	    	var bundleUrl = that.$getConfig().bundleUrl
	    	var  x = that.getDataByUrl('from',bundleUrl)
	    	if(x!='detailPage'){
	    		this.configData['title'] = '选择客户'
	    	}
	    	stream.fetch({
	    		method:'POST',
	    		url:this.labelApi,
	    		body:{	
					'PAGE_SIZE':this.pagesize,
					'PN': this.currentpage,
				}
	    	},res =>{
	    		this.labelGroup = res.extraData.groupList
	    		this.labelGroup.forEach(function(value,key) {
	    			value['BUYER_TAG_GROUP.BUYER_TAG_LIST'].forEach(function(item,index) {
	    				item['ifchoose'] = false
	    			})
	    		})
	    		// console.log(this.labelGroup)
	    		// this.getData()
	    		storage.getItem('login_user_info',event=>{
			    	this.serviceId = JSON.parse(event.data)['USER.SERVICE_ID'];
			    	storage.getItem('visitInfo', event => {
			    			if(event.data=="{}"||event.data=='undefined'){
								that.isvisit =false
							} else{
								if(JSON.parse(event.data)['VISIT_LIST.SERVICEID']==that.serviceId){
									that.isvisit = true
									that.clientname = JSON.parse(event.data)['VISIT_LIST.CLIENT_NAME']
									that.configData['title']= '客户拜访'
								} else{
									that.isvisit =false
								}
							}
			    		// }else{
			    		// 	modal.alert({message:'222222'})
			    		// 	that.isvisit =false
			    		// }
						
					})
			    })
	    		stream.fetch({
		    		method:'POST',
		    		url:this.getallApi,
		    		body:{	
						'PAGE_SIZE':this.pagesize,
						'PN': this.currentpage
					}
		    	},res =>{
		    		// console.log(res)
		    		this.clientGroups = res.data
		    		if(this.clientGroups.length==0){
		    			this.haveDatas =false
		    		}
		    		this.labelList = res.extraData['userTagMap']
		    		// if(this.groupList.length == 0){
	    			// 	this.noData = true
	    			// }
		    	})
		    	var self = this
		    	if(typeof(globalEvent.addEventListener) == "function"){
			    	var x =setTimeout(function() {
			    		globalEvent.addEventListener("getLocation", function (val) {
			    			
			    		})
			    	},1000)
		    	}
		    	var x =setTimeout(function() {
		    		globalEvent.addEventListener("currLocationInfo", function (res) {
		    			if(res!=null){
		    				if(res.type=='location'){
		    					that.longitude = res.longitude
		    					that.latitude  = res.latitude
		    					stream.fetch({
						    		method:'POST',
						    		url:that.getallApi,
						    		body: {
						    			'LONGITUDE':that.longitude,
						    			'LATITUDE':that.latitude,
						    			'BUYER.SEARCH' : that.items.name,
			    						'BUYER.TAG_ID_LIST': that.checklabelList.join(),
						    			'WITH_DISTANCE':1,
						    			'PAGE_SIZE':that.pagesize,
										'PN': 1
						    		}
						    	},res =>{
						    		that.clientGroups1 = res.data
						    		that.labelList1 = res.extraData['userTagMap']
						    		if(that.clientGroups1.length == 0){
					    				that.haveData = false
					    				that.tipTxt = '暂无客户'
					    				that.showbtn = true
					    			} else{
					    				that.haveData  = true
					    				that.showbtn = true
					    			}
					    			that.islocation= false
					    			// modal.alert({message:JSON.stringify(that.clientGroups1)})
					    			// modal.alert({message:that.labelList1})
						    	})
		    				}
		    			}else{
		    				that.haveData = false
					    	that.tipTxt = '无法获取您的位置信息'
		    				modal.toast({message:'请确认是否打开位置信息并稍后重试',duration:1})
		    			}
		    		})
		    	},1000)
	    	})
	    	
	    },
	    watch :{
	    	items: {  
	            handler: function() { 
	                // alert(this.$refs.name.value);
	                // console.log(this.items.name)
	                // var m = this.checklabelList.join()
	                if(this.allchecked==true){
		                stream.fetch({
				    		method:'POST',
				    		url:this.getallApi,
				    		body:{
			    				'BUYER.SEARCH' : this.items.name,
			    				'BUYER.TAG_ID_LIST': this.checklabelList.join(),
			    				'PAGE_SIZE':this.pagesize,
								'PN': 1
			    			}
				    	},res =>{
				    		// console.log(res)
				    		this.clientGroups = res.data
				    		if(this.clientGroups.length==0){
				    			this.haveDatas =false
				    		}else{
				    			this.haveDatas =true
				    		}
				    		// modal.alert({message:this.clientGroups})
		    				this.labelList = res.extraData['userTagMap']
		    				// modal.alert({message:JSON.stringify(this.labelList)})
				    		// if(this.groupList.length == 0){
			    			// 	this.noData = true
			    			// }
				    	})
				    }else{
				    	stream.fetch({
				    		method:'POST',
				    		url:this.getallApi,
				    		body: {
				    			'LONGITUDE':this.longitude,
				    			'LATITUDE':this.latitude,
				    			'WITH_DISTANCE':1,
				    			'PAGE_SIZE':this.pagesize,
								'PN': 1,
								'BUYER.SEARCH' : this.items.name,
			    				'BUYER.TAG_ID_LIST': this.checklabelList.join()
				    		}
				    	},res =>{
				    		this.clientGroups1 = res.data
				    		this.labelList1 = res.extraData['userTagMap']
				    		if(this.clientGroups1.length == 0){
			    				this.haveData = false
			    				this.tipTxt = '暂无客户'
			    				this.showbtn = true
			    			} else{
			    				this.haveData  = true
			    				this.showbtn = true
			    			}
			    			that.islocation= false
			    			// modal.alert({message:JSON.stringify(that.clientGroups1)})
			    			// modal.alert({message:that.labelList1})
				    	})
				    }
	                 
	            },  
	            deep: true 
           }  
	    },
    	methods:{
    		closeFilter(){
    			this.isfilter = false
    		},
    		recondition(){
    			this.items.name = '';
		    	this.checklabelList = [];
		    	var that = this;
		    	this.labelGroup.forEach(function(value,key) {
	    			value['BUYER_TAG_GROUP.BUYER_TAG_LIST'].forEach(function(item,index) {
	    				if(item['ifchoose'] == true){
	    					item['ifchoose'] = false
	    					that.$set(that.labelGroup[key]['BUYER_TAG_GROUP.BUYER_TAG_LIST'],index,item)
	    				}
	    			})
	    		})
    		},
    		tovisit(){
    			navigator.push({
    				url: this.visitpage,
    				query: '?to=visited'

    			},res=>{})
    		},
    		viewEvent(name,call){
    			this[name](call)
    		},
    		todetail(item){
    			// console.log(item)
    			var self = this
	    		var bundleUrl = self.$getConfig().bundleUrl
	    		var  x = self.getDataByUrl('from',bundleUrl)
	    		storage.setItem('select_client_msg',JSON.stringify(item), event =>{
	   	    		navigator.push({
	    				url: this.pages[x],
	    			},res=>{})
	    		})
    		},
    		getData(){
    			storage.getItem('renderClient', event =>{
    				if(event.data=='true'){
		    			var that = this
				    	stream.fetch({
				    		method:'POST',
				    		url:this.labelApi,
				    		body:{	
								'PAGE_SIZE':this.pagesize,
								'PN': 1,
							}
				    	},res =>{
				    		this.labelGroup = res.extraData.groupList
				    		this.labelGroup.forEach(function(value,key) {
				    			value['BUYER_TAG_GROUP.BUYER_TAG_LIST'].forEach(function(item,index) {
				    				item['ifchoose'] = false
				    			})
				    		})
					    	storage.getItem('login_user_info',event=>{
						    	this.serviceId = JSON.parse(event.data)['USER.SERVICE_ID'];
						    	storage.getItem('visitInfo', event => {
						    			if(event.data=="{}"||event.data=='undefined'){
											that.isvisit =false
										} else{
											if(JSON.parse(event.data)['VISIT_LIST.SERVICEID']==that.serviceId){
												that.isvisit = true
												that.clientname = JSON.parse(event.data)['VISIT_LIST.CLIENT_NAME']
												that.configData['title']= '客户拜访'
											} else{
												that.isvisit =false
											}
										}
						    		// }else{
						    		// 	that.isvisit =false
						    		// }
									
								})
						    })
				    		stream.fetch({
					    		method:'POST',
					    		url:this.getallApi,
					    		body:{	
									'PAGE_SIZE':this.pagesize,
									'PN': 1,
								}
					    	},res =>{
					    		// console.log(res)
					    		this.clientGroups = res.data
					    		if(this.clientGroups.length==0){
					    			this.haveDatas =false
					    		}else{
					    			this.haveDatas =true
					    		}
					    		this.labelList = res.extraData['userTagMap']
					    		// if(this.groupList.length == 0){
				    			// 	this.noData = true
				    			// }
					    	})
				    	})
				    	var mx = false; 
		                storage.setItem('renderClient',JSON.stringify(mx),event =>{})
				    }
			    })
    		},
    		refresh(call){
    			this.currentpage++
    			stream.fetch({
		    		method:'POST',
		    		url:this.getallApi,
		    		body:{	
	    				'PAGE_SIZE':this.pagesize,
	    				'PN': this.currentpage
	    			}
		    	},res =>{
		    		this.clientGroups = this.clientGroups.concat(res.data)
		    		this.labelList = this.labelList.concat(res.extraData['userTagMap'])
		    	},res=>{
		    		call()
		    	})
		    	
    		},
    		getDataByUrl: function (name, url) {
			  name = name.replace(/[\[\]]/g, "\\$&");
			  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			  results = regex.exec(url); 
			  if (!results) return null;
			  if (!results[2]) return '';
			  return decodeURIComponent(results[2].replace(/\+/g, " "));
			},
    		choosenear(key){
    			if(key == 1){
    				this.allchecked = true
    				this.islocation = false
    				this.configData['bottom'] = '0px'
    			} else if(key == 2){
    				this.configData['bottom'] = '130px'
    				if(this.clientGroups1.length==0){
    					this.tipTxt = "正在定位中"
	    				this.haveData = false
	    				this.allchecked = false
	    				this.islocation = true
	    				this.clientGroups1 = []
	    				var that = this
	    				locationEvent.getLocation('location')
    				}else{
    					this.allchecked = false;
    					this.haveData = true;
    				}
    				
    			} else if(key==3){
    				this.tipTxt = "正在定位中"
    				this.haveData = false
    				this.allchecked = false
    				this.islocation = true
    				this.clientGroups1 = []
    				this.configData['bottom'] = '130px'
    				var that = this
    				locationEvent.getLocation('location')
    			}
    		},
    		toadd(){
    			navigator.push({
    				url: this.addPage
    			},res=>{})
    		},
    		gomodify(item){
    			navigator.push({
    				url: this.modifyPage,
    				query: '?id='+item['SALEMAN_RULE_GROUP.SALEMAN_RULE_GROUP_ID']
    			},res=>{})
    		},
    		toback(){
    			navigator.pop()
    		},
    		tofilter(){
    			// modal.alert({message:this.$refs.views.statusBarH})
	    		this.bartop = parseInt(this.$refs.views.statusBarH)+275
    			this.isfilter = !this.isfilter
    		},
    		ifchoose(key1,key2){
    			var that = this
    			// console.log(this.labelGroup)
    			this.labelGroup[key1]['BUYER_TAG_GROUP.BUYER_TAG_LIST'][key2]['ifchoose'] = !this.labelGroup[key1]['BUYER_TAG_GROUP.BUYER_TAG_LIST'][key2]['ifchoose']
    			this.$set(this.labelGroup[key1]['BUYER_TAG_GROUP.BUYER_TAG_LIST'],key2,this.labelGroup[key1]['BUYER_TAG_GROUP.BUYER_TAG_LIST'][key2])
    			if(this.labelGroup[key1]['BUYER_TAG_GROUP.BUYER_TAG_LIST'][key2]['ifchoose']){
    				this.checklabelList.push(this.labelGroup[key1]['BUYER_TAG_GROUP.BUYER_TAG_LIST'][key2]['BUYER_TAG.BUYER_TAG_ID'])
    			} else{
    					this.checklabelList.splice(this.checklabelList.indexOf(this.labelGroup[key1]['BUYER_TAG_GROUP.BUYER_TAG_LIST'][key2]['BUYER_TAG.BUYER_TAG_ID']),1)
    			}
    			console.log(this.checklabelList)
    		},
    		savelabel(){
    			// console.log(this.)
    			// var m = this.checklabelList.join()
    			// modal.alert({message:this.checklabelList.join()})
    			// modal.alert({message:typeof(this.checklabelList.join())})

    			stream.fetch({
		    		method:'POST',
		    		url:this.getallApi,
		    		body:{
		    				'BUYER.SEARCH' : this.items.name,
		    				'BUYER.TAG_ID_LIST': this.checklabelList.join(),
		    				'PAGE_SIZE':this.pagesize,
							'PN': 1
		    			  }
		    	},res =>{
		    		// console.log(res)
		    		this.clientGroups = res.data
		    		// modal.alert({message:this.clientGroups})
    				this.labelList = res.extraData['userTagMap']
		    		// if(this.groupList.length == 0){
	    			// 	this.noData = true
	    			// }
		    	},res=>{
		    		this.isfilter = false;
		    	})
    		},

    	}
    };
</script>
