<template>
    <div class="item" @click="click">
        <text class="label" v-if="label === 'true'">*</text>  
        <div class="div">
            <text class="text" :class="[label === 'true' ? 'fw' : '']">{{title}}</text>
            <div class="row">
                <text class="input">{{value}}</text>    
                <image class="icon" src="http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/baseIcon/home-jump.png"></image>   
            </div>
        </div>
    </div>
</template>
<style scoped>
    .item{
        background-color: #fff;
        width: 750px;
        height: 97px;
        align-items: center;
    }
    .item:active {
        background-color: #D8D8D8;
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
    }
    .div{
        width: 690px;
        height: 97px;
        flex-direction: row;
        align-items: center;
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