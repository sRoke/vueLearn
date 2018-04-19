<!-- orderking select product display list -->

<template>
    <div class="content">
        <div class="bold-lin"></div>
        <div class="header">        
          <div class="row">
            <text class="font-gray33 font30">商品</text> 
            <text class="font-gray33 font30">{{prdCountMsg}}</text> 
          </div>
          <text class="font-gray33 font30">小计</text> 
        </div>
        <div v-for="(item,index) in list" class="list" @click="setPrd(index)">

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
        <div class="item-foot" v-if="prdCountMsg">
          <div class="row-between item-foot-w" v-if="discount">
            <text class="font-gray66 font28">优惠:</text>
            <text class="font-gray33 font32">- {{discount | price}}</text>  
          </div>
          <div class="row-between item-foot-w" v-if="freight">
            <text class="font-gray66 font28">运费:</text>
            <text class="font-gray33 font32">+ {{freight | price}}</text>  
          </div>
          <div class="row-between item-foot-w">
            <text class="font-gray66 font28">合计:</text>
            <text class="font-gray33 font40">{{overprice | price}}</text>  
          </div>
        </div>
      </div>
</template>
<style scoped> 
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
    import filters from '../../../common/filters.js'
    export default {
        props:['list','discount','freight','overprice'],
        filters:{
            image:filters.image,
            price:filters.price,
        },
        methods:{
            setPrd(index){
                this.$emit('event',index)
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
              this.list.forEach(item =>{
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
            }
        }
    }
</script>