<template>	
<bu-view :config="configData" @event="viewEvent">
	<div class="search-bar">
		<div class="dataAll">
			<div class="data-index" v-for='(item,index) in leavelLists' @click='gomodify(item)'>
				<text class='name'>{{item['BUYER_LEVEL.LEVEL_NAME']}}</text>
				<div class="right-div">
					<text class='default-txt'>{{item['BUYER_LEVEL.PRICE_OFF']}}％</text>
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
	      		addPage: '/modules/clientLeavel/addLeavel',
	      		modifyPage: '/modules/clientLeavel/modifyLeavel',
	      		leavelApi:'/buyer/queryInit',
	      		configData:{
                    title: '客户等级',
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
                firstEnter:true,
                leavelLists:[]
	      	};
	    },
	    created(){
	    	var self = this;
	    },
	    mounted(){
	        stream.fetch({
	    		method:'GET',
	    		url:this.leavelApi,
	    	},res =>{
	    		this.leavelLists =res.extraData['BUYER_LEVEL']
	    	})
	    },
    	methods:{
    		getData(){
				stream.fetch({
		    		method:'GET',
		    		url:this.leavelApi,
		    	},res =>{
		    		this.leavelLists =res.extraData['BUYER_LEVEL']
		    	})
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
    			storage.setItem('clientLeavel',JSON.stringify(item),event =>{
	    			navigator.push({
	    				url: this.modifyPage,
	    				query: '?id='+item['BUYER_LEVEL.BUYER_LEVEL_ID']
	    			},res=>{})
	    		})
    		},
    	}
    };
</script>