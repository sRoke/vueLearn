<template>	
<bu-view :config="configData" @event="viewEvent">
			<!-- 标签列表 -->
			<div class="mark-warp" >
				<div class="label-header">
					<text class="labeltxt">标签列表</text>
					<div class="in-block" @click='tosort' v-if="groupList.length>1">
						<text class="sort-tx">排序</text>
					</div>
				</div>
				<div class="list-index" v-for="(item,index) in groupList" @click="gomodify(item)">
					<div class="label-text" ><text class="label-name"> {{item['BUYER_TAG_GROUP.BUYER_TAG_GROUP_NAME']}}</text><image class="head-right-icon" :src="torightIcon"></image></div>
					<div class="lable-divs">
						<div class="label-div" v-for="(value,key) in labelList[item['BUYER_TAG_GROUP.BUYER_TAG_GROUP_ID']]">
							<text class="label-name-index">{{value['BUYER_TAG.BUYER_TAG_NAME']}}</text>
						</div>
					</div>
				</div>
				<div class="noData" v-if="groupList.length == 0">
					<text class="noData-text">暂无标签，请点击右上角添加</text>
				</div>
			</div>
			<!-- 标签列表 -->
</bu-view>
</template>	

<style  scoped>
	.noData{
		margin-top: 50px;
	}
	.noData-text{
		font-size: 32px;
    	color: #333;
    	text-align: center;
	}
	.scrol{
		position: absolute;
		top: 190px;
		bottom:0;
		left: 0;
		width: 750;
		padding-bottom: 18px;
	}
	.label-name-index{
		align-items: center;
    	text-align: center;
    	height: 62px;
    	line-height: 62px;
    	color: #CF411B;
    	font-size: 28px;
	}
	.label-div:last-child{
		margin-right: 0;
	}
	.label-div{
		height: 62px;
		padding-right: 20px;
		padding-left: 20px;
		margin-right: 30px;
		margin-bottom: 20px;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		border-bottom-color: #CF411B;
		border-top-style: solid;
		border-top-width: 1px;
		border-top-color: #CF411B;
		border-left-style: solid;
		border-left-width: 1px;
		border-left-color: #CF411B;
		border-right-style: solid;
		border-right-width: 1px;
		border-right-color: #CF411B;
		border-bottom-left-radius:4px;
		border-bottom-right-radius :4px;
		border-top-left-radius :4px;
		border-top-right-radius:4px;

	}
	.lable-divs{
		margin-top: 30px;
		flex-direction: row;
		justify-content: start;
    	-webkit-box-pack: justify;
    	-webkit-box-align: center;
    	align-items: center;
    	flex-wrap:wrap;
	}
	.label-name{
		font-size: 32px;
		color: #333;
		font-weight: bold;
	}
	.label-text{
		flex-direction: row;
    	justify-content: space-between;
    	-webkit-box-pack: justify;
    	-webkit-box-align: center;
    	align-items: center;
	}
	.list-index{
		padding-top: 45px;
		padding-bottom: 30px;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		border-bottom-color: #D8D8D8
	}
	.sort-tx{
		font-size: 32px;
		color: #535353
	}

	.back-div{
		display: inline-block;
		height: 78px;
		width: 80px;
		padding-top: 24px;
	}

	.top-bar{
		height: 78px;
		width: 750px;
		padding-left: 30px;
		padding-right: 30px;
		flex-direction: row;
    	justify-content: space-between;
    	-webkit-box-pack: justify;
    	-webkit-box-align: center;
    	align-items: center;
	}
	.label-icon-oprate{
		flex-direction: row;
		justify-content: space-start;
	}
	.sub-title{
		flex-direction: row;
		align-items: center;
		margin-top: 45px;
	}
	.label-header{
		flex-direction: row;
		justify-content: space-between;
		padding-bottom: 20px;
    	border-bottom-style: solid;
		border-bottom-width: 1px;
		border-bottom-color: #D8D8D8
	}
	.labeltxt{
		font-size: 36px;
		display: inline-block;
		font-weight: bold;
	}
	.titles{
		font-size: 50px;
		color: #333;
		font-weight: bold;
	}
	.bu-wrap{
		position: absolute;
		bottom:0;
		top:0;
		left: 0;
		right:0;
		width:750px;
		padding-bottom:40px;
		background-color: #fff;
	}
	.head-icon-warp{
		flex-direction:row;
		justify-content: flex-start;
		align-items: center;
		padding-left:30px;
		width:120px;
		height:136px;
	}
	.head-warp{
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 100px;
		padding-right: 30px;
		padding-left: 30px;
	}
	.in-block{
		flex-direction: row;
    	justify-content: space-between;
	}
	.head-back-icon{
		width:17px;
		height:30px;
	}
	.head-add-icon{
		width:34px;
		height:34px;
	}
	.head-right-icon{
		width: 14px;
		height: 24px;
	}
	.font-gray33{
		color:#333;
	}
	.font60{
		font-size:60px;
	}
	.font42{
		font-size:42px;
	}
	.font36{
		font-size:36px;
	}
	.font28{
		font-size:28px;
	}
	.font-bold{
		font-size:bold;
	}
	.mark-warp{
		position:relative;
		width:750px;
		padding-left:30px;
		padding-right:30px;
		margin-top:20px;
	}
	.margin-add{
		position:absolute;
		top:60px;
		right:24px;
		width:45px;
		height:45px;
	}
</style>
<script>
	import buView from '../../components/bu-view.vue'
  	import navigator from '../../common/navigator.js'
  	import modal     from '../../common/modal.js'
  	import stream    from '../../common/stream.js'
  	import icon      from './icon/icon.js'
  	const getEvent  = weex.requireModule('event');
	export default {
		components:{
            buView
        },
	    data() {
	      	return {
	      		addIcon  : icon.addIcon,
	      		groupIcon: icon.groupIcon,
	      		back     : icon.backIcon,
	      		okIcon   : icon.okIcon,
	      		delIcon  : icon.delIcon,
	      		movedownIcon : icon.movedownIcon,
	      		moveupIcon : icon.moveupIcon,
	      		openIcon : icon.openIcon,
	      		torightIcon : icon.torightIcon,
	      		headshow : true,
	      		title    : '管理标签',
	      		getallApi: '/buyers/tags/group/getTagGroupAndDetails',
	      		groupList: [],
	      		labelList: [],
	      		addPage  : '/modules/tagSection/addLabel',
	      		sortPage : '/modules/tagSection/labelSort',
	      		modifyPage : '/modules/tagSection/modifyLabel',
	      		configData:{
                    title: '管理标签',
                    titleAlgin: 'left',
                    secondTitle:'',
                    bottom: '0px',
                    addEvent: 'toadd',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: 'refresh',
                    loadmore: false,
                    loadmoreEvent:'',
                    viewappear: 'getData'
                },
	      	};
	    },
	    created(){
	    	var self = this;
	    	
	    },

	    mounted(){
	    	stream.fetch({
	    		method:'POST',
	    		url:this.getallApi,
	    		// body: {'$LOG':true}
	    	},res =>{
	    		// console.log(res)
	    		this.groupList = res.data
	    		this.labelList = res.extraData['tagGroupMap']
	    	})
	    },
    	methods:{
    		getData(event){
	    		stream.fetch({
		    		method:'POST',
		    		url:this.getallApi,
		    		// body: {'$LOG':true}
		    	},res =>{
		    		// console.log(res)
		    		this.groupList = res.data
		    		this.labelList = res.extraData['tagGroupMap']
		    	})
    		},
    		toadd(){
    			navigator.push({
    				url: this.addPage
    			},res=>{})
    		},
    		tosort(){
    			navigator.push({
    				url: this.sortPage
    			},res=>{})
    		},
    		gomodify(item){
    			navigator.push({
    				url: this.modifyPage,
    				query: '?id='+item['BUYER_TAG_GROUP.BUYER_TAG_GROUP_ID']
    			},res=>{})
    		},
    		toback(){
    			navigator.pop()
    		},
    		viewEvent(name,call){
    			this[name](call)
    		}
    	}
    };
</script>
