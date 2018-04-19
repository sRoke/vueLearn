<template>
    <div class="listall">
        <scroller class='scrol1' show-scrollbar="false">
            <div class="item" v-for="(item,index) in list" @click="select(index)">
                <text class="text">{{item['BUYER_LEVEL.LEVEL_NAME']}}</text>
                <image class="icon" :src="index === nowIndex ? iconAc : icon"></image>   
            </div>
        </scroller>
    </div>
</template>
<style scoped>
    .listall{
        height: 575px;
        overflow-y: scroll;
    }
    .text{
        font-size: 32px;
        color: #333;
    }
    .item{
        width: 750px;
        height: 115px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding-left: 30px;
        padding-right: 30px;
        border-bottom-width: 1px;
        border-bottom-color: #D8D8D8;
    }
    .item:active{
        background-color: #D8D8D8;
    }
    .icon{
        width: 42px;
        height: 42px;
    }
</style>
<script>
    export default {
        data(){
            return {
                iconAc:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/baseIcon/radioAction.png',
                icon:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/baseIcon/radioDefault.png',
                nowIndex: ''
            }
        },
        mounted(){
            this.nowIndex = this.index
        },
        props:['list','index'],
        methods:{
            select(index){
                this.nowIndex = index
            }
        }
    }
</script>
