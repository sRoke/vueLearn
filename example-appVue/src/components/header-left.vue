<template>
    <!-- 头部大 -->
    <div class="head-warp" :class="[theme == 'dark' ? 'dark' : 'light']">        
        <text class="title" :class="[theme == 'dark' ? 'f-dark' : 'f-light']" @appear="hide" @disappear="show">{{title}}</text>
        <div class="scan-item" v-if="scan" @click="scanEvent">
            <image :src="icon" class="icon"></image>
            <text class="scan-t">点击扫码核销</text>
        </div>
    </div>
</template>     
<style scoped>
    .head-warp{
        flex-direction: row;        
        align-items: center;
        justify-content: space-between;
        padding-left: 30px;
        padding-top: 10px;
        height: 90px;
        width: 750px;
    }
    .scan-item{
        width: 239px;
        height: 65px;
        flex-direction: row;
        align-items: center;
        padding-left: 30px;
        background-color: #cf411b;
        border-bottom-left-radius: 50px;
        border-top-left-radius: 50px;
    }
    .dark{
        background-color: #171B22;
    }
    .light{
        background-color: #fff;
    }
    .f-dark{
        color: #fff;
    }
    .f-light{
        color: #333;
    }
    .scan-t{
        margin-left: 10px;
        font-size: 26px;
        color: #fff;
    }
    .scan-item:active{
        background-color: #CF320A;
    }
    .center{
        justify-content: center;
    }
    .icon{
        width: 32px;
        height: 32px;
    }
    .title{
        font-size: 50px;
        font-weight: 400;
    }
</style>
<script>
    export default {
        data() {
            return {
               icon:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/baseIcon/scan-white.png'
            };
        },
        props:['title','theme','scan'],
        created(){

        },
        methods:{
            hide(){
                this.$emit('hidden',false)
            },
            show(){
                this.$emit('hidden',true)
            },
            scanEvent(){
                this.$emit('scanevent')
            }
        }
    };
</script>