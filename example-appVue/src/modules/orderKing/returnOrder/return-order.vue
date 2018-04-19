<!-- 访销订单 退货 -->
<template>
  <bu-view :config="configData" @event="viewEvent">
      <prd-list :list="cartList" @event="setPrd" :overprice="sumOverPrice"></prd-list>
      <bottomBar slot="footer" :index="index" @event="tabClick" :client="clientId" :type="'return'" @addprd="scanAddPrd" ref="button"></bottomBar>
      <confirm slot="footer" :price="sumOverPrice" :display="index" :remark="remark" :returntype="returnType" :returnmoney="returnMoney" @getInput="getInput" @close="close" @submit="submit" @getReturnType="getReturnType"></confirm> 
      <prdSetConfirm slot="footer" :display="setDisplay" :data="settingPrd" @close="closeSetConfirm" @delete="deletePrd" @change="changePrd"></prdSetConfirm>
      <success-tip slot="footer" :show="showSucess" :name="configData.secondTitle" :money="returnMoney" :tip="'新退货单创建成功'" @jump="jumpDetail" @close="closeSccess"></success-tip>
  </bu-view>
</template>
<script>
  import buView from '../../../components/bu-view.vue'
  import bottomBar from '../components/bottom-bar.vue'
  import prdList from '../components/prd-list.vue'
  import successTip from '../components/success-tip.vue'
  import confirm from '../components/confirm.vue'
  import prdSetConfirm from '../components/prd-set-confirm.vue'
  import stream from '../../../common/stream.js'
  import navigator from '../../../common/navigator.js'
  import modal from '../../../common/modal.js'

  const storage = weex.requireModule('storage')
  export default {
    data: {
        cartList:[],
        remark:'',
        orderId:'',
        index: -1,

        returnOrderApi:'/bee/returnOrder/order/addOrderReturn',

        settingPrd:[],
        payPlan:{},
        setDisplay: false,
        settingIndex: -1,
        showTitle: false,
        clientId:'',
        clientName:'',
        configData:{
            title: '访销退货',
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
        returnType:{
            name:'退款并退货',
            type:'GOODS_MONEY'
        },
        returnMoney:'',
        showSucess: false,
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
        storage.getItem('select_client_msg',res =>{
          let msg = JSON.parse(res.data)
          this.clientName = msg['BUYER.BUYER_NAME']
          this.clientId = msg['BUYER.UID']
          this.configData.secondTitle = this.clientName
          // 获取签到信息  如果对相应的客户和当前选中客户是用一个  则表示在拜访中
          storage.getItem('visitInfo',res =>{
            if(res.result == 'success' && res.data != ''){
              let client = JSON.parse(res.data)
              if(this.clientId == client['VISIT_LIST.CLIENT_ID']){
                this.visitId = client['VISIT_LIST.VISIT_LIST_ID']
              }
            }
          })
          storage.getItem(this.clientId + 'return_cart_list',res =>{
            if(res.result =='success'){
              this.cartList = JSON.parse(res.data)
            }
          })
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
            message: '确认退货？',
            okTitle:'确认',
            cancelTitle:'取消'
          },res =>{
            if(res === '确认'){
              this.configData.pageRender = true
              this.index = -1
              stream.fetch({
                method:'POST',
                url: this.returnOrderApi,
                body: form
              },res =>{
                storage.removeItem(this.clientId + 'return_cart_list',res =>{}) 
                this.cartList = []
                this.showSucess = true
                this.orderId = res.extraData['orderId']                         
              },() =>{
                this.configData.pageRender = false
              })
            }
          })
        }else{
          modal.toast({message:'请先选择退货商品',duration: 1})
        }
        
      },
      closeSccess(){
        this.showSucess = false
      },
      jumpDetail(){
        navigator.push({
          url:'/modules/orderSection/salemanOrder/return-order-detail',
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
            storage.setItem(this.clientId + 'return_cart_list',JSON.stringify(this.cartList),res => {
              storage.removeItem('new_cart_list',res =>{
              })
            })          
          })
        }       
      },
      tabClick(val){
        this.returnMoney = this.sumOverPrice
        this.index = val
      },
      getReturnType(val){
        this.returnType = val
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
        storage.setItem(this.clientId + 'return_cart_list',JSON.stringify(this.cartList))
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
                  "SKU_ID": item['SKU_ID'],
                  "PRD_ID": item['PRD_ID'],
                  'COUNT': ele.count,
                  'PRICE': ele.price,
                  'REMARK': ele.remark,
                  'UNIT_TYPE': ele.type
                })    
            }
          })
        })   
        return {
            "UID": this.clientId,
            "NAME":this.clientName,
            "RETURN_TYPE": this.returnType.type,
            "SUM_PRICE": this.returnMoney,
            "REMARK": this.remark,
            "ORDER_DETAIL_LIST": JSON.stringify(prdList),
            "VISIT_LIST_ID": this.visitId
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
        return s
      }
    }
  }
</script>