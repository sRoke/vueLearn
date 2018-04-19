<template>	
<!-- 头部大 -->
<bu-view :config="configData" @event="viewEvent">
		<topTabBar :list="tabList" :index="nowIndex" @change="choosenear"></topTabBar>
		<div v-if="nowIndex == 0">
			<div class="company-name-div">
				<text class="company-name-txt">{{clientInfos['BUYER.BUYER_NAME']}}</text>
				<text class="company-remark-txt">{{clientInfos['BUYER.REMARK']}}</text>
			</div>
			<div class="text-info">
				<div class="phone-icon-div"><image class="phone-icon" :src="phoneIcon"></image></image></div>
				<div class="info-text-div"><text class="info-text">{{clientInfos['BUYER.LINKMAN_PHONE']}}</text>
			</div></div>
			<div class="text-info" v-if="clientInfos['BUYER.DELIVERY_ADDR_DETAIL']!=undefined&&clientInfos['BUYER.DELIVERY_ADDR_DETAIL']!=''">
				<div class="phone-icon-div1"><image class="adress-icon" :src="addressIcon"></image></div>
				<div class="info-text-div" ><text class="info-text">{{clientInfos['BUYER.DELIVERY_ADDR_DETAIL']}}</text></div>
			</div>
			<div class="labels-div">
				<div class="label-icon-div"><image class="label-icon" :src="labelIcon"></image></div>
				<div class="labelindexs">
					<div class="labelindex" v-for="(item,index) in labelList"><text class='label-text'>{{item['BUYER_TAG.BUYER_TAG_NAME']}}</text></div>
				</div>
			</div>
		</div>
		<div class="bottom-div" slot="footer" v-if="nowIndex == 0">
			<div class="two-index-one" @click="tophone">
				<div class="phone-div">
					<image class="dark-phone-img" :src="darkphoneIcon"></image>
				</div>
				<div class="bottom-text-div">
					<text class="phone-text">电话</text>
					<!-- <text class="phone-text">无法获取您的位置信息</text> -->
				</div>
			</div>
			<div class="two-index-two" @click="tolocation" >
				<div class="phone-div">
					<image class="dark-location-img" :src="darklocationIcon"></image>
				</div>
				<div class="bottom-text-div">
					<text class="phone-text">导航</text>
				</div>
			</div>
		</div>
		<div v-if="nowIndex == 1">
			<orderCard :list="tabList[1].list" :type="addType" @jump="jumpToAddOrder"></orderCard>
			<text class="nodata-txt" v-if='tabList[1].list.length==0&&renderOver'>暂无数据</text>
		</div>
		<div v-if="nowIndex == 2">
			<orderCard :list="tabList[2].list" :type="returnType" @jump="jumpToReturnOrder"></orderCard>
			<text class="nodata-txt" v-if='tabList[2].list.length==0&&renderOver'>暂无数据</text>
		</div>
		<div v-if="nowIndex == 3">
			<text class="nodata-txt" v-if='payLists.length==0&&renderOver'>暂无数据</text>
			<div class="lists">
				<!-- <div class="wait-lists">
					<text class="wait-txt">已确认</text>
				</div> -->
				<div class="over-lists">
					<div class="over-list" v-for="(item,index) in payLists" v-if="item['MONEY_CONFIRM.STATE'] == '1'" @click="todo(item)">
						<div class="left-div">
							<text class="date">{{item['MONEY_CONFIRM.ADD_DATETIME']}}</text>
							<text class="name">{{item['MONEY_CONFIRM.ADD_UNAME']}}</text>
						</div>
						<div class="list-info">
							<div class="top-money">
								<div class="green-circle"></div>
								<text class="money-txt">¥{{item['MONEY_CONFIRM.MONEY']}}</text>
							</div>
							<div class="bottom-info">
								<text class="company-name">{{item['MONEY_CONFIRM.NAME']}}</text>
								<text class="pay-type">{{item['MONEY_CONFIRM.COMPANY_BANK_ACCOUNT_NAME']}}</text>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="choose-back" v-if="ifmaps" slot="footer">
			<div class="choosemaps">
				<div class="back-div" @click="closeds" id="nav">
					<image class="head-back-icon" :src="back"></image>
				</div>
				<div class="all-salesman-div">
					<div class="salesmansIndex" v-for="value in maps" >
						<text class="choosed-name" @click="tomaps(value)">{{value}}</text>
					</div>
				</div>
				<!-- <text class='tips'>点击所要选择的地图</text> -->
			</div>
		</div>
</bu-view>
</template>	

<style  scoped>
	.nodata-txt{
		color: #333;
		font-size: 35px;
		margin-top: 100px;
		text-align: center;
	}
	.head-back-icon{
		width: 17px;
		height: 32px;
		left: 0;
		/*margin-top: 44px;*/
	}
	.back-div{
		width: 750px;
		height: 68px;
		/*padding-left: 30px; */
		padding-top: 19px;
		border-bottom-style: solid;
		border-bottom-color: #EBEBEB;
		border-bottom-width: 1px;
	}
	.over-lists{
		margin-top: 20px;
	}
	.wait-lists{
		margin-top: 50px;
	}
	.bottom-info{
		padding-left: 24px;
		border-left-style: solid;
		border-left-width: 1px;
		border-left-color: #EBEBEB;
		padding-bottom: 45px;
		margin-left: 9px;
		margin-top: 10px;
	}
	.pay-type{
		color: #999;
		font-size: 28px;
		margin-top: 10px;
	}
	.company-name{
		color: #666;
		font-size: 32px;
	}
	.money-txt{
		flex: 1
	}
	.top-money{
		flex-direction: row;
	}
	.list-info{
		flex: 1
	}
	.money-txt{
		color: #CF411B;
		font-size: 42px;
	}
	.green-circle{
		width: 18px;
		height: 18px;
		background-color: #0F9B80;
		border-bottom-left-radius:9px;
		border-bottom-right-radius :9px;
		border-top-left-radius :9px;
		border-top-right-radius:9px;
		margin-top: 16px;
		margin-right: 15px;
	}
	.name{
		color: #666;
		font-size: 28px;
	}
	.date{
		font-size: 40px;
		color: #333;
		margin-bottom: 15px;
	}
	.left-div{
		width: 150px;
	}
	.over-list{
		flex-direction: row;
		justify-content: space-between;
	}
	.wait-txt{
		font-size: 42px;
		color: #333;
		font-weight: bold;
		margin-bottom: 43px;
	}
	.lists{
		margin-bottom: 20px;
		padding-right: 30px;
		padding-left: 30px;
	}
	.choosed-name:active{
		color: #CF411B
	}
	.colsed{
		width: 100px;
		margin-left: 540px;
		font-size: 35px;
		text-align: right;
		color: #D8D8D8
	}
	.tips{
		color: #999;
		margin-top:30px;
		margin-bottom: 30px;
		text-align: center;
	}
	.map-index-txt{
		color: #333;
		font-size: 32px;
		line-height: 100px;
		text-align: center;
	}
	.map-index{
		height: 100px;
		border-bottom-width: 1px;
		border-bottom-color: #D8D8D8;
		border-bottom-style: solid;
	}
	.choosemaps{
		width: 750px;
		height: 428px;
		position: absolute;
		bottom: 0;
		background-color: #fff;
		border-top-left-radius :20px;
		border-top-right-radius:20px;
		margin-bottom: 0;
		padding-left: 30px;
		padding-right: 30px;
		/*padding-top:25px;*/
	}
	.choosed-name{
		font-size: 32px;
		color: #333;
		line-height: 118px;
		flex: 1;
		text-align: center;
	}
	.salesmansIndex{
		flex-direction: row;
		height: 118px;
		width: 690px;
		justify-content: space-between;
		border-bottom-style: solid;
		border-bottom-color: #EBEBEB;
		border-bottom-width: 1px;
		padding-right: 15px;
		padding-left: 15px;
	}
	.all-salesman-div{
		width: 690px;
		height: 350px
	}
	.choose-back{
		position: absolute;
		z-index: 999;
		top: 0;
		width: 750px;
		background-color: rgba(0,0,0,0.5);
		/*height: 100%;*/
		bottom: 0
	}
	.text-r:last-child{
		margin-top: 20px;
	}
	.text-r{
		text-align: right;
	}
	.info-top{
		flex-direction: row;
		justify-content: start;
		margin-bottom: 20px;
	}
	.info-type{
		padding-top: 3px;
		padding-bottom: 3px;
		padding-top: 5px;
		padding-bottom: 5px;
		border-bottom-style: solid;
    	border-bottom-color: #CF411B;
    	border-bottom-width: 1px;
    	border-top-style: solid;
    	border-top-color: #CF411B;
    	border-top-width: 1px;
    	border-left-style: solid;
    	border-left-color: #CF411B;
    	border-left-width: 1px;
    	border-right-style: solid;
    	border-right-color: #CF411B;
    	border-right-width: 1px;
    	border-bottom-left-radius:4px;
		border-bottom-right-radius:4px;
		border-top-left-radius :4px;
		border-top-right-radius:4px;
		margin-right: 5px;
	}
	.type-text{
		font-size: 24px;
		color: #CF411B
	}
	.price-text{
		font-size: 34px;
		color: #333;
		font-weight: bold
	}
	.info-time-text{
		font-size: 32px;
		color: #333;
		font-weight: bold
	}
	.order-num{
		font-size: 30px;
		color: #666
	}
	.price-info{
		flex: 2
	}
	.trade-indexs{
		padding-left: 30px;
		padding-right: 30px
	}
	.order-info{
		flex: 3;
		margin-left: 10px;
		margin-right: 10px;
	}
	.good-img{
		width: 112px;
		height: 112px;
	}
	.trade-index{
		flex-direction: row;
		justify-content: start;
    	-webkit-box-pack: justify;
    	padding-top: 30px;
    	padding-bottom: 30px;
    	border-bottom-style: solid;
    	border-bottom-color: #D8D8D8;
    	border-bottom-width: 1px;
	}
	.bottom-text-div{
		height: 30px;
		margin-top: 10px;
		flex: 1;
		padding-left: 32px
	}
	.phone-text{
		font-size: 20px;
		color: #333;
		/*text-align:center;*/
	}
	.phone-div:last-child{
		padding-left: 31px
	}
	.phone-div{
		width: 100px;
		height: 100px;
		border-bottom-left-radius:50px;
		border-bottom-right-radius:50px;
		border-top-left-radius :50px;
		border-top-right-radius:50px;
		background-color: #F5F5F5;
		justify-content: center;
		padding-left: 32px
	}
	.dark-phone-img{
		width: 35px;
		height: 35px;
	}
	.dark-location-img{
		width: 38px;
		height: 38px;
	}
	.two-index-one{
		margin-right: 90px;
		margin-left: 230px;
	}
	.bottom-div{
		position: absolute;
		bottom: 33px;
		flex-direction: row;
		/*justify-content:center;*/
		width: 750px;
	}
	.labelindexs{
		flex-direction: row;
		justify-content: start;
    	-webkit-box-pack: justify;
    	flex-wrap:wrap;
    	flex:1;
	}
	.labelindex{
		padding-left: 20px;
		padding-right: 20px;
		padding-top: 20px;
		padding-bottom: 20px;
		background-color: #F5F5F5;
		margin-right: 20px;
		margin-bottom: 20px;
	}
	.label-icon-div{
		width: 33px;
		height: 33px;
		margin-right: 20px;
		margin-top: 15px;
	}
	.label-icon{
		width: 33px;
		height: 33px;
	}
	.labels-div{
		padding-top: 25px;
		padding-left: 30px;
		flex-direction: row;
		margin-bottom: 20px;
	}
	.phone-icon{
		width: 29px;
		height: 29px;
	}
	.adress-icon{
		width: 28px;
		height: 36px;
	}
	.info-text{
		font-size: 32px;
		color: #333;
		
	}
	.phone-icon-div{
		width: 29px;
		height: 29px;
		margin-top: 35px;
		margin-bottom: 30px;
		margin-right: 20px;
	}
	.phone-icon-div1{
		width: 40px;
		height: 40px;
		margin-top: 25px;
		margin-bottom: 30px;
		margin-right: 20px;
	}
	.info-text-div{
		padding-bottom: 30px;
		border-bottom-color: #D8D8D8;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		flex: 1;
		margin-top: 30px;
		padding-right: 30px;
	}
	.text-info{
		padding-left: 30px;
		flex-direction: row;
		justify-content: space-between;
	}
	.modify-txt{
		font-size: 30px;
		color: #333
	}
	.company-remark-txt{
		font-size: 30px;
		color: #CF411B;
		text-align: center;
		margin-top: 15px
	}
	.company-name-txt{
		font-size: 42px;
		color: #333;
		font-weight: bold;
		text-align: center;
	}
	.company-name-div{
		width: 750px;
		height: 300px;
		padding-right: 30px;
		padding-left:30px;
		justify-content: center;
		align-items: center;
	}
</style>
<script>
	import buView from '../../components/bu-view.vue'
  	import navigator from '../../common/navigator.js'
  	import modal     from '../../common/modal.js'
  	import stream    from '../../common/stream.js'
  	import icon      from '../tagSection/icon/icon.js'
  	import topTabBar from '../orderSection/components/tab-bar.vue'
  	import orderCard from '../orderSection/components/order-card.vue'
  	const getEvent  = weex.requireModule('event');
  	const locationEvent = weex.requireModule('locationEvent');
	const globalEvent = weex.requireModule('globalEvent');
	const storage = weex.requireModule('storage');
	export default {
		components:{
            buView,
            topTabBar,
            orderCard
        },
	    data() {
	      	return {
	      		renderOver:false,
	      		noData: false,
	      		ifmaps: false,
	      		addressIcon: icon.addressIcon,
	      		phoneIcon  : icon.phoneIcon,
	      		labelIcon  : icon.labelIcon,
	      		darkphoneIcon : icon.darkphoneIcon,
	      		darklocationIcon : icon.darklocationIcon,
	      		redgouIcon : icon.redgouIcon,
	      		allchecked : 1, 
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
	      		getallApi: '/buyer/queryByBuyerId',
	      		labelGroup: [],
	      		modifyPage : '/modules/myClient/modifyClient',
	      		isfilter : false,
	      		checklabelList: [],
	      		clientGroups : [],
	      		currentId: null,
	      		clientInfos: {},
	      		labelList: [],
	      		phone: null,
	      		maps: [],
	      		configData:{
                    title: '客户详情',
                    titleAlgin: 'left',
                    secondTitle:'',
                    bottom: '105px',
                    addEvent: 'tomodify',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: 'refresh',
                    loadmore: true,
                    loadmoreEvent:'loadmore',
                    btnText: '编辑',
                    viewappear: 'getData',
                },
                tabList:[{
                    name:'拜访'
                },{
                    name:'订单',
                    list: [],
                    api:'/bee/order/new/parent/getBySaleman?PAGE_SIZE=20&PN=',
                    pn: 1
                },{
                    name:'退单',
                    list: [],
                    api:'/bee/returnOrder/order/queryReturnOrder?PAGE_SIZE=20&PN=',
                    pn: 1
                },{
                    name:'收款',
                    api:'/money/confirm/getByAddId?PAGE_SIZE=20&PN=',
                    pn: 1
                }],
                addType:{
                    'WAIT':'配货中',
                    'DELIVERY':'发货中',
                    'DONE':'已收货',
                    'CANCEL':'已取消'
                },
                returnType:{
                    'WAIT':'待确认',
                    'DONE':'已确认',
                    'CANCEL':'已作废'
                },
                nowIndex:0,
                Uid: '',
                payLists: [],
	      	};
	    },
	    created(){
	    	var self = this;
	    	
	    },
	    mounted(){
	    	storage.getItem('select_client_msg', event => {
	    		// modal.alert({message:event.data})
		    	stream.fetch({
		    		method:'GET',
		    		url:'/buyer/queryByBuyerId?BUYER.BUYER_ID='+JSON.parse(event.data)['BUYER.BUYER_ID']
		    		// url:'/buyer/queryByBuyerId?BUYER.BUYER_ID=5057'
		    	},res =>{
		    		this.clientInfos = res.data[0]
		    		this.labelList = res.extraData.tagList
		    		this.Uid = this.clientInfos['BUYER.UID']
		    		this.currentId = this.clientInfos['BUYER.BUYER_ID']
		    		// modal.alert({message:stringify(clientInfos)})
		    		this.phone = this.clientInfos['BUYER.LINKMAN_PHONE']
		    	})
		    })
	    },
	    watch :{
	    	items: {  
                handler: function() {  
                    // alert(this.$refs.name.value);
                    console.log(this.items.name)
                    // var m = this.checklabelList.join()
                    stream.fetch({
			    		method:'POST',
			    		url:this.getallApi,
			    		body:{
			    				'BUYER.SEARCH' : this.items.name,
			    				'BUYER.TAG_ID_LIST': this.checklabelList.join()
			    			  }
			    	},res =>{
			    		// console.log(res)
			    		this.clientGroups = res.data
	    				this.labelList = res.extraData['userTagMap']
			    		// if(this.groupList.length == 0){
		    			// 	this.noData = true
		    			// }
			    	})

                },  
               	deep: true  
            }  
	    },
    	methods:{
    		viewEvent(name,call){
    			this[name](call)
    		},
    		closeds(){
    			this.ifmaps = false
    		},
    		getData(){
    			var self = this
    			storage.getItem('select_client_msg', event => {
			    	stream.fetch({
			    		method:'POST',
			    		url:'/buyer/queryByBuyerId?BUYER.BUYER_ID='+JSON.parse(event.data)['BUYER.BUYER_ID']
			    		// url:'/buyer/queryByBuyerId?BUYER.BUYER_ID=5022'
			    	},res =>{
			    		this.clientInfos = res.data[0]
			    		this.labelList = res.extraData.tagList
			    		this.currentId = this.clientInfos['BUYER.BUYER_ID']
			    		this.Uid = this.clientInfos['BUYER.UID']
			    		// modal.alert({message:stringify(clientInfos)})
			    		this.phone = this.clientInfos['BUYER.LINKMAN_PHONE']
			    	})
			    })
    		},
    		choosenear(key){
    			if(key !== this.nowIndex){
    				this.nowIndex = key
    				if(key == 0){
    					this.configData.bottom = '105px'
    				}else{
    					this.configData.bottom = '0px'
    				}
    				if(key == 1 && this.tabList[key].list.length == 0){
    					this.getAddData(key,1)
    				}else if(key == 2 && this.tabList[key].list.length == 0){
    					this.getReturnData(key,1)
    				} else if(key==3 && this.payLists.length == 0){
    					this.getPayData(key,1)
    				}
    			}
    		},
    		tomaps(value){
    			// console.log(value)
    			// modal.alert({message: value})
    			var x={
    				"name" : value,
    				"lat"  : this.clientInfos['BUYER.LATITUDE'],
    				"lon"  : this.clientInfos['BUYER.LONGITUDE'],
    				"address": this.clientInfos['BUYER.ADDR_DETAIL']
    			}
    			// modal.alert({message: x})
    			locationEvent.toNavigation(x)
    		},
    		toback(){
    			navigator.pop()
    		},
    		tomodify(){
    			navigator.push({
    				url: this.modifyPage,
    				query: '?id='+this.currentId
    			},res=>{})
    		},
    		tolocation(){
    			var that = this
    			if(this.clientInfos['BUYER.ADDR_DETAIL']!=null&&this.clientInfos['BUYER.ADDR_DETAIL']!=''){
    				locationEvent.getLocalMapName(function(res) {
    					that.maps = res
    					that.ifmaps = true
    				})
    			}else{
    				modal.toast({message:'此客户没有添加导航地址',duration:2})
    			}
    			
    		},
    		tophone(){
    			var m = this.phone
    			getEvent.call(m)
    		},

    		getPayData(index,pn){
    			// let query = this.tabList[index].api + pn;
    			this.renderOver = false
              	pn == 1 ? (this.configData.pageRender = true) : ''
              	stream.fetch({
		    		method:'GET',
		    		url:'/money/confirm/getByAddId?UID='+this.Uid+'&PAGE_SIZE=20&PN='+pn
		    	},res =>{
		    		this.configData.pageRender = false
		    		this.renderOver = true
		    		this.payLists = res.data
		    		var that = this
		    		this.payLists.forEach(function(value,key) {
		    			value['MONEY_CONFIRM.ADD_DATETIME'] = value['MONEY_CONFIRM.ADD_DATETIME'].split(" ")[0]
		    			var x = value['MONEY_CONFIRM.ADD_DATETIME'].split("-")
		    			value['MONEY_CONFIRM.ADD_DATETIME'] = x[1]+"-"+x[2]
		    			
		    		})
		    	})
    		},
    		/*

				获取订单信息

    		*/
    		getAddData(index,pn){
    		  this.renderOver = false
              let query = this.tabList[index].api + pn
              pn == 1 ? (this.configData.pageRender = true) : ''
              stream.fetch({
                method:'GET',
                url: query+"&ORDER_PARENT.UID="+this.Uid
              },res=>{
                  let arr = []
                  res.data.forEach(ele =>{
                    arr.push({
                      img:ele['ORDER_PARENT.PRODUCT_IMG'],
                      name: ele['ORDER_PARENT.USER_NAME'],
                      code: ele['ORDER_PARENT.ORDER_CODE'],
                      money: ele['ORDER_PARENT.SUM_OVER_PRICE'],
                      class: ele['ORDER_PARENT.SKU_COUNT'],
                      count: ele['ORDER_PARENT.BUY_COUNT'],
                      type: ele['ORDER_PARENT.TARGET'],
                      id: ele['ORDER_PARENT.ORDER_PARENT_ID']
                    })
                  })
                  this.tabList[index].list = this.tabList[index].list.concat(arr)                
              },res=>{
                this.configData.pageRender = false
                this.renderOver = true
              })
            },
            getReturnData(index,pn){
              this.renderOver = false
              let query = this.tabList[index].api + pn
              pn == 1 ? (this.configData.pageRender = true) : ''
              stream.fetch({
                method:'GET',
                url: query+"&UID="+this.Uid
              },res=>{
                  let arr = []
                  res.data.forEach(ele =>{
                    arr.push({
                      img:ele['ORDERE_RETURN.PRD_IMG'],
                      name: ele['ORDER_RETURN.USER_NAME'],
                      code: ele['ORDER_RETURN.ORDER_RETURN_CODE'],
                      money: ele['ORDER_RETURN.SUM_OVER_RETURN_PRICE'],
                      class: ele['ORDERE_RETURN.PRD_NUM'],
                      count: ele['ORDERE_RETURN.PRD_COUNT'],
                      type: ele['ORDER_RETURN.STATUS'],
                      id: ele['ORDER_RETURN.ORDER_RETURN_ID']
                    })
                  })
                  this.tabList[index].list = this.tabList[index].list.concat(arr)             
              },res=>{
                this.configData.pageRender = false
                this.renderOver = true
              })
            },
            jumpToAddOrder(id){
              navigator.push({
                  url:'/modules/orderSection/salemanOrder/order-detail',
                  query:'?id=' + id
              })
            },
            jumpToReturnOrder(id){
               navigator.push({
                  url:'/modules/orderSection/salemanOrder/return-order-detail',
                  query:'?id=' + id
              }) 
            },
            loadmore(){
            	let index = this.nowIndex
            	if(index == 1 || index == 2||index==3){
            		this.tabList[index].pn ++ 
            		if(index == 1){
            			this.getAddData(index,this.tabList[index].pn)
            		}else if(index==2){
            			this.getReturnData(index,this.tabList[index].pn)
            		}else if(index==3){
            			this.getPayData(index,this.tabList[index].pn)
            		}
            	}
            }
    	}
    };
</script>
