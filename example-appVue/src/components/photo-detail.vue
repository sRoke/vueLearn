<template>	
	<div class="chooseback" slot="footer">
		<div class="phototitle">
			<div class="back-div" @click="toback" id="nav">
				<image class="head-back-icon" :src="whiteback"></image>
			</div>
			<div class="title-div">
				<text class='font28 whites txtcen'>{{imginfo['times']}}</text>
				<text class='font28 whites txtcen'>{{imginfo['taskname']}}</text>
			</div>
		</div>
		<image class= "bigphoto" :src="imginfo['imgurl']" @click="toback" resize="contain"></image>
		<div class="photoinfo">
			<text class="font28 whites">{{imginfo['visitname']}}    {{imginfo['clientname']}}</text>
			<text class="font28 whites">{{imginfo['imgaddress']}}</text>
		</div>
	</div>
</template>	
<style  scoped>
	.title-div{
		flex: 1;
		flex-direction: column;
		padding-top: 55px;
	}
	.txtcen{
		text-align: center;
		position: a
	}
	.phototitle{
		width: 750px;
		height: 130px;
		/*padding-left:30px;*/
		padding-right: 80px;
		background-color: #000;
		flex-direction: row;
	}
	.back-div{
		display: inline-block;
		height: 130px;
		width: 80px;
		padding-top: 60px;
		padding-left: 30px;
	}
	.head-back-icon{
		width:17px;
		height:30px;
	}
	.bigphoto{
		flex: 1;
		background-color: #000;
		background-size: 100%;

	}
	.photoinfo{
		width: 750px;
		height: 160px;
		padding-left: 30px;
		padding-right: 30px;
		padding-top: 30px;
		padding-bottom: 30px;
		position: absolute;
		bottom: 0;
		background-color: rgba(0,0,0,0.5);
		flex-direction: column;
	}
	.font28{
		font-size: 28px;
	}
	.font26{
		font-size: 26px;
	}
	.whites{
		color: #fff;
		flex-wrap: wrap;
	}
	.chooseback{
		position: absolute;
		top: 0px;
		width: 750px;
		background-color: rgb(0,0,0);
		bottom: 0;
		flex-direction: column;
		/*padding-top: 125px;*/
	}
	
</style>
<script>

  	import icon      from '../modules/tagSection/icon/icon.js'

  	const getEvent  = weex.requireModule('event');
  	const locationEvent = weex.requireModule('locationEvent');
	const globalEvent = weex.requireModule('globalEvent');
	const photoEvent = weex.requireModule('photoEvent');
	const storage = weex.requireModule('storage');
	export default {
	    data() {
	      	return {
	      		whiteback     : icon.whiteback,
	      		nextday: icon.nextday,
	      		preday: icon.preday,
                closedIcon: icon.closedIcon,
                datetime:'',
                lists: [],
                today: '',
                nowtime: '',
	      	};
	    },
	    props:['showimg','imginfo'],
    	methods:{

    		toback(){
				this.watchphoto= false;
				this.$emit('toback',false)
			},
    	}	
    };
</script>
