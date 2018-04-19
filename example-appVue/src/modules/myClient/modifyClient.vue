<template>	
<bu-view :config="configData" @event="viewEvent">
			<div class="input-warp">
				<div class="input-div">
					<input type="text" class="input-item" placeholder="名称"    v-model="name"  ></input>
				</div>
				<div class="input-div">
					<input type="number" class="input-item" placeholder="手机号"  v-model="phone"  ></input>
				</div>
				<div class="input-div2" @click="showLeavel">
					<text class="font34 c99" v-if="leavelIndex == -1">客户级别</text>
                	<text class="font34 c33" v-if="leavelIndex != -1">{{leavelLists[leavelIndex]['BUYER_LEVEL.LEVEL_NAME']}}</text>
                	<image class="icon mg-l" :src="icon"></image>
				</div>
				<div class="input-div">
					<input type="text" class="input-item" placeholder="备注"    v-model="remark"  ></input>
				</div>
				<!-- <div class="location-div">
					<text class="input-item1" @click="getLocationInfo" >{{locationtxt}}</text>
					<textarea class="location-address" rows="5" disabled="true" v-model="address"></textarea>
				</div> -->
				<div class="input-div">
					<input type="text" class="input-items" placeholder="收货地址"  v-model="receiveaddress"></input>
				</div>
			</div>

			<div class="location-div" @click="getLocationInfo">
				<image class="backs" :src="locationBack"></image>
				<div class="location-body" v-if="!islocation">
					<image class="white-location" :src="whiteLocation"></image>
					<text class="font28 white">定位地址</text>
				</div>
				<div class="locationed"  v-if="islocation">
					<div class="icon-div">
						<div class="btn-relocation">
							<image class="locationeds" :src="locationeds"></image>
						</div>
						<div class="address-div">
							<text class='address-text'>{{address}}</text>
						</div>
					</div>
				</div>
				<!-- <text class="input-item1" @click="getLocationInfo" >{{locationtxt}}</text>
				<textarea class="location-address" rows="5" disabled="true" v-model="address"></textarea> -->
			</div>

			<div class="alink-label">
				<div class="alink-label-div">
					<text class="alink-label-text">客户标签</text>
				</div>
				<div class="lable-all">
					<div class="label-group" v-for="(item1,key1) in labelGroup">
						<div class="group-name-div"><text class="group-name">{{item1['BUYER_TAG_GROUP.BUYER_TAG_GROUP_NAME']}}</text></div>
						<div class="label-indexs">
							<div class="label-index" @click="ifchoose(key1,key2)" v-for="(item2,key2) in item1['BUYER_TAG_GROUP.BUYER_TAG_LIST']" :class="[item2['ifchoose']?'ischoosed':'notchoosed']">
								<text class="label-text">{{item2['BUYER_TAG.BUYER_TAG_NAME']}}</text>
								<image class="choose-img" :src="redgouIcon" v-if="item2['ifchoose']"></image>
							</div>

						</div>
					</div>
				</div>
				<div class="text-hint-div"><text class="text-hint">可以在『标签管理』中添加更多标签</text></div>
			</div>
			<!-- 标签列表 -->
			<div class="bottom-index" slot="footer">
				<div class="savebtn" @click="save">
					<text class="save-text">确定</text>
				</div>
			</div>
			<clientLevel slot="footer" ref="submit" :title="'客户级别'" @ok="getOver">
				<leavelList :list="leavelLists" :index="leavelIndex" ref="radio"></leavelList>
			</clientLevel>
</bu-view>
</template>	
                                                                               
<style  scoped>
	.icon-div{
		align-items: center;
		justify-content: center;
		padding-left: 80px;
		padding-right: 80px
	}
	.address-text{
		text-align: center;
		background-color: #fff;
		color: #666;
		font-size: 24px;
		padding-right: 20px;
		padding-left:20px;
		padding-top: 20px;
		padding-bottom: 20px
	}
	.locationeds{
		width: 36px;
		height: 46px;
		/*margin-bottom: 15px;*/
	}
	.btn-relocation{
		flex-direction: column;
		padding-top: 8px;
		padding-bottom: 8px;
		padding-left:40px;
		padding-right: 40px;
		align-items: center;
		justify-content: center;
	}
	.locationed{
		/*position: absolute;*/
		margin-top: -221px;
		width: 750px;
		height: 221px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.white-location{
		width: 21px;
		height: 25px;
		margin-right:5px;
	}
	.location-body{
		width: 240px;
		height: 70px;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		background-color: #CF411B;
		margin-top: -145.5px;
    	margin-left: 255px;
    	}
	.backs{
		width: 690px;
		height: 221px;
		margin-left: 30px;
		/*margin-bottom: 120px;*/
	}
	.input-div2{
		border-bottom-style: solid;
		border-bottom-color: #D8D8D8;
		border-bottom-width: 1px;
		padding-bottom: 5px;
		flex-direction: row;
		align-items: center;
		height:130px;
		justify-content: center;
	}
	.mg-l{
	    margin-left: 20px;
	  }
	.white{
	    color: #fff;
	  }
	  .c33{
	    color: #333;
	  }
	  .c99{
	  	color: #999
	  }
	  .icon{
	    width: 14px;
	    height: 24px;
	  }
	.font34{
    	font-size: 34px;
  	}
  	.font28{
  		font-size: 28px;
  	}
	.location-div1{
		border-bottom-style: solid;
		border-bottom-color: #D8D8D8;
		border-bottom-width: 1px;
		flex-direction: column;
		height: 240px;
		width: 550px;
	}
	.location-div{
		border-bottom-style: solid;
		border-bottom-color: #D8D8D8;
		border-bottom-width: 1px;
		flex-direction: column;
		height: 221px;
		margin-bottom: 120px;
		margin-top: 40px;
	}
	.location-address1{
		flex: 1;
		border:none;
		font-size: 30px;
		/*padding-top: 15px;*/
	}
	.location-address{
		justify-content: center;
		align-items    : center;
		height:130px;
		/*text-align: center;*/
		display: table-cell;
		vertical-align: middle;
		border:none;
		font-size: 24px;
	}
	.input-item1{
		flex-direction : row;
		justify-content: center;
		align-items    : center;
		/*height:130px;*/
		padding-top: 20px;
		padding-bottom: 10px;
		text-align: center;
		border:none;
		font-size: 34px;
		/*border-bottom-style: solid;
		border-bottom-color: #D8D8D8;
		border-bottom-width: 1px;*/
		/*line-height: 130px;*/
		color: #999;
		word-wrap:break-word;
	}
	.lable-all{
		padding-right: 30px;
		padding-left: 30px
	}
	.text-hint-div{
	}
	.text-hint{
		font-size: 28px;
		color: #CCC;
		text-align:center;
	}
	.choose-img{
		width:23px;
		height: 23px;
		margin-top: 4px;
    	margin-left: 5px;
	}
	.label-text{
		color: #666;
		font-size: 28px;
	}
	.label-text-choosed{
		color: #CF411B;
		font-size: 28px;
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
	.label-indexs{
		margin-top: 30px;
		flex-direction: row;
		justify-content: start;
    	-webkit-box-pack: justify;
    	-webkit-box-align: center;
    	align-items: center;
    	flex-wrap:wrap;
	}
	.group-name{
		font-size: 32px;
		color: #333;
		font-weight: bold
	}
	.label-group{
		margin-bottom: 40px;
	}
	.alink-label-text{
		font-size: 42px;
		text-align: center;
		font-weight: bold
	}
	.scrol{
		position: absolute;
		top: 168px;
		bottom:110px;
		left: 0;
		width: 750px;
		padding-bottom: 18px;
	}
	.back-div{
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

	.input-warp{
		position: relative;
		flex-direction: column;
		width        :750px;
		padding-left : 100px;
		padding-right: 100px;
		/*margin-bottom: 120px;*/
	}
	.input-item2{
		flex-direction : row;
		justify-content: center;
		align-items    : center;
		height:160px;
		text-align: center;
		display: table-cell;
		vertical-align: middle;
		border:none;
		font-size: 34px;
		border-bottom-style: solid;
		border-bottom-color: #D8D8D8;
		border-bottom-width: 1px;
		padding-top: 20px;
	}
	.input-item{
		flex-direction : row;
		justify-content: center;
		align-items    : center;
		height:130px;
		text-align: center;
		border:none;
		font-size: 34px;
	}
	.input-items{
		flex-direction : row;
		justify-content: center;
		align-items    : center;
		height:130px;
		border:none;
		font-size: 34px;
		text-align: center;
	}
	.input-div{
		border-bottom-style: solid;
		border-bottom-color: #D8D8D8;
		border-bottom-width: 1px;
		padding-bottom: 5px
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
	import clientLevel from './components/clientLevel.vue'
	import leavelList from './components/leavelList.vue'
  	import navigator from '../../common/navigator.js'
  	import modal     from '../../common/modal.js'
  	import stream    from '../../common/stream.js'
  	import icon      from '../tagSection/icon/icon.js'
  	const getEvent  = weex.requireModule('event');
  	const locationEvent = weex.requireModule('locationEvent');
	const globalEvent = weex.requireModule('globalEvent');
	const storage = weex.requireModule('storage');
	export default {
		components:{
            buView,
            clientLevel,
            leavelList
        },
	    data() {
	      	return {
	      		locationeds: icon.locationeds,
	      		islocation: false,
	      		whiteLocation: icon.whiteLocation,
	      		locationBack:icon.locationBack,
	      		leavelId:null,
	      		icon:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/orderIcon/itemGo.png',
	      		leavelLists: [],
	      		leavelIndex:-1,
	      		leavelApi: '/buyer/queryInit',
	      		name : '',
	      		phone : '',
	      		remark : '',
	      		positions: '',
	      		lableList: [],
	      		labelGroup: [],
	      		checklabelList: [],
	      		redgouIcon : icon.redgouIcon,
	      		back     : icon.backIcon,
	      		headshow : true,
	      		title    : '客户修改',
	      		labelApi : '/business/buyer/tag/map/queryTagForBusiBySaleMan',
	      		modifyApi   : '/buyer/modifyByBuyerId',
	      		getoneData : '/buyer/queryByBuyerId',
	      		oldlabel : [],
	      		checkIds : [],
	      		oldname: '',
	      		oldremark: '',
	      		oldphone : '',
	      		currentId : null,
	      		isSave   : false,
	      		locationDetail: null,
	      		nolocation: true,
	      		longitude : null,
	      		latitude  : null,
	      		province  : null,
	      		city      : null,
	      		xian      : null,
	      		zhen      : null,
	      		street    : null,
	      		address   : '',
	      		locationtxt: '定位',
	      		configData:{
                    title: '客户修改',
                    titleAlgin: 'left',
                    secondTitle:'',
                    bottom: '125px',
                    addEvent: '',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: 'refresh',
                    loadmore: false,
                    loadmoreEvent:''
                },
                receiveaddress: '',
                oldreceive: '',
                oldadress: '',
                locationConfig: null
	      	};
	    },
	    created(){
	    	var self = this;
	    	this.getLeavel()
	    },
	    mounted(){
	    	stream.fetch({
	    		method:'GET',
	    		url:this.labelApi
	    	},res =>{
	    		this.labelGroup = res.extraData.groupList

	    		this.labelGroup.forEach(function(value,key) {
	    			value['BUYER_TAG_GROUP.BUYER_TAG_LIST'].forEach(function(item,index) {
	    				item['ifchoose'] = false
	    			})
	    		})
	    		var self = this
		    	storage.getItem('select_client_msg', event => {
		    		stream.fetch({
			    		method:'GET',
			    		url:'/buyer/queryByBuyerId?BUYER.BUYER_ID='+JSON.parse(event.data)['BUYER.BUYER_ID']
			    		// url:'/buyer/queryByBuyerId?BUYER.BUYER_ID=5050'
			    	},res =>{
			    		var that =this
			    		// this.labelGroup = res.extraData.groupList
			    		this.name = res.data[0]['BUYER.BUYER_NAME']
			    		this.phone = res.data[0]['BUYER.LINKMAN_PHONE']
			    		this.remark = res.data[0]['BUYER.REMARK']
			    		this.oldname = res.data[0]['BUYER.BUYER_NAME']
			    		this.oldphone = res.data[0]['BUYER.LINKMAN_PHONE']
			    		this.oldremark = res.data[0]['BUYER.REMARK']
			    		this.currentId = res.data[0]['BUYER.BUYER_ID']
			    		this.address = res.data[0]['BUYER.ADDR_DETAIL']
			    		this.oldadress = res.data[0]['BUYER.ADDR_DETAIL']
			    		this.receiveaddress = res.data[0]['BUYER.DELIVERY_ADDR_DETAIL']
			    		this.oldreceive = res.data[0]['BUYER.DELIVERY_ADDR_DETAIL']
			    		this.leavelId = res.data[0]['BUYER.BUYER_LEVEL_ID']
			    		this.leavelLists.forEach(function(item,index){
			    			if(item['BUYER_LEVEL.BUYER_LEVEL_ID']==that.leavelId){
			    				that.leavelIndex = index
			    			}
			    		})
			    		if(this.address!=''&&this.address!=null){
			    			this.locationtxt = "重新定位";
			    			this.islocation = true
			    		}
			    		// this.positions = 
			    		this.oldlabel = res.extraData.tagList
			    		this.oldlabel.forEach(function(value,key){
			    			that.checkIds.push(value['BUYER_TAG_MAP.BUYER_TAG_ID'])
			    		})
			    		// console.log("121212")
			    		// console.log(this.oldlabel)
			    		// return
			    		this.labelGroup.forEach(function(value,key) {
			    			value['BUYER_TAG_GROUP.BUYER_TAG_LIST'].forEach(function(value1,key1) {
			    				if(that.checkIds.indexOf(value1['BUYER_TAG.BUYER_TAG_ID'])>=0){
			    					value1['ifchoose'] = true
			    					// console.log(value1)
			    					var m = {
			    						'BUYER_TAG_MAP.BUYER_TAG_ID' : value1['BUYER_TAG.BUYER_TAG_ID'],
			    						'BUYER_TAG_MAP.BUYER_ID' : that.currentId,
			    						'BUYER_TAG_MAP.IS_DEL' : '-1'
			    					}
			    					that.checklabelList.push(m)
			    				}
			    			})
			    		})
			    		// console.log(this.checklabelList)
			    		// this.labelGroup.forEach(function(value,key) {
			    		// 	value['BUYER_TAG_GROUP.BUYER_TAG_LIST'].forEach(function(item,index) {
			    		// 		item['ifchoose'] = false
			    		// 	})
			    		// })
			    	},res=>{

			    	})
			    })
	    	},res=>{

	    	})
	    	var self = this
	    	if(typeof(globalEvent.addEventListener) == "function"){
		    	var x =setTimeout(function() {
		    		globalEvent.addEventListener("getLocation", function (val) {
		    			self.locationDetail=val.location
		    			self.nolocation = false
		    			self.longitude = JSON.parse(self.locationDetail).latLonPoint.longitude
		    			self.latitude  = JSON.parse(self.locationDetail).latLonPoint.latitude
		    			self.province  = JSON.parse(self.locationDetail).provinceName
		    			self.city      = JSON.parse(self.locationDetail).cityName
		    			self.xian      = JSON.parse(self.locationDetail).adName
		    			self.street    = JSON.parse(self.locationDetail).snippet
		    			if(JSON.parse(self.locationDetail).address){
		    				self.address = JSON.parse(self.locationDetail).address
		    				if(self.receiveaddress == ''){
		    					self.receiveaddress = self.address
		    				}
		    			} else{
		    				self.address   = self.province+self.city+self.xian+self.street
		    				if(self.receiveaddress == ''){
		    					self.receiveaddress = self.address
		    				}
		    			}
		    			self.locationtxt = '重新定位';
		    			self.islocation = true
		    		})
		    	},1000)
	    	}
	    },
    	methods:{
    		showLeavel(){
    			this.$refs.submit.show = true
    		},
    		getOver(){
    			this.leavelIndex = this.$refs.radio.nowIndex
                this.$refs.submit.show = false
    		},
    		getLeavel(){
    			var that = this;
    			stream.fetch({
		    		method:'GET',
		    		url:this.leavelApi,
		    	},res =>{
		    		this.leavelLists =res.extraData['BUYER_LEVEL'];
		    	})
    		},
    		viewEvent(name,call){
    			this[name](call)
    		},
    		getLocationInfo:function(){
    			let sysName = weex.config.env.osName
				var that =this
				if(typeof(getEvent.getSystemVersionInfo)=='function'){
					if(sysName ==='android'){
    					locationEvent.getLocationDetail()
    				}else{
						getEvent.getSystemVersionInfo(function(val) {
							// modal.alert({message: JSON.stringify(res)})
							var x = parseInt(val['SYSTEM_VERSION'].replace(/\./g,''))
							if(x<3612){
								locationEvent.getLocationDetail()
							}else{
								stream.fetch({
						    		method:'GET',
						    		url: '/locationConfig/getDefaultLocationConfig'
						    	},res =>{
						    		if(res.code == 0){
						    			that.locationConfig = res.extraData['CONFIG'];
						    			locationEvent.getLocationDetail(that.locationConfig)
						    		}
								})
							}
						})
					}
				}else{
					locationEvent.getLocationDetail()
				}
				// locationEvent.getLocationDetail()
			},
    		getDataByUrl: function (name, url) {
			  name = name.replace(/[\[\]]/g, "\\$&");
			  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			  results = regex.exec(url); 
			  if (!results) return null;
			  if (!results[2]) return '';
			  return decodeURIComponent(results[2].replace(/\+/g, " "));
			},
    		toback(){
    			navigator.pop()
    		},
    		ifchoose(key1,key2){
    			var that = this
    			console.log(this.labelGroup[key1]['BUYER_TAG_GROUP.BUYER_TAG_LIST'][key2])
    			this.labelGroup[key1]['BUYER_TAG_GROUP.BUYER_TAG_LIST'][key2]['ifchoose'] = !this.labelGroup[key1]['BUYER_TAG_GROUP.BUYER_TAG_LIST'][key2]['ifchoose']
    			this.$set(this.labelGroup[key1]['BUYER_TAG_GROUP.BUYER_TAG_LIST'],key2,this.labelGroup[key1]['BUYER_TAG_GROUP.BUYER_TAG_LIST'][key2])
    			if(this.labelGroup[key1]['BUYER_TAG_GROUP.BUYER_TAG_LIST'][key2]['ifchoose']){
    				var x = {
    					// "BUYER_TAG.BUYER_TAG_ID" : this.labelGroup[key1]['BUYER_TAG_GROUP.BUYER_TAG_LIST'][key2]['BUYER_TAG.BUYER_TAG_ID']
    					'BUYER_TAG_MAP.BUYER_TAG_ID' : this.labelGroup[key1]['BUYER_TAG_GROUP.BUYER_TAG_LIST'][key2]['BUYER_TAG.BUYER_TAG_ID'],
    					'BUYER_TAG_MAP.BUYER_ID' : this.currentId,
		    			'BUYER_TAG_MAP.IS_DEL' : '-1'
    				}
    				this.checklabelList.push(x)
    			} else{
					this.checklabelList.forEach(function(value,key) {
						if(value['BUYER_TAG_MAP.BUYER_TAG_ID'] == that.labelGroup[key1]['BUYER_TAG_GROUP.BUYER_TAG_LIST'][key2]['BUYER_TAG.BUYER_TAG_ID']){
							that.checklabelList.splice(key,1)
							return
						}
					})
    			}
    			// console.log(this.checklabelList)
    		},
    		save(){
    			if(this.isSave){
    				modal.toast({message:'正在保存，请勿重复点击',duration:2})
    				return
    			}
    			if(this.leavelIndex==-1){
    				modal.toast({message:'请选择客户级别',duration:2})
    				return
    			}
    			var myreg=/^[1][3,4,5,7,8][0-9]{9}$/
    			if(this.name == ''){
    				modal.toast({message:'客户名称不能为空',duration:2})
    				return
    			} else if(this.phone == ''||!myreg.test(this.phone)){
    				modal.toast({message:'请输入正确的手机号',duration:2})
    				return
    			}
    			this.isSave = true
    			var that =this
    			console.log(this.checklabelList)
    			// console.log(oldlabel)
    			// return
    			this.oldlabel.forEach(function(value,key) {
    				var isexist = false
    				that.checklabelList.forEach(function(value1,key1) {   
    					if(value['BUYER_TAG_MAP.BUYER_TAG_ID'] == value1['BUYER_TAG_MAP.BUYER_TAG_ID']){
    						isexist = true
    					} 					
    				})
    				if(!isexist){
    					value['BUYER_TAG_MAP.IS_DEL'] = '1'
    				}
    			})
    			// console.log(this.oldlabel)
    			// return
    			this.checklabelList.forEach(function(value,key) {
    				var isexist = false
    				that.oldlabel.forEach(function(value1,key1) {   
    					if(value['BUYER_TAG_MAP.BUYER_TAG_ID'] == value1['BUYER_TAG_MAP.BUYER_TAG_ID']){
    						isexist = true
    					} 					
    				})
    				if(!isexist){
    					that.oldlabel.push(value)
    				}
    			})
    			var notdel = 0
    			this.oldlabel.forEach(function(value,key) {
					if(value['BUYER_TAG_MAP.IS_DEL']=='-1'){
						notdel++
					}    				
    			})
    			if(notdel==0){
    				this.isSave = false
    				modal.toast({message:'至少添加一个标签',duration:2})
    				return
    			}
    			var x = '日志:'
    			if(this.oldname != this.name){
    				x = x+"把客户名称从"+this.oldname+"修改为"+this.name
    			}
    			if(this.oldphone != this.phone){
    				x = x+",把电话从"+this.oldphone+"修改为"+this.phone
    			}
    			if(this.oldremark != this.remark){
    				x = x+",把备注从"+this.oldremark+"修改为"+this.remark
    			}
    			if(this.oldreceive != this.receiveaddress){
    				x = x+",把收货地址从"+this.oldreceive+"修改为"+this.receiveaddress
    			}
    			if(this.oldadress != this.address){
    				x = x+",把定位地址从"+this.oldadress+"修改为"+this.address
    			}
    			stream.fetch({
		    		method:'POST',
		    		url:this.modifyApi,
		    		body: {
		    			'BUYER.BUYER_LEVEL_ID':this.leavelLists[this.leavelIndex]['BUYER_LEVEL.BUYER_LEVEL_ID'],
		    			'BUYER.LONGITUDE': this.longitude,
		    			'BUYER.LATITUDE': this.latitude,
		    			'BUYER.ADDR_SHENG': this.province,
		    			'BUYER.ADDR_SHI' : this.city,
		    			'BUYER.ADDR_XIAN': this.xian,
		    			'BUYER.ADDR_LU': this.street,
		    			'BUYER.ADDR_DETAIL': this.address==''?'{$empty}':this.address,
		    			'BUYER.BUYER_ID' : this.currentId,
		    			'BUYER.LINKMAN_NAME' : this.name,
		    			'BUYER.LINKMAN_PHONE' : this.phone,
		    			'BUYER.DELIVERY_ADDR_DETAIL':this.receiveaddress==''?'{$null}':this.receiveaddress,
		    			'BUYER.REMARK' : this.remark,
		    			'CHANGE_INFOS' : x,
		    			'BUYER.TAG_LIST' : JSON.stringify(this.oldlabel)
		    		}
		    	},res =>{
		    		this.isSave = false
		    		if(res.code == 0){
		    			modal.toast({message:'修改成功',duration:2})
		    			var ifsuccess = true
		                storage.setItem('renderClient',JSON.stringify(ifsuccess),event =>{
			                setTimeout(()=>{
			                   navigator.pop()
			                },1500) 
			            })
					}
		    	},res=>{
		    		this.isSave = false
	    		})
	    	}
    	}
    };
</script>