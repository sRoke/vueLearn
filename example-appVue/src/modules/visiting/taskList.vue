<template>	
<bu-view :config="configData" @event="viewEvent">
	<div class="dateindex" v-for="(item,index) in lists">
		<text class="datetime">{{item['DATE']}}</text>
		<div class="imgindexs">
			<div class="imgindex" v-for="(value,key) in item['IMGS']">
				<image class="img" :src="value['URL']" @click="todetail(index,key)"></image>
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
		<image class= "bigphoto" :src="photoinfos['VISIT_PHOTO_INFO.URL']" @click="toback"  resize="contain"></image>
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
	.img{
		width: 171px;
		height: 171px;
		margin-left: 5px;
		margin-bottom: 10px;
	}
	.imgindexs{
		flex-direction: row;
		flex-wrap: wrap;
	}
	.datetime{
		color: #666;
		font-size: 32px;
		margin-left: 10px;
		margin-bottom: 30px;
	}
	.dateindex{
		margin-top: 50px;
		flex-direction: column;
		padding-left: 20px;
		padding-right: 20px
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
	      		watchphoto: false,
	      		whiteback     : icon.whiteback,
	      		visitstaticPage: '/modules/visiting/visitStatistics',
	      		getlistApi: '/visit/photo/task/queryAll',
	      		configData:{
                    title: '',
                    titleAlgin: 'left',
                    secondTitle:'',
                    bottom: '0',
                    addEvent: '',
                    btnText: '',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: '',
                    loadmore: false,
                    loadmoreEvent:'',
                    viewappear: '',
                },
                lists: [],
                photoinfos:{},
                taskname: '',
                time: ''
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
	    		// url:'/visit/photo/info/getByTaskId?VISIT_PHOTO_INFO.VISIT_PHOTO_TASK_ID=1045',
	    		url:'/visit/photo/info/getByTaskId?VISIT_PHOTO_INFO.VISIT_PHOTO_TASK_ID='+self.getDataByUrl('id',bundleUrl),
	    	},res =>{
	    		this.lists = res.data
	    		this.configData['title'] = res.extraData['TASK_NAME']
	    		this.lists.forEach(function(item,index){
	    			// item['0']['URL'] = item['0']['URL'] = 'http://u.ok.eerrpp.cc/'+item['0']['URL']+'?x-oss-process=image/resize,m_fill,h_220,w_220'
	    			item['IMGS'].forEach(function(value,key){
	    				value['URL'] = 'http://u.ok.eerrpp.cc/'+value['URL']+'?x-oss-process=image/resize,m_fill,h_200,w_200'
	    			})
	    		})
	    	})

	    },

    	methods:{
    		viewEvent(name,call){
    			this[name](call)
    		},
    		todetail(index,key){
	    		stream.fetch({
	    			method:'GET',  
	    			url:'/visit/photo/info/getById?VISIT_PHOTO_INFO.VISIT_PHOTO_INFO_ID='+this.lists[index]['IMGS'][key]['ID'],
		    	},res =>{
		    		this.photoinfos = res.data[0];
		    		var x = this.photoinfos['VISIT_PHOTO_INFO.ADD_DATETIME']
		    		this.times = x;
		    		this.taskname = this.photoinfos['VISIT_PHOTO_INFO.PHOTO_TASK_NAME'];
		    		this.photoinfos['VISIT_PHOTO_INFO.URL'] = 'http://u.ok.eerrpp.cc/'+this.photoinfos['VISIT_PHOTO_INFO.URL']+'?x-oss-process=image/resize,m_lfit,h_1000,w_770'
		    		this.watchphoto = true
		    	})
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
				this.watchphoto= false
			}
    	}
    };
</script>
