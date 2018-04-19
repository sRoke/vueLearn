<template>	
<bu-view :config="configData" @event="viewEvent">
	<div class="inputs">
		<input type="text" class="input-item" placeholder="供应商名称"    v-model="name"></input>
		<input type="number" class="input-item" placeholder="电话"    v-model="phone"></input>	
		<input type="text" class="input-item" placeholder="地址"    v-model="address"></input>	
	</div>
	<div class="bottom-index" slot="footer">
		<div class="savebtn" @click="save">
			<text class="save-text">保存</text>
		</div>
	</div>
</bu-view>
</template>
<style  scoped>
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
	.savebtn:active{
		color: #CF411B
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
	      		name:'',
	      		phone: '',
	      		address: '',
	      		addApi:'/SUPPLIER/add',
	      		configData:{
                    title: '添加供应商',
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
    		save(){
    			if(this.name==''){
    				modal.toast({message:'供应商名称不能为空',duration:1})
    				return
    			}
    			if(this.phone==''){
    				modal.toast({message:'电话不能为空',duration:1})
    				return
    			}
    			stream.fetch({
		    		method:'POST',
		    		url:this.addApi,
		    		body: {
		    			'SUPPLIER.SUPPLIER_NAME':this.name,
		    			'SUPPLIER.LOGIN_ID': this.phone,
		    			'SUPPLIER.ADDR_DETAIL':this.address
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