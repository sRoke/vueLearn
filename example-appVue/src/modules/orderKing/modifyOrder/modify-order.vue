<!-- 访销订单 开单 -->
<template>
  <bu-view :config="configData" @event="viewEvent">
      <prd-list :list="cartList" @event="setPrd" :overprice="sumOverPrice" :discount="discount" :freight="freight" ></prd-list>
      <bottomBar slot="footer" :index="index" :client="clientId" @event="tabClick" :type="'add'" @addprd="scanAddPrd" ref="button"></bottomBar>
      <confirm slot="footer" :price="sumOverPrice" :display="index" :payplan="payPlan" :payplan-list="payPlanList" :date="date" :discount="discount" :freight="freight" :address="address" :remark="remark" @getPayPlan="getPayPlan" @getInput="getInput" @close="close" @getDate="getDate" @submit="submit"></confirm> 
      <prdSetConfirm slot="footer" :display="setDisplay" :data="settingPrd" @close="closeSetConfirm" @delete="deletePrd" @change="changePrd"></prdSetConfirm>
      <success-tip slot="footer" :show="showSucess" :name="configData.secondTitle" :money="orderPrice" :tip="'订单修改成功'" :btn1="'false'" @jump="jumpDetail" @close="closeSccess"></success-tip>
  </bu-view>
</template>
<script>
  import buView from '../../../components/bu-view.vue'
  import bottomBar from '../components/bottom-bar.vue'
  import successTip from '../components/success-tip.vue'
  import prdList from '../components/prd-list.vue'
  import confirm from '../components/confirm.vue'
  import prdSetConfirm from '../components/prd-set-confirm.vue'
  import stream from '../../../common/stream.js'
  import navigator from '../../../common/navigator.js'
  import modal from '../../../common/modal.js'
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
            title: '修改订单',
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
        showSucess: false,
        orderPrice: 0,
        visitId:''
    },
    components:{
      buView,
      prdList,
      bottomBar,
      confirm,
      prdSetConfirm,
      successTip
    },
    created(){    
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
          modal.confirm({
            message: '确认提交订单？',
            okTitle:'确认',
            cancelTitle:'取消'
          },res =>{
            if(res === '确认'){
              this.configData.pageRender = true
              this.index = -1
              stream.fetch({
                method:'POST',
                url: this.postModifyApi,
                body: form
              },res =>{
                this.orderPrice = this.sumOverPrice
                this.cartList = []
                this.showSucess = true
                storage.setItem('order_page_refresh','true',res=>{})
                this.orderId = res.extraData['ORDER_PARENT.ORDER_PARENT_ID']                 
              },() =>{
                this.configData.pageRender = false
              })
            }
          })
        }else{
          modal.toast({message:'请先选择商品',duration: 1})
        }
        
      },
      closeSccess(){
        this.showSucess = false
      },
      jumpDetail(){
        navigator.push({
          url:'/modules/orderSection/salemanOrder/order-detail',
          query:'?id=' + this.orderId
        })
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
            
                storage.removeItem('new_cart_list',res =>{})         
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
      setPrd(index){
        this.settingIndex = index
        this.settingPrd = this.cartList[this.settingIndex]
        this.setDisplay = true
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
      scanAddPrd(obj){
        this.settingIndex = -1
        this.settingPrd = obj
        this.setDisplay = true
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
                  'ORDER_DETAIL.UNIT_TYPE': ele.type
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
                  'ORDER_DETAIL.UNIT_TYPE': ele.type
                })
            }
          })
        })  
        return {
            "ORDER_PARENT.UID": this.clientId,
            "ORDER_PARENT.USER_NAME":this.clientName,
            "ORDER_PARENT.FREIGHT_PRICE": this.freight,
            "ORDER_PARENT.DISCOUNT_PRICE": this.discount,
            "ORDER_PARENT.DELIVERY_ADDR_ID": this.address['USER_ADDR.ADDR_ID'],
            "ORDER_PARENT.DELIVERY_DATETIME": this.date,
            "ORDER_PARENT.REMARK": this.remark,
            "ORDER_PARENT.DELIVERY_ADDR": JSON.stringify(this.address),
            "ORDER_PARENT.ORDER_DETAILS": JSON.stringify(prdList),
            "ORDER_PARENT_ID": this.orderId,
            "TYPE": 'ORDER_PARENT',
        }
        
      }
    },
    computed:{
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