<template>
    <div class="table">
        <div class="head">
            <text class="title li-1">日期</text>
            <text class="title li-2">销售额</text>
            <text class="title li-3">退货金额</text>
            <text class="title li-4">{{ type ? '利润' : '利润率'}}</text>
        </div>
        <div class="line"></div>
        <div class="con" v-for="val in data.td">
            <text class="font li-1 font30">{{val.time}}</text>
            <text class="font li-2 font36">{{val.price}}</text>
            <text class="font li-3 font36">{{val.return}}</text>
            <text class="font li-4 font36" @click="change" :class="[parseFloat(type ? val.profits : val.margin) > 0 ? 'bg-red' : 'bg-green']">{{ type ? val.profits : val.margin}}</text>
        </div>    
    </div>
</template>
<style scoped>
    .table{
        width: 750px;
        background-color: #04050A;
    }
    .title{
        font-size: 28px;
        color: #888888;
    }
    .font36{
        font-size: 36px;
    }
    .font30{
        font-size: 30px;
    }
    .line{
        border-bottom-color: #2B2B2B;
        border-bottom-width: 1px;
    }
    .head{
        padding-left: 30px;
        padding-right: 30px;
        flex-direction: row;
        height: 94px;
        align-items: center;
        justify-content: space-between;
    }
    .con{
        padding-left: 30px;
        padding-right: 30px;
        flex-direction: row;
        height: 104px;
        align-items: center;
        justify-content: space-between;
    }
    .font{
        text-overflow: ellipsis;
        lines: 1;
        color: #fff;
    }
    .bg-green{
        padding-top: 10px;
        padding-bottom: 10px;
        border-radius: 4px;
        background-color: #49BA06;
    }
    .bg-red{
        padding-top: 10px;
        padding-bottom: 10px;
        border-radius: 4px;
        background-color: #B43100;
    }
    .li-1{
        width: 170px;
    }
    .li-2{
        width: 155px;
        text-align: right;
    }
    .li-3{
        width: 155px;
        text-align: right;
    }
    .li-4{
        width: 160px;
        padding-left: 5px;
        padding-right: 5px;
        text-align: right;
    }
</style>
<script>
    export default {
        data(){
            return {
                type:true
            }
        },
        props:['data'],
        methods:{
            change(){
                this.type = !this.type
            }
        }
    }
</script>