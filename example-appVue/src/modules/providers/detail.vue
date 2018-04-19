<template>	
<bu-view :config="configData" @event="viewEvent">
	<div class="inputs">
		<input type="text" class="input-item" placeholder="供应商名称"    v-model="info.name"></input>
		<input type="number" class="input-item" placeholder="电话"    v-model="info.phone"></input>	
		<input type="text" class="input-item" placeholder="地址"    v-model="info.address"></input>	
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
		background-color: #CF320A;
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
	      		info:{
	      			name:'',
	      			phone: '',
	      			address: '',
	      		},
	      		getinfoApi:'/SUPPLIER/getById',
	      		modifyApi:'/SUPPLIER/modifyById',
	      		delApi: '/SUPPLIER/delSupplier',
	      		configData:{
                    title: '供应商详情',
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
                oldinfo:{},
                providerId: null,
                Uid: null
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
	    		url:'/SUPPLIER/getById?SUPPLIER.SUPPLIER_ID='+self.getDataByUrl('id',bundleUrl)
	    		// url:'/SUPPLIER/getById?SUPPLIER.SUPPLIER_ID=1058'
	    	},res =>{
	    		this.oldinfo = res.data[0];
	    		this.Uid = res.data[0]['SUPPLIER.UID'],
	    		this.providerId = res.data[0]['SUPPLIER.SUPPLIER_ID'];
	    		this.info.name = res.data[0]['SUPPLIER.SUPPLIER_NAME'];
	    		this.info.phone = res.data[0]['SUPPLIER.LOGIN_ID'];
	    		this.info.address = res.data[0]['SUPPLIER.ADDR_DETAIL']
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
    		todel(){
    			modal.confirm({message:'是否确认删除？', okTitle: '删除', cancelTitle:'取消'},res =>{
    				if(res=='删除'){
		    			stream.fetch({
				    		method:'POST',
				    		url:this.delApi,
				    		body: {
				    			'SUPPLIER.SUPPLIER_ID': this.providerId,
				    		}
				    	},res =>{
				    		if(res.code == 0){
				    			modal.toast({message:'删除成功',duration:2})	
				    			setTimeout(()=>{
						            navigator.pop()
						        },1500)
				    		}
				    	})
				    }
			    })
    		},
    		save(){
    			// this.oldinfo['SUPPLIER.SUPPLIER_NAME'] = this.info.name;
    			// this.oldinfo['SUPPLIER.LOGIN_ID'] = this.info.phone;
    			// this.oldinfo['SUPPLIER.ADDR_DETAIL'] = this.info.address;
    			if(this.info.name==''){
    				modal.toast({message:'供应商名称不能为空',duration:1})
    				return
    			}
    			if(this.info.phone==''){
    				modal.toast({message:'电话不能为空',duration:1})
    				return
    			}
    			stream.fetch({
		    		method:'POST',
		    		url:this.modifyApi,
		    		body: {
		    			'SUPPLIER.UID': this.Uid,
		    			'SUPPLIER.SUPPLIER_ID': this.providerId,
		    			'SUPPLIER.SUPPLIER_NAME': this.info.name,
		    			'SUPPLIER.LOGIN_ID': this.info.phone,
		    			'SUPPLIER.ADDR_DETAIL': this.info.address
		    		}
		    	},res =>{
		    		if(res.code == 0){
		    			modal.toast({message:'修改成功',duration:2})	
		    			setTimeout(()=>{
				            navigator.pop()
				        },1500)
		    		}
		    	})
    		}
    	}
    };
</script>