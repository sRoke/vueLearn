<template>
    <div class="item" :style="{top:top}" v-if="show" @click="stop">
        <image class="icon-item" :src="icon"></image>
        <text class="font38 fontc-33">{{name}}</text>
        <text class="font28 fontc-99">{{tip}}</text>
        <text class="font80">{{money | price}}</text>
        <div class="foot">
            <div class="btn btn-1" @click="jump" v-if="btn1 !== 'false'">
                <text class="font30 fontc-red">查看详情</text>
            </div>
            <div class="btn btn-1" @click="close">
                <text class="font30 fontc-red">继续创建</text>
            </div>
            <div class="btn bg-red" @click="back">
                <text class="font30 fontc-ff">返回</text>
            </div>
        </div>
    </div>
</template>
<style scoped>
    .item{
        position: absolute;
        top: 78px;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #FFF;
        align-items: center;
    }
    .foot{
        width: 750px;
        position: absolute;
        bottom: 0;
        align-items: center;
    }
    .btn{
        width: 690px;
        height: 80px;
        border-radius: 10px;
        border-width: 1px;
        border-color: #cf411b;
        justify-content: center;
        align-items: center;
        margin-bottom: 30px;
    }
    .icon-item{
        margin-top: 75px;
        width: 162px;
        height: 162px;
    }
    .font28{
        font-size: 28px;
        margin-top: 7px;
    }
    .font30{
        font-size: 30px;
    }
    .font38{
        font-size: 38px;
        margin-top: 35px;
    }
    .font80{
        font-size: 80px;
        margin-top: 40px;
    }
    .fontc-red{
        color: #cf411b;
    }
    .fontc-33{
        color: #333;
    }
    .fontc-ff{
        color: #fff;
    }
    .fontc-99{
        color: #999;
    }
    .bg-red{
        background-color: #cf411b;
    }
    .bg-red:active{
        background-color: #CF320A;
    }
    .btn-1:active{
        background-color: rgba(207,65,27,0.1)  
    }
</style>
<script>
    import filters from '../../../common/filters.js'
    import navigator from '../../../common/navigator.js'
    const event = weex.requireModule('event')
    export default {
        data(){
            return {
                icon : 'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/orderIcon/successTip.png',
                top:''
            }
        },
        filters:{
            price: filters.price
        },
        props:['show','name','tip','money','btn1'],
        mounted(){
            let config = weex.config.env
            let dpr = 1
            let device = config.osName
            let height = 0
            let bg = "#FFFFFF"
            if(device == 'android'){
              if(config.osVersion/1 < 6){
                bg = '#171B22'
              }
              dpr = 750/config.deviceWidth
            }else{
              dpr = config.scale * 750/config.deviceWidth
            }
            if(typeof event.setStyle == 'function'){
              event.setStyle(true,true,bg,res =>{
                height = res/1 * dpr
                this.top = height + 78 + 'px'
              })
            }else{
                this.top = '78px'
            }
                
        },
        methods:{
            jump(){
                this.$emit('jump')
            },
            close(){
                this.$emit('close')
            },
            back(){
                navigator.pop({'animated':'false'},res=>{
                })
            },
            stop(){}
        }
    }
</script>