<template>
    <div class="item">
        <div class="row">
            <div class="btn btn-de" @click="discount">
                <text class="font30 fontc-red">小计</text>
            </div>
            <div class="btn btn-de" @click="remark">
                <text class="font30 fontc-red">备注</text>
            </div>
            <div class="btn btn-sm-de">
                <image :src="icon" class="schame"></image>    
            </div>
        </div>
        <div class="btn btn-pr" @click="submit">
            <text class="font30 fontc-ff">确定</text>
        </div>
    </div>
</template>
<style scoped>
    .item{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 750px;
        height: 245px;
        justify-content: center;
        background-color: #fff;
        padding-left:30px;
        padding-right: 30px;
    }
    .btn{
        height: 80px;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        border-width: 1px;
        border-color: #cf411b;
    }
    .row{
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
    }
    .btn-de{
        width: 258px;
    }
    .btn-sm-de{
        width: 116px;
    }
    .btn-pr{
        width: 690px;
        background-color: #cf411b;
    }
    .font30{
        font-size: 30px;
    }
    .fontc-red{
        color: #cf411b;
    }
    .fontc-ff{
        color: #fff;
    }
    .schame{
        width: 45px;
        height: 39px;
    }
    .btn-pr:active{
        background-color: #C5320A;
    }
    .btn-de:active{
        background-color: rgba(207,65,27,0.1);
    }
    .btn-sm-de:active{
        background-color: rgba(207,65,27,0.1);
    }
</style>
<script>
    export default {
        data(){
            return {
                icon: 'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/orderIcon/schame.png'
            }
        },
        methods:{
            discount(){
                this.$emit('discount')
            },
            remark(){
                this.$emit('remark')
            },
            submit(){
                this.$emit('submit')
            }
        }
    }
</script>