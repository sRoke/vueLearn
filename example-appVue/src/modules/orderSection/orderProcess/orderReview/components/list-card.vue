<template>
    <div class="item">
        <div v-for="item in list">
            <div v-if="item['DATE']">
                <div class="title">
                    <text class="font42 fontc-33">{{item['DATE']}}</text>
                </div>
                <div class="big-div">
                    <div class="div-item">
                        <text class="font30 fontc-op">实收金额</text>
                        <text class="font60 fontc-red">{{item['SUM_REAL_PRICE'] | price}}</text>
                    </div>
                    <div class="div-item">
                        <text class="font30 fontc-op">挂账金额</text>
                        <text class="font60 fontc-red">{{item['SUM_DEPT_PRICE'] | price}}</text>
                    </div>
                </div>
            </div>         
            <div class="card" v-if="item['name']" @click="jump(item.id)">
                <div class="left-bar">
                    <div class="content">
                        <text class="font32 fontc-33 line1 mg">{{item['name']}}</text>                  
                        <text class="font30 fontc-66 line1">{{item['code']}}</text>
                    </div>
                </div>
                <div class="right-bar">
                    <text class="font34 fontc-33 mg">{{item['money'] | price}}</text>
                    <text class="font28 fontc-99">{{item['bigCount']?(item['bigCount']+'大'):''}}{{item['count']?(item['count'] + '小') : ''}}{{item['present']?(item['present'] + '赠'):''}}</text>
                </div>
            </div>
        </div>       
    </div>   
</template>
<style scoped>
    .item{
        width: 750px;
        align-items: center;
    }
    .title{
        width: 690px;
        height: 130px;
        padding-top: 20px;
        justify-content: center;
    }
    .big-div{
        background-color: #F7F7F7;
        width: 690px;
        height: 202px;
        border-radius: 18px;
        flex-direction: row;
        align-items:center;
    }
    .div-item{
        flex: 1;
        align-items: center;
        justify-content: center;
    }
    .card{
        width: 690px;
        height: 153px;
        flex-direction: row;
        align-items: center;
        border-bottom-width: 1px;
        border-bottom-color: #D8D8D8;
    }
    .card:active{
        
        background-color: #D8D8D8;
    }
    .row{
        flex-direction: row;
        align-items: center;
    }
    .line1{
        width: 400px;
        lines:1;
        text-overflow: ellipsis;
    }
    .left-bar{
        flex-direction: row;
        align-items: center;
    }
    .right-bar{
        position: absolute;
        height: 179px;
        right: 0;
        justify-content: center;
        align-items: flex-end;
    }
    .mg{
        margin-bottom: 5px;
    }
    .content{
        margin-left: 20px;
    }
    .font60{
        font-size: 60px;
    }
    .font42{
        font-size: 42px;
    }
    .font34{
        font-size: 34px;
    }
    .font32{
        font-size: 32px;
    }
    .font30{
        font-size: 30px;
    }
    .font28{
        font-size: 28px;
    }
    .fw{
        font-weight: bold;
    }
    .fontc-red{
        color: #cf411b;
    }
    .fontc-33{
        color: #000;
    }
    .fontc-66{
        color: #666;
    }
    .fontc-99{
        color: #999;
    }
    .fontc-op{
        color: #333;
        opacity: 0.69;
    }
</style>
<script>
    import filters from '../../../../../common/filters.js'
    import navigator from '../../../../../common/navigator.js'
    export default {
        data(){
            return {
            }
        },
        filters:{
            price: filters.price
        },
        props:['list'],
        methods:{
            jump(id){
                this.$emit('jump',id)
            }
        }
    }
</script>