<template>	
<bu-view :config="configData" @event="viewEvent">
			<div class="mark-warp" >
				<div class="sub-title">
					<div class="lable-index" v-for="(items,key) in lists">
						<div class="label-icon-oprate">
							<div class="click-area" @click="delLabel(key)">
								<image class="del-icon" :src="delIcon"></image>
							</div>
							<input type="text" class="labelname" placeholder="相册名称"  v-model="items['VISIT_PHOTO_TASK.TASK_NAME']"></input>
						</div>
						<div class="click-area" v-if="!key" @click="movedown(key)">
							<image class="up-icon" :src="movedownIcon"></image>
						</div>
						<div class="click-area" v-if="key" @click="moveup(key)">
							<image class="up-icon" :src="moveupIcon"></image>
						</div>
					</div>
				</div>
				<div class="add-lable-index" @click="addLabel">
					<div class="click-area" >
						<image class="del-icon" :src="groupIcon"></image>
					</div>
					<text class="addbtn" >添加相册</text>
				</div>
				<!-- <image :src="add" class="margin-add"></image> -->
			</div>
			<div class="bottom-index" slot="footer">
				<div class="savebtn" @click="saveGroup">
					<text class="save-text">确定</text>
				</div>
			</div>
</bu-view>
<!-- 		</scroller>
	</div> -->
</template>	

<style  scoped>
	.btn-txt{
		color: #FFF;
		font-size: 32px;
		line-height: 80px;
		text-align: center;
	}
	.choose-btn{
		width: 150px;
		height: 80px;
		background-color: #cf411b;
		border-bottom-left-radius:20px;
		border-bottom-right-radius :20px;
		border-top-left-radius :20px;
		border-top-right-radius:20px;
	}
	.btns-div{
		width: 630px;
		flex-direction: row;
		justify-content: space-between;
		height: 80px;
		padding-right: 110px;
		padding-left: 110px;
		/*padding-top: 50px;*/
		
	}
	.choose-div{
		position: absolute;
		top: 500px;
		background-color: #FFF;
		width: 690px;
		margin-left: 30px;
		font-size: 32px;
		height: 250px;
		border-top-left-radius :20px;
		border-top-right-radius:20px;
		border-bottom-left-radius:20px;
		border-bottom-right-radius :20px;
		padding-right: 30px;
		padding-left: 30px;
	}
	.del-tip{
		color: #333;
		text-align: center;
		line-height: 120px;
		height: 120px;

	}
	.choose-back{
		position: absolute;
		z-index: 999;
		top: 0;
		width: 750px;
		background-color: rgba(0,0,0,0.5);
		bottom: 0
	}
	.del-div{
		height: 68px
	}
	.del-text{
		color: #CF411B;
		font-size: 32px;
		line-height: 68px
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
		-webkit-animation:mymoveback 0.4s 1; /*Safari and Chrome*/
		left: 1px;
	}
	.toright{
		animation:mymove 0.4s 1;
		-webkit-animation:mymove 0.4s 1; /*Safari and Chrome*/
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
		/*border-radius: 20px;*/
		position: absolute;
		border-bottom-left-radius:20px;
		border-bottom-right-radius:20px;
		border-top-left-radius :20px;
		border-top-right-radius:20px;

	}
	.big-slide{
		width: 80px;
		height: 40px;
		/*border-radius: 20px;*/
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
		/*margin-top: 19px;*/
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
		padding-top: 35px;
		width: 59px;
		/*margin-right: 50px*/
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
		/*border-radius: 5px;*/
		border-bottom-left-radius:10px;
		border-bottom-right-radius :10px;
		border-top-left-radius :10px;
		border-top-right-radius:10px;
	}
	.add-lable-index{
		width: 750px;
		height: 110px;
		flex-direction: row;
		margin-top: 1px;
		/*border-bottom: 1px solid #EBEBEB*/
		border-bottom-color: #EBEBEB;
		border-bottom-style: solid;
		border-bottom-width: 1px;
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
		/*border-bottom: 1px solid #EBEBEB;*/
		border-bottom-style: solid;
		border-bottom-width: 1px;
		border-bottom-color: #EBEBEB;
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
	/*.sub-title{
		flex-direction : row;
		align-items    : center;
	}*/
	.label-header{
		flex-direction: row;
		justify-content: space-between;
		padding-bottom: 25px;
    	/*border-bottom: 1px solid #EBEBEB;*/
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
		font-size: 36px;
		display: inline-block;
		font-weight: bold
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
		/*padding-top:24px;
		padding-bottom:24px;*/
		height: 100px;
		padding-right: 30px;
		padding-left: 30px;
	}
	.in-block{
		/*display: inline-block;*/
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
  	import icon      from '../tagSection/icon/icon.js'
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
	      		ifsingle : false,
	      		groupName : '',
	      		modifyApi : '/visit/photo/task/batchOperation',
	      		getallApi : '/visit/photo/task/queryAllNoPhoto',
	      		lists : [],
	      		currentId : null,
	      		delList : [],
	      		currentId: null,
	      		configData:{
                    title: '管理相册',
                    titleAlgin: 'left',
                    secondTitle:'',
                    bottom: '125px',
                    addEvent: '',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: 'refresh',
                    loadmore: false,
                    loadmoreEvent:'',
                    btnText:''
                },
	      	};
	    },
	    created(){
	    	var self = this;
	    },
	    mounted(){
	    	var self = this
	    	var bundleUrl = self.$getConfig().bundleUrl
	    	stream.fetch({
	    		method:'GET',
	    		url: this.getallApi
	    	},res =>{
	    		if(res.data.length > 0){
	    			this.lists = res.data
	    		}
	    	},res=>{

	    	})
	    },
    	methods:{
    		viewEvent(name,call){
    			this[name](call)
    		},
    		getDataByUrl: function (name, url) {
			  name = name.replace(/[\[\]]/g, "\\$&");
			  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			  results = regex.exec(url); 
			  if (!results) return null;
			  if (!results[2]) return '';
			  return decodeURIComponent(results[2].replace(/\+/g, " "));
			},
    		addLabel(){
    			var x = {
    				'TYPE': "ADD",
    				'VISIT_PHOTO_TASK.TASK_NAME': '',
    				'VISIT_PHOTO_TASK.INTRO': ''
    			}
    			this.$set(this.lists,this.lists.length,x)
    				
    		},
    		delLabel(key){
    			if(this.lists.length > 1){
    				this.lists[key]['VISIT_PHOTO_TASK.IS_DEL'] = '1'
    				this.delList.push(this.lists[key])
    				this.lists.splice(key,1);
    			} else{
    				modal.toast({message:'不能再删了',duration:2})
    			}
    			
    		},
    		saveGroup(){
    			if(this.isSave){
    				modal.toast({message:'正在保存，请勿重复点击',duration:2})
    				return
    			}
    			this.isSave = true
    			var that = this
    			var notnull = []
    			this.lists.forEach(function(value,key){
    				value['VISIT_PHOTO_TASK.SORT_NUM'] = key + 1 
      				if(value['VISIT_PHOTO_TASK.TASK_NAME'] != ''){
      					// console.log(value)
    					notnull.push(value)
    				}
    			})
    			// console.log(notnull)
    			if(notnull.length == 0){
    				modal.toast({message:'至少添加一个相册',duration:2})
    				this.isSave = false
    				return
    			}
    			this.delList.forEach(function(value,key) {
    				notnull.push(value)
    			})
    			notnull.forEach(function(value,key){
    				console.log(value)
      				if(value['VISIT_PHOTO_TASK.VISIT_PHOTO_TASK_ID'] != undefined){
    					value['TYPE'] = 'UPDATE';
    				}
    			})
    			stream.fetch({
			    		method:'POST',
			    		url:this.modifyApi,
			    		body:{
			    			'TASK_LIST': JSON.stringify(notnull)
			    		}
			    	},res =>{
			    		this.isSave = false
			    		if(res.code == 0){
			    			modal.toast({message:'保存成功',duration:2})
			                setTimeout(()=>{
			                   navigator.pop()
			                },1000) 
						}
			    	},res=>{
			    		this.isSave = false
			    	})

    		},
    		movedown(key){
    			var x =  this.lists[key]
    			this.lists[key] = this.lists[key+1]
    			this.lists[key+1] = x
    			this.$set(this.lists,key,this.lists[key])
    			this.$set(this.lists,key+1,this.lists[key+1])
    		},
    		moveup(key){
     			var x =  this.lists[key]
    			this.lists[key] = this.lists[key-1]
    			this.lists[key-1] = x
    			this.$set(this.lists,key,this.lists[key])
    			this.$set(this.lists,key-1,this.lists[key-1])
    		},
    	}
    };
</script>