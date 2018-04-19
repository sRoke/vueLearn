<template>
    <div>
        <div class="nav">
            <div class="btn">
                <image :src="icon" class="icon"></image>
            </div>
            <div class="row">
                <text class="font">近30天</text>
            </div>
            <div class="btn">
                <image :src="icon" class="icon tran"></image>
            </div>
        </div>   
    </div>
</template>
<style scoped>
    .nav{
        height: 110px;
        width: 750px;
        background-color: #171B22;
        padding-left: 30px;
        padding-right: 30px;
        padding-top: 40px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .foc-red{
        color: #cf411b;
    }
    .icon-div{
        width: 20px;
        align-items: center;
        justify-content: center;
    }
    .item{
        background-color: #171B22;
        height: 80px;
        width: 750px;
        justify-content: center;
        align-items: center;
    }
    .item:active{
        background-color: #04050A;
    }
    .select{
        position: absolute;
        top: 110px;
        bottom: 0px;
        background-color: rgba(0,0,0,0.4);
        width: 750px;
        padding-bottom: 10px;
    }
    .font{
        margin-right: 10px;
        font-size: 30px;
        color: #fff;
    }
    .font28{
        color: #fff;
        font-size: 28px;
    }
    .btn{
        width: 47px;
        height: 47px;
        border-radius: 50px;
        justify-content: center;
        align-items: center;
        background-color: #292929;
    }
    .btn:active{
        background-color: #04050A;
    }
    .row{
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .icon{
        width: 10.58px;
        height: 18.8px;
    }
    .tran{
        transform: rotate(180deg);
    }
    .down{
        transform: rotate(-90deg);
    }
</style>
<script>
    export default {
        data(){
            return {
                icon:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/baseIcon/backWhiteIcon.png',
            }
        },
        methods:{
            
        }
    }
</script>