<template>
	<bu-view :config="configData" @event="eventName">
		<div class="date-bar">
			<div class="nextday-div" @click="choooseday(-1)">
				<image class="predayIcon" :src="preday"></image>
			</div>
			<text class="dateTxt">{{datetime}}</text>
			<div class="nextday-div" @click="choooseday(1)" >
				<image class="nextdayIcon" :src="nextday" v-if="today!=datetime"></image>
			</div>
		</div>
		<div class="visitindex" v-for="(item,index) in showlists" >
			<div class="dots">
				<div class="dotsindex" v-if="index!=0">

					<div class="gray-dot"></div>
					<div class="gray-dot"></div>
					<div class="gray-dot"></div>
					<div class="gray-dot"></div>
					<div class="gray-dot"></div>
					<div class="gray-dot"></div>
				</div>
			</div>
			<div class="visitinfo" :style="{height:item['HEIGHT']+'px'}">
				<div class="left-line">
					<div class="red-dot"></div>
					<div class="red-line"></div>
					<div class="red-dot"></div>
				</div>
				<div class="infos">
					<div class="start-div">
						<image class="startTime-icon" :src="startTime"></image>
						<text class="start-time">{{item['VISIT_LIST.CHECK_IN_DATETIME']}}</text>
					</div>
					
					<text class="companyname">{{item['VISIT_LIST.CLIENT_NAME']}}</text>
					<div class="infos-img" v-if="item['VISIT_LIST.PHOTO_NUM']||0!=0">
						<text class="img-txt">拍照 {{item['VISIT_LIST.PHOTO_NUM']||0}}张</text>
					</div>
					<div class="infos-img">
						<text class="img-txt" v-if="item['VISIT_LIST.ORDER_MONEY']||0!=0">订单 ¥{{item['VISIT_LIST.ORDER_MONEY']||0}}</text>
						<text class="img-txt" v-if="item['VISIT_LIST.RETURN_MONEY']||0!=0">退单 ¥{{item['VISIT_LIST.RETURN_MONEY']||0}}</text>
						<text class="img-txt" v-if="item['VISIT_LIST.PAY_MONEY']||0!=0">收款 ¥{{item['VISIT_LIST.PAY_MONEY']||0}}</text>
					</div>
					<div class="end-time">
						<image class="endTime-icon" :src="endTime"></image>
						<text class="start-time" v-if="item['VISIT_LIST.CHECK_OUT_DATETIME']==null">拜访中</text>
						<text class="start-time" v-if="item['VISIT_LIST.CHECK_OUT_DATETIME']!=null">结束 {{item['VISIT_LIST.CHECK_OUT_DATETIME']}}</text>
						<text class="all-time" v-if="item['VISIT_LIST.ALL_TIME']>=0&&item['VISIT_LIST.CHECK_OUT_DATETIME']!=null">停留{{item['VISIT_LIST.ALL_TIME']}}分钟</text>
					</div>
				</div>
			</div>
			<div class="dots" >
				<div class="dotsindex" v-if="aboutTimes[index]['MINUTE']>=0">
					<div class="gray-dot"></div>
					<div class="gray-dot"></div>
					<div class="gray-dot"></div>
					<div class="gray-dot"></div>
					<div class="gray-dot"></div>
					<div class="gray-dot"></div>
				</div>
			</div>
			<div class="times" v-if="aboutTimes[index]['MINUTE']>=0" :style="{height:aboutTimes[index]['HEIGHTS']+'px'}">
				<div class="left-dot">
					<div class="gray-dot"></div>
					<div class="gray-dot"></div>
					<div class="gray-dot"></div>
					<div class="gray-dot"></div>
					<div class="gray-dot"></div>
					<div class="gray-dot"></div>
					<div class="gray-dot"></div>
					<div class="gray-dot"></div>
					<div class="gray-dot"></div>
					<div class="gray-dot"></div>
					<div class="gray-dot"></div>
					<div class="gray-dot"></div>
					<div class="gray-dot"></div>
					<div class="gray-dot"></div>
					<div class="gray-dot"></div>
					<div class="gray-dot"></div>
					<div class="gray-dot"></div>
					<div class="gray-dot"></div>
					<div class="gray-dot"></div>
					<div class="gray-dot"></div>
					<div class="gray-dot"></div>
					<div class="gray-dot"></div>
					<div class="gray-dot"></div>
					<div class="gray-dot"></div>

				</div>
				<div class="times-info">
					<image class='run' :src="run"></image> 
					<text class='distance-time'>{{aboutTimes[index]['MINUTE']}}分钟</text>
				</div>
			</div>
		</div>
	</bu-view>
</template>		
<style  scoped>
	.endTime-icon{
		width: 21px;
		height: 27px;
		margin-top: 7px;
	}
	.start-div{
		flex-direction: row;
		align-items: center;
		margin-bottom: 25px;
	}
	.startTime-icon{
		width: 23px;
		height: 29px;
	}
	.dotsindex{
		flex: 1;
		flex-direction: column;
	}
	.dots{
		height: 50px;
		flex-direction: column;
		padding-left: 30px;
	}
	.gray-dot{
		background-color: #D9DBDC;
		width: 6px;
		height: 6px;
		border-bottom-left-radius:6px;
		border-bottom-right-radius :6px;
		border-top-left-radius :6px;
		border-top-right-radius:6px;
		margin-top: 6px;
		margin-left: 4px;
	}
	.left-dot{
		width: 40px;
		overflow: hidden;
	}
	.times-info{
		flex-direction: row;
		flex: 1;
	}
	.distance-time{
		font-size: 30px;
		color: #333;
		margin-left: 5px;
	}
	.run{
		width: 21px;
		height: 35px;
	}
	.times{
		width: 750px;
		padding-left: 30px;
		background-color: #FBFBFA;
		flex-direction: row;
		align-items: center;
		overflow: hidden;
	}
	.all-time{
		margin-left: 20px;
		color: #FFF;
		font-size: 30px;
		background-color: #D96749;
	}
	.end-time{
		flex-direction: row;
		margin-top: 40px;
	}
	.img-txt{
		color: #666;
		font-size: 32px;
		margin-bottom: 5px;
		margin-right: 20px;
	}
	.infos-img{
		flex-direction: row;
		/*justify-content: ;*/
		align-items: center;
	}
	.companyname{
		color: #333;
		font-size: 34px;
		margin-bottom: 20px;
		font-weight: bold;
	}
	.head-right-icon{
		width: 14px;
		height: 24px;
	}
	.start-time1{
		background-color: #D96749;
		font-size:30px;
		width: 180px;
		text-align: center;
		color: #fff
	}
	.start-time{
		color: #CF411B;
		font-size:30px;
		width: 180px;
		margin-left: 10px;
	}
	.infos{
		flex-direction: column;
		flex: 1;
		justify-content:space-between;
	}
	.red-line{
		width: 4px;
		flex: 1;
		background-color: #D96749;
		margin-left: 5px;
	}
	.red-dot{
		background-color: #D96749;
		width: 14px;
		height: 14px;
		border-bottom-left-radius:14px;
		border-bottom-right-radius :14px;
		border-top-left-radius :14px;
		border-top-right-radius:14px;
	}
	.left-line{
		width: 40px;
		flex-direction: column;
		padding-top: 15px;
		padding-bottom:15px;
	}
	.visitinfo{
		background-color: #fff;
		padding-left: 30px;
		padding-right: 30px;
		flex-direction: row;
	}

	.visitindex{
		flex-direction: column;
	}
	.visitindex:first-child{
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
	import buView from '../../components/bu-view.vue'
  	import navigator from '../../common/navigator.js'
  	import modal     from '../../common/modal.js'
  	import stream    from '../../common/stream.js'
  	import icon      from '../tagSection/icon/icon.js'

  	const getEvent  = weex.requireModule('event');
	export default {
		components: {
			buView
		 },
	    data() {
	      	return {
	      		endTime:icon.endTime,
	      		startTime:icon.startTime,
	      		run: icon.run,
	      		nextday: icon.nextday,
	      		preday: icon.preday,
	      		configData:{
                    title: '拜访统计',
                    titleAlgin: 'left',
                    secondTitle:'',
                    bottom: '0px',
                    addEvent: '',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: '',
                    loadmore: true,
                    loadmoreEvent:'refresh'
                },
                currentpage: 1,
                pagesize: 30,
                datetime: '',
                today: '',
                nowtime: '',
                currentUid: '',
                lists: [],
                showlists: [],
                aboutTimes: [],    	
            };
	    },
	    created(){
	    },
	    mounted(){
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
	    	var self = this;
	    	var bundleUrl = self.$getConfig().bundleUrl;
	    	stream.fetch({
	    		method:'POST',
	    		url:'/visit/list/getByUid',
	    		body:{	
	    				// 'VISIT_LIST.UID': 6112,
	    				'VISIT_LIST.UID': self.getDataByUrl('id',bundleUrl),
	    				'VISIT_LIST.START_DATETIME': this.datetime+' 0:0:01',
	    				'VISIT_LIST.END_DATETIME': this.datetime+' 23:59:59'
	    			}
	    	},res =>{
	    		this.lists = res.data;
	    		this.configData['title'] = this.lists[0]['VISIT_LIST.USER_NAME']
	    		var that = this 
	    		this.lists.forEach(function(item,index){
	    			// console.log(item['VISIT_LIST.CHECK_IN_DATETIME'].split(' ')[1].split(':',2).join(':'))
	    			if(item['MINUTE']==undefined){
	    				item['VISIT_LIST.CHECK_IN_DATETIME'] = item['VISIT_LIST.CHECK_IN_DATETIME'].split(' ')[1].split(':',2).join(':');
	    				if(item['VISIT_LIST.CHECK_OUT_DATETIME']!=null){
	    					item['VISIT_LIST.CHECK_OUT_DATETIME'] = item['VISIT_LIST.CHECK_OUT_DATETIME'].split(' ')[1].split(':',2).join(':');
	    				}
	    				if (item['VISIT_LIST.ALL_TIME']!=null) {
	    					var m  = 317+parseInt(item['VISIT_LIST.ALL_TIME'])
	    				}else{
	    					var m = 317
	    				}
						item['HEIGHT'] = m>617?617:m
	    				that.showlists.push(item)
	    			} else{
	    				if(item['MINUTE']>30){
	    					var x = item['MINUTE']-30+92
	    					item['HEIGHTS'] = x>292?292:x
	    				}else{
	    					item['HEIGHTS']=92
	    				}
	    				that.aboutTimes.push(item)
	    			}
	    			
	    		})
	    		// console.log(this.showlists)
	    		var x = {
	    			'MINUTE': -1
	    		}
	    		this.aboutTimes.push(x)
	    	})
	    },

    	methods:{
    		getDataByUrl: function (name, url) {
			  name = name.replace(/[\[\]]/g, "\\$&");
			  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			  results = regex.exec(url); 
			  if (!results) return null;
			  if (!results[2]) return '';
			  return decodeURIComponent(results[2].replace(/\+/g, " "));
			},
    		eventName(name,call){
    			this[name](call)
    		},
    		refresh(call){
    			// this.currentpage++
    			// stream.fetch({
		    	// 	method:'POST',
		    	// 	url:this.getlistApi,
		    	// 	body:{	
		    	// 			'PAGE_SIZE':this.pagesize,
		    	// 			'PN': this.currentpage,
		    	// 			'ORDER_TYPE':this.sortType,
		    	// 		  }
		    	// },res =>{
		    	// 	this.list = this.list.concat(res.data)
		    	// },res=>{
		    	// 	call()
		    	// })
		    	
    		},
    		choooseday(key){
    			// console.log(key)
    			this.showlists= [];
    			this.aboutTimes = [];
    			var self = this;
	    		var bundleUrl = self.$getConfig().bundleUrl;
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
				    		url:'/visit/list/getByUid',
				    		body:{	
				    				// 'VISIT_LIST.UID': 8560,
				    				'VISIT_LIST.UID': self.getDataByUrl('id',bundleUrl),
				    				'VISIT_LIST.START_DATETIME': this.datetime+' 0:0:01',
				    				'VISIT_LIST.END_DATETIME': this.datetime+' 23:59:59'
				    			}
				    	},res =>{
				    		this.lists = res.data;
				    		this.configData['title'] = this.lists[0]['VISIT_LIST.USER_NAME']
				    		var that = this 
				    		this.lists.forEach(function(item,index){
				    			// console.log(item['VISIT_LIST.CHECK_IN_DATETIME'].split(' ')[1].split(':',2).join(':'))
				    			if(item['MINUTE']==undefined){
				    				item['VISIT_LIST.CHECK_IN_DATETIME'] = item['VISIT_LIST.CHECK_IN_DATETIME'].split(' ')[1].split(':',2).join(':');
				    				if(item['VISIT_LIST.CHECK_OUT_DATETIME']!=null){
				    					item['VISIT_LIST.CHECK_OUT_DATETIME'] = item['VISIT_LIST.CHECK_OUT_DATETIME'].split(' ')[1].split(':',2).join(':');
				    				}
				    				if(item['VISIT_LIST.ALL_TIME']!=null){
				    					var m  = 317+parseInt(item['VISIT_LIST.ALL_TIME'])
				    				}else{
				    					var m = 317
				    				}
	    							item['HEIGHT'] = m>617?617:m
				    				that.showlists.push(item)
				    			} else{
				    				if(item['MINUTE']>30){
				    					var x = item['MINUTE']-30+92
				    					item['HEIGHTS'] = x>292?292:x
				    				}else{
			    						item['HEIGHTS']=92
			    					}
				    				that.aboutTimes.push(item)
				    			}
				    			
				    		})
				    		// console.log(this.showlists)
				    		var x = {
				    			'MINUTE': -1
				    		}
				    		this.aboutTimes.push(x)
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
			    		url:'/visit/list/getByUid',
			    		body:{	
			    				// 'VISIT_LIST.UID': 8560,
			    				'VISIT_LIST.UID': self.getDataByUrl('id',bundleUrl),
			    				'VISIT_LIST.START_DATETIME': this.datetime+' 0:0:01',
			    				'VISIT_LIST.END_DATETIME': this.datetime+' 23:59:59'
			    			}
			    	},res =>{
			    		this.lists = res.data;
			    		this.configData['title'] = this.lists[0]['VISIT_LIST.USER_NAME']
			    		var that = this 
			    		this.lists.forEach(function(item,index){
			    			// console.log(item['VISIT_LIST.CHECK_IN_DATETIME'].split(' ')[1].split(':',2).join(':'))
			    			if(item['MINUTE']==undefined){
			    				item['VISIT_LIST.CHECK_IN_DATETIME'] = item['VISIT_LIST.CHECK_IN_DATETIME'].split(' ')[1].split(':',2).join(':');
			    				if(item['VISIT_LIST.CHECK_OUT_DATETIME']!=null){
			    					item['VISIT_LIST.CHECK_OUT_DATETIME'] = item['VISIT_LIST.CHECK_OUT_DATETIME'].split(' ')[1].split(':',2).join(':');
			    				}
			    				if (item['VISIT_LIST.ALL_TIME']!=null) {
			    					var m  = 317+parseInt(item['VISIT_LIST.ALL_TIME'])
			    				}else{
			    					var m = 317
			    				}
	    						item['HEIGHT'] = m>617?617:m
			    				that.showlists.push(item)
			    			} else{
			    				if(item['MINUTE']>30){
			    					var x = item['MINUTE']-30+92
			    					item['HEIGHTS'] = x>292?292:x
			    				}else{
			    					item['HEIGHTS']=92
			    				}
			    				that.aboutTimes.push(item)
			    			}
			    			
			    		})
			    		// console.log(this.showlists)
			    		var x = {
			    			'MINUTE': -1
			    		}
			    		this.aboutTimes.push(x)
			    	})
    			}
    		},
    		
    	}
    };
</script>