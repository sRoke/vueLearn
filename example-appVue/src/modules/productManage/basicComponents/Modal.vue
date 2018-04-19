<template>
    <div class="page rgba4" @click="closeModal">
        <image class="liner" resize="cover" :src="icon.liner"></image>     
        <div class="con" @click="stopClick">
            <div class="header">
                <div class="icon-btn left" @click="backClick">
                    <image class="back" :src="icon.back"></image>
                </div>
                <text class="font">{{title}}</text>
                <div class="row right">
                    <div class="row">
                        <div class="icon-btn" @click="write" v-if="writeshow">
                            <image class="write" :src="icon.write"></image>
                        </div>
                        <div class="icon-btn" @click="add" v-if="addshow">
                            <image class="add" :src="icon.add"></image>
                        </div>
                    </div>
                    <div class="icon-btn" @click="conf" v-if="confshow">
                        <image class="conf" :src="icon.conf"></image>
                    </div>
                </div>
            </div> 
            <slot></slot>        
        </div>   
    </div>
</template>     
<style scoped>
    .page{
        position: absolute;
        bottom: 0;
        top: 0;
        left: 0;
        right: 0;
        justify-content: flex-end;
    }
    .header{
        width: 750px;
        height: 108px;
        justify-content: center;
        align-items: center;
        border-bottom-width: 1px;
        border-bottom-color: #D8D8D8;
    }
    .row{
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
    }
    .left {
        position: absolute;
        left: 0;
        top: 0;
    }
    .right{
        position: absolute;
        right: 0;
        top: 0;
    }
    .icon-btn{  
        height: 108px;
        padding-left: 30px;
        padding-right: 30px;
        justify-content: center;
        align-items: center;
    }
    .icon-btn:active{
        background-color: #d8d8d8;
    }
    .con{
        background-color: #fff;
        align-items: center;
    }
    .font{
        font-size: 38px;
        color: #333;
    }
    .close{
        width: 24px;
        height: 24px;
    }
    .conf{
        width: 41px;
        height: 31px;
    }
    .write{
        width: 29px;
        height: 35px;
    }
    .add{
        width: 41px;
        height: 41px;
    }
    .back{
        width: 17px;
        height: 31px;
    }
    .liner{
        width: 750px;
        height: 9px;
    }
    .rgba4{
        background-color: rgba(0,0,0,0.4)
    }
</style>
<script>
    export default {
        data() {
            return {
                icon: {
                    liner: 'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/orderIcon/liner.png',
                    back: 'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/orderIcon/itemBack.png',
                    add: 'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/baseIcon/addIcon.png',
                    write: 'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/product/wirte.png',
                    conf: 'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/orderIcon/confAction.png'
                }
            }
        },
        props:[
            'title',
            'confshow',
            'writeshow',
            'addshow'
        ],
        created(){

        },
        methods:{
            closeModal(){
                this.$emit('close','')
            },
            backClick(){
                this.$emit('back','')
            },
            write() {
                this.$emit('write','')
            },
            add() {
                this.$emit('add','')
            },
            conf(){
                this.$emit('conf','')
            },
            stopClick(){

            }
        }
    };
</script>