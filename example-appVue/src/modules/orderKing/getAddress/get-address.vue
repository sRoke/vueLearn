<template>
    <bu-view :config="configData" @event="viewEvent">
          <div class="list">
              <div class="item" v-for="item in addressList" @click="jumpToOrder(item)">
                  <div class="row-between">
                      <text class="fonts-34 fontc-red" v-if="item['USER_ADDR.IS_DEFAULT'] === '1'">（默认）</text>  
                      <text class="fonts-34 fontc-33 fw line1">{{item['USER_ADDR.USERNAME']}}（{{item['USER_ADDR.PHONE']}}）</text>
                  </div>
                  <div class="row-between">
                      <text class="fonts-30 fontc-66 line1">{{item.address}}</text>
                  </div>
              </div>
          </div>
    </bu-view>
</template>     
<style scoped>
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
    background-color: #D8D8D8;
   }
   .fw{
  /*  font-weight: bold;*/
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
    const modal = weex.requireModule('modal')
    export default {
        data() {
            return {
                configData:{
                    title: '选择收货地址',
                    titleAlgin: 'left',
                    bottom: '0px',
                    addEvent: 'addAddress',
                    btnText: '管理',
                    headerBtnType: 'default',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: 'refresh',
                    loadmore: false,
                    loadmoreEvent:'',
                    viewappear:'refresh'
                },
                getAddressApi:'/bee/user/useraddr/getByUid',
                addressList: [],
                uid:''
            };
        },
        components:{
            buView
        },
        props:[],
        created(){

        },
        mounted(){
            storage.getItem('select_client_msg',ret=>{
                this.uid = JSON.parse(ret.data)['BUYER.UID']
                this.configData.pageRender = true
                this.refresh()
            })         
        },
        methods:{
            viewEvent(name , call){
              this.uid && this[name](call)
            },
            refresh(){
              stream.fetch({
                    method:'GET',
                    url:this.getAddressApi+'?USER_ADDR.UID=' + this.uid
                },res =>{
                    if(res.data.length == 0){
                        modal.alert({message:'请添加收货地址'})
                        this.addressList = []
                    }else{
                        res.data.forEach(ele =>{
                            let add = ''
                            if(ele['USER_ADDR.ADDR_GUO'] == '中国'){
                                ele.address = (ele['USER_ADDR.ADDR_SHENG'] ? ele['USER_ADDR.ADDR_SHENG'] : '') + (ele['USER_ADDR.ADDR_SHI'] ? ele['USER_ADDR.ADDR_SHI'] : '') + (ele['USER_ADDR.ADDR_XIAN'] ? ele['USER_ADDR.ADDR_XIAN'] : '') + (ele['USER_ADDR.ADDR_DETAIL'] ? ele['USER_ADDR.ADDR_DETAIL'] : '')
                            }else{
                                ele.address = ele['USER_ADDR.ADDR_GUO'] + (ele['USER_ADDR.ADDR_DETAIL'] ? ele['USER_ADDR.ADDR_DETAIL'] : '')
                            }
                        })
                        this.addressList = res.data
                    }           
                },res =>{
                    this.configData.pageRender = false
                })
            },
            jumpToOrder(item){
                storage.setItem('select_address_msg',JSON.stringify(item),res=>{
                    navigator.pop()
                })
            },
            addAddress(){
              navigator.push({
                url:'/modules/orderKing/getAddress/address-list',
                query:'?id=' + this.uid
              })
            }
        },
    };
</script>