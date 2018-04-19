<template>	

<bu-view :config="configData" @event="viewEvent">
			<!-- 区域名称输入框 -->
			<div class="input-warp">
				<input type="text" class="input-item" placeholder="区域名称(必填)"    v-model="areaName" key="name" ></input>	
				<div class="salesman-div" @click="chooseSalesman">
					<text class="salesmans-text">{{showNames}}</text>
				</div>
			</div>
			<!-- 标签组输入框 -->

			<!-- 标签列表 -->
			<div class="alink-label">
				<div class="alink-label-div">
					<text class="alink-label-text">关联标签</text>
				</div>
				<div class="lable-all">
					<div class="label-group" v-for="(item1,key1) in labelGroup">
						<div class="group-name-div"><text class="group-name">{{item1['BUYER_TAG_GROUP.BUYER_TAG_GROUP_NAME']}}</text></div>
						<div class="label-indexs">
							<div class="label-index" @click="ifchoose(key1,key2)" v-for="(item2,key2) in lableList[item1['BUYER_TAG_GROUP.BUYER_TAG_GROUP_ID']]" :class="[item2['ifchoose']?'ischoosed':'notchoosed']">
								<text class="label-text">{{item2['BUYER_TAG.BUYER_TAG_NAME']}}</text>
								<image class="choose-img" :src="redgouIcon" v-if="item2['ifchoose']"></image>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- 标签列表 -->
			<div class="bottom-index" slot="footer">
				<div class="savebtn" @click="saveArea">
					<text class="save-text">确定</text>
				</div>
			</div>
		<!-- </scroller> -->
		<div class="choose-back" v-if="ifdel" slot="footer">
			<div class="choose-div1">
				<text class= "del-tip">是否确定删除该销售团队</text>
				<div class="btns-div">
					<div class="choose-btn"><text class="btn-txt"@click="del(1)">取消</text></div>
					<div class="choose-btn"><text class="btn-txt" @click="del(2)">删除</text></div>
				</div>
			</div>
		</div>
		<div class="choose-back" v-if="ifchooseSalesman" slot="footer">
			<div class="choose-div">
				<div class="all-salesman-div">
					<scroller class='scrol1' show-scrollbar="false">
					<div class="salesmansIndex" v-for="(item3,key3) in salesmans" @click="checkSalesman(key3)">
						<text class="choosed-name">{{item3['EMPLOYEE.NAME']}}</text>
						<div class="choosed-click">
							<image class="choosed-man-icon" :src="notchoosedIcon" v-if="!item3['ischecked']"></image>
							<image class="choosed-man-icon" :src="choosedIcon" v-if="item3['ischecked']"></image>
						</div>
					</div>
					<!-- <div class="salesmansIndex">
						<text class="choosed-name">张三</text>
					</div> -->
					<!-- <div class="salesmansIndex">
						<text class="choosed-name">暂无业务员</text>
					</div> -->
					</scroller>
				</div>
				<div class="bottom-index">
					<div class="savebtn" @click="saveSalesman">
						<text class="save-text">确定</text>
					</div>
				</div>
			</div>
			
		</div>
	<!-- </div> -->
</bu-view>
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
	.choose-btn:active{
		background-color: #CF320A;
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
	.choose-div1{
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
	.del-div{
		height: 68px
	}
	.del-text{
		color: #CF411B;
		font-size: 32px;
		line-height: 68px
	}
	.ischoosed{
		padding-right: 15px;
		padding-left: 15px;
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
	.notchoosed{
		padding-right: 29px;
		padding-left: 29px;
		background-color: #F5F6F5;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		border-bottom-color: #F5F6F5;
		border-top-style: solid;
		border-top-width: 1px;
		border-top-color: #F5F6F5;
		border-left-style: solid;
		border-left-width: 1px;
		border-left-color: #F5F6F5;
		border-right-style: solid;
		border-right-width: 1px;
		border-right-color: #F5F6F5;
	}
	.choosed-click{
		padding-top: 39px;
	}
	.choosed-man-icon{
		width: 42px;
		height: 42px;
	}
	.choosed-name{
		font-size: 32px;
		color: #333;
		line-height: 120px;
	}
	.salesmansIndex{
		flex-direction: row;
		justify-content: space-between;
		border-bottom-style: solid;
		border-bottom-color: #EBEBEB;
		border-bottom-width: 1px;
		padding-right: 15px;
		padding-left: 15px;
	}
	.all-salesman-div{
		width: 750px;
		padding-left: 30px;
		padding-right: 30px;
		margin-bottom: 140px;
		height: 450px;
		overflow-y: scroll;
		min-height: 150px
	}
	.choose-div{
		width: 750px;
		/*height: 300px;*/
		max-height: 600px;
		position: fixed;
		bottom: 0;
		background-color: #fff;
		border-top-left-radius :20px;
		border-top-right-radius:20px;
		margin-bottom: 0;
	}
	.choose-back{
		position: absolute;
		top: 0;
		width: 750px;
		background-color: rgba(0,0,0,0.5);
		bottom: 0
	}
	.label-index-choosed{
		padding-right: 15px;
		padding-left: 15px;
		padding-top: 15px;
		padding-bottom: 15px;
		margin-left: 30px;
		margin-bottom: 30px;
		flex-direction: row;
		justify-content: space-between;
	}
	.label-text-choosed{
		color: #CF411B;
		font-size: 28px;
	}
	.choose-img{
		width:23px;
		height: 23px;
		margin-top: 4px;
    	margin-left: 5px;
	}
	.label-group{
		margin-bottom: 40px;
	}
	.group-name{
		font-size: 32px;
		color: #333;
		font-weight: bold
	}
	.label-indexs{
		margin-top: 30px;
		/*width:750px;*/
		flex-direction: row;
		justify-content: start;
    	-webkit-box-pack: justify;
    	-webkit-box-align: center;
    	align-items: center;
    	flex-wrap:wrap;
	}
	.label-text{
		color: #666;
		font-size: 28px;
	}
	.label-index:first-child{
		margin-left: 0;
	}
	.label-index{
		padding-top: 15px;
		padding-bottom: 15px;
		margin-right: 30px;
		margin-bottom: 30px;
		
		flex-direction: row;
		justify-content: space-between;
	}
	.alink-label{
		width: 750px;
		padding-right: 30px;
		padding-left: 30px;
	}
	.alink-label-text{
		font-size: 50px;
		font-weight: bold;
	}
	.alink-label-div{
		margin-bottom: 60px;
	}
	.salesmans-text{
		font-size: 32px;
		color:#333;
		line-height: 120px;
		text-align: center;
	}
	.salesman-div{
		/*width: 750px;*/
		height: 120px;
		border-bottom-style: solid;
		border-bottom-color: #D8D8D8;
		border-bottom-width: 1px;
	}
	.scrol{
		position: absolute;
		top: 168px;
		bottom:110px;
		left: 0;
		width: 750px;
		padding-bottom: 18px;
	}
	.scrol1{
		/*padding-right: 30px;*/
		position: absolute;
		top: 0px;
		bottom:0px;
		left: 0;
		width: 750px;
		padding-bottom: 0px;
		padding-top: 5px;
	}
	.back-div{
		/*margin-top: 19px;*/
		display: inline-block;
		height: 68px;
		width: 80px;
		padding-top: 19px;
	}
	.top-bar{
		height: 68px;
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
		background-color: #CF320A;
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
		width        :750px;
		padding-left : 30px;
		padding-right: 30px;
		margin-bottom: 90px;
	}
	.input-item{
		flex-direction : row;
		justify-content: center;
		align-items    : center;
		/*width:750px;*/
		height:120px;
		text-align: center;
		border:none;
		font-size: 32px;
		border-bottom-style: solid;
		border-bottom-color: #D8D8D8;
		border-bottom-width: 1px;
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
	      		ifdel: false,
	      		back     : icon.backIcon,
	      		headshow : true,
	      		title    : '区域更改',
	      		areaName : '',
	      		salesmanNames : ['分配业务员 >'],
	      		showNames: '分配业务员 >',
	      		redgouIcon : icon.redgouIcon,
	      		notchoosedIcon : icon.notchoosedIcon,
	      		choosedIcon : icon.choosedIcon,
	      		ifchooseSalesman : false,
	      		getLabel : '/buyers/tags/group/getTagGroupAndDetails',
	      		getSalesman : '/employee/querySaleMan',
	      		modifyApi : '/saleman/rule/group/updateSaleManGroup',
	      		getallApi: '/saleman/rule/group/querySaleManGroup',
	      		delApi : '/saleman/rule/group/deleteSaleManGroup',
	      		labelGroup : [],
	      		lableList  : [],
	      		salesmans  : [],
	      		checklabelList : [],
	      		checksalesmanList : [],
	      		checkSalesmanName : '',
	      		isSave: false,
	      		currentId : null,
	      		oldLabels : [],
	      		oldmans : [],
	      		checkSalesmans: [],
	      		checksalesmanList: [],
	      		oldnames: [],
	      		configData:{
                    title: '销售团队修改',
                    titleAlgin: 'left',
                    secondTitle:'',
                    bottom: '105px',
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
	    	stream.fetch({
	    		method:'GET',
	    		url:this.getLabel,
	    	},res =>{
	    		this.labelGroup = res.data
	    		this.lableList = res.extraData.tagGroupMap
	    		for (var item in this.lableList ) {
	    			this.lableList[item].forEach(function(value,index) {
	    				value['ifchoose'] = false
	    			})
	    		}
	    	},res=>{

	    	})
	    	stream.fetch({
	    		method:'GET',
	    		url:this.getSalesman,
	    	},res =>{
	    		this.salesmans = res.data
	    		this.salesmans.forEach(function(value,key) {
	    			value['ischecked'] = false
	    		})
	    		this.getData()
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
    		getData(){
    			var self = this
	    		var bundleUrl = self.$getConfig().bundleUrl
    			stream.fetch({
	    		method:'GET',
	    		url:'/saleman/rule/group/querySaleManGroup?SALEMAN_RULE_GROUP.SALEMAN_RULE_GROUP_ID='+self.getDataByUrl('id',bundleUrl)
	    		// url:'/saleman/rule/group/querySaleManGroup?SALEMAN_RULE_GROUP.SALEMAN_RULE_GROUP_ID=1243'
	    		},res =>{
		    		if(res.code == 0){
		    			var that =this
		    			this.areaName = res.data[0]['SALEMAN_RULE_GROUP.GROUP_NAME']
		    			this.currentId = res.data[0]['SALEMAN_RULE_GROUP.SALEMAN_RULE_GROUP_ID']
		    			this.checklabelList = res.extraData.groupTagMap[this.currentId]
		    			this.oldLabels = res.extraData.groupTagMap[this.currentId]
		    			this.oldmans = res.extraData.groupSalemanMap[this.currentId]==undefined?[]:res.extraData.groupSalemanMap[this.currentId]
		    			this.checkSalesmans = res.extraData.groupSalemanMap[this.currentId]
		    			if(this.oldmans.length > 0){
		    				this.salesmanNames = []
		    				this.oldmans.forEach(function(item,index) {
		    					that.salesmanNames.push(item['EMPLOYEE.NAME'])
		    					that.oldnames.push(item['EMPLOYEE.NAME'])
		    				})
			    			this.showNames = JSON.stringify(this.salesmanNames).replace(/"/g, "")
	    					this.showNames = this.showNames.replace("[", "")
	    					this.showNames = this.showNames.replace("]", ">")
		    			}
		    			this.oldLabels.forEach(function(item,index) {
		    				for (var i in that.lableList) {
		    					that.lableList[i].forEach(function(value,key) {
		    						if(item['BUYER_TAG.BUYER_TAG_ID'] == value['BUYER_TAG.BUYER_TAG_ID']){
		    							value['ifchoose'] = true
		    						}
		    					
		    					})
		    				}
		    			})
		    			this.oldmans.forEach(function(item,index) {
		    				that.salesmans.forEach(function(value,key) {
		    					if(item['EMPLOYEE.EMPLOYEE_ID']==value['EMPLOYEE.EMPLOYEE_ID']){
		    						value['ischecked'] = true
		    					}
		    				})
		    			})
		    		}
		    	},res=>{

		    	})
    		},
    		toback(){
    			navigator.pop()
    		},
    		saveArea(){
    			var that = this
    			if(this.isSave){
    				modal.toast({message:'正在保存，请勿重复点击',duration:2})
    				return
    			}
    			this.isSave = true
    			var regu = "^[ ]+$";
				var re = new RegExp(regu);
    			if(this.areaName == ''||re.test(this.areaName)){
    				modal.toast({message:'请填写好区域名称',duration:2})
    				this.isSave = false
    				return
    			}
    			this.checksalesmanList.forEach(function(value,key){
    				if(that.oldnames.indexOf(value['EMPLOYEE.NAME'])<0){
    					value['SALEMAN_RULE_GROUP_SALEMAN.IS_DEL'] = '-1'
    					value['SALEMAN_RULE_GROUP_SALEMAN.SALEMAN_ID'] = value['EMPLOYEE.EMPLOYEE_ID']
    					that.oldmans.push(value)
    				}
    			})
    			this.oldmans.forEach(function(item,index) {
    				if(that.salesmanNames.indexOf(item[['EMPLOYEE.NAME']])<0){
    					item['SALEMAN_RULE_GROUP_SALEMAN.IS_DEL'] = '1'
    				}
    			})
    			var checkLabels = []
    			for(var i in this.lableList){
    				that.lableList[i].forEach(function(value,key) {
    					if(value['ifchoose']){
    						value['BUSINESS_BUYER_TAG_MAP.IS_DEL'] = '-1'
    						checkLabels.push(value)
    					}
    				})
    			}
    			if(checkLabels.length<=0){
    				modal.toast({message:'至少添加一个标签',duration:2})
    				this.isSave = false
    				return
    			}
    			this.oldLabels.forEach(function(item,index) {
    				var ifexist = false
    				checkLabels.forEach(function(value,key) {
    					if(item['BUYER_TAG.BUYER_TAG_ID'] == value['BUYER_TAG.BUYER_TAG_ID']){
    						ifexist = true
    					}
    				})
    				if(!ifexist){
    					item['BUSINESS_BUYER_TAG_MAP.IS_DEL'] = '1'
    				}
    			})
    			checkLabels.forEach(function(item,index){
    				var ifexist = false
    				that.oldLabels.forEach(function(value,key) {
    					if(item['BUYER_TAG.BUYER_TAG_ID'] == value['BUYER_TAG.BUYER_TAG_ID']){
    						ifexist = true
    					}
    				})
    				if(!ifexist){
    					item['BUSINESS_BUYER_TAG_MAP.IS_DEL'] = '-1'
    					item['BUSINESS_BUYER_TAG_MAP.BUYER_TAG_ID'] = item['BUYER_TAG.BUYER_TAG_ID']
    					that.oldLabels.push(item)
    				}
    			})
    			stream.fetch({
		    		method:'POST',
		    		url:this.modifyApi,
		    		body: {
		    			'SALEMAN_RULE_GROUP.SALEMAN_RULE_GROUP_ID' : this.currentId,
		    			'SALEMAN_RULE_GROUP.GROUP_NAME' : this.areaName,
		    			'SALEMAN_RULE_GROUP.SALEMAN_LIST' : JSON.stringify(this.oldmans),
		    			'SALEMAN_RULE_GROUP.TAG_LIST' : JSON.stringify(this.oldLabels),
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
    		ifchoose(key1,key2){
    			var that = this
    			this.lableList[this.labelGroup[key1]['BUYER_TAG_GROUP.BUYER_TAG_GROUP_ID']][key2]['ifchoose'] = !this.lableList[this.labelGroup[key1]['BUYER_TAG_GROUP.BUYER_TAG_GROUP_ID']][key2]['ifchoose']
    			this.$set(this.lableList[this.labelGroup[key1]['BUYER_TAG_GROUP.BUYER_TAG_GROUP_ID']],key2,this.lableList[this.labelGroup[key1]['BUYER_TAG_GROUP.BUYER_TAG_GROUP_ID']][key2])
    		},
    		chooseSalesman(){
    			this.ifchooseSalesman = true
    		},
    		saveSalesman(){
    			var that = this
    			var x = 0
    			this.ifchooseSalesman = false
    			this.checksalesmanList = []
    			this.salesmanNames = []
    			this.salesmans.forEach(function(item,index){
    				if(item['ischecked']){
    					that.checksalesmanList.push(item)
    					that.salesmanNames.push(item['EMPLOYEE.NAME'])
    				}
    			})
    			if(this.checksalesmanList.length == 0){
    				this.showNames = "分配业务员 >"
    				return
    			}
    			this.showNames = JSON.stringify(this.salesmanNames).replace(/"/g, "")
    			this.showNames = this.showNames.replace("[", "")
    			this.showNames = this.showNames.replace("]", "")
    		},
    		checkSalesman(key){
    			var that = this
    			this.salesmans[key]['ischecked'] = !this.salesmans[key]['ischecked']
    			this.$set(this.salesmans,key,this.salesmans[key])    			
    		},
    		todel(){
    			this.ifdel = true
    		},
    		del(key){
    			if(key == 1){
    				this.ifdel = false
    			} else{
	    			stream.fetch({
			    		method:'POST',
			    		url:this.delApi,
			    		body: {'SALEMAN_RULE_GROUP.SALEMAN_RULE_GROUP_ID':this.currentId}
			    	},res =>{
			    		if(res.code == 0){

			    		}
			    	},res=>{
			    		modal.toast({message:'删除成功',duration:2})	
		    			setTimeout(()=>{
				            navigator.pop()
				        },1500)	 
			    	})
    			}
    		}
    	}
    };
</script>