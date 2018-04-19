<template>	
<bu-view :config="configData" @event="viewEvent">
	<div class="companyindex" v-for="(item,key) in companyidList">
		<div class="companyinfo">
			<text class="companyname">{{JSON.parse(companyList[item][0]['content'])['company']}}</text>
			<!-- <text class="times">{{(companyList[item][0]['time']).split(' ',1)[0]}}</text> -->
			<text class="times">{{(companyList[item][0]['time'])}}</text>
		</div>
		<div class="photos-div">
			<div class="photo-div" v-for="(item1,key1) in companyList[item]">
				<div class="photos-index">			
					<image class='photo' :src="item1['base64']" resize="cover"></image>
				</div>
				<text class='photoname'>{{JSON.parse(item1['content'])['picName']}}</text>
			</div>
		</div>
	</div>
	<div class="bottom-index" slot="footer" ng-if="!noData">
		<div class="savebtn" @click="nowupdata">
			<text class="save-text">上传</text>
		</div>
	</div>
	<div class="choose-back" v-if="isloading" slot="footer">
		<text class="loadtxt">正在上传  {{updateNum}}/{{picNum}}</text>
	</div>  
</bu-view>
</template>	
<style  scoped>
	.times{
		font-size: 28px;
		color: #999;
	}
	.companyname{
		font-size: 34px;
		color: #333
	}
	.companyinfo{
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding-left: 30px;
		padding-right: 30px;
		flex: 1
	}
	.companyindex{
		flex-direction: column;
		margin-top: 50px;
		width: 750px;
	}
	.loadtxt{
		color:red;
		font-size: 42px;
		text-align: center;
		width: 750px;
	}
	.choose-back{
		position: absolute;
		z-index: 9999;
		top: 0;
		width: 750px;
		background-color: rgba(0,0,0,0.5);
		/*height: 100%;*/
		bottom: 0;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.takephoto{
		width: 60px;
		height: 52px;
	}
	.save-text{
		text-align: center;
		font-size: 	32px;
		color: #fff;
		line-height: 80px;
	}
	.save-text1{
		text-align: center;
		font-size: 	32px;
		color: #cf411b;
		line-height: 80px;
	}
	.savebtn{
		height: 80px;
		width: 690px;
		background-color: #cf411b;
		border-bottom-left-radius:10px;
		border-bottom-right-radius :10px;
		border-top-left-radius :10px;
		border-top-right-radius:10px;
	}
	.savebtn1{
		height: 80px;
		width: 330px;
		background-color: #FFF;
		border-bottom-left-radius:10px;
		border-bottom-right-radius :10px;
		border-top-left-radius :10px;
		border-top-right-radius:10px;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		border-bottom-color: #cf411b;
		border-top-style: solid;
		border-top-width: 1px;
		border-top-color: #cf411b;
		border-left-style: solid;
		border-left-width: 1px;
		border-left-color: #cf411b;
		border-right-style: solid;
		border-right-width: 1px;
		border-right-color: #cf411b;
	}
	.bottom-index{
		width: 750px;
		flex-direction: row;
		justify-content: space-between;
		padding-left: 30px;
		padding-right: 30px;
		margin-top: 20px;
		position: absolute;
		bottom: 25px
	}
	.savebtn:active{
		background-color: #CF320A;
	}
	.closed{
		width: 42px;
		height: 42px;
		position: absolute;
		top: 0px;
		right: 0px;
	}
	.photo{
		width: 210px;
		height: 210px;
	}
	.photos-div{
		flex-direction : row;
		padding-left: 30px;
		width:750px;
		margin-top: 35px;
    	flex-wrap:wrap;

	}
	.photoname{
		width: 210px;
		text-align: center;
		color: #666;
		font-size: #26px;
		margin-top: 20px;
	}
	.photo-div{
		flex-direction: column;
		margin-bottom: 30px;
		width: 210px;
		margin-right: 29px;
		overflow: visible
	}
	.photos-index{
		align-items: center;
		justify-content: center;
		width: 210px;
		height: 210px;
		border-bottom-left-radius:10px;
		border-bottom-right-radius :10px;
		border-top-left-radius :10px;
		border-top-right-radius:10px;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		border-bottom-color: #DEDEDF;
		border-top-style: solid;
		border-top-width: 1px;
		border-top-color: #DEDEDF;
		border-left-style: solid;
		border-left-width: 1px;
		border-left-color: #DEDEDF;
		border-right-style: solid;
		border-right-width: 1px;
		border-right-color: #DEDEDF;
		overflow: visible;
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
	      		isloading:false,
	      		addApi: '/visit/photo/info/add',
	      		getlistApi: '/visit/photo/task/queryAllNoPhoto',
	      		getallListApi: '/visit/photo/task/queryAll',
	      		delApi: '/visit/photo/info/delById',
	      		isupdate: false,
	      		imgaddress:icon.redgouIcon,
	      		configData:{
                    title: '待上传照片',
                    titleAlgin: 'left',
                    secondTitle:'',
                    bottom: '130px',
                    addEvent: '',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: '',
                    loadmore: false,
                    loadmoreEvent:'',
                    viewappear: '',
                },
                closedIcon: icon.closedIcon,
                takephoto: icon.takephoto,
                clientUid: '',
                operaterUid:'',
                serviceId: '',
                visitId: '',
                lists: [],
                picIndex: 0,
                longitude: '',
                latitude: '',
                address: '',
                clientName: '',
                updateNum: 0,
                picNum: 0,
                companyList: {},
                companyidList:[],
                noData: false
	      	};
	    },
	    created(){
	    	var self = this;
	    	
	    },
	    mounted(){
	    	var num = 0
	    	var that =this;
	    	storage.getItem('login_user_info',event=>{
	    		this.operaterUid = JSON.parse(event.data)['USER.UID'];
	    		this.serviceId = JSON.parse(event.data)['USER.SERVICE_ID'];
	    		var m = {
					'uid': parseInt(this.operaterUid),
					'serviceId': parseInt(this.serviceId),
					'state': 'wait'
				}
				// modal.alert({message:JSON.stringify(m)})
				photoEvent.getOfflinePhotos(m,function(res) {
					// modal.alert({message:res.length})
					if(res.length == 0){
						that.noData = true
					}else{
						that.noData = false
					}
					res.forEach(function(item,key){
						item['base64'] = 'data:image/png;base64,'+item['base64'];
						if(that.companyidList.indexOf(item['meetId'])<0){
							var x= item['meetId']
							that.companyidList.push(x)
						}
					})
					that.lists = res;
					// var that = this;
					that.companyidList.forEach(function(item,key){
						var x =[];
						that.lists.forEach(function(value,index) {
							// if(index==0){
							// 	modal.alert({message:that.serviceId})
							// }
							if(parseInt(value['serviceId'])==parseInt(that.serviceId)){
								// x.push(value)
								if(parseInt(value['meetId'])==parseInt(item)){
									x.push(value)
								}
							}
						})
						that.companyList[item] = x
					})

					// modal.alert({message:that.companyList.length})
				})
	    	})

	    	var s =setTimeout(function(){
	    		globalEvent.addEventListener("uploadImgPool", function (res) {
	    			for(var item in that.companyList){
		    			that.companyList[item].forEach(function(value,key){
		    				if(value['id'] == res['id']){
		    					var m = {
		    						'VISIT_PHOTO_INFO.CLIENT_ID': JSON.parse(res['content'])['companyUid'],
		    						'VISIT_PHOTO_INFO.CLIENT_NAME': JSON.parse(res['content'])['company'],
		    						'VISIT_PHOTO_INFO.VISIT_LIST_ID': JSON.parse(res['content'])['meetId'],
		    						'VISIT_PHOTO_INFO.VISIT_PHOTO_TASK_ID': JSON.parse(res['content'])['taskId'],
		    						'VISIT_PHOTO_INFO.URL': res['ossPath'],
		    						'VISIT_PHOTO_INFO.PHOTO_TASK_NAME': res['VISIT_PHOTO_TASK.TASK_NAME'],
		    						'VISIT_PHOTO_INFO.EXT_INFO':res['exif']
		    					}
		    					stream.fetch({
						    		method:'POST',
						    		url:that.addApi,
						    		body: m
						    	},res =>{
						    		num++;
						    		that.updateNum = num;
						    		if(num==that.picNum){
						    			that.isloading = false;
						    			that.noData = true;
						    			that.companyidList=[];
						    			that.companyList = [];
						    			modal.toast({message:'上传完成',duration:1})
						    			setTimeout(()=>{
						                   navigator.pop()
						                },1500) 
						    		}
						    	})
		    				}
		    			})
		    		}
	    		})
	    	},1000)

	    },

    	methods:{
    		viewEvent(name,call){
    			this[name](call)
    		},
    		getData(){

    		},
    		nowupdata(){
    			var that = this;
    			this.updateNum = 0;
    			for( var item in that.companyList){
    				that.picNum = that.picNum + that.companyList[item].length
    			}
    			if(this.picNum==0){
    				modal.toast({message:'暂无照片可以上传',duration:1})
    				return
    			}
    			for(var item1 in that.companyList){
	    			that.companyList[item1].forEach(function(value,key){
	    				if(value['ossPath']==''){
    						that.isloading = true;
    						photoEvent.uploadImg(parseInt(that.operaterUid),parseInt(that.serviceId),parseInt(value['id']))
	    				}
	    			})
	    		}
    		},
    	}	
    };
</script>
