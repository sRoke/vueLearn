<template>	
<bu-view :config="configData" @event="viewEvent">
	<div class="inputs">
		<input type="text" class="input-item" placeholder="仓库名称"    v-model="name"></input>
		<div class="operate-div" v-if='!isDefault'>
			<text class='isdefault'>设为默认仓库</text>
			<div class="example1">
	      		<div class="big-slide" :class="[ifsingle?'isSingle':'notSingle']" @click="ifchange">

	      			<div class="small-slide"  :class="[ifsingle?'toright':'toleft']"></div>
	      		</div>
	    	</div>
		</div>
		<div class="operate-div" v-if='isDefault'>
			<text class='isdefault1'>该仓库为默认仓库</text>
		</div>
	</div>
	<div class="bottom-index" slot="footer">
		<div class="savebtn" @click="save">
			<text class="save-text">保存</text>
		</div>
	</div>
</bu-view>
</template>
<style  scoped>
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
		position: absolute;
		border-bottom-left-radius:20px;
		border-bottom-right-radius:20px;
		border-top-left-radius :20px;
		border-top-right-radius:20px;

	}
	.big-slide{
		width: 80px;
		height: 40px;
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
	.isdefault{
		font-size: 30px;
		color:#333;
	}
	.isdefault1{
		font-size: 30px;
		color:#333;
		flex: 1;
		text-align: center;
	}
	.operate-div{
		height: 135px;
		width: 670px;
		flex-direction: row;
		border-bottom-style: solid;
		border-bottom-color: #D8D8D8;
		border-bottom-width: 1px;
		justify-content: space-between;
		align-items: center;
	}
	.input-item{
		height: 135px;
		border-bottom-style: solid;
		border-bottom-color: #D8D8D8;
		border-bottom-width: 1px;
		font-size: 32px;
		color: #333;
		text-align: center;
		line-height: 135px;
	}
	.inputs{
		flex-direction: column;
		padding-left: 40px;
		padding-right: 40px;
		margin-top: 30px;
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
	.savebtn:active{
		background-color: #CF320A;
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


</style>
<script>
	import buView from '../../components/bu-view.vue'
	import navigator from '../../common/navigator.js'
  	import modal     from '../../common/modal.js'
  	import stream    from '../../common/stream.js'
  	import icon      from '../tagSection/icon/icon.js'
  	import ordericon from '../../assets/orderIcon/icon.js'
  	const getEvent  = weex.requireModule('event');
  	const storage = weex.requireModule('storage');
	export default {
		components:{
            buView
        },
	    data() {
	      	return {
	      		ifsingle: false,
	      		name:'',
	      		detailApi: '/repository/getById',
	      		delApi:'/bee/repos/repository/delById',
	      		modifyApi:'/bee/repos/repository/modifyById',
	      		configData:{
                    title: '修改仓库',
                    titleAlgin: 'left',
                    secondTitle:'',
                    bottom: '80px',
                    addEvent: 'todel',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: 'refresh',
                    loadmore: false,
                    loadmoreEvent:'',
                    btnText:'删除'
                },
                currentId: null,
                isDefault: false
	      	};
	    },
	    created(){
	    	var self = this;
	    },
	    mounted(){
	    	var self = this;
	    	var bundleUrl = self.$getConfig().bundleUrl;
	    	stream.fetch({
	    		method:'GET',
	    		url:this.detailApi+'?REPOSITORY.REPOSITORY_ID='+self.getDataByUrl('id',bundleUrl)
	    	},res =>{
	    		this.name = res.data[0]['REPOSITORY.REPOS_NAME'];
	    		this.ifsingle = res.data[0]['REPOSITORY.IS_DEFAULT']=='1'?true:false;
	    		this.currentId = res.data[0]['REPOSITORY.REPOSITORY_ID'];
	    		this.isDefault = res.data[0]['REPOSITORY.IS_DEFAULT']=='1'?true:false
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
    		ifchange (){
	      		this.ifsingle = !this.ifsingle
	      	},
	      	todel(){
	      		if(this.isDefault== true){
	      			modal.toast({message:'默认仓库不能删除',duration:1})
	      			return
	      		}else{
	      			modal.confirm({message:'确认删除？', okTitle: '删除', cancelTitle:'取消'},res =>{
	      				if(res=='删除'){
			      			stream.fetch({
					    		method:'GET',
					    		url:this.delApi+"?REPOSITORY.REPOSITORY_ID="+this.currentId
					    	},res =>{
					    		if(res.code==0){
					    			modal.toast({message:'删除成功',duration:2})	
					    			setTimeout(()=>{
							            navigator.pop()
							        },1500)
					    		}
					    	})
					    }
				    })
	      		}
	      	},
    		save(){
    			if(this.name==''){
    				modal.toast({message:'仓库名称不能为空',duration:1})
    				return
    			}
    			stream.fetch({
		    		method:'POST',
		    		url:this.modifyApi,
		    		body: {
		    			'REPOSITORY.REPOS_NAME':this.name,
		    			'IS_DEFAULT': this.ifsingle,
		    			'REPOSITORY.REPOSITORY_ID': this.currentId
		    		}
		    	},res =>{
		    		if(res.code == 0){
		    			modal.toast({message:'修改成功',duration:2})	
		    			setTimeout(()=>{
				            navigator.pop()
				        },1500)
		    		}
		    	},res=>{
		    		
		    	})
    		}
    	}
    };
</script>