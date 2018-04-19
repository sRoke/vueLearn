<template>
    <div class="card">
        <div class="header">        
          <div class="row">
            <text class="font-gray33 font34">商品</text> 
            <text class="font-gray33 font34">{{sumCountMsg}}</text> 
          </div>
          <text class="font-gray33 font34">小计</text> 
        </div>
        <div class="item" v-for="(item,index) in list" @click="event(item)">
          <div class="item-title">
            <text class="font-gray33 font32">{{item.INDEX}}</text>
          </div>
            <div class="item-con">
              <div class="row-between">
                <text class="font-gray33 font32 line1">{{item.NAME}}</text>
                <image :src="icon" class="icon" v-if="display"></image>
              </div>       
              <text class="font-gray99 font30 line1">{{item.CONTENT}}</text>
              <div class="row-between mt-10">
                <div class="row">
                  <text class="font-gray33 font32">{{item.PRICE | price}}</text>
                  <text class="font-gray33 font28">   x{{item.COUNT | count}}{{item.UNIT}}</text>
                </div>
                <text class="font-gray33 font32">{{item.PRICE * item.COUNT | price}}</text>  
              </div>
              <text class="font-red font28 mt-10">{{item.REMARK}}</text>
            </div> 
        </div>
        <div class="line"></div>
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
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

  }
  .item{
    flex-direction: row;
    justify-content: space-between;
    width: 690px;
    padding-top: 25px;
    padding-bottom: 25px;
  }
  .item:active{
    background-color: #D8D8D8;
  }
  .item-title{
    width: 48px;
    padding-top: 2px;
  }
  .item-con{
    width: 635px;
  }
  .item-foot{
    width: 690px;
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
  .line1{
    width: 580px;
    lines: 1;
    text-overflow: ellipsis;
  }
  .line{
    width: 690px;
    border-bottom-width: 1px;
    border-bottom-color: #000;
  }
  .icon{
    width: 14px;
    height: 24px;
  }
</style>
<script>
    import filters from '../../../../../common/filters.js'
    export default {
        data(){
            return {
              icon:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/orderIcon/itemGo.png'
            }
        },
        props:['list','display'],
        filters:{
            price: filters.price,
            count: filters.count
        },
        methods:{
          event(val){
            if(this.display){
              this.$emit('event',val)
            }  
          }
        },
        computed:{
            sumCountMsg(){
                let a = this.list.length
                let b = 0
                let m = 0
                let s = 0
                this.list.forEach(ele =>{
                    let count = ele.COUNT/1
                    if(ele['UNIT_TYPE'] == 'large'){
                        b += count
                    }else if(ele['UNIT_TYPE'] == 'big'){
                        m += count
                    }else if(ele['UNIT_TYPE'] == 'small'){
                        s += count
                    }
                })
                return a == 0 ? '' : '（共' + a + '行，' + ( b > 0 ? b + '大' : '') + ( m > 0 ? m + '中' : '') + ( s > 0 ? s + '小' : '') + '）'
            }
        }
    }
</script>