<template>
    <div class="item">
        <div class="div">
            <div class="row">
                <div class="title">
                    <text class="font32 fc-33">付款</text>
                </div>              
                <div>
                    <div class="row-center">
                        <image class="icon" :src="payIcon"></image>
                        <text class="font-28 fc-33">已付：</text>
                        <text class="font-28 fc-33">{{msg.paied | price}}</text>
                    </div>
                    <div class="row-center">
                        <image class="icon"></image>
                        <text class="font-28 fc-33">待付：</text>
                        <text class="font-28 cred">{{msg.waitPay | price}}</text>
                    </div>
                </div>
            </div>
        </div>
        <image :src="liner" class="line" resize="cover"></image>
    </div>   
</template>
<style scoped>
    .item{
        width: 750px;
        align-items: center;    
    }
    .progress{        
        width: 690px;
        height: 7px;
        border-radius: 10px;
    }
    .title{
        width: 130px;
    }
    .bg-ac{
        background-color: #cf411b;
    }
    .bg{
        background-color: #EFEFEF;
    }
    .row{
        flex-direction: row;
    }
    .row-center{
        flex-direction: row;
        align-items: center;
    }
    .line{
        width: 690px;
        height: 1px;
    }
    .div{
        width: 690px;
        height: 135px;
        padding-left: 20px;
        padding-right: 20px;
        flex-direction: row;
        align-items: center;
    }
    .icon{
        width: 25px;
        height: 22px;
        margin-right: 20px;
    }
    .font32{
        font-size: 32px;
    }
    .font-28{
        font-size: 28px;
    }
    .fc-33{
        color: #333;
    }
    .c99{
        color: #999;
    }
    .cred{
        color: #cf411b;
    }
</style>
<script>
    import filters from '../../../common/filters.js'
    export default {
        data(){
            return {
                liner:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/orderIcon/line-xuxian.png',
                payIcon:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/orderIcon/payicon.png'
            }
        },
        filters:{
            price: filters.price
        },
        props:['msg'],
        methods:{
          
        }
    }
</script>