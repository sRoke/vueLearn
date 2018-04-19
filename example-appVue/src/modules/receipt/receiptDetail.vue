<template>	
<bu-view :config="configData" @event="viewEvent">
			<div class="paymoney">
				<text class="money-txt">￥{{detailInfos['MONEY_CONFIRM.MONEY']}}</text>
			</div>
			<div class="infos">
				<div class="info">
					<div class="info-row">
						<text class="font30 gray1">创建人</text>
						<text class="font30 gray2">{{detailInfos['MONEY_CONFIRM.NAME']}}</text>
					</div>
					<div class="info-row">
						<text class="font30 gray1">支付类型</text>
						<text class="font30 gray2">{{detailInfos['MONEY_CONFIRM.COMPANY_BANK_ACCOUNT_NAME']}}</text>
					</div>
				</div>
				<div class="info">
					<div class="info-row" v-if='orderlist.length>0'>
						<text class="font30 gray1">付款至订单</text>
						<div class="order-lists">
							<div class="order-list" v-for="(item,index) in orderlist">
								<text class="font30 reds">￥{{item['MONEY']}}</text>
								<text class="font30 gray2">{{item['TARGET_CODE']}}</text>
							</div>
						</div>
					</div>
					<div class="info-row" v-for="(value,key) in accountlist">
						<text class="font30 gray1">存入{{value['ACCOUNT_TYPE_NAME']}}</text>
						<text class="font30 reds">￥{{value['MONEY']}}</text>
					</div>
				</div>
				<div class="info">
					<div class="info-row">
						<text class="font30 gray1">时间</text>
						<text class="font30 gray2">{{detailInfos['MONEY_CONFIRM.UPDATE_DATETIME']}}</text>
					</div>
					<div class="info-row">
						<text class="font30 gray1">备注</text>
						<text class="font30 gray2">{{detailInfos['MONEY_CONFIRM.REMARK']}}</text>
					</div>
				</div>
			</div>
			<div class="files">
				<text class="font30 gray1">附件</text>
				<div class="show-files"></div>
			</div>
		<div class="success-bottom" v-if="isaccount" slot="footer">
			<div class="seedetail" @click="todetail">
				<text class="seedetail-txt">批量调整</text>
			</div>
			<div class="continue" @click="todel">
				<text class="continue-txt">作废</text>
			</div>
		</div>
		<div class="success-bottom" v-if="!isaccount&&ifshow" slot="footer">
			<div class="continue1" @click="todel" v-if="detailInfos['MONEY_CONFIRM.STATE']=='1'">
				<text class="continue-txt">作废</text>
			</div>
			<div class="delbtn" @click="todel" v-if="detailInfos['MONEY_CONFIRM.STATE']=='0'">
				<text class="continue-txt1">作废</text>
			</div>
			<div class="passbtn" @click="passorder" v-if="detailInfos['MONEY_CONFIRM.STATE']=='0'">
				<text class="continue-txt">通过</text>
			</div>
		</div>
		<div class="choose-back" v-if="failure" slot="footer">
			<div class="tip-div">
				<image class="warns" :src="warnred"></image>
				<text class="tip1">已经入账，不能作废</text>
				<text class="tip2">请联系财务人员视情款调整</text>
				<div class="btn" @click="know"><text class="btn-txt">知道了</text></div>
			</div>
		</div>
		<div class="choose-back" v-if="ifdel" slot="footer">
			<div class="choose-div">
				<text class= "del-tip">确定作废吗</text>
				<div class="btns-div">
					<div class="choose-btn1"><text class="btn-txt1 gary3"@click="del(1)">取消</text></div>
					<div class="choose-btn"><text class="btn-txt1 red1" @click="del(2)">作废</text></div>
				</div>
			</div>
		</div>
</bu-view>
</template>

<style  scoped>
	.continue-txt1{
		color: #CF411B;
		font-size: 30px;
		line-height: 80px;
		text-align: center;
	}
	.delbtn{
		width: 330px;
		height: 80px;
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
	.passbtn{
		width: 330px;
		height: 80px;
		background-color: #CF411B;
	}
	.gary3{
		color: #333
	}
	.red1{
		color: #CF411B
	}
	.paymoney{
		width: 690px;
		margin-left: 30px;
		flex-direction: row;
		height: 168px;
		align-items: center;
		justify-content: center;
	}
	.btn-txt{
		color: #FFF;
		font-size: 32px;
		line-height: 80px;
		text-align: center;
	}
	.choose-btn1{
		border-right-width: 1px;
		border-right-color: #999;
		border-right-style: solid;
		width: 315px;
		height: 110px;
		background-color: #fff;
	}
	.choose-btn{
		width: 315px;
		height: 110px;
		background-color: #fff;
	}
	.btns-div{
		width: 630px;
		flex-direction: row;
		justify-content: space-between;
		height: 110px;
		border-top-style: solid;
		border-top-width: 1px;
		border-top-color: #999;
	}
	.del-tip{
		font-size: 32px;
		color: #333;
		text-align: center;
		line-height: 140px;
		height: 140px;

	}
	.choose-div{
		position: absolute;
		top: 550px;
		background-color: #FFF;
		width: 630px;
		margin-left: 60px;
		font-size: 32px;
		height: 250px;
		border-top-left-radius :20px;
		border-top-right-radius:20px;
		border-bottom-left-radius:20px;
		border-bottom-right-radius :20px;
		/*padding-right: 30px;*/
		/*padding-left: 30px;*/
	}
	.btn-txt1{
		/*color: #fff;*/
		font-size: 30px;
		text-align: center;
		line-height: 110px;
	}
	.btn{
		width: 580px;
		height: 80px;
		background-color: #CF411B;
		border-bottom-left-radius:10px;
		border-bottom-right-radius :10px;
		border-top-left-radius :10px;
		border-top-right-radius:10px;
		position: absolute;
		bottom: 25px;
	}
	.tip2{
		color: #999;
		font-size: 24px;
		text-align:center;
		height: 40px;
	}
	.tip1{
		color: #333;
		font-size: 34px;
		text-align:center;
		margin-top: 30px;
		margin-bottom:5px;
		height: 50px;
	}
	.warns{
		width: 105px;
		height: 105px;
	}
	.tip-div{
		width: 640px;
		height: 390px;
		margin-left: 55px;
		background-color: #fff;
		flex-direction: column;
		align-items:center;
		padding-top: 30px;
		padding-left: 25px;
		padding-right: 25px;
		padding-bottom: 25px;
		border-bottom-left-radius:20px;
		border-bottom-right-radius :20px;
		border-top-left-radius :20px;
		border-top-right-radius:20px;
	}
	.choose-back{
		position: fixed;
		z-index: 999;
		top: 0px;
		width: 750px;
		background-color: rgba(0,0,0,0.5);
		bottom: 0;
		justify-content: center;
	}
	.success-bottom{
		width: 750px;
		padding-right: 30px;
		padding-left: 30px;
		position: absolute;
		bottom: 20px;
		flex-direction: row;
		justify-content: space-between;
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
	.continue1{
		flex:1;
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
		background-color: #CF411B
	}
	.continue{
		width: 330px;
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
		background-color: #CF411B
	}
	.seedetail{
		width: 330px;
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
		background-color: #fff
	}
	.show-files{
		margin-top: 10px;
	}
	.files{
		margin-top: 30px;
		padding-left: 30px;
		padding-right: 30px;
	}
	.order-list:last-child{
		margin-bottom: 0;
	}
	.order-list{
		margin-bottom: 20px;
	}
	.reds{
		color: #CF411B;
		text-align:right;
	}
	.info-row{
		flex-direction: row;
		justify-content: space-between;
		margin-bottom: 30px;
	}
	.gray2{
		color: #333;
		text-align:right;
	}
	.gray1{
		text-align: left;
		color: #666
	}
	.font30{
		font-size: 30px;
	}
	.info{
		border-bottom-style: solid;
		border-bottom-width: 1px;
		border-bottom-color: #D8D8D8;
		padding-bottom: 10px;
		padding-top: 35px;
	}
	.infos{
		margin-top:40px;
		padding-left: 30px;
		padding-right: 30px;
	}
	.money-txt{
		color: #333;
		font-size: 120px;
		text-align: center;
		line-height: 168px;
		height: 168px;
		flex: 1;
		padding-bottom: 35px;
	}
	.scrol{
		position: absolute;
		top: 78px;
		left: 0;
		width: 750px;
		padding-bottom: 18px;
		padding-left: 30px;
		padding-right: 30px;
		bottom: 110px;
	}
	.company-name{
		color: #333;
		font-size: 32px;
		text-align: center;
	}
	.titles{
		font-size: 50px;
		color: #333;
		font-weight: bold;
		text-align: center;
	}
	.head-warp{
		flex-direction: row;
		justify-content: center;
		align-items: center;
		/*height: 100px;*/
		margin-top: 20px;
		padding-right: 30px;
		padding-left: 30px;
		margin-bottom: 60px;
	}
	.back-div{
		display: inline-block;
		height: 68px;
		width: 80px;
		padding-top: 19px;
	}
	.top-bar{
		height: 78px;
		width: 750px;
		padding-left: 30px;
		padding-right: 30px;
		flex-direction: row;
    	justify-content: space-between;
    	-webkit-box-pack: justify;
    	-webkit-box-align: center;
    	align-items: center;
	}
	.labeltxt{
		font-size: 36px;
		display: inline-block;
		font-weight: bold;
	}
	.bu-wrap{
		position: absolute;
		bottom:0;
		top:0;
		left: 0;
		right:0;
		width:750px;
		padding-bottom:40px;
		background-color: #fff;
	}

	.head-back-icon{
		width:17px;
		height:30px;
	}
	.head-add-icon{
		width:34px;
		height:34px;
	}
	.head-right-icon{
		width: 14px;
		height: 24px;
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
	export default {
		components:{
            buView
        },
	    data() {
	      	return {
	      		ifshow: true,
	      		ifdel: false,
	      		warnred: icon.warnred,
	      		paypage: '/modules/receipt/pay',
	      		listpage:"/modules/receipt/receiptList",
	      		delApi: '/money/confirm/cancel',
	      		passApi:'/money/confirm/pass',
	      		getdataApi:'/money/confirm/getById',
	      		back     : icon.backIcon,
	      		title    : '收款详情',
	      		labelGroup: [],
	      		isaccount: false,
	      		configData:{
                    title: '收款详情',
                    titleAlgin: 'center',
                    secondTitle:'',
                    bottom: '120px',
                    addEvent: '',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: 'refresh',
                    loadmore: false,
                    loadmoreEvent:''
                },
                failure: false,
                detailInfos: [],
                orderlist:[],
                accountlist: [],
	      	};
	    },
	    created(){
	    	var self = this;
	    	
	    },
	    mounted(){
	    	var self = this
	    	var bundleUrl = self.$getConfig().bundleUrl
	    	if(self.getDataByUrl('from',bundleUrl) == 'pay'){
	    		this.ifshow = false
	    	}
	    	stream.fetch({
	    		method:'POST',
	    		url:this.getdataApi,
	    		body: {
	    			'MONEY_CONFIRM.MONEY_CONFIRM_ID': self.getDataByUrl('id',bundleUrl),
	    			// 'MONEY_CONFIRM.MONEY_CONFIRM_ID': 1572,
	    		}
	    	},res =>{
	    		var that = this
	    		this.detailInfos = res.data[0]
	    		this.configData['secondTitle'] = this.detailInfos['MONEY_CONFIRM.NAME']
	    		// console.log(this.detailInfos['MONEY_CONFIRM.PURPOSE'])
    			JSON.parse(this.detailInfos['MONEY_CONFIRM.PURPOSE']).forEach(function(item,index) {
    				if(item['TYPE'] == 'BUYER_ACCOUNT'){
    					that.accountlist.push(item)
    				} else if(item['TYPE'] == 'PARENT_ORDER'){
    					that.orderlist.push(item)
    				}
    			})
	    		console.log(this.orderlist)
	    		console.log(this.accountlist)
	    	})
	    	
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
    		viewEvent(name,call){
    			this[name](call)
    		},
    		todel(){
    			// console.log(typeof(this.detailInfos['MONEY_CONFIRM.STATE']))
    			this.ifdel = true
    		},
    		know(){
    			this.failure = false
    		},
    		toback(){
    			navigator.pop()
    		},
    		tocontinue(){

    		},
    		del(key){
    			if(key == 1){
    				this.ifdel = false
    			}else if(key == 2){
    				if(this.detailInfos['MONEY_CONFIRM.STATE']=="1"){
    					this.ifdel = false
	    				this.failure = true
	    			} else{
	    				stream.fetch({
				    		method:'POST',
				    		url:this.delApi,
				    		body: {
				    			'MONEY_CONFIRM.MONEY_CONFIRM_ID': this.detailInfos['MONEY_CONFIRM.MONEY_CONFIRM_ID'],
				    		}
				    	},res =>{
				    		modal.toast({
				    			"message": '作废成功'
				    		})
				    		this.ifdel = false
				    		navigator.pop()
		    			})
	    			}
    			}
    		},
    		passorder(){
    			stream.fetch({
				    		method:'POST',
				    		url:this.passApi,
				    		body: {
				    			'MONEY_CONFIRM.MONEY_CONFIRM_ID': this.detailInfos['MONEY_CONFIRM.MONEY_CONFIRM_ID'],
				    		}
				    	},res =>{
				    		if(res.code == 0){
				    			modal.toast({
					    			"message": '通过成功'
					    		,duration:1})
					    		navigator.pop()
					    		}
				    		
		    			})
    		}
    	}
    };
</script>