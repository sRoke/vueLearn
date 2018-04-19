<template>
    <div class="item" @click="click">
        <text class="label" v-if="label === 'true'">*</text>  
        <div class="div">
            <div class="title">
                <text class="text" :class="[label === 'true' ? 'fw' : '']">{{title}}</text>
            </div>
            <div>
                <div class="row">
                    <text class="input">{{value[0]}}</text>    
                    <image class="icon" src="http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/baseIcon/home-jump.png"></image>   
                </div>
                <div class="row1" v-if="value[1]">
                    <text class="input">{{value[1]}}</text>    
                    <image class="icon"></image>   
                </div>
                <div class="row1" v-if="value[2]">
                    <text class="input">{{value[2]}}</text>    
                    <image class="icon"></image>   
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
    .item{
        background-color: #fff;
        width: 750px;
        align-items: center;
    }
    .item:active {
        background-color: #D8D8D8;
    }
    .title{
        height: 97px;
        align-items: center;
        justify-content: center;
    }
    .label{
        position: absolute;
        top: 25px;
        left: 14px;
        font-size: 24px;
        color: #E32E1B;
    }
    .row{
        flex-direction: row;
        align-items: center;
        height: 97px;
    }
    .row1{
        flex-direction: row;
        height: 60px;
    }
    .div{
        width: 690px;
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
        border-bottom-width: 1px;
        border-bottom-color: #D8D8D8;
    }
    .input{
        font-size: 32px;
        padding-right: 20px;
        padding-left: 20px;
        width: 400px;
        color: #666;
        text-align: right;
    }
    .icon{
        width: 14px;
        height: 25px;
    }
    .text{
        font-size: 34px;
        color: #333;
    }
    .fw{
        font-weight: bold;
    }
</style>
<script>
    export default {
        data () {
            return {
            }
        },
        props: [
            'label',
            'title',
            'value'
        ],
        methods: {
            click() {
                this.$emit('clickEvent')
            }
        }
    }
</script>