<template>	
<bu-view :config="configData" @event="viewEvent">
	<div class="search-bar">
		<div class="search-div">
			<image class='search-img' :src="searchIcon"></image>
			<input type="text" class="input-items" placeholder="供应商名称" v-model="items.name"  ref="name"></input>
		</div>
		<div class="dataAll">
			<div class="data-index" v-for='(item,index) in listdata' @click='gomodify(item)'>
				<text class='name'>{{item['SUPPLIER.SUPPLIER_NAME']}}</text>
				<text class='address'>{{item['SUPPLIER.ADDR_DETAIL']}}</text>
			</div>
		</div>
	</div>
</bu-view>
</template>
<style  scoped>
.address{
	font-size: 28px;
	color: #666;
}
.name{
	font-weight: bold;
	font-size: 32px;
	color: #333
}
.data-index{
	flex-direction: column;
	border-bottom-style: solid;
	border-bottom-width: 1px;
	border-bottom-color: #D8D8D8;
	height: 175px;
	justify-content: center;
}
.dataAll{
	margin-top: 40px;
	flex-direction: column;
	margin-left: 30px;
	margin-right: 30px;
}
.input-items{
	background-color: #F3F3F3;
	flex: 1;
	height: 66px;
}
.search-img{
	width: 30px;
	height: 30px;
	margin-right: 10px;
}
.search-div{
	background-color: #F3F3F3;
	height: 66px;
	flex-direction: row;
	justify-content: start;
	-webkit-box-pack: justify;
	-webkit-box-align: center;
	align-items: center;
	flex-wrap:wrap;
	padding-left: 20px;
	padding-right: 20px;
}
.search-bar{
	width: 750px;
	padding-left: 30px;
	padding-right: 30px;
	margin-top: 30px;
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
	      		addPage: '/modules/providers/addProviders',
	      		modifyPage: '/modules/providers/detail',
	      		items : {
	      			name: ''
	      		},
	      		searchIcon: icon.searchIcon,
	      		listApi: '/SUPPLIER/queryAll',
	      		configData:{
                    title: '供应商',
                    titleAlgin: 'left',
                    secondTitle:'',
                    bottom: '0',
                    addEvent: 'addProviders',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: 'refresh',
                    loadmore: false,
                    loadmoreEvent:'',
                    viewappear: 'getData'
                },
                listdata:[],
                firstEnter: true
	      	};
	    },
	    created(){
	    	var self = this;
	    },
	    mounted(){
	        stream.fetch({
	    		method:'GET',
	    		url:this.listApi
	    	},res =>{
	    		this.listdata = res.data;
	    	})
	    	
	    },
	    watch :{
	    	items: {  
	            handler: function() { 
	                stream.fetch({
			    		method:'POST',
			    		url:this.listApi,
			    		body:{'search': this.items.name}
			    	},res =>{
			    		this.listdata = res.data;
			    	})
	                 
	            },  
	            deep: true 
           }  
	    },
    	methods:{
    		viewEvent(name,call){
    			this[name](call)
    		},
    		getData(){
				stream.fetch({
		    		method:'GET',
		    		url:this.listApi,
		    	},res =>{
		    		this.listdata = res.data;
		    	})
    		},
    		addProviders(){
    			navigator.push({
    				url: this.addPage
    			},res=>{})
    		},
    		gomodify(item){
    			navigator.push({
    				url: this.modifyPage,
    				query: '?id='+item['SUPPLIER.SUPPLIER_ID']
    			},res=>{})
    		},
    	}
    };
</script>