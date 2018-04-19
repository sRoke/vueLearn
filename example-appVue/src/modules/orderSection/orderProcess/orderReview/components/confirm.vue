<template>
    <div class="window" v-if="show"  @click="close">
        <image :src="liner" class="line"></image>
        <div class="item" @click="stop" >
            <div class="header">               
                <div class="icon-div" @click="close">
                    <image :src="itemBack" class="back"></image>
                </div>   
                <text class="font38 fontc-33">{{title}}</text>
                <div class="icon-div" @click="ok">
                    <image :src="confAction" class="conf"></image>
                </div>                          
            </div>
            <slot></slot>        
        </div>
    </div>
</template>
<style scoped>
    .window{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        justify-content: flex-end;
        background-color: rgba(0,0,0,0.4);
    }
    .item{
        background-color: #fff;
    }
    .line{
        width: 750px;
        height: 9px;
    }
    .header{
        width: 750px;
        height: 115px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        border-bottom-color: #D8D8D8;
        border-bottom-width: 1px;
    }
    .conf{
        width: 41px;
        height: 31px;
    }
    .back{
        width: 17px;
        height: 31px;
        position: relative;
        right: 15px;
    }
    .icon-div{
        width: 100px;
        height: 100px;
        justify-content: center;
        align-items: center;
    }
    .icon-div:active{
        background-color: #D8D8D8;
    }
    .font38{
        font-size: 38px;
        font-weight: bold;
    }
    .fontc-33{
        color: #333;
    }
</style>
<script>
    export default {
        data(){
            return{
                confAction:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/orderIcon/confAction.png',
                itemBack:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/orderIcon/itemBack.png',
                liner:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/orderIcon/liner.png',
                show:false
            }
        },
        props:['title','content'],
        methods:{
            close(){
                this.show = false
            },
            ok(){
                this.$emit('ok')
            },
            stop(){} 
        }
    }
</script>