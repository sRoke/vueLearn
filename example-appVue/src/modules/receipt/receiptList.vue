<template>	
<bu-view :config="configData" @event="viewEvent">
		<div class="search-bar">
			<div class="search-div">
				<image class='search-img' :src="searchIcon"></image>
				<input type="text" class="input-items" placeholder="金额／打款人" v-model="items.name"  ref="name"></input>
			</div>
		</div>
			<div class="lists" v-if="typedata1">
				<div class="wait-lists">
					<text class="wait-txt">待确认</text>
				</div>
				<div class="over-lists">
					<div class="over-list" v-for="(item,index) in payLists" v-if="item['MONEY_CONFIRM.STATE'] == '0'" @click="todo(item)">
						<div class="left-div">
							<text class="date">{{item['MONEY_CONFIRM.ADD_DATETIME']}}</text>
							<text class="name">{{item['MONEY_CONFIRM.ADD_UNAME']}}</text>
						</div>
						<div class="list-info">
							<div class="top-money">
								<div class="green-circle"></div>
								<text class="money-txt">¥{{item['MONEY_CONFIRM.MONEY']}}</text>
							</div>
							<div class="bottom-info">
								<text class="company-name">{{item['MONEY_CONFIRM.NAME']}}</text>
								<text class="pay-type">{{item['MONEY_CONFIRM.COMPANY_BANK_ACCOUNT_NAME']}}</text>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="lists" v-if="typedata2">
				<div class="wait-lists">
					<text class="wait-txt">已确认</text>
				</div>
				<div class="over-lists">
					<div class="over-list" v-for="(item,index) in payLists" v-if="item['MONEY_CONFIRM.STATE'] == '1'" @click="todo(item)">
						<div class="left-div">
							<text class="date">{{item['MONEY_CONFIRM.ADD_DATETIME']}}</text>
							<text class="name">{{item['MONEY_CONFIRM.ADD_UNAME']}}</text>
						</div>
						<div class="list-info">
							<div class="top-money">
								<div class="green-circle"></div>
								<text class="money-txt">¥{{item['MONEY_CONFIRM.MONEY']}}</text>
							</div>
							<div class="bottom-info">
								<text class="company-name">{{item['MONEY_CONFIRM.NAME']}}</text>
								<text class="pay-type">{{item['MONEY_CONFIRM.COMPANY_BANK_ACCOUNT_NAME']}}</text>
							</div>
						</div>
					</div>
				</div>
			</div>
</bu-view>
</template>	

<style  scoped>
	.wait-lists{
		margin-top: 50px;
	}
	.bottom-info{
		padding-left: 24px;
		border-left-style: solid;
		border-left-width: 1px;
		border-left-color: #EBEBEB;
		padding-bottom: 45px;
		margin-left: 9px;
		margin-top: 10px;
	}
	.pay-type{
		color: #999;
		font-size: 28px;
		margin-top: 10px;
	}
	.company-name{
		color: #666;
		font-size: 32px;
	}
	.money-txt{
		flex: 1
	}
	.top-money{
		flex-direction: row;
	}
	.list-info{
		flex: 1
	}
	.money-txt{
		color: #CF411B;
		font-size: 42px;
	}
	.green-circle{
		width: 18px;
		height: 18px;
		background-color: #0F9B80;
		border-bottom-left-radius:9px;
		border-bottom-right-radius :9px;
		border-top-left-radius :9px;
		border-top-right-radius:9px;
		margin-top: 16px;
		margin-right: 15px;
	}
	.name{
		color: #666;
		font-size: 28px;
	}
	.date{
		font-size: 40px;
		color: #333;
		margin-bottom: 15px;
	}
	.left-div{
		width: 150px;
	}
	.over-list{
		flex-direction: row;
		justify-content: space-between;
	}
	.wait-txt{
		font-size: 42px;
		color: #333;
		font-weight: bold;
		margin-bottom: 43px;
	}
	.lists{
		margin-bottom: 20px;
		padding-right: 30px;
		padding-left: 30px;
	}
	.input-items{
		background-color: #F3F3F3;
		flex: 1;
	}
	.search-img{
		width: 30px;
		height: 30px;
		margin-right: 10px;
	}
	.search-div{
		background-color: #F3F3F3;
		border-bottom-left-radius:5px;
		border-bottom-right-radius :5px;
		border-top-left-radius :5px;
		border-top-right-radius:5px;
		border-bottom-style: solid;
		border-bottom-width: 1px;
		border-bottom-color: #979797;
		border-top-style: solid;
		border-top-width: 1px;
		border-top-color: #979797;
		border-left-style: solid;
		border-left-width: 1px;
		border-left-color: #979797;
		border-right-style: solid;
		border-right-width: 1px;
		border-right-color: #979797;
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
	}
	.noData{
		margin-top: 50px;
	}
	.noData-text{
		font-size: 32px;
    	color: #666;
    	text-align: center;
    	margin-top: 30px
	}
	.scrol{
		position: absolute;
		top: 250px;
		bottom:0;
		left: 0;
		width: 750px;
		padding-bottom: 18px;
		padding-left: 30px;
		padding-right: 30px;
		padding-top: 75px;
	}
	.choose-back{
		position: absolute;
		z-index: 999;
		top: 250px;
		width: 750px;
		background-color: rgba(0,0,0,0.5);
		bottom: 0
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
		padding-top: 40px;
		padding-bottom: 15px;
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
		height: 68px;
		width: 80px;
		padding-top: 19px;
	}
	.add-div{
		height: 68px;
		width: 80px;
		padding-top: 19px;
		padding-left: 46px
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
		flex-direction : row;
		align-items    : center;
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
		padding-left  :30px;
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
	.mark-warp{
		position:relative;
		width:750px;
		padding-left:30px;
		padding-right:30px;
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
  	import icon      from '../tagSection/icon/icon.js'
  	const storage = weex.requireModule('storage');
  	const getEvent  = weex.requireModule('event');
	export default {
		components:{
            buView
        },
	    data() {
	      	return {
	      		warnIcon :icon.warnIcon,
	      		items : {
	      			name: ''
	      		},
	      		addPage: "/modules/myClient/myClient",
	      		getinfoApi: '/money/confirm/getByAddId',
	      		searchIcon: icon.searchIcon,
	      		addIcon  : icon.addIcon,
	      		back     : icon.backIcon,
	      		headshow : true,
	      		title    : '客户收款',
	      		labelGroup: [],
	      		haveData   : true,
	      		configData:{
                    title: '客户收款',
                    titleAlgin: 'left',
                    secondTitle:'toadd',
                    bottom: '0',
                    addEvent: 'toadd',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: 'refresh',
                    loadmore: false,
                    loadmoreEvent:'',
                    viewappear: 'getData',
                },
                payLists: [],
                typedata1: false,
                typedata2: false,
                detailPage: '/modules/receipt/receiptDetail'
	      	};
	    },
	    created(){
	    	var self = this;
	    	
	    },
	    mounted(){
	    	stream.fetch({
	    		method:'GET',
	    		url:this.getinfoApi,
	    	},res =>{
	    		this.payLists = res.data
	    		var that = this
	    		this.payLists.forEach(function(value,key) {
	    			value['MONEY_CONFIRM.ADD_DATETIME'] = value['MONEY_CONFIRM.ADD_DATETIME'].split(" ")[0]
	    			var x = value['MONEY_CONFIRM.ADD_DATETIME'].split("-")
	    			value['MONEY_CONFIRM.ADD_DATETIME'] = x[1]+"-"+x[2]
	    			if(value['MONEY_CONFIRM.STATE'] == 1){
	    				that.typedata2 = true
	    			} else if(value['MONEY_CONFIRM.STATE'] == 0){
	    				that.typedata1 = true
	    			}
	    		})
	    	})

	    },
	    watch :{
	    	items: {  
	            handler: function() { 
	                stream.fetch({
			    		method:'POST',
			    		url:this.getinfoApi,
			    		body:{
			    				'SEARCH' : this.items.name
			    			  }
			    	},res =>{
			    		this.payLists = res.data
			    		var ifhavuedata1 = false
			    		var ifhavuedata2 = false
			    		var that = this
			    		this.payLists.forEach(function(value,key) {
			    			value['MONEY_CONFIRM.ADD_DATETIME'] = value['MONEY_CONFIRM.ADD_DATETIME'].split(" ")[0]
			    			var x = value['MONEY_CONFIRM.ADD_DATETIME'].split("-")
			    			value['MONEY_CONFIRM.ADD_DATETIME'] = x[1]+"-"+x[2]
			    			if(value['MONEY_CONFIRM.STATE'] == 0){
			    				ifhavuedata1 = true
			    			} else if(value['MONEY_CONFIRM.STATE'] == 1){
			    				ifhavuedata2 = true
			    			}
			    		})
			    		that.typedata1 = ifhavuedata1
			    		that.typedata2 = ifhavuedata2
			    	})
	                 
	            },  
	            deep: true 
           }  
	    },
    	methods:{
    		todo(item){
   	    		navigator.push({
    				url: this.detailPage,
					query: '?id='+item['MONEY_CONFIRM.MONEY_CONFIRM_ID']
	    		})
    		},
    		viewEvent(name,call){
    			this[name](call)
    		},
    		getData(event){
	    		stream.fetch({
		    		method:'GET',
		    		url:this.getinfoApi,
		    	},res =>{
		    		this.payLists = res.data
		    		var that = this
		    		this.payLists.forEach(function(value,key) {
		    			value['MONEY_CONFIRM.ADD_DATETIME'] = value['MONEY_CONFIRM.ADD_DATETIME'].split(" ")[0]
		    			var x = value['MONEY_CONFIRM.ADD_DATETIME'].split("-")
		    			value['MONEY_CONFIRM.ADD_DATETIME'] = x[1]+"-"+x[2]
		    			if(value['MONEY_CONFIRM.STATE'] == 1){
		    				that.typedata2 = true
		    			} else if(value['MONEY_CONFIRM.STATE'] == 0){
		    				that.typedata1 = true
		    			}
		    		})
		    	})
    		},
    		toadd(){
    			navigator.push({
    				url: this.addPage,
    				query: '?from=receivelistPage'
    			},res=>{})
    		},
    		toback(){
    			navigator.pop()
    		},

    	}
    };
</script>
