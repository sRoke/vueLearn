<template>	
<bu-view :config="configData" @event="viewEvent">
		<div class="choose">
			<text class="choose-txt">选择调整账户</text>
			<div class="choose-btns">
				<div class="account-div" v-for="(item,index) in userAccount" :class="[checkone==index?'ischeck':'nocheck']" @click="checkAccount(index,item)">
					<text class="account-name" :class="[checkone==index?'text-checked':'text-checke']">{{item['USER_ACCOUNT_TYPE.ACCOUNT_NAME']}}</text>
					<text class="account-money" :class="[checkone==index?'text-checked':'text-checke']">{{item['USER_ACCOUNT_SUB.USABLE_MONEY']}}</text>
				</div>
			</div>
		</div>
		<div class="choose">
			<text class="choose-txt">选择调整方式</text>
			<div class="choose-btns">
				<div class="account-div" :class="[adjustType==1?'ischeck':'nocheck']" @click="abouttype(1)">
					<text class="account-name" :class="[adjustType==1?'text-checked':'text-checke']">+ 打款</text>
				</div>
				<div class="account-div" :class="[adjustType==2?'ischeck':'nocheck']" @click="abouttype(2)">
					<text class="account-name" :class="[adjustType==2?'text-checked':'text-checke']">－ 扣款</text>
				</div>
			</div>
		</div>
		<div class="input-div">
			<text class='input-txt'>输入金额</text>
			<input type="text" class="input-money" placeholder="输入金额"   v-model="money" ></input>	
		</div>
		<div class="input-div1">
			<text class='input-remark-txt'>备注</text>
			<textarea class="input-remark"  rows="8" placeholder="输入备注" v-model="remark"></textarea>
		</div>
		<div class="bottom-bar" slot="footer">
			<image class="liner" resize="cover" :src="liner"></image>
			<div class="operatebtn">
				<!-- <text class="adjust-txt" @click="moreadjust">批量调整</text> -->
				<div class="redgou-div" @click="toadjust">
					<image class="redgouIcon" :src="redgouIcon"></image>
				</div>
			</div>
		</div>
</bu-view>
</template>
<style  scoped>
	.operatebtn{
		flex-direction: row;
		height: 98px;
		justify-content: flex-end;
		padding-left: 20px;
		padding-right: 20px;
	}
	.liner{
        width: 750px;
        height: 9px;
    }
	.input-remark{
		height: 120px;
		font-size: 30px;
		color: #333;
		margin-top: 20px;
	}
	.company-name{
		font-size: 32px;
		color: #333;
		text-align: center;
		padding-left: 30px;
		padding-right: 30px;
		margin-bottom: 80px;
	}
	.adjust-txt{
		color: #666;
		font-size: 32px;
		line-height: 99px;
	}
	.redgouIcon{
		width: 41px;
		height: 31px;
	}
	.redgou-div{
		width: 70px;
		padding-left: 27px;
		padding-top: 30px;
	}
	.bottom-bar{
		position: absolute;
		bottom: 0;
		width: 750px;
		height: 107px;
		flex-direction: column;
		
	}
	.input-remark-txt{
		color: #999;
		font-size: 30px;
	}
	.input-money{
		color: #333;
		font-size: 58px;
		margin-top: 15px;
		height: 75px;
		padding-bottom: 5px;
	}
	.input-txt{
		color: #333;
		font-size: 32px;
	}
	.input-div{
		width: 690px;
		margin-left: 30px;
		border-bottom-width: 1px;
    	border-bottom-color: rgb(216, 216, 216);
    	border-right-style: solid;
	}
	.input-div1{
		padding-left: 30px;
		padding-right: 30px;
		margin-top: 20px;
	}
	.choose{
		margin-bottom: 60px;
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
	.choose-btns{
		padding-left: 30px;
		padding-right: 30px;
		flex-direction: row;
		justify-content: space-between;
		flex-wrap: wrap;
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
	.choose-txt{
		color: #333;
		font-size: 30px;
		padding-left: 30px;
		margin-bottom: 20px;
	}

</style>
<script>
	import buView from '../../components/bu-view.vue'
	import navigator from '../../common/navigator.js'
  	import modal     from '../../common/modal.js'
  	import stream    from '../../common/stream.js'
  	import icon      from '../tagSection/icon/icon.js'
  	import ordericon from '../../assets/orderIcon/icon.js'
  	const getEvent  = weex.requireModule('event');
  	const storage = weex.requireModule('storage');
	export default {
		components:{
            buView
        },
	    data() {
	      	return {
	      		adjustApi: '/money/confirm/adjust',
	      		back     : icon.backIcon,
	      		redgouIcon: icon.redgouIcon,
	      		liner:ordericon.liner,
	      		getaccountApi: '/user/account/getAccountInfoByUid',
	      		title    : '账款调整',
	      		money    : '',
	      		checkone : 0,
	      		configData:{
                    title: '账款调整',
                    titleAlgin: 'center',
                    secondTitle:'',
                    bottom: '107px',
                    addEvent: '',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: 'refresh',
                    loadmore: false,
                    loadmoreEvent:''
                },
                userAccount: [],
                remark: '',
                UID: null,
                userInfo: {},
                type: '',
                accountId: null,
                accountType: '',
                checktype: 1,
                adjustType: 1,
	      	};
	    },
	    created(){
	    	var self = this;
	    },
	    mounted(){
			storage.getItem('select_client_msg', event => {
	        	// this.state = 'value: ' + event.data
	        	// modal.alert({message:JSON.stringify(event.data)})
		        stream.fetch({
		    		method:'POST',
		    		url:this.getaccountApi,
		    		body:{"USER_ACCOUNT.UID":JSON.parse(event.data)['BUYER.UID']}
		    		// body:{"USER_ACCOUNT.UID":6133}
		    	},res =>{
		    		this.UID = res.data[0]['USER.UID']
		    		this.userInfo = res.data[0]
		    		this.userAccount = res.extraData['subAccountList']
		    		this.accountId = this.userAccount[0]['USER_ACCOUNT_TYPE.ACCOUNT_TYPE_ID']
		    		this.accountType = 'BUYER_ACCOUNT'
		    		this.configData['secondTitle'] = res.data[0]['USER.NAME']
		    		console.log(this.userAccount)
		    		var that= this
		    		this.userAccount.forEach(function(item,index) {
		    			if(index == 0){
		    				item['ischecked'] = true
		    			} else{
		    				item['ischecked'] = false
		    			}
		    		})
		    	},res=>{

		    	})
 

	        })
	    	
	    },
    	methods:{
    		viewEvent(name,call){
    			this[name](call)
    		},
    		todetail(){

    		},
    		tocontinue(){

    		},
    		initdata(){
    			storage.getItem('select_client_msg', event => {
	        	// this.state = 'value: ' + event.data
	        	// modal.alert({message:JSON.stringify(event.data)})
		        stream.fetch({
		    		method:'POST',
		    		url:this.getaccountApi,
		    		body:{"USER_ACCOUNT.UID":JSON.parse(event.data)['BUYER.UID']}
		    		// body:{"USER_ACCOUNT.UID":6133}
		    	},res =>{
		    		this.UID = res.data[0]['USER.UID']
		    		this.userInfo = res.data[0]
		    		this.userAccount = res.extraData['subAccountList']
		    		this.accountId = this.userAccount[0]['USER_ACCOUNT_TYPE.ACCOUNT_TYPE_ID']
		    		this.accountType = 'BUYER_ACCOUNT'
		    		this.configData['secondTitle'] = res.data[0]['USER.NAME']
		    		console.log(this.userAccount)
		    		var that= this
		    		this.userAccount.forEach(function(item,index) {
		    			if(index == 0){
		    				item['ischecked'] = true
		    			} else{
		    				item['ischecked'] = false
		    			}
		    		})
		    	},res=>{

		    	})
 

	        })
    		},
    		toback (){
    			navigator.pop()
    		},
    		sure(){
    			this.ifsure = true
    		},
    		checkAccount(key,item){
    			// console.log('11')
    			this.checkone = key
    			this.accountId = item['USER_ACCOUNT_TYPE.ACCOUNT_TYPE_ID']
    		},
    		moreadjust(){
    			modal.toast({message:"您未开通，加客服微信 97556668 申请"})
    		},
    		choosetype(key){
    			this,checktype = key
    		},
    		toadjust(){
    			var x = ''
    			if(this.adjustType == 1){
    				x = '收入'
    			}else if(this.adjustType == 2){
    				x = '支出'
    				// this.money = "-"+this.money
    			}
    			stream.fetch({
		    		method:'POST',
		    		url:this.adjustApi,
		    		body:{
		    			"MONEY":x=='支出'?"-"+this.money:this.money,
		    			'REMARK':this.remark,
		    			"UID":this.UID,
		    			"NAME": this.userInfo['USER.NAME'],
		    			"TYPE": x,
		    			"ACCOUNT_TYPE_ID": this.accountId,
		    			"ACCOUNT_TYPE":this.accountType,
		    		}
		    	},res =>{
		    		if(res.code == 0){
		    			this.initdata();
		    			this.money = 0;
		    			this.remark = '';
		    			this.adjustType = 1;
		    			this.checkone = 0;
		    			modal.toast({message:'调整成功',duration:1})
		    		}
		    	})
    		},
    		abouttype(key){
    			this.adjustType = key
    		}
    	}
    };
</script>