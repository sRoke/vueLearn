<template>	
	<!-- <div class="bu-wrap"  > -->
	<!-- <div class="bu-wrap"  :style="{'padding-top':topHeight}"> -->
		<!-- 头部小 -->
		<!-- <div class="head-small-warp"  v-if="!headshow" :style="{top:(topHeight)?topHeight:0}">
			<div class="head-iconsmall-warp" @click="toback" id="nav">
				<image class="head-back-icon" :src="back"></image>
			</div>
			<div class="head-back-warp">
				<text class="font-gray33 font34">{{title}}</text>
			</div>
			<div class="head-iconsmall-warp">
				<image></image>
			</div>
		</div> -->
		<!-- 头部小 -->
		<!-- <scroller show-scrollbar="false" scroll-direction="vertical"   offset-accuracy="10"  @scroll="scrollHandler">	 -->
		<!-- 头部大 -->
		<!--  -->
			<!-- 标签组名称输入框 -->
<bu-view :config="configData" @event="viewEvent">
			<div class="input-warp">
				<input type="text" class="input-item" placeholder="标签组名称"    v-model="groupName" key="name" ></input>	
			</div>
			<!-- 标签组输入框 -->

			<!-- 标签列表 -->
			<div class="mark-warp" >
				<div class="label-header">
					<text class="labeltxt">标签列表</text>
					<div class="in-block">
						<text class="onlyone">标签仅单选</text>
						<div class="example1">
				      		<!-- <div class="big-slide" :class="{'isSingle':ifsingle,'notSingle':!ifsingle}"> -->
				      		<div class="big-slide" :class="[ifsingle?'isSingle':'notSingle']" @click="ifchange">

				      			<div class="small-slide"  :class="[ifsingle?'toright':'toleft']"></div>
				      		</div>
				    	</div>
					</div>
					
				</div>
				<div class="sub-title">
					<div class="lable-index" v-for="(items,key) in labelList">
						<div class="label-icon-oprate">
							<div class="click-area" @click="delLabel(key)">
								<image class="del-icon" :src="delIcon"></image>
							</div>
							<input type="text" class="labelname" placeholder="标签名称"    v-model="items['BUYER_TAG.BUYER_TAG_NAME']"  key="name" ></input>
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
					<text class="addbtn" >添加标签</text>
				</div>
				<!-- <image :src="add" class="margin-add"></image> -->
			</div>
			<!-- 标签列表 -->
			<div class="bottom-index" slot="footer">
				<div class="savebtn" @click="saveGroup">
					<text class="save-text">保存</text>
				</div>
			</div>
			<div class="choose-back" v-if="ifdel" slot="footer">
				<div class="choose-div">
					<text class= "del-tip">是否确定删除该标签组</text>
					<div class="btns-div">
						<div class="choose-btn"><text class="btn-txt"@click="del(1)">取消</text></div>
						<div class="choose-btn"><text class="btn-txt" @click="del(2)">删除</text></div>
					</div>
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
		font-size: 30px;
	}
	.choose-back{
		position: absolute;
		z-index: 999;
		top: 0;
		width: 750px;
		background-color: rgba(0,0,0,0.5);
		/*height: 100%;*/

		bottom: 0
	}
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
	.savebtn:active{
		color: #CF411B
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
		height: 120px;
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
	      		ifdel: false,
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
	      		title    : '修改标签',
	      		ifsingle : false,
	      		groupName : '',
	      		modifyApi : '/buyers/tags/group/updateTagGroupAndTagInfo',
	      		getallLabel : '/buyers/tags/group/getTagGroupAndDetails',
	      		delApi :'/buyers/tags/group/delelteTagGroupAndTagInfo',
	      		labelList : [],
	      		currentId : null,
	      		delList : [],
	      		currentId: null,
	      		configData:{
                    title: '修改标签',
                    titleAlgin: 'left',
                    secondTitle:'',
                    bottom: '125px',
                    addEvent: 'todel',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: 'refresh',
                    loadmore: false,
                    loadmoreEvent:'',
                    btnText:'删除'
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
	    		url:'/buyers/tags/group/getTagGroupAndDetails?BUYER_TAG_GROUP_ID='+self.getDataByUrl('id',bundleUrl)
	    		// body:{
		    	// 		'BUYER_TAG_GROUP_ID' : 1060,
		    	// 		'$LOG' : true	
		    	// 	}
	    	},res =>{
	    		if(res.data.length > 0){
	    			this.groupName = res.data[0]['BUYER_TAG_GROUP.BUYER_TAG_GROUP_NAME']
	    			this.currentId = res.data[0]['BUYER_TAG_GROUP.BUYER_TAG_GROUP_ID']
	    			this.labelList = res.extraData.tagGroupMap[this.currentId]
	    			this.ifsingle = res.data[0]['BUYER_TAG_GROUP.IS_SINGLE'] == '1'?true:false
	    		}else{

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
    			var x = {'BUYER_TAG.BUYER_TAG_NAME': '','BUYER_TAG.IS_DEL':'-1','BUYER_TAG.BUYER_TAG_GROUP_ID': this.currentId}
    			this.$set(this.labelList,this.labelList.length,x)
    				
    		},
    		toback (){
    			navigator.pop()
    		},
    		delLabel(key){
    			if(this.labelList.length > 1){
    				if(this.labelList[key]['BUYER_TAG.IS_DEL'] == "-1"){
    					this.labelList[key]['BUYER_TAG.IS_DEL'] = "1"
    					this.delList.push(this.labelList[key])
    				}
    				this.labelList.splice(key,1)
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
    			var regu = "^[ ]+$";
				var re = new RegExp(regu);
    			if(this.groupName == ''||re.test(this.groupName)){
    				modal.toast({message:'请填写标签组名',duration:2})
    				this.isSave = false
                    return
    			}
    			var notnull = []
    			this.labelList.forEach(function(value,key){
      				if(value['BUYER_TAG.BUYER_TAG_NAME'] != ''){
    					notnull.push(value)
    				}
    			})
    			if(notnull.length == 0){
    				modal.toast({message:'至少添加一个标签',duration:2})
    				this.isSave = false
    				return
    			}
    			this.delList.forEach(function(item,index) {
    				notnull.push(item)
    			})
    			// console.log(notnull)
    			// return
    			stream.fetch({
			    		method:'POST',
			    		url:this.modifyApi,
			    		body:{
			    			'BUYER_TAG_GROUP.BUYER_TAG_GROUP_ID' : this.currentId,
			    			'BUYER_TAG_GROUP.BUYER_TAG_GROUP_NAME': this.groupName,
			    			'BUYER_TAG_GROUP.IS_SINGLE': this.ifsingle?1:0,
			    			'BUYER_TAG_GROUP.TAG_LIST': JSON.stringify(notnull)
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
    			this.$set(this.labelList,key+1,this.labelList[key+1])
    		},
    		moveup(key){
     			var x =  this.labelList[key]
    			this.labelList[key] = this.labelList[key-1]
    			this.labelList[key-1] = x
    			this.$set(this.labelList,key,this.labelList[key])
    			this.$set(this.labelList,key-1,this.labelList[key-1])
    		},
	      	ifchange (){
	      		this.ifsingle = !this.ifsingle
	      	},
	      	todel(){
	      		this.ifdel = true
    			
    		},
    		del(key){
    			if(key == 1){
    				this.ifdel = false
    			} else{
    				// if(this.isSave){
	    			// 	modal.toast({message:'正在删除，请勿重复点击',duration:2})
	    			// 	return
	    			// }
	    			// this.isSave = true
	    			stream.fetch({
			    		method:'POST',
			    		url:this.delApi,
			    		body: {'BUYER_TAG_GROUP.BUYER_TAG_GROUP_ID':this.currentId}
			    	},res =>{
			    		if(res.code == 0){
			    			modal.toast({message:'删除成功',duration:2})	
			    			setTimeout(()=>{
					            navigator.pop()
					        },1500)
					        this.ifdel = false
			    		}
			    	},res=>{
			    		
			    	})
    			}
    		}
    	}
    };
</script>