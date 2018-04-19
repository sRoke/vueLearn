<template>
  <bu-view :config="configData" @event="viewEvent">
      <div class="content">
        <div class="bold-lin"></div>
        <div class="header">        
          <div class="row">
            <text class="font-gray33 font30">商品</text> 
            <text class="font-gray33 font30">{{prdCountMsg}}</text> 
          </div>
          <text class="font-gray33 font30">小计</text> 
        </div>
        <div v-for="(item,index) in cartList" class="list" @click="setPrd(index)">

          <!-- 销售商品 -->
          <div class="item" v-for="(prd,index) in item.UNIT" v-if="prd.count > 0">
            <image :src="item['IMG'] | image(120)" class="item-img" resize="cover"></image>
            <div class="item-con">
              <text class="font-gray33 font32">{{item['NAME']}}</text>
              <text class="font-gray99 font30">{{item['CONTENT']}}</text>
              <div class="row-between mt-10">
                <div class="row">
                  <text class="font-gray33 font32">{{prd.price | price}}</text>
                  <text class="font-gray33 font28">   x{{prd.count}}{{prd.name}}</text>
                </div>
                <text class="font-gray33 font32">{{prd.sumPrice | price}}</text>  
              </div>
              <text class="font-red font28">{{prd['remark']}}</text>
            </div> 
          </div>

          <!-- 赠品 -->
          <div class="item" v-for="(prd,index) in item.UNIT" v-if="prd.presentCount > 0 && item.IS_PRESENT">
            <image :src="item['IMG'] | image(120)" class="item-img" resize="cover"></image>
            <div class="item-con">
              <text class="font-gray33 font32">{{item['NAME']}}</text>
              <text class="font-gray99 font30">{{item['CONTENT']}}</text>
              <div class="row-between mt-10">
                <div class="row">
                  <text class="font-gray33 font32">{{'0' | price}}</text>
                  <text class="font-gray33 font28">   x{{prd.presentCount}}{{prd.name}}</text>
                </div>
                <text class="font-gray33 font32">{{'0' | price}}</text>  
              </div>
              <text class="font-red font28">{{item['PRESENT_REMARK']}}</text>
            </div> 
          </div>

        </div>      
        <div class="item-foot" v-if="cartList.length > 0">
          <div class="row-between item-foot-w" v-if="discount > 0">
            <text class="font-gray66 font28">优惠:</text>
            <text class="font-gray33 font32">- {{discount | price}}</text>  
          </div>
          <div class="row-between item-foot-w" v-if="freight > 0">
            <text class="font-gray66 font28">运费:</text>
            <text class="font-gray33 font32">+ {{freight | price}}</text>  
          </div>
          <div class="row-between item-foot-w">
            <text class="font-gray66 font28">合计:</text>
            <text class="font-gray33 font40">{{sumOverPrice | price}}</text>  
          </div>
        </div>
      </div>
      <bottomBar slot="footer" :index="index" :client="clientId" @event="tabClick" @addprd="scanAddPrd" ref="button"></bottomBar>
      <confirm slot="footer" :price="sumOverPrice" :display="index" :payplan="payPlan" :payplan-list="payPlanList" :date="date" :discount="discount" :freight="freight" :address="address" :remark="remark" @getPayPlan="getPayPlan" @getInput="getInput" @close="close" @getDate="getDate" @submit="submit"></confirm> 
      <prdSetConfirm slot="footer" :display="setDisplay" :data="settingPrd" @close="closeSetConfirm" @delete="deletePrd" @change="changePrd"></prdSetConfirm>
  </bu-view>
</template>

<style scoped>
  .page{ 
    position: absolute;
    top: 0;
    left: 0;
    width: 750px;
    bottom: 0;
  }
  .footer{

  }
  .scrol{
    position: absolute;
    left: 0;
    width: 750px;
    bottom: 99px;
  }
  .row-between{
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .mt-10{
    margin-top: 13px;
  }
  .content{
    width: 750px;
    align-items: center;
  }
  .bold-lin{
    width: 700px;
    height: 3px;
    background-color: #000;
    margin-bottom: 3px;
  }
  .header{
    height: 88px;
    width: 700px;
    border-bottom-width: 1px;
    border-bottom-color: #000;
    border-top-width: 1px;
    border-top-color: #000;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

  }
  .item{
    flex-direction: row;
    justify-content: space-between;
    width: 700px;
    margin-top: 25px;
    margin-bottom: 25px;
  }
  .list:active{
    background-color: #D8D8D8;
  }
  .item-img{
    width: 148px;
    height: 148px;
  }
  .item-con{
    width: 527px;
  }
  .item-foot{
    width: 700px;
    border-top-width: 1px;
    border-top-color: #000;
    align-items: flex-end;
    padding-bottom: 50px;
  }
  .item-foot-w{
    width: 275px;
    margin-top: 30px;
  }
  .font24{
      font-size: 24px;
  }
  .font26{
      font-size: 26px;
  }
  .font28{
      font-size: 28px;
  }
  .font30{
      font-size: 30px;
  }
  .font32{
      font-size: 32px;
  }
  .font40{
      font-size: 40px;
  }
  .font42{
      font-size: 42px;
  }
  .bold{
      font-weight: bold;
  }
  .rgba4{
      background-color: rgba(0,0,0,0.4)
  }
  .font46{
      font-size: 46px
  }
  .font34{
      font-size: 34px;
  }
  .font60{
      font-size:60px;
  }
  .font-gray33{
      color:#333;
  }
  .font-gray66{
      color:#666;
  }
  .font-gray99{
      color:#999;
  }
  .font-white{
      color:#fff;
  }
  .font-red{
      color:#cf411b;
  }
  .margin-r20{
      margin-right: 20px;
  }
  .margin-r10{
      margin-right: 10px;
  }
  .margin-b18{
      margin-bottom: 18px;
  }
  .back-purple{
      background-color:#9839e6;
  }
  .back-orange{
      background-color:#fa7900;
  }
  .row{
      flex-direction:row;
      align-items: center;
  }
  .lines1{
    lines:1;
    text-align: center;
    text-overflow: ellipsis;
  }
</style>

<script>
  import buView from '../../components/bu-view.vue'
  import bottomBar from './components/bottom-bar.vue'
  import confirm from './components/confirm.vue'
  import prdSetConfirm from './components/prd-set-confirm.vue'
  import filters from '../../common/filters.js'
  import stream from '../../common/stream.js'
  import navigator from '../../common/navigator.js'
  import modal from '../../common/modal.js'

  const storage = weex.requireModule('storage')
  export default {
    data: {
        cartList:[],
        discount:0,
        freight:0,
        date:'',
        remark:'',
        orderId:'',
        index: -1,
        //获取付款方案               
        getPayPlanApi:'/pay/plan/queryAll',
        getAddressApi:'/bee/user/useraddr/getByUid?PAGE_SIZE=1&PN=1&USER_ADDR.UID=',
        postOrderApi:'/bee/order/new/parent/addByAdmin',
        postModifyApi:'/bee/order/new/parent/generalModifyOrder',
        payPlanList:[],
        settingPrd:[],
        payPlan:{},
        setDisplay: false,
        settingIndex: -1,
        showTitle: false,
        clientId:'',
        clientName:'',
        configData:{
            title: '',
            titleAlgin: 'center',
            secondTitle:'',
            bottom: '99px',
            pageRender: false,
            refresh:false,
            refreshEvent: 'refresh',
            loadmore: false,
            loadmoreEvent:'',
            viewappear:'refreshPrd'
        },
        address:{},
        render: false,
        pageType:{
          'delivery':{title:'部分交货',api:'/bee/order/new/parent/generalModifyOrder',tip:'确认修改并提交交货单？'},
          'order':{title:'访销订单',api:'/bee/order/new/parent/addByAdmin',tip:'确认提交订单？'}
        },
        thisType:'order'
    },
    filters:{
      image:filters.image,
      price:filters.price,
    },
    components:{
      buView,
      bottomBar,
      confirm,
      prdSetConfirm,
    },
    created(){
      let type = navigator.getQuery('type',this)
      if(type){
        this.thisType = type
        this.configData.title = this.pageType[type].title
      }else{
        this.configData.title = this.pageType['order'].title
      }
      if(type == 'delivery'){
        storage.getItem('SET_ORDER_INFO',res =>{
          let info = JSON.parse(res.data)
          this.clientName = info['USER_NAME']
          this.clientId = info['USER_ID']
          this.cartList = info.DETAIL
          this.address = JSON.parse(info['ORDER_ADDR'])
          this.discount = info.DISCOUNT
          this.freight = info.FREIGHT
          this.remark = info.REMARK
          this.date = info['DELIVERY_DATETIME']
          this.orderId = info['ORDER_ID']
          this.configData.secondTitle = this.clientName
        })
      }else{
        storage.getItem('select_client_msg',res =>{
          let msg = JSON.parse(res.data)
          this.clientName = msg['BUYER.BUYER_NAME']
          this.clientId = msg['BUYER.UID']
          this.configData.secondTitle = this.clientName
          storage.getItem(this.clientId + 'cart_list',res =>{
            if(res.result =='success'){
              this.cartList = JSON.parse(res.data)
            }
          })
          this.getAddress(this.clientId)
        })
      }    
    },
    mounted(){
    },
    methods:{
      viewEvent(event,callback){
          this[event](callback);
      },
      //  提交订单
      submit(){
        if(this.cartList.length > 0){
          let form = this.renderFormData()
          let control = this.pageType[this.thisType]
          modal.confirm({
            message: control.tip,
            okTitle:'确认',
            cancelTitle:'取消'
          },res =>{
            if(res === '确认'){
              this.configData.pageRender = true
              this.index = -1
              stream.fetch({
                method:'POST',
                url: control.api,
                body: form
              },res =>{
                this.cartList = []
                if(this.thisType == 'order'){
                  storage.removeItem(this.clientId + 'cart_list',res =>{
                    
                  }) 
                }else{
                  storage.setItem('order_page_refresh','true',res =>{
                    
                  })
                }
                modal.toast({message:'提交成功',duration:2})
                setTimeout(()=>{
                  navigator.pop()
                },1500)                         
              },() =>{
                this.configData.pageRender = false
              })
            }
          })
        }else{
          modal.toast({message:'请先选择商品',duration: 1})
        }
        
      },

      refreshPrd(){
        if(this.index == 2){
          storage.getItem('select_address_msg',res =>{
            if(res.result == 'success'){
              this.address = JSON.parse(res.data)
            }
            storage.removeItem('select_address_msg')        
          })
        }else{
          storage.getItem('new_cart_list',res =>{
            this.cartList = JSON.parse(res.data).concat( this.cartList )
            storage.removeItem('new_cart_list',res =>{
            })        
          })
        }       
      },
      tabClick(val){
        this.index = val
      },
      getPayPlan(val){
        this.payPlan = val
      },
      getInput(val,type){
        this[type] = val
      },
      getDate(ret){
        this.date = ret
      },
      close(){
        this.index = -1
      },
      closeSetConfirm(){
        this.setDisplay = false
      },
      deletePrd(){
        this.cartList.splice(this.settingIndex,1)
      },
      changePrd(obj){
        if(typeof obj == 'object'){
          if(this.settingIndex === -1){

            this.$refs.button.startScan()
            this.cartList.unshift(obj)
          }else{
            this.cartList[this.settingIndex] = obj
            this.$set(this.cartList,this.settingIndex,this.cartList[this.settingIndex])
          } 
        }else if(this.settingIndex !== -1){
          this.deletePrd()
        }
      },
      setPrd(index){
        this.settingIndex = index
        this.settingPrd = this.cartList[this.settingIndex]
        this.setDisplay = true
      },
      scanAddPrd(obj){
        this.settingIndex = -1
        this.settingPrd = obj
        this.setDisplay = true
      },
      hidden(ret){
        this.showTitle = ret
      },
      getAddress(id){
        stream.fetch({
            method:'GET',
            url:this.getAddressApi + id
        },res =>{   
            if(res.data.length > 0){
                this.address = res.data[0]
            }
        },res=>{

        })
      },
      renderFormData(){
        let prdList = []
        this.cartList.forEach(item => {
          item.UNIT.forEach(ele =>{
            if(ele.count > 0){
                prdList.push({
                  "ORDER_DETAIL.SKU_ID": item['SKU_ID'],
                  "ORDER_DETAIL.PRD_ID": item['PRD_ID'],
                  'ORDER_DETAIL.COUNT': ele.count,
                  'ORDER_DETAIL.PRD_PRICE': ele.price,
                  'ORDER_DETAIL.REMARK': ele.remark,
                  'ORDER_DETAIL.PRD_TYPE': 'PRD',
                  'ORDER_DETAIL.UNIT_TYPE': ele.type,
                  'IS_NEW_PRD': item['IS_ORIGINAL'] ? '' : 'true',
                  'ORDER_DETAIL.ORDER_WAIT_HAND_GOODS_DETAIL_ID' : item['IS_ORIGINAL'] ? item.ID : ''
                })    
            }
            if(ele.presentCount > 0 && item['IS_PRESENT']){
              prdList.push({
                  "ORDER_DETAIL.SKU_ID": item['SKU_ID'],
                  "ORDER_DETAIL.PRD_ID": item['PRD_ID'],
                  'ORDER_DETAIL.COUNT': ele.presentCount,
                  'ORDER_DETAIL.PRD_PRICE': '0',
                  'ORDER_DETAIL.REMARK': item.PRESENT_REMARK,
                  'ORDER_DETAIL.PRD_TYPE': 'PRESENT',
                  'ORDER_DETAIL.UNIT_TYPE': ele.type,
                  'IS_NEW_PRD': item['IS_ORIGINAL'] ? '' : 'true',
                  'ORDER_DETAIL.ORDER_WAIT_HAND_GOODS_DETAIL_ID' : item['IS_ORIGINAL'] ? item.ID : ''
                })
            }
          })
        })  
        return {
          "ORDER_WAIT_HAND_GOODS_BILL_ID": this.orderId,
          "TYPE": 'ORDER_DEILVERY',
          "SUM_FREIGHT_PRICE": this.freight,
          "DISCOUNT_PRICE": this.discount,
          "DELIVERY_ADDR_ID": this.address['USER_ADDR.ADDR_ID'],
          "DELIVERY_DATETIME": this.date,
          "REMARK": this.remark,
          "DELIVERY_ADDR": JSON.stringify(this.address),
          "ORDER_DETAILS": JSON.stringify(prdList),
        }
      }
    },
    computed:{
      prdCountMsg(){
        let obj = {
            'small' : 0,
            'big':0,
            'large': 0
        }
        let line = 0
        let p = 0
        this.cartList.forEach(item =>{
          item.UNIT.forEach(ele =>{
            if(ele.count > 0) {
                obj[ele.type] += ele.count/1
                line ++ 
            }
            if(ele.presentCount > 0) {
                p += ele.presentCount/1
                line ++
            }
          })
        })
        let ls = obj.large > 0 ? (obj.large + '大') : ''
        let ms = obj.big > 0 ? (obj.big + '中') : ''
        let ss = obj.small > 0 ? (obj.small + '小') : ''
        let ps = p > 0 ? (p + '赠') : ''
        return line > 0 ? ('（共' + line + '行，' + ls + ms + ss + ps + '）') : ''
      },
      sumOverPrice(){
        let s = 0
        this.cartList.forEach(item =>{
          item.UNIT.forEach(ele =>{
            if(ele.count > 0){
              s += (ele.count * ele.price)
            }
          })
        })
        return s - this.discount + this.freight/1
      }
    }
  }
</script>