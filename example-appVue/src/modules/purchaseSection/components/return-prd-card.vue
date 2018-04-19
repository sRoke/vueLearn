<template>
    <div class="card">
        <!-- <div class="bold-lin"></div> -->
        <div class="header">        
          <div class="row">
            <text class="font-gray33 font34">商品</text> 
            <text class="font-gray33 font34">（{{sumCountMsg}}）</text> 
          </div>
          <text class="font-gray33 font34">小计</text> 
        </div>
        <div class="item" v-for="item in list">
            <image :src="item['PURCHASE_RETURN_BILL_DETAIL.PRD_IMG'].COVER ? item['PURCHASE_RETURN_BILL_DETAIL.PRD_IMG'].COVER : JSON.parse(item['PURCHASE_RETURN_BILL_DETAIL.PRD_IMG']).COVER | image(120)" resize="cover" class="item-img"></image>
            <div class="item-con">
              <text class="font-gray33 font32">{{item['PURCHASE_RETURN_BILL_DETAIL.PRD_NAME']}}</text>
              <text class="font-gray99 font30">{{item['PURCHASE_RETURN_BILL_DETAIL.SKU_CONTENT']}}</text>
              <div class="row-between mt-10">
                <div class="row">
                  <text class="font-gray33 font32">{{item['PURCHASE_RETURN_BILL_DETAIL.RETURN_PRICE'] | price}}</text>
                  <text class="font-gray33 font28">   x{{item['PURCHASE_RETURN_BILL_DETAIL.RETURN_COUNT'] | count}}{{item['PURCHASE_RETURN_BILL_DETAIL.RETURN_UNIT']}}</text>
                </div>
                <text class="font-gray33 font32">{{item['PURCHASE_RETURN_BILL_DETAIL.RETURN_COUNT'] * item['PURCHASE_RETURN_BILL_DETAIL.RETURN_PRICE'] | price}}</text>  
              </div>
              <text class="font-red font28 mt-10">{{item['PURCHASE_RETURN_BILL_DETAIL.REMARK']}}</text>
            </div> 
        </div>
        <div class="item-foot">
          <div class="row-between item-foot-w" v-if="msg.discount">
            <text class="font-gray66 font28">优惠:</text>
            <text class="font-gray33 font32">- {{msg.discount | price}}</text>  
          </div>
          <div class="row-between item-foot-w" v-if="msg.freight">
            <text class="font-gray66 font28">运费:</text>
            <text class="font-gray33 font32">+ {{msg.freight | price}}</text>  
          </div>
          <div class="row-between item-foot-w">
            <text class="font-gray66 font28">合计:</text>
            <text class="font-gray33 font40">{{msg.overPrice | price}}</text>  
          </div>
        </div>
    </div>  
</template>
<style scoped>
    .card{
        width: 750px;
        align-items: center;
    }
    .row-between{
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .mt-10{
    margin-top: 13px;
  }
  .bold-lin{
    width: 690px;
    height: 3px;
    background-color: #000;
    margin-top: 30px;
    margin-bottom: 3px;
  }
  .header{
    height: 98px;
    width: 690px;
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
    width: 690px;
    margin-top: 25px;
    margin-bottom: 25px;
  }
  .item-img{
    width: 148px;
    height: 148px;
  }
  .item-con{
    width: 527px;
  }
  .item-foot{
    width: 690px;
    border-top-width: 1px;
    border-top-color: #000;
    align-items: flex-end;
    padding-bottom: 150px;
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
  .font-red{
      color:#cf411b;
  }
  .row{
      flex-direction:row;
      align-items: center;
  }
</style>
<script>
    import filters from '../../../common/filters.js'
    export default {
        data(){
            return {

            }
        },
        props:['list','msg'],
        filters:{
            image: filters.image,
            price: filters.price,
            count: filters.count
        },
        computed:{
            sumCountMsg(){
                let a = this.list.length
                let l = 0
                let m = 0
                let s = 0
                let d = 0
                this.list.forEach(ele =>{
                    let count = ele['PURCHASE_RETURN_BILL_DETAIL.RETURN_COUNT']/1
                    if(ele['PURCHASE_RETURN_BILL_DETAIL.UNIT_TYPE'] == 'large'){
                        l += count
                    }else if(ele['PURCHASE_RETURN_BILL_DETAIL.UNIT_TYPE'] == 'big'){
                        m += count
                    }else if(ele['PURCHASE_RETURN_BILL_DETAIL.UNIT_TYPE'] == 'small'){
                        s += count
                    }
                })
                return a == 0 ? '' : '共' + a + '行，' +( l > 0 ? l + '大' : '') + ( m > 0 ? m + '中' : '') + ( s > 0 ? s + '小' : '')+( d > 0 ? d + '赠' : '')
            }
        }
    }
</script>