<template>	

<bu-view :config="configData" @event="viewEvent">
			<!-- 标签列表 -->
			<div class="mark-warp" >
				<div class="list-index" v-for="(item,index) in groupList" @click="gomodify(item)">
					<div class="label-text" ><text class="label-name"> {{item['SALEMAN_RULE_GROUP.GROUP_NAME']}}</text><image class="head-right-icon" :src="torightIcon"></image></div>
					<div class="lable-divs">
						<div class="label-div" v-for="(value,key) in labelList[item['SALEMAN_RULE_GROUP.SALEMAN_RULE_GROUP_ID']]" >
							<text class="label-name-index">{{value['EMPLOYEE.NAME']}}</text>
						</div>
					</div>
				</div>
				<div class="noData" v-if="groupList.length == 0">
					<text class="noData-text">暂无标签，请点击右上角添加</text>
				</div>
			</div>
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
		/*width: 113px;*/
		/*border: 1px solid #CF411B;*/
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
		/*width:750px;*/
		flex-direction: row;
		justify-content: start;
    	-webkit-box-pack: justify;
    	-webkit-box-align: center;
    	align-items: center;
    	flex-wrap:wrap;
    	/*padding-left: 20px;*/
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
		/*height: 218px;*/
		/*width : 100%;*/
		padding-top: 45px;
		padding-bottom: 30px;
		/*padding-right: 30px;*/
		/*padding-left: 30px;*/
		/*border-bottom: 1px solid #D8D8D8;*/
		border-bottom-style: solid;
		border-bottom-width: 1px;
		border-bottom-color: #D8D8D8
	}
	.list-index:first-child{
		padding-top: 35px;
	}
	.mark-warp{
		position:relative;
		width:750px;
		padding-left:30px;
		padding-right:30px;
	}

</style>
<script>
	import buView from '../../components/bu-view.vue'
  	import navigator from '../../common/navigator.js'
  	import modal     from '../../common/modal.js'
  	import stream    from '../../common/stream.js'
  	import icon      from '../tagSection/icon/icon.js'
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
	      		getallApi: '/saleman/rule/group/querySaleManGroup',
	      		groupList: [],
	      		labelList: [],
	      		addPage  : '/modules/areaControl/addArea',
	      		modifyPage : '/modules/areaControl/modifyArea',
	      		configData:{
                    title: '销售团队',
                    titleAlgin: 'left',
                    secondTitle:'',
                    bottom: '0px',
                    addEvent: 'toadd',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: 'refresh',
                    loadmore: false,
                    loadmoreEvent:'',
                    viewappear: 'viewappear',
                },
                render: false
	      	};
	    },
	    mounted(){
	   		this.getData()
	    },
    	methods:{
    		viewEvent(name,call){
    			this[name](call)
    		},
    		viewappear(){
    			if(this.render){
    				this.getData()
    			}
    		},
    		getData(event){
	    		stream.fetch({
		    		method:'GET',
		    		url:this.getallApi,
		    	},res =>{
		    		this.groupList = res.data
		    		this.labelList = res.extraData['groupSalemanMap']
		    		this.render = true
		    	})
    		},
    		toadd(){
    			navigator.push({
    				url: this.addPage
    			},res=>{})
    		},
    		gomodify(item){
    			navigator.push({
    				url: this.modifyPage,
    				query: '?id='+item['SALEMAN_RULE_GROUP.SALEMAN_RULE_GROUP_ID']
    			},res=>{})
    		},
    		toback(){
    			navigator.pop()
    		}
    	}
    };
</script>
