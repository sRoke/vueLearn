<template>
	<div>
		<div class="company-name-div">
			<text class="company-name-txt">{{list['BUYER.BUYER_NAME']}}</text>
			<text class="company-remark-txt">{{list['BUYER.REMARK']}}</text>
		</div>
		<div class="text-info">
			<div class="phone-icon-div"><image class="phone-icon" :src="phoneIcon"></image></image></div>
			<div class="info-text-div"><text class="info-text">{{list['BUYER.LINKMAN_PHONE']}}</text>
		</div></div>
		
		<div class="text-info" v-if="list['BUYER.DELIVERY_ADDR_DETAIL']!=undefined&&list['BUYER.DELIVERY_ADDR_DETAIL']!=''">
			<div class="phone-icon-div1"><image class="adress-icon" :src="addressIcon"></image></div>
			<div class="info-text-div"><text class="info-text">{{list['BUYER.DELIVERY_ADDR_DETAIL']}}</text></div>
		</div>
		<div class="labels-div">
			<div class="label-icon-div"><image class="label-icon" :src="labelIcon"></image></div>
			<div class="labelindexs">
				<div class="labelindex" v-for="(item,index) in labels"><text class='label-text'>{{item['BUYER_TAG.BUYER_TAG_NAME']}}</text></div>
			</div>
		</div>
	</div>
</template>
<style scoped>
	.labelindexs{
		flex-direction: row;
		justify-content: start;
		-webkit-box-pack: justify;
		flex-wrap:wrap;
	}
	.labelindex{
		padding-left: 20px;
		padding-right: 20px;
		padding-top: 20px;
		padding-bottom: 20px;
		background-color: #F5F5F5;
		margin-right: 20px
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
		padding-top: 45px;
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
		flex-direction: column;
		padding-left:30px;
		justify-content: center
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
        props:['list','labels'],
        methods:{
            
        }
    }
</script>