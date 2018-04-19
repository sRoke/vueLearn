<template>	
<bu-view :config="configData" @event="viewEvent">
	<div class="inputs">
		<input type="text" class="input-item" placeholder="等级名称"    v-model="name"></input>
		<div class="operate-div" >
			<input type="number" class="input-item1" placeholder="折扣"    v-model="leavel"></input>
			<text class='isdefault1'>％</text>
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
	.isdefault{
		font-size: 30px;
		color:#333;
	}
	.isdefault1{
		font-size: 30px;
		color:#333;
		text-align: center;
		width:30px;
	}
	.operate-div{
		height: 135px;
		width: 670px;
		flex-direction: row;
		border-bottom-style: solid;
		border-bottom-color: #D8D8D8;
		border-bottom-width: 1px;
		justify-content: center;
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
	.input-item1{
		height: 135px;
		width: 70px;
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
	      		leavel: '',
	      		name:'',
	      		addApi: '/buyerlevel/add',
	      		configData:{
                    title: '新增等级',
                    titleAlgin: 'left',
                    secondTitle:'',
                    bottom: '80px',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: 'refresh',
                    loadmore: false,
                    loadmoreEvent:'',
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
    		save(){
    			if(this.name==''){
    				modal.toast({message:'等级名称不能为空',duration:1})
    				return
    			}
    			if(this.leavel==''){
    				modal.toast({message:'商品折扣不能为空',duration:1})
    				return
    			}
    			stream.fetch({
		    		method:'POST',
		    		url:this.addApi,
		    		body: {
		    			'BUYER_LEVEL.PRICE_OFF':this.leavel,
		    			'BUYER_LEVEL.LEVEL_NAME': this.name,
		    		}
		    	},res =>{
		    		if(res.code == 0){
		    			modal.toast({message:'新增成功',duration:2})	
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