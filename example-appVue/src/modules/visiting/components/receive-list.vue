<template>
	<div>
		<div class="lists">
			<div class="over-lists">
				<div class="over-list" v-for="(item,index) in list" v-if="item['MONEY_CONFIRM.STATE'] == '1'">
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
</template>
<style scoped>
	.lists{
		margin-bottom: 20px;
		padding-right: 30px;
		padding-left: 30px;
	}
	.over-list{
		flex-direction: row;
		justify-content: space-between;
	}
	.over-lists{
		margin-top: 20px;
		flex-direction: column;
		justify-content: space-between;
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
</style>
<script>
	import modal from '../../../common/modal.js'
  	import navigator from '../../../common/navigator.js'
  	import stream     from '../../../common/stream.js'
  	import icon      from '../../tagSection/icon/icon.js'
    export default {
        data(){
            return {
	      		addressIcon: icon.addressIcon,
	      		phoneIcon  : icon.phoneIcon,
	      		labelIcon  : icon.labelIcon,
            }
        },
        props:['list'],
        methods:{
            
        }
    }
</script>