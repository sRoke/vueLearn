<template>	
<bu-view :config="configData" @event="viewEvent">
	<topTabBar :list="tabList" :index="nowIndex" @change="choosenear"></topTabBar>
	<div v-if="nowIndex == 0">
		<div class="numinfo">
			<div class="numinfo-index1">
				<text class="info-txt font-gray99 font24">上次拜访</text>
				<div class="info-time">
					<text class="info-num font48 font-gray33" v-if="!ifFirst&&infos['VISIT_LIST.DATE_RANGE']!=0">{{infos['VISIT_LIST.DATE_RANGE']}}</text>
					<text class="info-num-day font24 font-gray33" v-if="!ifFirst&&infos['VISIT_LIST.DATE_RANGE']!=0">天前</text>
					<text class="info-num font48 font-gray33" v-if="!ifFirst&&infos['VISIT_LIST.DATE_RANGE']==0">今天</text>
					<text class="info-num font48 font-gray33" v-if="ifFirst">首次</text>
				</div>
			</div>
			<div class="numinfo-index">
				<text class="info-txt font-gray99 font24">上次销售</text>
				<text class="info-num font48 font-gray33">{{infos['VISIT_LIST.ORDER_MONEY']||0|price}}</text>
			</div>
			<div class="numinfo-index">
				<text class="info-txt font-gray99 font24">欠款</text>
				<text class="info-num font48 font-gray33">{{debtMoney||0|price}}</text>
			</div>
		</div>
		<div class="operate-btn">
			<div class="btn-index"  @click="tothispage('photo')">
				<div class="btn-div">
					<image class="btn-icon" :src="photo"></image>
					<text class="btn-name">拍照</text>
				</div>
				<div class="tip-num" v-if="photoNum>0">
					<text class='tip-num-txt'>{{photoNum}}</text>
				</div>
			</div>
			<div class="btn-index" @click="tothispage('add')"> 
				<div class="btn-div">
					<image class="btn-icon" :src="openorder"></image>
					<text class="btn-name">开单</text>
				</div>
			</div>
			<div class="btn-index11">
				<div class="btn-div" @click="tothispage('carsale')">
					<image class="btn-icon" :src="carsale"></image>
					<text class="btn-name">车销</text>
				</div>
			</div>
		</div>
		<div class="operate-btn1">
			<div class="btn-index1" @click="tothispage('returns')">
				<div class="btn-div">
					<image class="btn-icon" :src="returngoods" ></image>
					<text class="btn-name">退货</text>
				</div>
			</div>
			<div class="btn-index1" @click="tothispage('receipt')">
				<div class="btn-div">
					<image class="btn-icon" :src="receivemoney"></image>
					<text class="btn-name">收款</text>
				</div>
			</div>
			<div class="btn-index11">
				<div class="btn-div" @click="tothispage('quickmark')">
					<image class="btn-icon" :src="quikmark"></image>
					<text class="btn-name">速记</text>
				</div>
			</div>
		</div>
		
	</div>
	<div v-if="nowIndex == 1">
		<cilentData :list="tabList[1].list" :labels='labelList'  @jump="getclientDate"></cilentData>
	</div>
	<div v-if="nowIndex == 2">
		<orderCard :list="tabList[2].list" :type="addType" @jump="jumpToAddOrder"></orderCard>
		<text class="nodata-txt" v-if='tabList[2].list.length==0&&renderOver'>暂无数据</text>
	</div>
	<div v-if="nowIndex == 3">
		<orderCard :list="tabList[3].list" :type="returnType" @jump="jumpToReturnOrder"></orderCard>
		<text class="nodata-txt" v-if='tabList[3].list.length==0&&renderOver'>暂无数据</text>
	</div>
	<div v-if="nowIndex == 4">
		<text class="nodata-txt" v-if='tabList[4].list.length==0&&renderOver'>暂无数据</text>
		<receiveList :list="tabList[4].list"   @jump="getPayData"></receiveList>
	</div>
	<div class="bottom-operate" slot="footer" v-if="!isvisit&&nowIndex == 0" >
		<div class="bottom-btn-index" @click="tophone" v-if="!ifsign">
			<image class='bottom-btn-icon' :src="visitphone"></image>
			<text class='bottom-btn-name'>电话</text>
		</div>
		<div class="bottom-btn-index" @click="tosign(1)"  v-if="!ifsign">
			<image class='bottom-btn-icon' :src="visitsign"></image>
			<text class='bottom-btn-name'>签到</text>
		</div>
		<div class="bottom-btn-index" @click="tolocation"  v-if="!ifsign">
			<image class='bottom-btn-icon' :src="visitlocation"></image>
			<text class='bottom-btn-name'>导航</text>
		</div>
	</div>
	<div class="sign-btn1" slot="footer" v-if="isvisit&&nowIndex == 0" @click="stopsign">
		<text class="sign-btn-txt">结束拜访</text>
	</div>
	<div class="choose-back" v-if="ifsign" slot="footer">
		<div class="sign">
			<div class="sign-title">
				<div class="close-div" @click="closesign">
					<image class="head-back-icon" :src="back" ></image>
				</div>
				<text class="sign-txt">{{smalltitle}}</text>
			</div>
			<div class="address-div">
				<text class="address-txt" :class="[canlocation?'':'txt-c']">{{address}}</text>
				<div class="recola-div">
					<image class="reloca" :src="relocation" @click="tosign(2)"></image> 
				</div>
			</div>
			<div class="sign-btn" @click="savesign" v-if="canlocation&&!stopvisit">
				<text class="sign-btn-txt">{{btnName}}</text>
			</div>
			<div class="sign-btn" @click="isstop" v-if="canlocation&&stopvisit">
				<text class="sign-btn-txt">{{btnName1}}</text>
			</div>
		</div>
	</div>
	<div class="choose-back" v-if="ifmaps" slot="footer">
		<div class="choosemaps">
			<div class="back-div" @click="closeds" id="nav">
				<image class="head-back-icons" :src="back"></image>
			</div>
			<div class="all-salesman-div">
				<div class="salesmansIndex" v-for="value in maps" >
					<text class="choosed-name" @click="tomaps(value)">{{value}}</text>
				</div>
			</div>
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
	.tip-num{
		width: 39px;
		height: 39px;
		background-color: #CF411B;
		border-bottom-left-radius:39px;
		border-bottom-right-radius :39px;
		border-top-left-radius :39px;
		border-top-right-radius:39px;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		position: absolute;
		right: 55px;
    	top: 5px;
	}
	.tip-num-txt{
		font-size: 24px;
		color: #FFF;
		font-weight: bold;
	}
	.recola-div{
		width: 60px;
		height: 100px;
		align-items: center;
	    justify-content: center;
	}
	.close-div{
		width: 65px;
		height: 120px;
		padding-left: 30px
	}
	.txt-c{
		text-align: center;
	}
	.choosed-name:active{
		color: #CF411B
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
	.back-div{
		width: 750px;
		height: 68px;
		padding-top: 19px;
		border-bottom-style: solid;
		border-bottom-color: #EBEBEB;
		border-bottom-width: 1px;
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
		}
	.address-div{
		flex-direction: row;
		padding-left: 30px;
		padding-right: 30px;
		width: 750px;
		align-items: center;
		flex: 1;
	}
	.reloca{
		width: 40px;
		height: 40px;
	}
	.address-txt{
		font-size: 32px;
		color: #333;
		flex: 1;
		white-space: normal;
		margin-right: 10px;
	}
	.sign-btn-txt{
		font-size: 30px;
		color: #fff;
		text-align: center;
		line-height: 80px;
		flex: 1
	}
	.sign-btn:active{
		background-color:#CF320A;
	}
	.sign-btn{
		width: 690px;
		margin-left: 30px;
		height: 80px;
		background-color: #CF411B;
		border-bottom-left-radius:10px;
		border-bottom-right-radius :10px;
		border-top-left-radius :10px;
		border-top-right-radius:10px;
		margin-bottom: 30px;
	}
	.sign-btn1:active{
		background-color:#CF320A;
	}
	/*.bottom-btn-index:active{
		background-color: #CF320A;
	}*/
	.sign-btn1{
		position: absolute;
		bottom: 30px;
		width: 690px;
		margin-left: 30px;
		height: 80px;
		background-color: #CF411B;
		border-bottom-left-radius:10px;
		border-bottom-right-radius :10px;
		border-top-left-radius :10px;
		border-top-right-radius:10px;
	}
	.sign-txt{
		color: #333;
		font-size: 38px;
		text-align: center;
		flex: 1;
		line-height: 120px;
	}
	.head-back-icon{
		width: 17px;
		height: 32px;
		left: 0;
		margin-top: 44px;
	}
	.head-back-icons{
		width:17px;
		height:30px;
	}
	.sign-title{
		width: 750px;
		height: 120px;
		justify-content: flex-start;
		border-bottom-width: 1px;
		border-bottom-color:#D8D8D8;
		border-bottom-style: solid;
		padding-right: 47px;
		flex-direction: row;
	}
	.sign{
		position: absolute;
		bottom: 0;
		width: 750px;
		height: 380px;
		background-color: #fff;
		flex-direction: column;
	}
	.choose-back1{
		position: absolute;
		z-index: 9999;
		top: 0;
		width: 750px;
		padding-left: 30px;
		padding-right: 30px;
		background-color: rgba(0,0,0,0.5);
		bottom: 0
	}
	.choose-back{
		position: absolute;
		z-index: 9999;
		top: 0;
		width: 750px;
		background-color: rgba(0,0,0,0.5);
		bottom: 0
	}
	.font-gray66{
		color: #666;
	}
	.bottom-btn-name{
		font-size: 20px;
		color: #333;
		text-align: center;
		width: 102px;
	}
	.bottom-btn-icon{
		width: 102px;
		height: 102px;
		margin-bottom: 10px;
	}
	.bottom-operate{
		position: absolute;
		flex-direction: row;
		bottom: 35px;
		padding-left: 50px;
		padding-right: 50px;
		width: 750px;
		justify-content: space-between;
	}
	.btn-name{
		color: #333;
		font-size: 30px;
		text-align: center;
		width: 82px;
	}
	.btn-icon{
		width: 82px;
		height: 82px;
		margin-bottom: 10px;
	}

	.btn-index11{
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
		padding-top: 20px;
		padding-bottom: 20px;
	}
	.btn-index{
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
		padding-top: 20px;
		padding-bottom: 20px;
		border-right-width: 1px;
		border-right-style: solid;
		border-right-color: #D8D8D8;
	}
	.btn-index:last-child{
		border-right-width: 0x;
		border-right-style: solid;
		border-right-color: #FFF;
	}

	.btn-index1{
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
		padding-top: 20px;
		padding-bottom: 20px;
		border-right-width: 1px;
		border-right-style: solid;
		border-right-color: #D8D8D8;
	}
	.btn-index1:last-child{
		border-right-width: 0x;
		border-right-style: solid;
		border-right-color: #FFF;
	}
	.operate-btn{
		width: 690px;
		margin-left: 30px;
		flex-direction: row;
		border-bottom-color: #D8D8D8;
		border-bottom-width: 1px;
		border-bottom-style: solid;
		border-top-style: solid;
		border-top-color: #D8D8D8;
		border-top-width: 1px;
	}
	.operate-btn1{
		width: 690px;
		margin-left: 30px;
		flex-direction: row;
		border-bottom-color: #D8D8D8;
		border-bottom-width: 1px;
		border-bottom-style: solid;
	}
	.info-num-day{
		line-height: 67px;
	}
	.info-time{
		flex-direction: row
	}
	.font-gray33{
		color: #333
	}
	.font48{
		font-size: 48px;
	}
	.font24{
		font-size: 24px;
	}
	.font-gray99{
		color: #999
	}
	.numinfo-index{
		flex: 1;
		justify-content: center;
		align-items: center;
	}
	.numinfo-index1{
		flex: 1;
		justify-content: center;
		align-items: center;
	}
	.numinfo{
		width: 690px;
		margin-left: 30px;
		height: 185px;
		flex-direction: row;
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
	}
	.font32{
		font-size: 32px;
	}
	.list-item-title{
		position:relative;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width:750px;
		padding-left  :30px;
		padding-right :30px;
		margin-top: 20px;
	}	
</style>
<script>

	import buView from '../../components/bu-view.vue'
  	import navigator from '../../common/navigator.js'
  	import modal from '../../common/modal.js'
  	import filters     from '../../common/filters.js'
  	import stream    from '../../common/stream.js'
  	import icon      from '../tagSection/icon/icon.js'
  	import topTabBar from '../orderSection/components/tab-bar.vue'
  	import orderCard from '../orderSection/components/order-card.vue'
  	import cilentData from './components/client-data.vue'
  	import receiveList from './components/receive-list.vue'
  	const getEvent  = weex.requireModule('event');
  	const locationEvent = weex.requireModule('locationEvent');
	const globalEvent = weex.requireModule('globalEvent');
	const photoEvent = weex.requireModule('photoEvent');
	const storage = weex.requireModule('storage');
	export default {
		components:{
            buView,
            price:filters.price,
            topTabBar,
            orderCard,
            cilentData,
            receiveList
        },
	    data() {
	      	return {
	      		renderOver:false,
	      		stopvisit: false,
	      		smalltitle: '签到',
	      		issaving:false,
	      		ifmaps:false,
	      		signoutApi: '/visit/list/signOut',
	      		relocation: icon.relocation,
	      		signrecord: '/visit/list/getLastByClientId',
	      		signinApi:　'/visit/list/signIn',
	      		address: '正在定位...',
	      		back: icon.backIcon,
	      		pages:{
	      			"returns":"/modules/orderKing/returnOrder/return-order",
	      			"add":"/modules/orderKing/addOrder/add-order",
	      			"receipt": "/modules/receipt/pay",
	      			"photo": "/modules/visiting/takephoto",
	      			'carsale': '/modules/webView/nullTip',
	      			'quickmark':'/modules/webView/nullTip'
	      		},
	      		maps: [],
	      		ifFirst: true,
	      		isvisit: false,
	      		ifsign: false,
	      		visitsign: icon.visitsign,
	      		visitphone: icon.visitphone,
	      		visitlocation: icon.visitlocation,
	      		photo: icon.photo,
	      		openorder: icon.openorder,
	      		carsale: icon.carsale,
	      		quikmark: icon.quikmark,
	      		receivemoney: icon.receivemoney,
	      		returngoods: icon.returngoods,
	      		typelist: 1,
	      		photoNum: 0,
	      		configData:{
                    title: '',
                    titleAlgin: 'left',
                    secondTitle:'',
                    bottom: '0px',
                    addEvent: '',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: '',
                    loadmore: true,
                    loadmoreEvent:'loadmore',
                    viewappear: 'getData',
                },
                infos: {
                	'VISIT_LIST.DATE_RANGE':0,
                	'VISIT_LIST.ORDER_MONEY':0
                },
                latitude: '',
                longitude: '',
                currentName: '',
                currentId: '',
                addressName: '',
                signRange: '',
                phone: '',
                currentAddress: '',
                currentUid: '',
                listId: null,
                culongitude :'',
				culatitude : '',
				cuaddressName : '',
				instance: 0,
				debtMoney: 0,
				visittime: '',
				firstenter: true,
				canlocation: false,
				serviceId: '',
				lists: [],
				sameaccount: true,
				picinfo: {

				},
				tabList:[{
                    name:'拜访'
                },{
                    name:'资料',
                    list:{},
                    api:'/buyer/queryByBuyerId',
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
                    list:[],
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
                clientInfos:{},
                labelList: [],
                visitServiceId: '',
                signover: false,
                btnName: '签到',
                btnName1: '签退'
	      	};
	    },
	    created(){
	    	var self = this;
	    	
	    },
	    mounted(){
	    	var self = this;
	    	var bundleUrl = self.$getConfig().bundleUrl;
	    	var m = self.getDataByUrl('to',bundleUrl)
	    	storage.getItem('login_user_info',event=>{
			    this.operaterUid = JSON.parse(event.data)['USER.UID'];
			    this.serviceId = JSON.parse(event.data)['USER.SERVICE_ID'];
			})
	    	if(m =='visited'){
	    		storage.getItem('visitInfo', event => {
	    			// modal.alert({message:event.data})
			  		this.isvisit = true;
			  		this.visitServiceId = JSON.parse(event.data)['VISIT_LIST.SERVICEID'];
					this.listId = 	JSON.parse(event.data)['VISIT_LIST.VISIT_LIST_ID'];
					this.latitude = JSON.parse(event.data)['VISIT_LIST.LATITUDE'];
		    		this.longitude =JSON.parse(event.data)['VISIT_LIST.LONGITUDE'];
		    		this.currentName =JSON.parse(event.data)['VISIT_LIST.CLIENT_NAME'];
		    		this.phone = 	JSON.parse(event.data)['VISIT_LIST.LOGIN_ID'];
		    		this.currentUid= JSON.parse(event.data)['VISIT_LIST.CLIENT_ID'];
		    		this.addressName =JSON.parse(event.data)['VISIT_LIST.ADDR_DETAIL'];
		    		this.visittime = JSON.parse(event.data)['VISIT_LIST.CLIENT_TIME'];
		    		this.currentId = JSON.parse(event.data)['VISIT_LIST.BUYER_ID'];
		    		this.configData['title'] = this.currentName;
		    		var ms = {
	    				'uid': parseInt(this.operaterUid),
	    				'serviceId': parseInt(this.serviceId),
	    				'meetId': parseInt(this.listId)
	    			}
	    			photoEvent.getOfflinePhotos(ms,function(res) {
	    				self.photoNum = res.length
	    			})
		    		var msg={
							'BUYER.LATITUDE': this.latitude,
							'BUYER.LONGITUDE': this.longitude,
							'BUYER.BUYER_NAME':this.currentName,
							'BUYER.LOGIN_ID': this.phone,
							'BUYER.UID':this.currentUid,
							'BUYER.BUYER_ID':this.currentId,
							'BUYER.ADDR_DETAIL':this.addressName
						}
					storage.setItem('select_client_msg',JSON.stringify(msg),event =>{
						stream.fetch({
				    		method:'GET',
				    		url:'/visit/list/getLastByClientId?VISIT_LIST.CLIENT_ID='+JSON.parse(event.data)['BUYER.UID']
				    	},res =>{
				    		if(res.data.length > 0){
				    			this.ifFirst = false;
				    			this.infos = res.data[0];
					    		this.debtMoney = res.extraData['VISIT_LIST.ARREARS'];
				    		}else{
				    			this.ifFirst = true
				    		}
				    	})
					})
				})
	    	}else{
	    		storage.getItem('select_client_msg', event => {
	    			// modal.alert({message:event.data})
	    		this.latitude = JSON.parse(event.data)['BUYER.LATITUDE'];
	    		this.longitude = JSON.parse(event.data)['BUYER.LONGITUDE'];
	    		this.currentName = JSON.parse(event.data)['BUYER.BUYER_NAME'];
	    		this.currentId = JSON.parse(event.data)['BUYER.BUYER_ID'];
	    		this.phone = JSON.parse(event.data)['BUYER.LOGIN_ID'];
	    		this.currentUid = JSON.parse(event.data)['BUYER.UID'];
	    		this.configData['title'] = this.currentName;
	    		storage.getItem('visitInfo', event => {
			  		if(event.data!='{}'&&event.data!='undefined'){
			  			if(JSON.parse(event.data)['VISIT_LIST.CLIENT_NAME'] == this.currentName){
				  			if(JSON.parse(event.data)['VISIT_LIST.SERVICEID']==this.serviceId){
				  				var ms = {
				    				'uid': parseInt(this.operaterUid),
				    				'serviceId': parseInt(this.serviceId),
				    				'meetId': parseInt(this.listId)
				    			}
				    			photoEvent.getOfflinePhotos(ms,function(res) {
				    				self.photoNum = res.length
				    			})

				  				this.isvisit = true;
				  			}
			  			}
			  		}
			  	});
	    		if('BUYER.ADDR_DETAIL' in JSON.parse(event.data)){
	    			this.addressName = JSON.parse(event.data)['BUYER.ADDR_DETAIL'];
	    		}
		    	stream.fetch({
		    		method:'GET',
		    		url:'/visit/list/getLastByClientId?VISIT_LIST.CLIENT_ID='+JSON.parse(event.data)['BUYER.UID']
		    		// url:'/visit/list/getLastByClientId?VISIT_LIST.CLIENT_ID=6198'
		    	},res =>{
		    		if(res.data.length > 0){
		    			this.ifFirst = false;
		    			this.infos = res.data[0];
			    		this.debtMoney = res.extraData['VISIT_LIST.ARREARS'];
		    		}else{
		    			this.ifFirst = true
		    		}

		    	})
		    })
	    	}
	    	var that =this;
	    	var x =setTimeout(function() {
	    		globalEvent.addEventListener("currLocationInfo", function (res) {
	    			var times = setInterval(function() {
	    				if(that.signover == true){
	    					clearInterval(times)
	    					return
	    				}
	    			},1000)
	    			if(res!=null){
	    				if(res.type=='signIn'){
	    					if(res.latitude!=0){
	    						that.canlocation = true;
								that.culongitude = res.longitude;
								that.culatitude = res.latitude;
								that.cuaddressName = res.addressDetail;
								that.address = res.addressDetail;
								that.btnName = '签到';
	    					}else{
	    						modal.alert({message:'请确认是否打开位置信息并稍后重试'})
	    					}
	    				} else if(res.type=='signOut'){
	    					that.canlocation = true;
	    					that.stopvisit = true;
	    					that.culongitude = res.longitude;
							that.culatitude = res.latitude;
							that.cuaddressName = res.addressDetail;
							that.address = res.addressDetail;
						    that.btnName1 = '签退';
							
	    				}
	    			}else{
						modal.alert({message:'请确认是否打开位置信息并稍后重试'})
						this.configData.pageRender = false
					}
	    		})
	    	},1000)
	    	var x =setTimeout(function(){
	    		globalEvent.addEventListener("takePhotoPool", function (res) {
    				that.isvisit = true;
	    			that.ifsign = false;
	    			that.photoNum = 1;
	    			var ifsuccess = true;
	    			storage.setItem('renderClient',JSON.stringify(ifsuccess), event =>{
		                modal.toast({message:'签到成功',duration:1})
		            })
	    		})
	    		
	    	},1000)
	    },

    	methods:{
    		getDataByUrl: function (name, url) {
			  name = name.replace(/[\[\]]/g, "\\$&");
			  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			  results = regex.exec(url); 
			  if (!results) return null;
			  if (!results[2]) return '';
			  return decodeURIComponent(results[2].replace(/\+/g, " "));
			},
    		getData(){
    			this.smalltitle = '签到';
    			storage.getItem('login_user_info',event=>{
			    	this.serviceId = JSON.parse(event.data)['USER.SERVICE_ID'];
			    	this.operaterUid = JSON.parse(event.data)['USER.UID'];
	    			storage.getItem('visitInfo', event => {
						if(event.data=="{}"||event.data=='undefined'){
							this.isvisit =false
						} else if(JSON.parse(event.data)['VISIT_LIST.CLIENT_NAME'] == this.currentName){
							this.listId = JSON.parse(event.data)['VISIT_LIST.VISIT_LIST_ID']
							this.latitude = JSON.parse(event.data)['VISIT_LIST.LATITUDE'];
				    		this.longitude = JSON.parse(event.data)['VISIT_LIST.LONGITUDE'];
				    		this.currentName = JSON.parse(event.data)['VISIT_LIST.CLIENT_NAME'];
				    		this.phone = JSON.parse(event.data)['VISIT_LIST.LOGIN_ID'];
				    		this.currentUid = JSON.parse(event.data)['VISIT_LIST.CLIENT_ID'];
				    		this.addressName = JSON.parse(event.data)['VISIT_LIST.ADDR_DETAIL'];
				    		this.visittime = JSON.parse(event.data)['VISIT_LIST.CLIENT_TIME'];
				    		this.currentId = JSON.parse(event.data)['VISIT_LIST.BUYER_ID'];
				    		this.configData['title'] = this.currentName;
							var msg={
								'BUYER.LATITUDE': this.latitude,
								'BUYER.LONGITUDE': this.longitude,
								'BUYER.BUYER_NAME':this.currentName,
								'BUYER.LOGIN_ID': this.phone,
								'BUYER.UID':this.currentUid,
								'BUYER.BUYER_ID':this.currentId,
								'BUYER.ADDR_DETAIL':this.addressName
							}
							var ms = {
			    				'uid': parseInt(this.operaterUid),
			    				'serviceId': parseInt(this.serviceId),
			    				'meetId': parseInt(this.listId)
			    			}
			    			var that = this
			    			photoEvent.getOfflinePhotos(ms,function(res) {
			    				that.photoNum = res.length
			    			})
							storage.setItem('select_client_msg',JSON.stringify(msg))
							if(JSON.parse(event.data)['VISIT_LIST.SERVICEID']==that.serviceId){
								that.isvisit = true
								this.sameaccount = true
							} else{
								that.isvisit = false
								this.sameaccount = false
							}
							// modal.alert({message:this.sameaccount})
						}
					})
    			})

    		},
    		viewEvent(name,call){
    			this[name](call)
    		},
    		tosign(key){
    			var that = this;
    			this.signover = false;
    			var oldaddress = this.address;
    			// var timer = setTimeout(function() {
    			// 	if(oldaddress==this.address){
    			// 		this.signover = true;
    			// 		this.culatitude =  0;
    			// 		this.culongitude = 0;
    			// 		this.addressName = '';
    			// 	}
    			// },10000)
				storage.getItem('visitInfo', event => {
					if(key == 1){
						var date = new Date();
				    	var nowtime = new Date();
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
				        var currentdate = year + month + strDate;
		    			var ms = {
							'uid': parseInt(this.operaterUid),
							'serviceId': parseInt(this.serviceId),
							'state': 'wait'
						}
						var datas = event.data;
						photoEvent.getOfflinePhotos(ms,function(res) {
							if(res.length>0){
								res[0]['time'] = parseInt(res[0]['time'].substr(0,11).replace(/\-/g,''))
								if(res[0]['time']<parseInt(currentdate)){
									modal.confirm({message:'之前还有照片未上传，是否去上传？', okTitle: '确定', cancelTitle:'取消'},res =>{
										if(res=='确定'){
											navigator.push({
							    				url: '/modules/visiting/waitupdataImg',
							    			},res=>{})
										}else{
											return
										}
									})
								}else{
									if(datas=="{}"||datas=='undefined'){
										that.smalltitle = "签到"
					    				that.ifsign = true
					    				locationEvent.getLocation('signIn')
					    				var timer = setTimeout(function() {
						    				if(oldaddress==that.address){
						    					that.signover = true;
						    					that.culatitude =  0;
						    					that.culongitude = 0;
						    					that.cuaddressName = '';
						    					that.canlocation = true;
						    					that.address = '定位失败';
						    					that.btnName = '强制签到';
						    				}
						    			},10000)
									}else{
										if(that.serviceId ==JSON.parse(datas)['VISIT_LIST.SERVICEID']){
											modal.alert({message:'请先结束当前拜访'})
											return
										}else{
											that.smalltitle = "签到"
					    					that.ifsign = true
					    					locationEvent.getLocation('signIn')
					    					var timer = setTimeout(function() {
							    				if(oldaddress==that.address){
							    					that.signover = true;
							    					that.culatitude =  0;
							    					that.canlocation = true;
							    					that.culongitude = 0;
							    					that.cuaddressName = '';
							    					that.address = '定位失败';
						    						that.btnName = '强制签到';
							    				}
							    			},10000)
										}	
									}
								}
							}else{
								if(datas=="{}"||datas=='undefined'){
								that.smalltitle = "签到"
			    				that.ifsign = true
			    				locationEvent.getLocation('signIn')
			    				var timer = setTimeout(function() {
				    				if(oldaddress==that.address){
				    					that.signover = true;
				    					that.culatitude =  0;
				    					that.culongitude = 0;
				    					that.canlocation = true;
				    					that.cuaddressName = '';
				    					that.address = '定位失败';
						    			that.btnName = '强制签到';
				    				}
				    			},10000)
								}else{
									if(that.serviceId ==JSON.parse(datas)['VISIT_LIST.SERVICEID']){
										modal.alert({message:'请先结束当前拜访'})
										return
									}else{
										that.smalltitle = "签到"
				    					that.ifsign = true
				    					locationEvent.getLocation('signIn')
				    					var timer = setTimeout(function() {
						    				if(oldaddress==that.address){
						    					that.signover = true;
						    					that.culatitude =  0;
						    					that.culongitude = 0;
						    					that.cuaddressName = '';
						    					that.canlocation = true;
						    					that.address = '定位失败';
						    					that.btnName = '强制签到';
						    				}
						    			},10000)
									}	
								}
							}
						})
					}else{
						modal.toast({message:'定位中',duration:1});
						if(that.smalltitle =='签到'){
							locationEvent.getLocation('signIn')
							var timer = setTimeout(function() {
			    				if(oldaddress==that.address){
			    					that.signover = true;
			    					that.culatitude =  0;
			    					that.canlocation = true;
			    					that.culongitude = 0;
			    					that.cuaddressName = '';
			    					that.address = '定位失败';
						    		that.btnName = '强制签到';
			    				}
			    			},10000)
						}else{
							locationEvent.getLocation('signOut')
							var timer = setTimeout(function() {
			    				if(oldaddress==that.address){
			    					that.signover = true;
			    					that.culatitude =  0;
			    					that.stopvisit = true;
			    					that.canlocation = true;
			    					that.culongitude = 0;
			    					that.cuaddressName = '';
			    					that.address = '定位失败';
						    		that.btnName1 = '强制签退';
			    				}
			    			},10000)
						}
					}
				})
				
				
    		},
    		tomaps(value){
    			if(this.addressName==" "){
    				modal.toast({message:"签到失败.该客户未维护地址信息",duration:2})
    				return
    			}
    			var x={
    				"name" : value,
    				"lat"  : this.latitude,
    				"lon"  : this.longitude,
    				"address": this.addressName
    			}
    			locationEvent.toNavigation(x)
    		},
    		savesign(){
    			if(this.issaving == true){
    				return
    			}
    			this.issaving = true;
    			var that= this
    			if(this.latitude == '0.0'||this.latitude=='0'||this.cuaddressName==''){
    				this.longitude = '0';
    				this.addressName = '';
    				var s = 0
    			}else{
    				that.longitude = Number(that.longitude)
	    			that.latitude = Number(that.latitude)
	    			var radLat1 = that.latitude * Math.PI / 180.0;
				    var radLat2 = that.culatitude * Math.PI / 180.0;
				    var a = radLat1 - radLat2;
				    var b = that.longitude * Math.PI / 180.0 - that.culongitude * Math.PI / 180.0;
				    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
				    s = s * 6378.137;
				    s = Math.round(s * 10000) / 10000;
				    if(s>0.05){
				    	s = s
				    }else{
				    	s = 0
				    }
    			}
    			stream.fetch({
		    		method:'POST',
		    		url: that.signinApi,
		    		body: {
		    			'VISIT_LIST.CLIENT_ID': that.currentUid,
		    			'VISIT_LIST.CLIENT_NAME': that.currentName,
		    			'VISIT_LIST.CHECK_IN_GPS_LONGITUDE': that.culongitude,
		    			'VISIT_LIST.CHECK_IN_GPS_LATITUDE': that.culatitude,
		    			'VISIT_LIST.CHECK_IN_GPS_NAME': that.cuaddressName,
		    			'VISIT_LIST.CHECK_IN_SCOPE': s,
		    		}
		    	},res =>{
		    		if(res.code == 0){
			    		that.listId = res.extraData['VISIT_LIST.VISIT_LIST_ID'];
			    		var myDate = new Date()
			    		storage.getItem('login_user_info',event=>{
				    		that.serviceId = JSON.parse(event.data)['USER.SERVICE_ID'];
					    	var msg = {
				    			'VISIT_LIST.BUYER_ID' : that.currentId,
				    			'VISIT_LIST.CLIENT_ID': that.currentUid,
				    			'VISIT_LIST.CLIENT_NAME': that.currentName,
				    			'VISIT_LIST.CLIENT_TIME': myDate.toLocaleString(),
				    			'VISIT_LIST.VISIT_LIST_ID': that.listId,
				    			'VISIT_LIST.LONGITUDE': that.longitude,
				    			'VISIT_LIST.LATITUDE' : that.latitude,
				    			'VISIT_LIST.LOGIN_ID' : that.phone,
				    			'VISIT_LIST.ADDR_DETAIL': that.addressName,
				    			'VISIT_LIST.SERVICEID': that.serviceId
				    		}
				    		// modal.alert({message:JSON.stringify(msg)})
				    		storage.setItem('visitInfo',JSON.stringify(msg), event =>{
				    			// modal.alert({message:JSON.stringify(msg)})
				    			stream.fetch({
						    		method:'GET',
						    		url:'/visit/photo/task/queryAll?VISIT_PHOTO_TASK.VISIT_LIST_ID='+this.listId,
						    	},res =>{
						    		var arr = res.data;
						    		arr.forEach(function(value,key) {
						    				value['isupdate'] = false;
						    				value['picAddress'] = '';
						    				value['picUrl'] = '';
						    				value['ossUrl'] = '';
						    				value['exif'] = '';
						    		})
						    		this.lists = arr;
						    		// console.log(this.lists)
						    		this.picinfo = {
					    				'picName':this.lists[0]['VISIT_PHOTO_TASK.TASK_NAME'],
					    				'imgId': JSON.stringify(this.lists[0]['VISIT_PHOTO_TASK.VISIT_PHOTO'])=='{}'?'-1':this.lists[0]['VISIT_PHOTO_TASK.VISIT_PHOTO']['VISIT_PHOTO_INFO.VISIT_PHOTO_INFO_ID'],
					    				'company':this.currentName,
					    				'meetId': parseInt(this.listId),
					    				'companyUid':parseInt(this.currentUid),
					    				"taskId":this.lists[0]['VISIT_PHOTO_TASK.VISIT_PHOTO_TASK_ID']
					    			};
					    			var x = {
					    				'uid': parseInt(this.operaterUid),
					    				'meetId': parseInt(this.listId),
					    				'serviceId': parseInt(this.serviceId),
					    				'content': JSON.stringify(this.picinfo),
					    				'latitude':JSON.stringify(this.latitude),
					    				'longitude':JSON.stringify(this.longitude),
					    				'address': this.addressName
					    			}
					    			photoEvent.takePhotoOnly(x)
						    	},res=>{
					    			
					   	    	})
				    		})
				    	})
		    		}else{
		    			this.issaving = false;
		    			modal.toast({message:'签到失败，请重试',duration:1})
		    		}
		    	})
    		},
    		closesign(){
    			this.ifsign = false;
    		},
    		tothispage(val){
    			var that = this;
    			storage.getItem('login_user_info',event=>{
			    	that.serviceId = JSON.parse(event.data)['USER.SERVICE_ID'];
			    	that.operaterUid = JSON.parse(event.data)['USER.UID'];
			    	storage.getItem('visitInfo', event => {
			    		if(event.data=="{}"||event.data=='undefined'){
			    			modal.toast({message:'请先签到'})
							return
			    		}else{
			    			if(that.serviceId == JSON.parse(event.data)['VISIT_LIST.SERVICEID']){
			    				if(JSON.parse(event.data)['VISIT_LIST.CLIENT_NAME'] != this.currentName){
			    					modal.toast({message:'只能对当前正在拜访客户进行操作'})
									return
			    				}else{
			    					navigator.push({
					    				url: that.pages[val],
					    			},res=>{})
			    				}
			    			}else{
			    				modal.toast({message:'请先签到'})
			    			}
			    		}
					})
			    })
    		},
    		viewEvent(name,call){
    			this[name](call)
    		},
    		choosenear(key){
    			if(key !== this.nowIndex){
    				this.nowIndex = key
    				if(key == 0){
    					this.configData.bottom = '105px'
    				}else{
    					this.configData.bottom = '0px'
    				}
    				if(key == 2 && this.tabList[key].list.length == 0){
    					this.getAddData(key,1)
    				}else if(key == 3 && this.tabList[key].list.length == 0){
    					this.getReturnData(key,1)
    				} else if(key==4 && this.tabList[key].list.length == 0){
    					this.getPayData(key,1)
    				} else if(key==1 && JSON.stringify(this.tabList[key].list)== '{}'){
    					this.getclientDate(key)
    				}
    			}
    		},
    		tophone(){
    			var m = this.phone
    			getEvent.call(m)
    		},
    		tolocation(){
    			if(this.addressName !=''&&this.addressName!=null){
    				var that = this
    				locationEvent.getLocalMapName(function(res) {

    					that.maps = res
    					that.ifmaps = true
    				})
    			}else{
    				modal.toast({message:'此客户没有维护精准的导航地址，请先维护并定位',duration:2})
    				return
    			}
    		},
    		stopsign(){
    			// this.configData.pageRender = true
    			var that = this;
    			this.signover = false;
    			this.ifsign= true;
    			this.canlocation = false;
    			this.address ='定位中';
    			this.smalltitle = '结束拜访';
    			locationEvent.getLocation('signOut')
    			var oldaddress = this.address;
    			var timer = setTimeout(function() {
    				if(oldaddress==that.address){
    					that.signover = true;
    					that.culatitude =  0;
    					that.culongitude = 0;
    					that.stopvisit = true;
    					that.canlocation = true;
    					that.cuaddressName = '';
    					that.address = '定位失败';
			    		that.btnName1 = '强制签退';
    				}
    			},10000)
    		},
    		isstop(){
    			this.configData.pageRender = false;
    			var that =this;
    			if(that.cuaddressName!=''){
	    			that.longitude = Number(that.longitude)
	    			that.latitude = Number(that.latitude)
	    			var radLat1 = that.latitude * Math.PI / 180.0;
				    var radLat2 = that.culatitude * Math.PI / 180.0;
				    var a = radLat1 - radLat2;
				    var b = that.longitude * Math.PI / 180.0 - that.culongitude * Math.PI / 180.0;
				    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
				    s = s * 6378.137;
				    s = Math.round(s * 10000) / 10000;
				}else{
					s=0
				}
				stream.fetch({
				method:'POST',
				url: that.signoutApi,
				body: {
					'VISIT_LIST.VISIT_LIST_ID': that.listId,
					'VISIT_LIST.CHECK_OUT_GPS_LONGITUDE': that.culongitude,
					'VISIT_LIST.CHECK_OUT_GPS_LATITUDE': that.culatitude,
					'VISIT_LIST.CHECK_OUT_GPS_NAME': that.cuaddressName,
					'VISIT_LIST.CHECK_OUT_SCOPE': s>0.05?s:0,
				}
				},res =>{
			        var msg={}
			        storage.setItem('visitInfo',JSON.stringify(msg), event =>{
			        	that.isvisit= false;
			        	that.ifsign = false;
			        	that.configData.pageRender = false;
			        	that.stopvisit = false;
			        	that.photoNum=0;
			        	var ifsuccess = true;
			        	storage.setItem('renderClient',JSON.stringify(ifsuccess), event =>{
			        		that.issaving = false;
			                modal.toast({message:'签退成功',duration:2})
			   	    		setTimeout(()=>{
			                   navigator.pop()
			                },1500) 
			            })
		    		})
				})
    		},
    		closeds(){
    			this.ifmaps = false;
    		},
    		getclientDate(key){
    			stream.fetch({
		    		method:'GET',
		    		url:'/buyer/queryByBuyerId?BUYER.BUYER_ID='+this.currentId
		    		// url:'/buyer/queryByBuyerId?BUYER.BUYER_ID=7348'
		    	},res =>{
		    		this.tabList[1].list = res.data[0]
		    		this.labelList = res.extraData.tagList
		    	})
    		},
    		getPayData(index,pn){
    			// let query = this.tabList[index].api + pn;
    			this.renderOver = false
              	pn == 1 ? (this.configData.pageRender = true) : ''
              	stream.fetch({
		    		method:'GET',
		    		url:'/money/confirm/getByAddId?UID='+this.currentUid+'&PAGE_SIZE=20&PN='+pn,
		    	},res =>{
		    		this.configData.pageRender = false
		    		this.renderOver = true
		    		this.tabList[4].list = res.data
		    		var that = this
		    		this.tabList[4].list.forEach(function(value,key) {
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
                url: query+"&ORDER_PARENT.UID="+this.currentUid
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
                url: query+"&UID="+this.currentUid
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
