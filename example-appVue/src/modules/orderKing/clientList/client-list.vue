<template>
    <bu-view :config="configData" @event="viewEvent">
      <div class="list">
          <div class="item" v-for="item in clientList" @click="jumpToOrder(item)">
                <text class="fonts-34 fontc-33 fw line1">{{item['BUYER.BUYER_NAME']}}</text>
                <div class="row-between">
                    <text class="fonts-30 fontc-66 line1">{{item['BUYER.ADDRESS']}}</text>
                    <!-- <text class="fonts-28 fontc-99">3.5km</text> -->
                </div>
                <!-- <text class="fonts-26 fontc-66">新零售企业</text>
                <div class="row">
                    <div class="tag">
                        <text class="fonts-22 fontc-red">渠道商</text>
                    </div>
                    <div class="tag">
                        <text class="fonts-22 fontc-red">渠道商</text>
                    </div>
                </div> -->
          </div>
        </div>
    </bu-view>
            
</template>     
<style scoped>
   .page{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
   }
   .scrol{
    position: absolute;
    top: 78px;
    bottom: 0px;
    left: 0px;
    width: 750px;
   }
   .tag{
    margin-top: 10px;
    margin-right: 10px;
    border-width: 1px;
    border-color: #cf411b;
    border-radius: 3px;
    padding-top: 3px;
    padding-bottom: 3px;
    padding-right: 8px;
    padding-left: 8px;
   }
   .list{
     align-items: center;
   }
   .row{
    flex-direction: row;
   }
   .row-between{
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
   }
   .item{
    width: 690px;
    padding-top: 40px;
    padding-bottom: 40px;
    border-bottom-width: 1px;
    border-bottom-color: #EBEBEB;
   }
   .item:active{
    background-color: #d8d8d8;
   }
   .fw{
    font-weight: bold;
   }
   .line1{
    width: 600px;
    lines:1;
    text-overflow: ellipsis;
   }
   .fonts-34{
    font-size: 34px;
   }
   .fonts-30{
    font-size: 30px;
   }
   .fonts-28{
    font-size: 28px;
   }
   .fonts-26{
    font-size: 26px;
   }
   .fonts-22{
    font-size: 22px;
   }
   .fontc-66{
    color: #666;
   }
   .fontc-99{
    color: #999;
   }
   .fontc-33{
    color: #333;
   }
   .fontc-red{
    color: #cf411b;
   }
</style>
<script>
    import buView from '../../../components/bu-view.vue'
    import stream from '../../../common/stream.js'
    import navigator from '../../../common/navigator.js'
    const storage = weex.requireModule('storage')
    export default {
        data() {
            return {
                title: '选择客户',
                getClientApi:'/buyer/queryAll',
                showTitle: false,
                clientList: [],
                type:'',
                configData:{
                    title: '选择客户',
                    titleAlgin: 'left',
                    secondTitle:'',
                    bottom: '0px',
                    addEvent: 'add',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: 'refresh',
                    loadmore: false,
                    loadmoreEvent:'',
                },
            };
        },
        components:{
            buView
        },
        props:[],
        created(){
          this.type = navigator.getQuery('type',this)
        },
        mounted(){
            this.configData.pageRender = true
            stream.fetch({
                method:'GET',
                url:this.getClientApi
            },res =>{
                this.clientList = res.data
            },res =>{
              this.configData.pageRender = false
            })
        },
        methods:{
            hidden(ret){
                this.showTitle = ret
            },
            jumpToOrder(item){
                storage.setItem('select_client_msg',JSON.stringify(item),res=>{
                    let url  
                    if(this.type == 'add'){
                      url = '/modules/orderKing/addOrder/add-order'
                    }else if(this.type == 'return'){
                      url = '/modules/orderKing/returnOrder/return-order'
                    }
                    navigator.push({
                        url:url
                    },res=>{})
                })
            } 
        },
    };
</script>