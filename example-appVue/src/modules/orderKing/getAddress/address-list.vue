<template>
    <bu-view :config="configData" @event="viewEvent">
          <div class="list">
                <div class="item" v-for="item in addressList" @click="setDefault(item)">
                    <div>
                        <div class="row-between">
                            <text class="fonts-34 fontc-red" v-if="item['USER_ADDR.IS_DEFAULT'] === '1'">（默认）</text>  
                            <text class="fonts-34 fontc-33 fw line1">{{item['USER_ADDR.USERNAME']}}（{{item['USER_ADDR.PHONE']}}）</text>
                        </div>
                        <div class="row-between">
                            <text class="fonts-30 fontc-66 line1">{{item.address}}</text>
                        </div>
                    </div>
                    <div class="row-between">
                        <div class="btn" @click="del(item)">
                            <text class="fonts-28 fontc-red">删除</text>
                        </div>
                        <div class="btn" @click="setAddr(item)">
                            <text class="fonts-28 fontc-99">修改</text>
                        </div>
                    </div>
                </div>
          </div>
          <div slot="footer" class="foot">
            <div class="foot-btn" @click="addAddress">
                <text class="fonts-32 fontc-ff">新增收货地址</text>
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
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-top: 40px;
    padding-bottom: 40px;
    border-bottom-width: 1px;
    border-bottom-color: #EBEBEB;
   }
   .fw{
  /*  font-weight: bold;*/
   }
   .btn{
    padding: 10px;
   }
   .line1{
    width: 400px;
   }
   .fonts-34{
    font-size: 34px;
   }
   .fonts-32{
    font-size: 32px;
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
   .fontc-ff{
    color: #fff;
   }
   .fontc-red{
    color: #cf411b;
   }
   .foot{
    width: 750px;
    height: 140px;
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: #fff;
    flex-direction: row;
    justify-content: center;
    align-items: center;
   }
   .foot-btn{
    flex: 1;
    height: 80px;
    margin-left: 15px;
    margin-right: 15px;
    border-radius: 10px;
    justify-content: center;
    align-items: center;
    background-color: #cf411b;
   }
   .foot-btn:active{
    background-color: #C5320A;
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
                    title: '收货地址',
                    titleAlgin: 'left',
                    bottom: '140px',
                    addEvent: '',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: 'refresh',
                    loadmore: false,
                    loadmoreEvent:'',
                    viewappear:'refresh'
                },
                getAddressApi:'/bee/user/useraddr/getByUid',
                delAddressApi:'/bee/user/useraddr/delById',
                setDefaultApi:'/bee/user/useraddr/setDefaultAddr',
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
            del(item){
                modal.confirm({
                    message: '确认删除？',
                    okTitle:'确认',
                    cancelTitle:'取消'
                  },res =>{
                    if(res === '确认'){
                      this.configData.pageRender = true
                      stream.fetch({
                        method:'POST',
                        url: this.delAddressApi,
                        body: {
                            'USER_ADDR.ADDR_ID' : item['USER_ADDR.ADDR_ID'],
                            'USER_ADDR.UID' : this.uid
                        }
                      },res =>{
                        this.refresh()             
                      },() =>{
                        this.configData.pageRender = false
                      })
                    }
                })
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
            setDefault(item){
                if(item['USER_ADDR.IS_DEFAULT'] !== '1'){
                    modal.confirm({
                        message: '确认设置为默认地址？',
                        okTitle:'确认',
                        cancelTitle:'取消'
                      },res =>{
                        if(res === '确认'){
                          this.configData.pageRender = true
                          stream.fetch({
                            method:'POST',
                            url: this.setDefaultApi,
                            body: {
                                'USER_ADDR.ADDR_ID' : item['USER_ADDR.ADDR_ID'],
                                'USER_ADDR.UID' : this.uid
                            }
                          },res =>{
                            this.refresh()             
                          },() =>{
                            this.configData.pageRender = false
                          })
                        }
                    })
                }
            },
            addAddress(){
              navigator.push({
                url:'/modules/orderKing/getAddress/address-detail',
                query:'?id=' + this.uid + '&type=new'
              })
            },
            setAddr(item){
                storage.setItem('modify_addr_data', JSON.stringify(item),res =>{
                    navigator.push({
                        url:'/modules/orderKing/getAddress/address-detail',
                        query:'?id=' + this.uid + '&type=modify'
                    })
                })
            }
        },
    };
</script>