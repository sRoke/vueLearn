<template>	
<bu-view :config="configData" @event="viewEvent">
	<div >
		<div class="conpany-infos">
			<div>
				<div class="conpany-debt">
					<text class="conpany-debt-text" v-if="parseFloat(debtinfos['USER_ACCOUNT.ALL_USABLE_MONEY'])>0">余额：¥{{debtinfos['USER_ACCOUNT.ALL_USABLE_MONEY']}}</text>
					<text class="conpany-debt-text" v-if="parseFloat(debtinfos['USER_ACCOUNT.ALL_USABLE_MONEY'])<0">欠款：¥{{debtinfos['USER_ACCOUNT.ALL_USABLE_MONEY']}}</text>
				</div>
			</div>
			<!-- 金额输入框 -->
			<div class="input-warp">
				<input type="number" class="input-item" placeholder="输入金额"    v-model="money" ></input>	
			</div>
			<!-- 金额输入框 -->
			<div class="account-divs" >
				<div class="account-div" v-for="(item,index) in userAccount" :class="[checkone==index&&checkmoneyType ==1?'ischeck':'nocheck']" @click="checkAccount(index,1,item)" v-if="item['USER_ACCOUNT_SUB.USABLE_MONEY']>0">
					<text class="account-name" :class="[checkone==index&&checkmoneyType==1?'text-checked':'text-checke']">{{item['USER_ACCOUNT_TYPE.ACCOUNT_NAME']}}</text>
					<text class="account-money" :class="[checkone==index&&checkmoneyType==1?'text-checked':'text-checke']">¥{{item['USER_ACCOUNT_SUB.USABLE_MONEY']}}</text>
				</div>
				<div class="account-div" v-for="(value,key) in companyAccount" :class="[checkone==key+accountlength&&checkmoneyType==2?'ischeck':'nocheck']" @click="checkAccount(key+accountlength,2,value)">
					<text class="account-name" :class="[checkone==key+accountlength&&checkmoneyType==2?'text-checked':'text-checke']">{{value['REAL_ACCT.ACCT_NAME']}}</text>
				</div>
			</div>
			<div class="operate">
				<div class="remark">
					<input type="text" name=""class="remark-txt" placeholder="备注" v-model="remark"></input>
				</div>
				<div class="date">
					<text class="remark-txt" @click="pickTime">{{datatime}}</text>
				</div>
				<div class="photo">
					<image class="cameraimg" :src="cameraIcon"></image>
				</div>

			</div>
			<div class="photos">
				<div class="photo">
					<image src=""></image>
				</div>
			</div>
		</div>
		
	</div>
	<div  class="choose-back" v-if="ifsure&&!ifsucess" slot="footer">
		<image class="liner1" resize="cover" :src="liner"></image>
		<div class="operate1">
			<div class="operatetop">
				<div class="back-div1" @click="closed" id="nav">
					<image class="head-back-icon" :src="back"></image>
				</div>
				<div class="top-title">
					<text class="top-title-text">收款用途</text>
				</div>
				<div class="redgou-div1" @click="sure">
					<image class="redgouIcon" :src="redgouIcon"></image>
				</div>
			</div>
			<scroller class="scrol1" show-scrollbar="false">
			<div class="useraccounts">
					<div class="useraccount" v-for="(value1,key1) in debtlist">
						<div class="check-img" @click="choose(value1,key1,1)">
							<image class="choose-icon" :src="notchoosedIcon" v-if="!value1['ischecked']"></image>
							<image class="choose-icon" :src="choosedIcon" v-if="value1['ischecked']"></image>
						</div>
						<div class="orderinfo">
							<text class="ordername">订单号{{value1['ORDER_PARENT.ORDER_CODE']}}</text>
							<text class="ordermoney">欠:{{parseFloat(value1['ORDER_PARENT.SUM_OVER_PRICE'])-parseFloat(value1['ORDER_PARENT.PAID_PRICE'])| price}}</text>
						</div>
						<div class="input-money-div">
							<input type="number" class="input-money" placeholder="输入金额"    v-model="value1['addmoney']" ></input>
						</div>	
					</div>
					<div class="useraccount" v-for="(item1,index1) in userAccount" v-if="!userchecked">
						<div class="check-img" @click="choose(item1,index1,2)">
							<image class="choose-icon" :src="notchoosedIcon" v-if="!item1['ischecked']"></image>
							<image class="choose-icon" :src="choosedIcon" v-if="item1['ischecked']"></image>
						</div>
						<text class="username">{{item1['USER_ACCOUNT_TYPE.ACCOUNT_NAME']}}</text>
						<div class="input-money-div">
							<input type="number" class="input-money" placeholder="输入金额"    v-model="item1['addmoney']" />
						</div>	
					</div>
			</div>
			</scroller>
		</div>
	</div>
	<div class="bottom-bar" slot="footer"  v-if="!ifsure&&!ifsucess">
		<image class="liner" resize="cover" :src="liner"></image>
		<div class="redgou-div" @click="creates">
			<image class="redgouIcon" :src="redgouIcon"></image>
		</div>
	</div>
	<div class="bu-wrap"   v-if="ifsucess">
		<div class="middle-div">
			<div class="success-div">
				<image class="success-img" :src="createsucess"></image>
			</div>
			<div class="success-txts">
				<text class="success-company">{{debtinfos['USER.NAME']}}</text>
				<text class="success-type">收款单创建成功</text>
				<text class="success-money">¥{{trueMoney}}</text>
			</div>
		</div>
		<div class="success-bottom" v-if="ifsucess">
			<div class="seedetail" @click="todetail" v-if="!userchecked">
				<text class="seedetail-txt">查看详情</text>
			</div>
			<div class="continue" @click="tocontinue">
				<text class="continue-txt">继续创建</text>
			</div>
			<div class="seedetail" @click="closedBack">
				<text class="seedetail-txt">关闭</text>
			</div>
		</div>
	</div>
</bu-view>
</template>	

<style  scoped>
	.liner{
        width: 750px;
        height: 9px;
    }
    .liner1{
        width: 750px;
        height: 9px;
        position: absolute;
        bottom: 720px;
    }
	.check-img{
		width: 67px;
		height: 42px;
	}
	.operatetop{
		flex-direction: row;
		padding-right: 30px;
		height: 120px;
		width: 750px;
		align-items: center;
	}
	.orderinfo{
		flex: 1
	}
	.useraccounts{
		width: 750px;
	}
	.ordermoney{
		color: #CF411B;
		font-size: 30px;
	}
	.ordername{
		color: #333;
		font-size: 26px;
	}
	.input-money{
		width: 280px;
		color: #333;
		font-size: 44px;
		text-align: right;
		height: 70px;
	}
	.input-money-div{
		width: 280px;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		border-bottom-color: #B1B1B1;
	}
	.username{
		flex: 1;
		color: #000;
		font-size: 34px;
		text-align: left;
	}
	.choose-icon{
		width: 42px;
		height: 42px;
		margin-right: 25px;
	}
	.useraccount{
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		padding-left: 30px;
		padding-right: 30px;
		margin-top: 60px;
		width: 750px;
	}
	.useraccount:last-child{
		margin-bottom: 60px;
	}
	.seedetail-txt{
		color: #CF411B;
		font-size: 30px;
		line-height: 80px;
		text-align: center;
	}
	.continue-txt{
		color: #fff;
		font-size: 30px;
		line-height: 80px;
		text-align: center;
	}
	.continue{
		width: 690px;
		height: 80px;
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
		background-color: #CF411B;
		margin-bottom: 30px;
	}
	.seedetail{
		width: 690px;
		height: 80px;
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
		background-color: #fff;
		margin-bottom: 30px;
	}
	.success-bottom{
		width: 750px;
		padding-right: 30px;
		padding-left: 30px;
		margin-top: 345px;
		flex-direction: column;
		justify-content: space-between;
	}
	.success-money{
		font-size: 80px;
		color: #000;
		text-align: center;
		width: 750px;
	}
	.success-type{
		font-size: 28px;
		color: #999;
		margin-bottom: 55px;
		text-align: center;
		width: 750px;
	}
	.success-company{
		font-size: 38px;
		color: #333;
		margin-bottom: 10px;
		width: 750px;
		text-align: center;
	}
	.success-txts{
		justify-content:center;
	}
	.success-div{
		justify-content:center;
		margin-bottom: 40px;
	}
	.success-img{
		width: 162px;
		height: 162px;
	}
	.middle-div{
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 90px;
	}
	.top-title-text{
		text-align: center;
		font-size: 	38px;
		color: #333;
		font-weight: bold;
	}
	.top-title{
		flex: 1
	}
	.redgou-div1{
		width: 100px;
		height: 120px;
		justify-content: center;
		padding-left: 59px;
		/*padding-left: 27px;*/
		/*padding-top: 30px;*/
	}
	.back-div1{
		width: 90px;
		height: 120px;
		padding-left: 30px;
		justify-content: center;
	}
	/*.xxxxxxxxxxxxxxx{
		flex-direction: row;
		align-items: center;
		height: 120px;
		padding-left: 30px;
		padding-right: 30px;
	}*/
	.operate1{
		width: 750px;
		position: absolute;
		/*bottom: 600px;*/
		bottom: 0;
		background-color: #fff;
		/*height: 810px;*/
	}
	.choose-back{
		position: absolute;
		top: 0;
		width: 750px;
		background-color: rgba(0,0,0,0.5);
		bottom: 0
	}
	.photos{
		width: 690px;
		flex-direction: column;
	}
	.redgouIcon{
		width: 41px;
		height: 31px;
	}
	.redgou-div{
		width: 70px;
		height: 98px;
		padding-left: 27px;
		padding-top: 30px;
		margin-left: 650px;
	}
	.bottom-bar{
		position: absolute;
		bottom: 0;
		width: 750px;
		height: 107px;
		flex-direction: column;
		justify-content: flex-end;
/*		border-top-style: solid;
		border-top-width: 1px;
		border-top-color: #979797;*/
	}
	.cameraimg{
		width: 45px;
		height: 39px;
	}
	.photo{
		width: 45px;
		height: 39px;
		margin-left:10px;
		margin-top: 5px;
	}
	.date{
		width: 200px;
		height: 55px;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		border-bottom-color: #D8D8D8;
	}
	.remark{
		height: 55px;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		border-bottom-color: #D8D8D8;
		flex: 1;
		margin-right: 20px;
	}
	.remark-txt{
		font-size: 30px;
		color: #333;
		line-height: 55px;
		text-align: center;
	}
	.operate{
		padding-right: 30px;
		padding-left: 30px;
		flex-direction: row;
		margin-top: 60px;
	}
	.text-checked{
		color: #333;
	}
	.text-checked{
		color: #fff
	}
	.ischeck{
		background-color: #CF411B;
	}
	.nocheck{
		background-color: #fff
	}
	.account-name{
		font-size: 32px;
		/*color: #333;*/
		text-align: center;
	}
	.account-money{
		font-size: 20px;
		/*color: #333;*/
		text-align: center;
	}
	.account-div{
		width: 335px;
		height: 100px;
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
		justify-content: center;
		margin-bottom: 20px;
		border-bottom-left-radius:10px;
		border-bottom-right-radius :10px;
		border-top-left-radius :10px;
		border-top-right-radius:10px;
		/*align-items    : center;*/
	}
	.account-divs{
		padding-left: 30px;
		padding-right: 30px;
		flex-direction: row;
		justify-content: space-between;
		flex-wrap: wrap;
	}
	.conpany-debt-text{
		font-size: 26px;
		color: #CD421B;
		text-align: center;
	}
	.conpany-name-text{
		font-size: 32px;
		color: #333;
		text-align: center;
	}
	.scrol1{
		/*position: absolute;*/
		/*top: 120px;*/
		bottom:20px;
		left: 0;
		width: 750px;
		height: 600px;
		background-color: #fff;
		/*padding-left: 30px;
		padding-right: 30px;
		padding-bottom: 18px;*/
	}

	.titles{
		font-size: 50px;
		color: #333;
		font-weight: bold;
		text-align: center;
	}
	.bu-wrap{
		position: absolute;
		bottom:-100px;
		top:0;
		left: 0;
		right:0;
		width:750px;
		padding-bottom:40px;
		background-color: #fff;
	}
	.head-icon-warp{
		flex-direction:row;
		justify-content: flex-start;
		align-items: center;
		padding-left  :30px;
		  width:120px;
		height:136px;
	}
	.head-warp{
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 100px;
		padding-right: 30px;
		padding-left: 30px;
	}
	.head-back-icon{
		width:17px;
		height:30px;
	}
	.font-gray33{
		color:#333;
	}
	.font60{
		font-size:60px;
	}
	.font42{
		font-size:42px;
	}
	.font36{
		font-size:36px;
	}
	.font28{
		font-size:28px;
	}
	.font-bold{
		font-weight:bold;
	}
	.input-warp{
		position: relative;
		flex-direction: column;
		height: 90px;
		width:400px;
		margin-left: 175px;
		/*padding-right: 30px;*/
		margin-bottom: 65px;
		border-bottom-style: solid;
		border-bottom-color: #D8D8D8;
		border-bottom-width: 1px;
		margin-top: 55px;
	}
	.input-item{
		flex-direction : row;
		justify-content: center;
		align-items    : center;
		/*height:135px;*/
		height: 90px;
		text-align: center;
		border:none;
		color: #000;
		font-size: 80px;
		line-height: 90px;
	}

</style>
<script>
	import buView from '../../components/bu-view.vue'
  	import navigator from '../../common/navigator.js'
  	import modal     from '../../common/modal.js'
  	import stream    from '../../common/stream.js'
  	import icon      from '../tagSection/icon/icon.js'
  	import filters from '../../common/filters.js'
  	import ordericon from '../../assets/orderIcon/icon.js'
  	const storage = weex.requireModule('storage');
  	const getEvent  = weex.requireModule('event');
  	const picker = weex.requireModule('picker')
   	const webview = weex.requireModule('webview');
	export default {
		components:{
            buView
        },
        filters:{
            price:filters.price,
        },
	    data() {
	      	return {
	      		detailPage: '/modules/receipt/receiptDetail',
	      		debtlistApi: '/bee/order/new/parent/getArrearsByUid',
	      		ownpage: '/modules/receipt/pay',
	      		payApi:'/money/confirm/payMoney',
	      		notchoosedIcon: icon.notchoosedIcon,
	      		choosedIcon: icon.choosedIcon,
	      		createsucess: icon.createsucess,
	      		getuserApi: '/user/account/getAccountInfoByUid',
	      		getcompanyApi: '/realAcct/queryAll',
	      		back     : icon.backIcon,
	      		redgouIcon: icon.redgouIcon,
	      		cameraIcon: icon.cameraIcon,
	      		liner:ordericon.liner,
	      		title    : '收款单',
	      		money    : '',
	      		checkone : 0,
	      		debtinfos: {},
	      		remark   : '', 
	      		ifsure   : false,
	      		ifsucess : false,
	      		configData:{
                    title: '收款单',
                    titleAlgin: 'center',
                    secondTitle:'',
                    bottom: '140px',
                    addEvent: '',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: 'refresh',
                    loadmore: false,
                    loadmoreEvent:'',
                },
                userAccount: [],
                accountId : null,
                accountType : '',
                companyAccount: [],
                accountlength: 0,
                datatime: "选择日期",
                UID: null,
                debtlist: [],
                currentId: null,
                accountTypeId: null,
                userchecked: true,
                checkmoneyType: 1,
                trueMoney: 0,
                olduserAccount:[],
                olddebtlist:[],
                visitId: null
	      	};
	    },
	    created(){
	    	var self = this;
	    },
	    mounted(){
	    	storage.getItem('visitInfo', event => {
	    		if(event.data!="{}"||event.data!='undefined'){
	    			this.visitId = JSON.parse(event.data)['VISIT_LIST.VISIT_LIST_ID']
	    		}
	    	})
	    	var date = new Date();
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
	        this.datatime = currentdate
	    	storage.getItem('select_client_msg', event => {
	    		// modal.alert({message:JSON.parse(event.data)['BUYER.UID']})
		    	stream.fetch({
		    		method:'POST',
		    		url:this.getuserApi,
		    		body:{"USER_ACCOUNT.UID":JSON.parse(event.data)['BUYER.UID']}
		    		// body:{"USER_ACCOUNT.UID":"5361"}
		    	},res =>{
		    		this.debtinfos = res.data[0]
		    		this.UID = res.data[0]['USER.UID']
		    		this.configData['secondTitle'] = this.debtinfos['USER.NAME']
		    		let arr = res.extraData['subAccountList']
		    		this.accountId = arr[0]['USER_ACCOUNT_SUB.CAID']
		    		this.accountTypeId = arr[0]['USER_ACCOUNT_TYPE.ACCOUNT_TYPE_ID']
		    		this.accountType = 'BUYER_ACCOUNT'
		    		// console.log(this.userAccount)
		    		this.accountlength = 0
		    		var that= this
		    		arr.forEach(function(item,index) {
		    			item['ischecked'] = false
		    			item['addmoney'] = ''
		    			if(item['USER_ACCOUNT_SUB.USABLE_MONEY']>0){
		    				that.accountlength++
		    			}
		    		})
		    		this.userAccount = arr
		    		stream.fetch({
			    		method:'POST',
			    		url:this.debtlistApi,
			    		body:{
			    			"ORDER_PARENT.UID":this.UID,
			    		}
			    	},res =>{
			    		let arrs = res.data
			    		arrs.forEach(function(value,key) {
			    			value['ischecked'] = false
			    			value['addmoney'] = ''
			    		})
			    		this.debtlist = arrs
			    	})
		    	},res=>{

		    	})
	    	})
	    	this.olddebtlist = this.debtlist;
	    	this.olduserAccount = this.userAccount;
	    	stream.fetch({
	    		method:'GET',
	    		url:this.getcompanyApi
	    	},res =>{
	    		this.companyAccount = res.data
	    	},res=>{

	    	})
	    },
    	methods:{
    		choose(item,index,id){
    			item['ischecked'] = !item['ischecked'];
    			item['addmoney'] = item['ischecked']?item['addmoney']:'0';
    			if(id==1){
    				this.$set(this.debtlist,index,item)
    			}else{
    				this.$set(this.userAccount,index,item)
    			}


    			// modal.alert({message:JSON.stringify(item)})
    		},
    		pickTime () {
	        	picker.pickDate({
	          		value: this.value
	        	}, event => {
	          		if (event.result === 'success') {
	            	this.datatime = event.data
	          	}
	        	})
	      	},
    		viewEvent(name,call){
    			this[name](call)
    		},
    		todetail(){
    			// modal.alert({message:this.currentId})
    			// return
    			navigator.push({
    				url: this.detailPage,
    				query: '?id='+this.currentId+"&from=pay"
    			},res=>{})
    		},
    		tocontinue(){
    			this.money = '';
    			this.checkone = 0;
	      		this.debtinfos= {};
	      		this.remark= ''; 
    			this.ifsure =false;
	      		this.ifsucess=false;
	      		this.userAccount= [];
                this.accountId =null;
                this.accountType = '';
                this.companyAccount= [];
                this.accountlength= 0;
                this.UID=null;
                this.debtlist=[];
                this.currentId= null;
                this.accountTypeId= null;
                this.userchecked= true;
                this.checkmoneyType= 1;
                this.trueMoney=0;
                this.olduserAccount=[];
                this.olddebtlist=[];
                var date = new Date();
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
		        this.datatime = currentdate;
		    	storage.getItem('select_client_msg', event => {
			    	stream.fetch({
			    		method:'POST',
			    		url:this.getuserApi,
			    		body:{"USER_ACCOUNT.UID":JSON.parse(event.data)['BUYER.UID']}
			    	},res =>{
			    		this.debtinfos = res.data[0]
			    		this.UID = res.data[0]['USER.UID']
			    		this.configData['secondTitle'] = this.debtinfos['USER.NAME']
			    		let arr = res.extraData['subAccountList']
			    		this.accountId = arr[0]['USER_ACCOUNT_SUB.CAID']
			    		this.accountTypeId = arr[0]['USER_ACCOUNT_TYPE.ACCOUNT_TYPE_ID']
			    		this.accountType = 'BUYER_ACCOUNT'
			    		this.accountlength = 0
			    		var that= this
			    		arr.forEach(function(item,index) {
			    			item['ischecked'] = false
			    			item['addmoney'] = ''
			    			if(item['USER_ACCOUNT_SUB.USABLE_MONEY']>0){
			    				that.accountlength++
			    			}
			    		})
			    		this.userAccount = arr
			    		stream.fetch({
				    		method:'POST',
				    		url:this.debtlistApi,
				    		body:{
				    			"ORDER_PARENT.UID":this.UID,
				    		}
				    	},res =>{
				    		let arrs = res.data
				    		arrs.forEach(function(value,key) {
				    			value['ischecked'] = false
				    			value['addmoney'] = ''
				    		})
				    		this.debtlist = arrs
				    	})
			    	},res=>{

			    	})
		    	})
		    	this.olddebtlist = this.debtlist;
		    	this.olduserAccount = this.userAccount;
		    	stream.fetch({
		    		method:'GET',
		    		url:this.getcompanyApi
		    	},res =>{
		    		this.companyAccount = res.data
		    	},res=>{

		    	})
    		},
    		toback(){
    			navigator.pop()
    		},
    		checkAccount(key,id,item){
    			this.checkone = key
    			if(id == 1){
    				this.accountId = item['USER_ACCOUNT_SUB.CAID']
    				this.accountTypeId = item['USER_ACCOUNT_TYPE.ACCOUNT_TYPE_ID']
    				this.accountType = 'BUYER_ACCOUNT'
    				this.userchecked = true
    				this.checkmoneyType = 1
    			} else{
    				this.accountId = item['REAL_ACCT.REAL_ACCT_ID']
    				this.accountType = 'COMPANY_ACCOUNT'
    				this.accountTypeId = null
    				this.userchecked = false
    				this.checkmoneyType =2
    			}
    		},
    		sure(){
    			var that = this
    			var userway = []
    			this.userAccount.forEach(function(item,index) {
    				if(item['ischecked']){
    					if(item['addmoney']==undefined||item['addmoney']==0){
    						modal.toast({message:'已勾选项金额不能为空',duration:2})
    						return false
    					}else{
    						var x ={
	    						'TYPE': 'BUYER_ACCOUNT',
	    						'ACCOUNT_ID': item['USER_ACCOUNT_SUB.CAID'],
	    						'MONEY': item['addmoney'],
	    						"ACCOUNT_TYPE_ID":item['USER_ACCOUNT_TYPE.ACCOUNT_TYPE_ID'],
	    						"ACCOUNT_TYPE_NAME": item['USER_ACCOUNT_TYPE.ACCOUNT_NAME']
	    					}
	    					userway.push(x)
    					}
    					
    				}
    			})
    			this.debtlist.forEach(function(item,index) {
    				console.log('22222')
    				if(item['ischecked']){
    					if(item['addmoney']==undefined||item['addmoney']=='0'||item['addmoney']==''){
    						modal.toast({message:'已勾选项金额不能为空',duration:2})
    						return false
    					} else{
    						var x ={
	    						'TYPE': 'PARENT_ORDER',
	    						'TARGET_CODE': item['ORDER_PARENT.ORDER_CODE'],
	    						'MONEY': item['addmoney'],
	    						"TARGET_ID":item['ORDER_PARENT.ORDER_PARENT_ID']
	    					}
	    					userway.push(x)
    					}
    					
    				}
    			})
    			// this.debtlist.forEach(function(index,item) {
    				
    			// })
    			if(userway.length == 0){
    				modal.toast({message:'请选择收款用途',duration:2})
    				return
    			}
    			var usemoney = 0
    			this.userAccount.forEach(function(value,key) {
    				if(value['ischecked']){
    					if(value['addmoney']==undefined||value['addmoney']=='0'||value['addmoney']==''){
    						modal.toast({message:'已勾选项金额不能为空',duration:2})
    						return false
    					} else{
    						usemoney = usemoney+parseFloat(value['addmoney'])
    					}
    				}
    				
    			},res=>{

    			})
    			this.debtlist.forEach(function(value,key) {
    				if(value['ischecked']){
    					if(value['addmoney']==undefined||value['addmoney']=='0'||value['addmoney']==''){
    						modal.toast({message:'已勾选项金额不能为空',duration:2})
    						return false 
    					} else{
    						usemoney = usemoney+parseFloat(value['addmoney'])
    					}
    				}
    			})
    			if(usemoney>this.money){
    				modal.toast({message:'超出打款金额',duration:2})
    				return
    			}
    			var onlymoney = this.money - usemoney
    			if(this.accountType=='COMPANY_ACCOUNT'&&usemoney<this.money){
    				modal.toast({message:'打款金额还剩'+onlymoney+"未用完",duration:2})
    				return
    			}
    			var inputdata = ''
    			if(this.datatime != "选择日期"){
    				inputdata = this.datatime

    			}
    			this.trueMoney = usemoney
    			// console.log(userway)
    			// return
    			stream.fetch({
		    		method:'POST',
		    		url:this.payApi,
		    		body:{
		    			"NAME":this.debtinfos['USER.NAME'],
		    			"TYPE":this.accountType,
		    			"ACCOUNT_ID":this.accountId,
		    			"ACCOUNT_NAME": this.accountName,
		    			"ACCOUNT_TYPE_ID": this.accountTypeId,
		    			"UID": this.UID,
		    			"PAY_DATETIME":inputdata,
		    			"REMARK": this.remark,
		    			"PURPOSE": JSON.stringify(userway),
		    			"VISIT_LIST_ID": this.visitId
		    		}
		    	},res =>{
		    		this.currentId = res.extraData['CONFIRM_ID']
		    	},res=>{

		    	})
    			this.ifsucess = true
    			this.configData['bottom'] = "20px"
    		},
    		creates(){
    			if(this.money == ''){
    				modal.toast({message:'请输入金额',duration:2})
    				return
    			}
    			if(this.datatime == '选择日期'){
    				modal.toast({message:'请选择日期',duration:2})
    				return
    			}
    			// this.debtlist.forEach(function(item,index) {
    			// 	item['addmoney'] = null
    			// 	item['ischecked'] = false
    			// })
    			// this.userAccount.forEach(function(item,index) {
    			// 	item['addmoney'] = null
    			// 	item['ischecked'] = false
    			// })
    			var cemoney = parseFloat(this.money);
    			var that= this
    			this.debtlist.forEach(function(item,index) {
					var x = parseFloat(item['ORDER_PARENT.SUM_OVER_PRICE'])-parseFloat(item['ORDER_PARENT.PAID_PRICE'])
					if(cemoney>x){
						item['addmoney'] =  x.toString()
						cemoney = cemoney - x
						item['ischecked'] = true
						that.$set(that.debtlist,index,item)
					} else{
						if(cemoney<= 0){
							return
						} else{
							item['addmoney'] =  cemoney.toString()
							item['ischecked'] = true
							cemoney = 0
							that.$set(that.debtlist,index,item)
						}
					}
					
    			})
    			if(cemoney>0&&this.checkmoneyType == 2){
					this.userAccount[0]['addmoney'] = cemoney
					this.userAccount[0]['ischecked'] = true
					this.$set(this.userAccount,0,this.userAccount[0])
				}
    			this.ifsure = true
    			this.configData['bottom'] = '0px'
    		},
    		closed(){
    			this.ifsure = false
    			var that =this
    			this.debtlist.forEach(function(value,key) {
    				value['addmoney'] = '0'
    				value['ischecked'] = false
    				that.$set(that.debtlist,key,value)
    			})
    			this.userAccount.forEach(function(value,key) {
    				value['addmoney'] = '0'
    				value['ischecked'] = false
    				that.$set(that.userAccount,key,value)
    			})
    			// this.debtlist = this.olddebtlist;
    			// this.userAccount = this.olduserAccount;
    			this.configData['bottom'] = '0px'
    		},
    		closedBack(){
    			navigator.pop()
    		}
    	}
    };
</script>