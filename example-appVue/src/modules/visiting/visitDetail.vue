<template>	
<bu-view :config="configData" @event="viewEvent">
	<div class="company-info">
		<text class="company-name">{{infos['VISIT_LIST.CLIENT_NAME']}}</text>
		<text class="address">{{infos['VISIT_LIST.CHECK_IN_GPS_NAME']}}</text>
	</div>

	<div class="company-info">
		<div class="visitinfo">
			<text class="visitname">{{infos['VISIT_LIST.USER_NAME']}}</text>
			<image class="dotIcon" :src="dotIcon"></image>
			<text class="visitDistance" v-if="infos['VISIT_LIST.CHECK_OUT_SCOPE']!=null&&parseInt(infos['VISIT_LIST.CHECK_OUT_SCOPE'])||0!=0">签到 {{parseInt(infos['VISIT_LIST.CHECK_OUT_SCOPE'])||0}}km</text>
		</div>
		<!-- <div class="visittime"> -->
		<text class="visittime">{{infos['VISIT_LIST.CHECK_IN_DATETIME']}}～{{infos['VISIT_LIST.CHECK_OUT_DATETIME']}}({{infos['VISIT_LIST.ALL_TIME']}}分钟)</text>
		<!-- </div> -->
	</div>

	<div class="company-info">
		<div class="operatename">
			<text class="operatename-txt">订单</text>
			<text class="operatename-txt">收款</text>
			<text class="operatename-txt">退货</text>
		</div>
		<div class="operatename">
			<text class="operatemoney-txt">¥{{infos['VISIT_LIST.ORDER_MONEY']||0}}</text>
			<text class="operatemoney-txt">¥{{infos['VISIT_LIST.PAY_MONEY']||0}}</text>
			<text class="operatemoney-txt">¥{{infos['VISIT_LIST.RETURN_MONEY']||0}}</text>
		</div>
	</div>

	<div class="company-info">
		<text class="operatename-txt">速记</text>
		<!-- <text class="remark" v-if="JSON.stringify(infos['VISIT_LIST.VISIT_NOTES'])!='{}'">{{infos['VISIT_LIST.VISIT_NOTES']['0']['VISIT_NOTE.CONTENT']}}</text> -->
	</div>
	<div class="camerainfo">
		<text class="camera-txt">拍照</text>
		<div class="camera-index">
			<div class="img-div" v-for="(item,index) in infos['VISIT_LIST.VISIT_PHOTOS']">
				<image class='img' :src="item['VISIT_PHOTO_INFO.URL']" @click="todetail(item)"></image>
				<text class="img-name">{{item['VISIT_PHOTO_INFO.PHOTO_TASK_NAME']}}</text>
			</div>
		</div>
	</div>
	<div class="chooseback" slot="footer" v-if="watchphoto">
		<div class="phototitle">
			<div class="back-div" @click="toback" id="nav">
				<image class="head-back-icon" :src="whiteback"></image>
			</div>
			<div class="title-div">
				<text class='font28 whites txtcen'>{{times}}</text>
				<text class='font28 whites txtcen'>{{taskname}}</text>
			</div>
		</div>
		<image class= "bigphoto" :src="photoinfos['VISIT_PHOTO_INFO.URL']" @click="toback" resize="contain"></image>
		<div class="photoinfo">
			<text class="font28 whites">{{photoinfos['VISIT_PHOTO_INFO.USER_NAME']}}    {{photoinfos['VISIT_PHOTO_INFO.CLIENT_NAME']}}</text>
			<text class="font28 whites">{{photoinfos['VISIT_PHOTO_INFO.ADDRESS']}}</text>
		</div>
	</div>
</bu-view>
</template>	
<style  scoped>
	.title-div{
		flex: 1;
		flex-direction: column;
		padding-top: 55px;
	}
	.txtcen{
		text-align: center;
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
		background-color: rgba(0,0,0,0.6);
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
	.img-name{
		color: #666;
		font-size: 26px;
		flex: 1;
		text-align: center;
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
		padding-top: 50px;
		padding-bottom:20px;
		flex-direction: column;
	}
	.remark{
		font-size: 32px;
		color: #333;
		white-space: pre-wrap;
		margin-top: 30px;
	}
	.operatemoney-txt{
		flex: 1;
		color: #333;
		font-size: 48px;
		font-weight: bold;
	}
	.operatename-txt{
		flex: 1;
		color: #999;
		font-size: 24px;
	}
	.operatename{
		flex-direction: row;
		align-items: center;
		margin-top: 20px
	}
	.visittime{
		font-size: 32px;
		color: #666;
		margin-top: 30px;
	}
	.visitinfo{
		flex-direction: row;
		align-items: center;
	}
	.visitDistance{
		font-size: 28px;
		color:#CF411B
	}
	.visitname{
		font-size: 32px;
		color: #333;
		font-weight: bold;
	}
	.dotIcon{
		width: 12px;
		height: 12px;
		margin-left: 10px;
		margin-right: 10px;
	}
	.address{
		font-size: 32px;
		color: #666;
		white-space: pre-wrap;
	}
	.company-name{
		font-size: 34px;
		color: #333;
		font-weight: bold;
		white-space: pre-wrap;
	}
	.company-info{
		margin-left: 30px;
		width: 690px;
		padding-bottom: 50px;
		padding-top: 50px;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		border-bottom-color: #D8D8D8;
		flex-direction: column;

	}
</style>
<script>

	import buView from '../../components/bu-view.vue'
  	import navigator from '../../common/navigator.js'
  	import modal from '../../common/modal.js'
  	import filters     from '../../common/filters.js'
  	import stream    from '../../common/stream.js'
  	import icon      from '../tagSection/icon/icon.js'
  	const getEvent  = weex.requireModule('event');
  	const locationEvent = weex.requireModule('locationEvent');
	const globalEvent = weex.requireModule('globalEvent');
	const photoEvent = weex.requireModule('photoEvent');
	const storage = weex.requireModule('storage'); 
	export default {
		components:{
            buView,
        },
	    data() {
	      	return {
	      		whiteback     : icon.whiteback,
	      		watchphoto: false,
	      		photoinfos: {},
	      		getdetailApi: '/visit/list/getById',
	      		dotIcon:icon.dotIcon,
	      		configData:{
                    title: '拜访详情',
                    titleAlgin: 'left',
                    secondTitle:'',
                    bottom: '105px',
                    addEvent: '',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: '',
                    loadmore: false,
                    loadmoreEvent:'',
                    viewappear: '',
                },
                infos: {
                	'VISIT_LIST.CHECK_OUT_SCOPE':0
                }
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
	    		// url:'/visit/list/getById?VISIT_LIST.VISIT_LIST_ID=1204',
	    		url:'/visit/list/getById?VISIT_LIST.VISIT_LIST_ID='+self.getDataByUrl('id',bundleUrl),
	    	},res =>{
	    		this.infos = res.data[0];
	    		var x = this.infos['VISIT_LIST.CHECK_OUT_DATETIME'].split(':',3)[0]+":"+this.infos['VISIT_LIST.CHECK_OUT_DATETIME'].split(':',3)[1]
	    		x = x.split('-',3)[1]+"-"+x.split('-',3)[2]
	    		this.infos['VISIT_LIST.CHECK_OUT_DATETIME'] = x
	    		var y = this.infos['VISIT_LIST.CHECK_IN_DATETIME'].split(':',3)[0]+":"+this.infos['VISIT_LIST.CHECK_IN_DATETIME'].split(':',3)[1]
	    		y = y.split('-',3)[1]+"-"+y.split('-',3)[2]
	    		this.infos['VISIT_LIST.CHECK_IN_DATETIME'] = y
	    		var that = this
	    		if(this.infos['VISIT_LIST.VISIT_PHOTOS'].length!=0){
	    			this.infos['VISIT_LIST.VISIT_PHOTOS'].forEach(function(item,index) {
		    			item['VISIT_PHOTO_INFO.URL']= 'http://u.ok.eerrpp.cc/'+item['VISIT_PHOTO_INFO.URL']+'?x-oss-process=image/resize,m_fill,h_200,w_200'
		    			// that.$set(this.infos['VISIT_PHOTO_INFO.EXT_INFO'],index,item)
		    			// console.log(i)
		    		})
	    		}
	    		
	    	})
	    },

    	methods:{
    		viewEvent(name,call){
    			this[name](call)
    		},
    		getData(){

    		},
    		toback(){
				this.watchphoto= false
			},
    		getDataByUrl: function (name, url) {
			  name = name.replace(/[\[\]]/g, "\\$&");
			  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			  results = regex.exec(url); 
			  if (!results) return null;
			  if (!results[2]) return '';
			  return decodeURIComponent(results[2].replace(/\+/g, " "));
			},
			todetail(item){
	    		stream.fetch({
	    			method:'GET',  
	    			url:'/visit/photo/info/getById?VISIT_PHOTO_INFO.VISIT_PHOTO_INFO_ID='+item['VISIT_PHOTO_INFO.VISIT_PHOTO_INFO_ID'],
		    	},res =>{
		    		this.photoinfos = res.data[0];
		    		var x = this.photoinfos['VISIT_PHOTO_INFO.ADD_DATETIME'].split(' ',1)[0];
		    		this.times = x;
		    		this.taskname = this.photoinfos['VISIT_PHOTO_INFO.PHOTO_TASK_NAME'];
		    		this.photoinfos['VISIT_PHOTO_INFO.URL'] = 'http://u.ok.eerrpp.cc/'+this.photoinfos['VISIT_PHOTO_INFO.URL']+'?x-oss-process=image/resize,m_lfit,h_1000,w_770'
		    		this.watchphoto = true
		    	})
    		},
    	}
    };
</script>
