<template>	
<bu-view :config="configData" @event="viewEvent">
	<div class="search-bar">
		<div class="dataAll">
			<div class="data-index" v-for='(item,index) in listdata' @click='gomodify(item)'>
				<text class='name'>{{item['REPOSITORY.REPOS_NAME']}}</text>
				<div class="right-div">
					<text class='default-txt' v-if='index==0'>默认仓库</text>
					<image class="head-right-icon" :src="torightIcon"></image></div>
				</div>
			</div>
		</div>
	</div>
</bu-view>
</template>
<style  scoped>
.head-right-icon{
	width: 14px;
	height: 24px;
	margin-left: 20px;
}
.default-txt{
	font-size: 28px;
	color: #666
}
.right-div{
	flex-direction: row;
	align-items: center;
}
.name{
	font-weight: bold;
	font-size: 32px;
	color: #333
}
.data-index{
	flex-direction: row;
	border-bottom-style: solid;
	border-bottom-width: 1px;
	border-bottom-color: #D8D8D8;
	justify-content: space-between;
	height: 175px;
	align-items: center;
	/*padding-top: 40px;
	padding-bottom: 40px;*/
}
.dataAll{
	flex-direction: column;
	margin-left: 30px;
	margin-right: 30px;
}

.search-bar{
	width: 750px;
	padding-left: 30px;
	padding-right: 30px;
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
	      		torightIcon:icon.torightIcon,
	      		addPage: '/modules/warehouse/addWarehouse',
	      		modifyPage: '/modules/warehouse/modifyWarehouse',
	      		listApi: '/repository/query',
	      		configData:{
                    title: '仓库管理',
                    titleAlgin: 'left',
                    secondTitle:'',
                    bottom: '0',
                    addEvent: 'toadd',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: 'refresh',
                    loadmore: false,
                    loadmoreEvent:'',
                    viewappear: 'getData'
                },
                listdata:[],
                firstEnter:true
	      	};
	    },
	    created(){
	    	var self = this;
	    },
	    mounted(){
	        stream.fetch({
	    		method:'GET',
	    		url:this.listApi,
	    		// body:{'search': ,'PAGE_SIZE':,'PN':}
	    	},res =>{
	    		this.listdata = res.data;
	    		var x = {};
	    		var y = null;
	    		this.listdata.forEach(function(item,index) {
	    			if(item['REPOSITORY.IS_DEFAULT'] == '1'){
	    				x = item;
	    				y = index
	    				// console.log(y)
	    			}
	    		})
	    		this.listdata.splice(y,1)
	    		this.listdata.unshift(x)
	    	})
	    },
    	methods:{
    		getData(){
    			if(this.firstEnter==false){
    				stream.fetch({
			    		method:'GET',
			    		url:this.listApi,
			    		// body:{'search': ,'PAGE_SIZE':,'PN':}
			    	},res =>{
			    		this.listdata = res.data;
			    		var x = {};
			    		var y = null;
			    		this.listdata.forEach(function(item,index) {
			    			if(item['REPOSITORY.IS_DEFAULT'] == '1'){
			    				x = item;
			    				y = index
			    				// console.log(y)
			    			}
			    		})
			    		this.listdata.splice(y,1)
			    		this.listdata.unshift(x)
			    	})
    			}
    			this.firstEnter = false
    		},
    		viewEvent(name,call){
    			this[name](call)
    		},
    		toadd(){
    			navigator.push({
    				url: this.addPage
    			},res=>{})
    		},
    		gomodify(item){
    			navigator.push({
    				url: this.modifyPage,
    				query: '?id='+item['REPOSITORY.REPOSITORY_ID']
    			},res=>{})
    		},
    	}
    };
</script>