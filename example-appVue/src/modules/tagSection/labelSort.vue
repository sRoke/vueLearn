<template>	
<bu-view :config="configData" @event="viewEvent">
			<div class="mark-warp" >
				<div class="sub-title">
					<div class="lable-index" v-for="(items,key) in labelList">
						<text class="labeltxt">{{items['BUYER_TAG_GROUP.BUYER_TAG_GROUP_NAME']}}</text>
						<div class="click-area" v-if="!key" @click="movedown(key)">
							<image class="up-icon" :src="movedownIcon"></image>
						</div>
						<div class="click-area" v-if="key" @click="moveup(key)">
							<image class="up-icon" :src="moveupIcon"></image>
						</div>
					</div>
				</div>
			</div>
			<!-- 标签列表 -->
			<div class="bottom-index" slot="footer">
				<div class="savebtn" @click="saveGroup">
					<text class="save-text">保存</text>
				</div>
			</div>
</bu-view>
<!-- 		</scroller>
	</div> -->
</template>	

<style  scoped>
	@keyframes mymove
	{
	from {left:0px;}
	to {left:38px;}
	}

	@-webkit-keyframes mymove
	{
	from {left:0px;}
	to {left:38px;}
	}
	@keyframes mymoveback
	{
	from {left:39px;}
	to {left:1px;}
	}

	@-webkit-keyframes mymoveback
	{
	from {left:39px;}
	to {left:1px;}
	}
	.scrol{
		position: absolute;
		top: 168px;
		bottom:110px;
		left: 0;
		width: 750px;
		padding-bottom: 18px;
	}
	.toleft{
		animation:mymoveback 0.4s 1;
		-webkit-animation:mymoveback 0.4s 1; 
		left: 1px;
	}
	.toright{
		animation:mymove 0.4s 1;
		-webkit-animation:mymove 0.4s 1; 
		left: 39px;
	}
	.notSingle{
		border-color: #D5D4D4;
		background-color: #D5D4D4;
		animation-direction:alternate;
		
	}
	.isSingle{
		border-color: #CF411B;
		background-color: #CF411B;
		animation-direction:alternate;
	}
	.small-slide{
		width: 40px;
		height: 40px;
		border-color: #fff;
		background-color: #fff;
		position: absolute;
		border-bottom-left-radius:20px;
		border-bottom-right-radius:20px;
		border-top-left-radius :20px;
		border-top-right-radius:20px;

	}
	.big-slide{
		width: 80px;
		height: 40px;
		border-bottom-left-radius:20px;
		border-bottom-right-radius :20px;
		border-top-left-radius :20px;
		border-top-right-radius:20px;
		padding-left: 1px;
		position: relative;
	}
	.example1{
		position: relative;
    	-webkit-box-orient: vertical;
    	height: 45px;
    	width: 86px;
    	margin-left: 10px;
	}
	.label {
    	font-size: 40px;
    	line-height: 60px;
    	width: 350px;
    	color: #666;
    	text-align: right;
    	margin-right: 20px;
  	}
	.back-div{
		display: inline-block;
		height: 78px;
		width: 80px;
		padding-top: 24px;
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
	.save-text{
		text-align: center;
		font-size: 	30px;
		color: #fff;
		line-height: 80px;
	}
	.click-area{
		height: 109px;
		padding-top: 45px;
		width: 59px;
	}
	.bottom-index{
		width: 750px;
		padding-left: 30px;
		padding-right: 30px;
		margin-top: 20px;
		position: absolute;
		bottom: 25px
	}
	.savebtn{
		height: 80px;
		background-color: #cf411b;
		border-bottom-left-radius:10px;
		border-bottom-right-radius :10px;
		border-top-left-radius :10px;
		border-top-right-radius:10px;
	}
	.savebtn:active{
		color: #CF411B
	}
	.add-lable-index{
		width: 750px;
		height: 110px;
		flex-direction: row;
		margin-top: 1px;
	}
	.addbtn{
		font-size: 32px;
		color: #cf411b;
		line-height: 110px;
	}
	.lable-index{
		flex-direction: row;
		justify-content: space-between;
		height: 110px;
		margin-top: 1px;
		-webkit-box-pack: justify;
    	-webkit-box-align: center;
    	align-items: center;
	}
	.up-icon{
		height: 40px;
		width: 40px;

	}
	.del-icon{
		height: 40px;
		width: 40px;
		margin-right: 54px;
	}
	.label-icon-oprate{
		flex-direction: row;
		justify-content: space-start;
		width: 630px;
		height: 109px;
	}
	.label-header{
		flex-direction: row;
		justify-content: space-between;
		padding-bottom: 25px;
    	border-bottom-color: #EBEBEB;
		border-bottom-style: solid;
		border-bottom-width: 1px;
	}
	.labelname{
		flex-direction: row;
		justify-content: space-between;
		font-size: 32px;
		color: #262626;
		flex: 1
	}
	.onlyone{
		display: inline-block;
		font-size: 28px;
		color: #262626
	}
	.labeltxt{
		font-size: 32px;
		color:#333;
		flex: 1;
		border-bottom-color: #D8D8D8;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		height: 110px;
		margin-right: 30px;
		line-height: 140px
	}
	.titles{
		font-size: 50px;
		color: #333;
		font-weight: bold
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
	.in-block{
		flex-direction: row;
    	justify-content: space-between;
	}
	.head-back-icon{
		width:17px;
		height:30px;
	}
	.head-add-icon{
		width:36px;
		height:36px;
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
		font-size:bold;
	}
	.input-warp{
		position: relative;
		flex-direction: column;
		height: 120px;
		width        :750px;
		padding-left : 30px;
		padding-right: 30px;
		margin-bottom: 50px;
		border-bottom-style: solid;
		border-bottom-color: #EBEBEB;
		border-bottom-width: 1px;
	}
	.input-item{
		flex-direction : row;
		justify-content: center;
		align-items    : center;
		/*height:135px;*/
		text-align: center;
		border:none;
		font-size: 36px;
		margin-top: 37px
	}
	.mark-warp{
		position:relative;
		width:750px;
		padding-left:30px;
		padding-right:30px;
		margin-top:20px;
	}
	.margin-add{
		position:absolute;
		top:60px;
		right:24px;
		width:45px;
		height:45px;
	}
	
</style>
<script>
	import buView from '../../components/bu-view.vue'
  	import navigator from '../../common/navigator.js'
  	import modal     from '../../common/modal.js'
  	import stream    from '../../common/stream.js'
  	import icon      from './icon/icon.js'
  	const getEvent  = weex.requireModule('event');
	export default {
		components:{
            buView
        },
	    data() {
	      	return {
	      		isSave: false,
	      		controlPage: '/modules/tagSection/controlLabel',
	      		addIcon  : icon.addIcon,
	      		groupIcon: icon.groupIcon,
	      		back     : icon.backIcon,
	      		okIcon   : icon.okIcon,
	      		delIcon  : icon.delIcon,
	      		movedownIcon : icon.movedownIcon,
	      		moveupIcon : icon.moveupIcon,
	      		openIcon : icon.openIcon,
	      		headshow : true,
	      		title    : '标签排序',
	      		ifsingle : false,
	      		groupName : '',
	      		sortApi : '/buyers/tags/group/updateTagGroupsSortNum',
	      		getallLabel : '/buyers/tags/group/getTagGroupAndDetails',
	      		labelList : [],
	      		currentId : null,
	      		delList : [],
	      		configData:{
                    title: '标签排序',
                    titleAlgin: 'left',
                    secondTitle:'',
                    bottom: '105px',
                    addEvent: '',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: 'refresh',
                    loadmore: false,
                    loadmoreEvent:''
                },
	      	};
	    },
	    created(){
	    	var self = this;
	    },
	    mounted(){
	    	stream.fetch({
	    		method:'POST',
	    		url:this.getallLabel,
	    		// body:{
		    	// 		'$LOG' : true	
		    	// 	}
	    	},res =>{
	    		if(res.data.length > 0){
	    			this.labelList = res.data
	    		}else{

	    		}
	    	},res=>{

	    	})
	    },
    	methods:{
    		viewEvent(name,call){
    			this[name](call)
    		},
    		toback (){
    			navigator.pop()
    		},
    		saveGroup(){
    			if(this.isSave){
    				modal.toast({message:'正在保存，请勿重复点击',duration:2})
    				return
    			}
    			this.isSave = true
    			var x = []
    			this.labelList.forEach(function(value,key) {
    				var m = {
    					"BUYER_TAG_GROUP.BUYER_TAG_GROUP_NAME" : value['BUYER_TAG_GROUP.BUYER_TAG_GROUP_NAME'],
    					"BUYER_TAG_GROUP.BUYER_TAG_GROUP_ID" : value['BUYER_TAG_GROUP.BUYER_TAG_GROUP_ID']
    				}
    				x.push(m)
    			})
    			stream.fetch({
			    		method:'POST',
			    		url:this.sortApi,
			    		body:{
			    			'BUYER_TAG_GROUP.TAG_GROUP_LIST': JSON.stringify(x),
			    			'$LOG' :true
			    		}
			    	},res =>{
			    		this.isSave = false
			    		if(res.code == 0){
			    			modal.toast({message:'保存成功',duration:2})
			                setTimeout(()=>{
			                   navigator.pop()
			                },1500) 
						}
			    	},res=>{
			    		this.isSave = false
			    	})

    		},
    		movedown(key){
    			var x =  this.labelList[key]
    			this.labelList[key] = this.labelList[key+1]
    			this.labelList[key+1] = x
    			this.$set(this.labelList,key,this.labelList[key])
    			// console.log(this.labelList)
    			this.$set(this.labelList,key+1,this.labelList[key+1])
    		},
    		moveup(key){
     			var x =  this.labelList[key]
     			console.log(x)
    			this.labelList[key] = this.labelList[key-1]
    			this.labelList[key-1] = x
    			// console.log(this.labelList)
    			this.$set(this.labelList,key,this.labelList[key])
    			this.$set(this.labelList,key-1,this.labelList[key-1])
    		},
    	}
    };
</script>