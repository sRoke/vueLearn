<template>	
<div class="item" v-if=" show == 0">
		<div class="date-bar">
			<div class="nextday-div" @click="choooseday(-1)">
				<image class="predayIcon" :src="preday"></image>
			</div>
			<text class="dateTxt">{{datetime}}</text>
			<div class="nextday-div" @click="choooseday(1)" >
				<image class="nextdayIcon" :src="nextday" v-if="today!=datetime"></image>
			</div>
		</div>
		<div class="content">
			<div class="visit-index" v-for="(item,index) in lists" @click="todetail(item)">
				<div class="content-head">
					<image class='head-img' :src="headimage"></image>
					<div class="company-info">
						<text class='visitName'>{{item['VISIT_LIST.USER_NAME']}}</text>
						<text class="visitCompany">{{item['VISIT_LIST.CLIENT_NAME']}}</text>
					</div>
				</div>
				<div class="content-body">
					<div class="pay-record-div" v-if="item['VISIT_LIST.ORDER_MONEY']!=null&&item['VISIT_LIST.RETURN_MONEY']!=null">
						<text class="pay-record1">订单 ¥{{item['VISIT_LIST.ORDER_MONEY']}}</text>
						<text class="pay-record">退款 ¥{{item['VISIT_LIST.RETURN_MONEY']}}</text>
					</div>
					<text class="remark" v-if="JSON.stringify(item['VISIT_LIST.VISIT_NOTES'])!='{}'">{{item['VISIT_LIST.VISIT_NOTES']['0']['VISIT_NOTE.CONTENT']}}</text>
					<div class="img-indexs">
						<image class="show-img" :class="[item['VISIT_LIST.VISIT_PHOTOS'].length<=1?'one-img':'half-img']" v-for="(value,key) in item['VISIT_LIST.VISIT_PHOTOS']" :src="value['VISIT_PHOTO_INFO.URL']" @click="watchimg(value)"></image>
						<!-- <image class="show-img" v-for="(value,key) in item['VISIT_LIST.VISIT_PHOTOS']" :src="value['VISIT_PHOTO_INFO.URL']"></image> -->
					</div>
					<div class="visitinfo" v-if="item['VISIT_LIST.CHECK_IN_GPS_NAME']!=null&&item['VISIT_LIST.CHECK_IN_GPS_NAME']!=''">
						<text class="address">{{item['VISIT_LIST.CHECK_IN_GPS_NAME']}}</text>
						<text class="visitDistance" v-if="parseInt(item['VISIT_LIST.CHECK_IN_SCOPE'])>0 &&item['VISIT_LIST.CHECK_IN_SCOPE']!=null">签到偏移{{parseInt(item['VISIT_LIST.CHECK_IN_SCOPE'])}}km</text>
						<text class="visitDistance" v-if="parseInt(item['VISIT_LIST.CHECK_OUT_SCOPE'])>0 &&item['VISIT_LIST.CHECK_OUT_SCOPE']!=null">签退偏移{{parseInt(item['VISIT_LIST.CHECK_OUT_SCOPE'])}}km</text>
					</div>
					<text class="visit-time">{{item['VISIT_LIST.CHECK_IN_DATETIME']}}～{{item['VISIT_LIST.CHECK_OUT_DATETIME']}}({{parseInt(item['VISIT_LIST.ALL_TIME'])}}分钟)</text>
				</div>
			</div>
		</div>
</div>
</template>	
<style  scoped>
	.visit-time{
		color: #333;
		font-size: 28px;
		margin-top: 15px;
	}
	.one-img{
		width: 350px;
		height: 350px;
	}
	.half-img{
		width: 280px;
		height: 280px;
	}
	.nextday-div{
		width: 100px;
		height: 110px;
		justify-content: center;
	}
	.visitDistance{
		font-size: 24px;
		color:#CF411B
	}
	.address{
		font-size: 26px;
		color: #666;
		white-space: pre-wrap;
		flex: 1
	}
	.dotIcon{
		width: 12px;
		height: 12px;
		margin-left: 10px;
		margin-right: 10px;
		margin-top: 12px;
	}
	.visitinfo{
		flex-direction: column;
		/*align-items: center;*/
		margin-top: 10px;
	}
	.show-img{
		/*margin-right: 20px;*/
		margin-bottom: 20px;
	}
	.img-indexs{
		flex-direction: row;
		justify-content: space-between;
		flex-wrap: wrap;
		margin-top: 20px;
	}
	.remark{
		font-size: 30px;
		color: #333
	}
	.pay-record{
		margin-left: 35px;
		color: #CF411B;
		font-size: 28px;
	}
	.pay-record1{
		margin-left: 0;
		color: #CF411B;
		font-size: 28px;
	}
	.pay-record-div{
		flex-direction: row;
	}
	.content-body{
		flex-direction: column;
		padding-top: 30px;
		padding-left: 100px;
	}
	.visitCompany{
		font-size: 32px;
		color: #333;
		font-weight: bold;
	}
	.visitName{
		font-size: 28px;
		color: #666;
	}
	.company-info{
		flex-direction: column;
		flex: 1;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		border-bottom-color: #D8D8D8;
		padding-bottom: 30px
	}
	.content-head{
		flex-direction: row;

	}
	.visit-index{
		flex-direction: column;
		padding-top: 50px;
		padding-bottom: 50px;
		border-top-style: solid;
		border-top-width: 1px;
		border-top-color: #D8D8D8
	}
	.head-img{
		width: 80px;
		height: 80px;
		margin-right: 20px;
	}
	.content{
		flex-direction: column;
		padding-left: 30px;
		padding-right:30px;
	}
	.date-bar{
		height: 110px;
		width: 690px;
		margin-left: 30px;
		flex-direction: row;
		justify-content: space-between;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		border-bottom-color: #D8D8D8;
		align-items: center;
	}
	.dateTxt{
		color: #333;
		font-size: 28px;
		text-align: center;
		align-items: center;
		flex: 1;
	}
	.predayIcon{
		width: 47px;
		height: 47px;
	}
	.nextdayIcon{
		width: 47px;
		height: 47px;
		margin-left: 53px;
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
	      		whiteback     : icon.whiteback,
	      		watchphoto: false,
	      		visitApi: '/visit/list/queryAllByDate',
	      		detailvisitpage: '/modules/visiting/visitDetail',
	      		photolistPage: '/modules/visiting/photoList',
	      		camerainfoPage: '',
	      		visitstaticPage: '/modules/visiting/visitStatistics',
	      		nextday: icon.nextday,
	      		preday: icon.preday,
	      		dotIcon:icon.dotIcon,
	      		headimage:icon.headimage,
	      		camerainfo: icon.camerainfo,
	      		historycheck: icon.historycheck,
	      		visitstatic: icon.visitstatic,
	      		imgaddress:icon.redgouIcon,
                closedIcon: icon.closedIcon,
                datetime:'',
                lists: [],
                today: '',
                nowtime: '',
                photoinfos: {},
	      	};
	    },
	    props:['show'],
    	methods:{
    		getlist(){
    			var date = new Date();
		    	this.nowtime = new Date();
		        var seperator1 = "-";
		        var year = date.getFullYear();
		        var month = date.getMonth() + 1;
		        var strDate = date.getDate();
		        if (month >= 1 && month <= 9) {
		            month = "0" + month;
		        }
		        if (strDate >= 0 && strDate <= 9) {
		            strDate = "0" + strDate;
		        }
		        var currentdate = year + seperator1 + month + seperator1 + strDate;
		        this.datetime = currentdate;
		        this.today = currentdate;
		        // var x = this.datatime.replace(/-/g,' ')
		        // console.log(x)
		        stream.fetch({
		    		method:'POST',
		    		url:this.visitApi,
		    		body: {
		    			'VISIT_LIST.START_DATETIME': this.datetime+' 0:0:01',
		    			'VISIT_LIST.END_DATETIME': this.datetime+' 23:59:59',
		    		}
		    	},res =>{
		    		this.lists = res.data;
		    		var that = this;
		    		// if(JSON.stringify(this.lists['VISIT_LIST.VISIT_PHOTOS'])=='{}'){}
		    		this.lists.forEach(function(item,index){
		    			var m = item['VISIT_LIST.CHECK_IN_DATETIME'].split(' ',2)[1];
		    				m = m.split(':',3)[0]+":"+m.split(':',3)[1];
		    			item['VISIT_LIST.CHECK_IN_DATETIME'] = m;
		    			if(item['VISIT_LIST.CHECK_OUT_DATETIME'] == null){
		    				item['VISIT_LIST.CHECK_OUT_DATETIME'] = '拜访中'
		    			} else{
		    				var x = item['VISIT_LIST.CHECK_OUT_DATETIME'].split(' ',2)[1];
		    				x = x.split(':',3)[0]+":"+x.split(':',3)[1];
		    				item['VISIT_LIST.CHECK_OUT_DATETIME'] =  x
		    			}
		    			if(JSON.stringify(item['VISIT_LIST.VISIT_PHOTOS'])=="{}"){
		    				item['VISIT_LIST.VISIT_PHOTOS'] = []
		    			}else{
		    				item['VISIT_LIST.VISIT_PHOTOS'].forEach(function(value,key){
		    					value['VISIT_PHOTO_INFO.URL'] = 'http://u.ok.eerrpp.cc/'+value['VISIT_PHOTO_INFO.URL']+'?x-oss-process=image/resize,m_fill,h_200,w_200'
		    				})
		    			}
		    		})
		    	})
    		},
    		choooseday(key){
    			console.log(key)
    			if(key==1){
    				if(this.datetime!=this.today){
						this.nowtime.setDate(this.nowtime.getDate()+1);
						var seperator1 = "-";
				        var year = this.nowtime.getFullYear();
				        var month = this.nowtime.getMonth() + 1;
				        var strDate = this.nowtime.getDate();
				        if (month >= 1 && month <= 9) {
				            month = "0" + month;
				        }
				        if (strDate >= 0 && strDate <= 9) {
				            strDate = "0" + strDate;
				        }
				        var currentdate = year + seperator1 + month + seperator1 + strDate;
				        // if(this.today == this.datetime){
				        // 	this.datetime = '昨天';
				        // }else{
				        	this.datetime = currentdate;
				        // }
				        stream.fetch({
				    		method:'POST',
				    		url:this.visitApi,
				    		body: {
				    			'VISIT_LIST.START_DATETIME': this.datetime+' 0:0:01',
				    			'VISIT_LIST.END_DATETIME': this.datetime+' 23:59:59',
				    		}
				    	},res =>{
				    		this.lists = res.data;
				    		this.lists.forEach(function(item,index){
				    			if(JSON.stringify(item['VISIT_LIST.VISIT_PHOTOS'])=="{}"){
				    				item['VISIT_LIST.VISIT_PHOTOS'] = []
				    			}else{
				    				item['VISIT_LIST.VISIT_PHOTOS'].forEach(function(value,key){
				    					value['VISIT_PHOTO_INFO.URL'] = 'http://u.ok.eerrpp.cc/'+value['VISIT_PHOTO_INFO.URL']+'?x-oss-process=image/resize,m_fill,h_200,w_200'
				    				})
				    			}
				    		})
				    		console.log(this.lists)
				    	})
    				}
    			}else if(key == -1){
					this.nowtime.setDate(this.nowtime.getDate()-1);
					var seperator1 = "-";
			        var year = this.nowtime.getFullYear();
			        var month = this.nowtime.getMonth() + 1;
			        var strDate = this.nowtime.getDate();
			        if (month >= 1 && month <= 9) {
			            month = "0" + month;
			        }
			        if (strDate >= 0 && strDate <= 9) {
			            strDate = "0" + strDate;
			        }
			        var currentdate = year + seperator1 + month + seperator1 + strDate;
			        // if(this.today == this.datetime){
			        // 	this.datetime = '昨天';
			        // }else{
			        	this.datetime = currentdate;
			        // }
			        stream.fetch({
			    		method:'POST',
			    		url:this.visitApi,
			    		body: {
			    			'VISIT_LIST.START_DATETIME': this.datetime+' 0:0:01',
			    			'VISIT_LIST.END_DATETIME': this.datetime+' 23:59:59',
			    		}
			    	},res =>{
			    		this.lists = res.data;
			    		this.lists.forEach(function(item,index){
			    			if(JSON.stringify(item['VISIT_LIST.VISIT_PHOTOS'])=="{}"){
			    				item['VISIT_LIST.VISIT_PHOTOS'] = []
			    			}else{
			    				item['VISIT_LIST.VISIT_PHOTOS'].forEach(function(value,key){
			    					value['VISIT_PHOTO_INFO.URL'] = 'http://u.ok.eerrpp.cc/'+value['VISIT_PHOTO_INFO.URL']+'?x-oss-process=image/resize,m_fill,h_200,w_200'
			    				})
			    			}
			    		})
			    		console.log(this.lists)
			    	})
    			}
    		},
    		todetail(item){
    			// console.log(item)
    			navigator.push({
    				url: this.detailvisitpage,
    				query: '?id='+item['VISIT_LIST.VISIT_LIST_ID']
    			},res=>{})
    		},
    		watchimg(value){
    			// console.log(value)
    			// return
	    		stream.fetch({
	    			method:'GET',  
	    			url:'/visit/photo/info/getById?VISIT_PHOTO_INFO.VISIT_PHOTO_INFO_ID='+value['VISIT_PHOTO_INFO.VISIT_PHOTO_INFO_ID'],
		    	},res =>{
		    		this.photoinfos = res.data[0];
		    		var x = this.photoinfos['VISIT_PHOTO_INFO.ADD_DATETIME'];
		    		this.times = x;
		    		this.taskname = this.photoinfos['VISIT_PHOTO_INFO.PHOTO_TASK_NAME'];
		    		this.photoinfos['VISIT_PHOTO_INFO.URL'] = 'http://u.ok.eerrpp.cc/'+this.photoinfos['VISIT_PHOTO_INFO.URL']+'?x-oss-process=image/resize,m_lfit,h_1000,w_770'
		    		this.watchphoto = true
		    		var imginfo = {
			    		"times": this.times,
			    		"taskname": this.taskname,
			    		"imgurl": this.photoinfos['VISIT_PHOTO_INFO.URL'],
			    		'imgaddress': this.photoinfos['VISIT_PHOTO_INFO.ADDRESS'],
			    		'clientname': this.photoinfos['VISIT_PHOTO_INFO.CLIENT_NAME'],
			    		'visitname': this.photoinfos['VISIT_PHOTO_INFO.USER_NAME']
			    	}
			    	this.$emit('watchimg',imginfo)
		    	})
    		},
    		toback(){
				this.watchphoto= false
			},
    	}	
    };
</script>
