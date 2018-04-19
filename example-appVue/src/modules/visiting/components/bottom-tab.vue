<template>
    <div class="bottom-btn">
		<div class="historyVisit" v-for="(item,i) in list" @click="change(i)">
			<image class="history" :src="i== index?imglist[i]:imglist1[i]"></image>
			<text class="btn-txt" :class="[i== index?'fontc-red':'fontc-66']">{{item['name']}}</text>
		</div>
	</div>  
</template>
<style scoped>
	.history{
		width: 47px;
		height: 47px;
	}
	.btn-txt1{
		text-align: center;
		font-size: 20px;
		/*color:#CF411B;*/
	}
	.fontc-red{
		color:#CF411B;
	}
	.fontc-66{
		color: #666;
	}
	.btn-txt{
		text-align: center;
		font-size: 20px;
/*		color: #666;*/
	}
	.historyVisit{
		height: 96px;
		width: 100px;
		flex-direction: column;
		align-items: center;
		padding-top: 15px;
	}
	.bottom-btn{
		width: 750px;
		height: 96px;
		border-top-style: solid;
		border-top-width: 1px;
		border-top-color: #D8D8D8;
		padding-right: 30px;
		padding-left: 30px;
		flex-direction: row;
		justify-content: space-between;
		position: absolute;
		bottom: 0;
		background-color: #fff
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
	      		imglist: [icon.historycheck,icon.cameracheck,icon.staticcheck],
	      		imglist1: [icon.historyvisit,icon.camerainfo,icon.visitstatic],
	      		historys: '',
	      		cameras: '',
	      		visits: ''
            }
        },
        props:['list','index'],
        methods:{
            change(index){
                this.$emit('change',index)
            }
        }
    }
</script>