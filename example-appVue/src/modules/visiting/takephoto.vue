<template>	
<bu-view :config="configData" @event="viewEvent">
	<div class="photos-div">
		<div class="photo-div" v-for="(item,key) in lists" @click="takepic(key)">
			<div class="photos-index">			
				<image class='photo' :src="item['picUrl']" v-if="item['isupdate']" resize="cover"></image>
				<image class="takephoto" :src="takephoto" v-if="!item['isupdate']" ></image>
			</div>
			<image class='closed' :src="closedIcon" v-if="item['isupdate']" @click="del(key)"></image>
			<text class='photoname'>{{item['VISIT_PHOTO_TASK.TASK_NAME']}}</text>
		</div>
	</div>
	<div class="bottom-index" slot="footer">
		<div class="savebtn1" @click="waitupdate">
			<text class="save-text1">稍后上传</text>
		</div>
		<div class="savebtn" @click="nowupdata">
			<text class="save-text">立即上传</text>
		</div>
	</div>
	<div class="choose-back" v-if="isloading" slot="footer">
		<text class="loadtxt">正在上传  {{updateNum}}/{{picNum}}</text>
	</div>  
</bu-view>
</template>	
<style  scoped>
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
		width: 330px;
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
	      		waitPage:'/modules/visiting/waitupdataImg',
	      		addApi: '/visit/photo/info/add',
	      		getlistApi: '/visit/photo/task/queryAllNoPhoto',
	      		getallListApi: '/visit/photo/task/queryAll',
	      		delApi: '/visit/photo/info/delById',
	      		isupdate: false,
	      		imgaddress:icon.redgouIcon,
	      		configData:{
                    title: '水印拍照',
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
                closedIcon: icon.closedIcon,
                takephoto: icon.takephoto,
                clientUid: '',
                // operaterUid:'5361',
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
                currentNum:0,
                localNum:0
	      	};
	    },
	    created(){
	    	var self = this;
	    	
	    },
	    mounted(){
	    	var num = 0
	    	storage.getItem('visitInfo',event=>{
	    		this.visitId = JSON.parse(event.data)['VISIT_LIST.VISIT_LIST_ID'];
	    		this.longitude = JSON.parse(event.data)['VISIT_LIST.LONGITUDE'];
	    		this.latitude = JSON.parse(event.data)['VISIT_LIST.LATITUDE'];
	    		this.address = JSON.parse(event.data)['VISIT_LIST.ADDR_DETAIL'];
	    		this.clientName = JSON.parse(event.data)['VISIT_LIST.CLIENT_NAME'];
	    		this.clientUid = JSON.parse(event.data)['VISIT_LIST.CLIENT_ID'];
	    		this.getData()
	    	})
	    	storage.getItem('login_user_info',event=>{
	    		this.operaterUid = JSON.parse(event.data)['USER.UID'];
	    		this.serviceId = JSON.parse(event.data)['USER.SERVICE_ID'];

	    	})
	    	stream.fetch({
	    		method:'GET',
	    		url:'/visit/photo/task/queryAll?VISIT_PHOTO_TASK.VISIT_LIST_ID='+this.visitId,
	    	},res =>{
	    		var arr = res.data;
	    		arr.forEach(function(value,key) {
	    				value['isupdate'] = false;
	    				value['picAddress'] = '';
	    				value['picUrl'] = '';
	    				value['ossUrl'] = '';
	    				value['exif'] = '';
	    		})
	    		this.lists = arr;
	    		// console.log(this.lists)
	    		// modal.alert({message:this.lists.length})
	    	},res=>{
	    		var m = {
    				'uid': parseInt(this.operaterUid),
    				'serviceId': parseInt(this.serviceId),
    				'meetId': parseInt(this.visitId)
    			}
    			var that = this
    			photoEvent.getOfflinePhotos(m,function(res) {
    				res.forEach(function(item,key){
    					that.lists.forEach(function(value,index){
    						if(JSON.parse(item['content'])['picName']==value['VISIT_PHOTO_TASK.TASK_NAME']){
    							value['picUrl'] = 'data:image/png;base64,'+item['base64']
    							value['ossUrl'] = item['ossPath']
    							value['isupdate'] = true;
    							value['picId'] = item['id']
    							that.$set(that.lists,index,value)
    						}
    					})
    				})
    			})
	    	})
	    	
	    	
	    	var that =this
	    	var x =setTimeout(function(){
	    		globalEvent.addEventListener("takePhotoPool", function (res) {
	    			that.lists[that.picIndex]['picUrl'] = 'data:image/png;base64,'+res['base64'];
	    			that.lists[that.picIndex]['isupdate'] = true;
	    			that.lists[that.picIndex]['picId'] = res['id'];
	    			that.$set(that.lists,that.picIndex,that.lists[that.picIndex])
	    		})
	    	},1000)
	    	var s =setTimeout(function(){
	    		globalEvent.addEventListener("uploadImgPool", function (res) {
	    			that.lists.forEach(function(value,key) {
	    				if(value['picId'] == res['id']){
	    					value['ossUrl'] = res['ossPath']
	    					value['exif'] = res['exif']
	    				}
	    			})
	    			that.localNum++
	    			if(that.localNum==that.picNum){
			    		that.currentNum = 0;
			    		that.updateimgs(that.lists)
			    	}
	    		})
	    	},1000)

	    },

    	methods:{
    		updateimgs(list){
				if(this.currentNum==this.picNum){
	                return ;
	            }
	            var  value = list[this.currentNum];
	            var m = {
					'VISIT_PHOTO_INFO.CLIENT_ID': this.clientUid,
					'VISIT_PHOTO_INFO.CLIENT_NAME': this.clientName,
					'VISIT_PHOTO_INFO.VISIT_LIST_ID': this.visitId,
					'VISIT_PHOTO_INFO.VISIT_PHOTO_TASK_ID': value['VISIT_PHOTO_TASK.VISIT_PHOTO_TASK_ID'],
					'VISIT_PHOTO_INFO.URL': value['ossUrl'],
					'VISIT_PHOTO_INFO.PHOTO_TASK_NAME': value['VISIT_PHOTO_TASK.TASK_NAME'],
					'VISIT_PHOTO_INFO.EXT_INFO':value['exif']
				}
	            stream.fetch({
		    		method:'POST',
		    		url:this.addApi,
		    		body: m
		    	},res =>{
		    		if(res.code == 0){
			    		this.currentNum++
			    		this.updateNum = this.currentNum;
			    		if(this.currentNum==this.picNum){
			    			this.isloading = false;
			    			modal.toast({message:'上传完成',duration:1})
			    			setTimeout(()=>{
			                   navigator.pop()
			                },1000) 
			    		}
			    		this.updateimgs(list)
			    	}
		    	})
    		},
    		viewEvent(name,call){
    			this[name](call)
    		},
    		getData(){

    		},
    		del(key){
    			// modal.alert({message:this.lists[key]['picId']})
    			// this.lists[key]['picUrl'] = '';
    			// this.lists[key]['isupdate'] = false;
    			// this.$set(this.lists,key,this.lists[key]);
    			// photoEvent.deleteImg(parseInt(this.lists[key]['picId']))
    			if(JSON.stringify(this.lists[key]['VISIT_PHOTO_TASK.VISIT_PHOTO'])!='{}'){
    				// modal.alert({message:JSON.stringify(this.lists[key]['VISIT_PHOTO_TASK.VISIT_PHOTO'])})
    				stream.fetch({
			    		method:'POST',
			    		url:this.delApi,
			    		body: {'VISIT_PHOTO_INFO.VISIT_PHOTO_INFO_ID':parseInt(this.lists[key]['VISIT_PHOTO_TASK.VISIT_PHOTO']['VISIT_PHOTO_INFO.VISIT_PHOTO_INFO_ID'])}
			    	},res =>{
			    		if(res.code==0){
			    			this.lists[key]['picUrl'] = '';
			    			this.lists[key]['isupdate'] = false;
			    			this.lists[key]['ossPath'] = '';
			    			this.$set(this.lists,key,this.lists[key]);
			    			photoEvent.deleteImg(parseInt(this.lists[key]['picId']));
			    			modal.toast({message:'删除成功',duration:1})
			    		}
			    	})
    			}else{
    				this.lists[key]['picUrl'] = '';
	    			this.lists[key]['isupdate'] = false;
	    			this.lists[key]['ossPath'] = '';
	    			this.$set(this.lists,key,this.lists[key]);
	    			photoEvent.deleteImg(parseInt(this.lists[key]['picId']));
	    			modal.toast({message:'删除成功',duration:1})
    			}
    		},
    		takepic(key){
    			if(this.lists[key]['isupdate']){
    				return
    			}else{
    				this.picIndex = key
	    			this.picinfo = {
	    				'picName':this.lists[key]['VISIT_PHOTO_TASK.TASK_NAME'],
	    				'imgId': JSON.stringify(this.lists[key]['VISIT_PHOTO_TASK.VISIT_PHOTO'])=='{}'?'-1':this.lists[key]['VISIT_PHOTO_TASK.VISIT_PHOTO']['VISIT_PHOTO_INFO.VISIT_PHOTO_INFO_ID'],
	    				'company':this.clientName,
	    				'meetId': parseInt(this.visitId),
	    				'companyUid':this.clientUid,
	    				"taskId":this.lists[key]['VISIT_PHOTO_TASK.VISIT_PHOTO_TASK_ID']
	    			};
	    			var x = {
	    				'uid': parseInt(this.operaterUid),
	    				'meetId': parseInt(this.visitId),
	    				'serviceId': parseInt(this.serviceId),
	    				'content': JSON.stringify(this.picinfo),
	    				'latitude':JSON.stringify(this.latitude),
	    				'longitude':JSON.stringify(this.longitude),
	    				'address': this.address
	    			}
	    			photoEvent.takePhotoOnly(x)
    			}
    		},
    		nowupdata(){
    			var that = this;
    			this.updateNum = 0,
    			that.lists.forEach(function(value,key){
    				if(value['ossUrl']==''&&value['isupdate']){
    					that.picNum++
    				}
    			})
    			if(this.picNum==0){
    				modal.toast({message:'暂无照片可以上传',duration:1})
    				return
    			}
    			that.localNum = 0;
    			that.lists.forEach(function(value,key){
    				if(value['ossUrl']==''&&value['isupdate']){
    					that.isloading = true;
    					photoEvent.uploadImg(parseInt(that.operaterUid),parseInt(that.serviceId),parseInt(value['picId']))
    				}
    			})
    		},
    		waitupdate(){
    			navigator.pop()
    			// navigator.push({
    			// 	url: this.waitPage,
    			// },res=>{})
    		},
    	}	
    };
</script>
