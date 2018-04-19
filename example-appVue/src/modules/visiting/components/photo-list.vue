<template>
<div class="item">
	<div class="camerainfo">
		<div class="camera-index" >
			<div class="img-div" v-for="(item,index) in list" @click="totask(item)">
				<image class='img' :src="item['VISIT_PHOTO_TASK.VISIT_PHOTO']['VISIT_PHOTO_INFO.URL']"></image>
				<text class="img-name">{{item['VISIT_PHOTO_TASK.TASK_NAME']}}</text>
				<text class="photoname">{{item['VISIT_PHOTO_TASK.PHOTO_COUNT']}}</text>
			</div>

		</div>
	</div>
</div>
</template>	
<style  scoped>
	.item{
        width: 750px;
        align-items: center;
    }
	.photoname{
		color: #999;
		font-size: 26px;
	}
	.img-name{
		color: #666;
		font-size: 26px;
		flex: 1;
		margin-top: 20px;
	}
	.img{
		width: 210px;
		height: 210px;
	}
	.img-div{
		flex-direction: column;
		/*width: 210px;
		height: 210px;*/
		margin-top: 25px;
		margin-left: 30px;
	}
	.camera-index{
		flex-direction: row;
		flex-wrap: wrap;
		/*justify-content: space-between;*/
	}
	.camera-txt{
		font-size: 30px;
		color: #666;
		margin-left: 30px;
	}
	.camerainfo{
		width: 750px;
		/*padding-left: 30px;*/
		/*padding-right: 30px;*/
		padding-top: 30px;
		padding-bottom:20px;
		flex-direction: column;
	}
	.history{
		width: 47px;
		height: 47px;
	}
	.btn-txt1{
		text-align: center;
		font-size: 20px;
		color:#CF411B;
	}
	.btn-txt{
		text-align: center;
		font-size: 20px;
		color: #666;
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
	}
</style>
<script>
  	import modal from '../../../common/modal.js'
  	import navigator from '../../../common/navigator.js'
  	import stream     from '../../../common/stream.js'
  	import icon      from '../../tagSection/icon/icon.js'
  	const getEvent  = weex.requireModule('event');
  	const locationEvent = weex.requireModule('locationEvent');
	const globalEvent = weex.requireModule('globalEvent');
	const photoEvent = weex.requireModule('photoEvent');
	const storage = weex.requireModule('storage');
	export default {
	    data() {
	      	return {
	      		taskPage: '/modules/visiting/taskList',
	      		visitstaticPage: '/modules/visiting/visitStatistics',
	      		photorecordPage:'/modules/visiting/visitRecord',
	      		getlistApi: '/visit/photo/task/queryAll',
	      		cameracheck: icon.cameracheck,
	      		historyvisit: icon.historyvisit,
	      		visitstatic: icon.visitstatic,
                lists: [],
                enterNum: 0,
	      	};
	    },

	    props:['list'],
    	methods:{

    		
    		totask(item){
    			navigator.push({
	    				url: this.taskPage,
	    				query: '?id='+item['VISIT_PHOTO_TASK.VISIT_PHOTO_TASK_ID']
	    			},res=>{})
    		},
    		
    	}
    };
</script>
