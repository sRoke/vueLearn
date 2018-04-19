<template>	
<bu-view :config="configData" @event="viewEvent">
	<div class="inputs">
		<input type="text" class="input-item" placeholder="仓库名称"    v-model="name"></input>
		<div class="operate-div">
			<text class='isdefault'>设为默认仓库</text>
			<div class="example1">
	      		<div class="big-slide" :class="[ifsingle?'isSingle':'notSingle']" @click="ifchange">

	      			<div class="small-slide"  :class="[ifsingle?'toright':'toleft']"></div>
	      		</div>
	    	</div>
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
	.operate-div{
		height: 130px;
		width: 670px;
		flex-direction: row;
		border-bottom-style: solid;
		border-bottom-color: #D8D8D8;
		border-bottom-width: 1px;
		justify-content: space-between;
		align-items: center;
	}
	.input-item{
		height: 130px;
		border-bottom-style: solid;
		border-bottom-color: #D8D8D8;
		border-bottom-width: 1px;
		font-size: 32px;
		color: #333;
		text-align: center;
		line-height: 130px;
	}
	.inputs{
		flex-direction: column;
		padding-left: 40px;
		padding-right: 40px;
		margin-top: 50px;
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
	      		addApi:'/bee/repos/repository/addNewRepos',
	      		configData:{
                    title: '新增仓库',
                    titleAlgin: 'left',
                    secondTitle:'',
                    bottom: '80px',
                    addEvent: '',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: 'refresh',
                    loadmore: false,
                    loadmoreEvent:''
                },
	      	};
	    },
	    created(){
	    	var self = this;
	    },
	    mounted(){

	    	
	    },
    	methods:{
    		viewEvent(name,call){
    			this[name](call)
    		},
    		ifchange (){
	      		this.ifsingle = !this.ifsingle
	      	},
    		save(){
    			if(this.name==''){
    				modal.toast({message:'仓库名称不能为空',duration:1})
    				return
    			}
    			stream.fetch({
		    		method:'POST',
		    		url:this.addApi,
		    		body: {
		    			'REPOSITORY.REPOS_NAME':this.name,
		    			'IS_DEFAULT': this.ifsingle
		    		}
		    	},res =>{
		    		if(res.code == 0){
		    			modal.toast({message:'添加成功',duration:2})	
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