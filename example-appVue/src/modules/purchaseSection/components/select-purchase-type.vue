<template>
    <!-- 访销订单基本信息设置 -->
    <div class="page rgba4" @click="closeConfirm" v-if="show"> 
        <image class="liner" resize="cover" :src="liner"></image>       
        <div class="con" @click="stopClick">    
            <div class="header">
                <div class="icon-btn" @click="closeConfirm">
                    <image class="back" :src="back"></image>
                </div>
                <text class="font42 font-gray33">入库</text>
                <div class="icon-btn" @click="closeOrSelect">
                    <image class="conf" :src="conf"></image>
                </div>
            </div>  
            <div class="select">
                <div class="sec" @click="selectTrue">
                    <image class="icon" :src="type? doneAcIcon : doneIcon"></image>
                    <text class="font26" :class="[type?'fontc-red':'fontc-66']">直接入库</text>
                </div>
                <div class="sec" @click="selectFalse">
                    <image class="icon" :src="type? waitIcon : waitAcIcon"></image>
                    <text class="font26" :class="[type?'fontc-66':'fontc-red']">待入库</text>
                </div>
            </div>     
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
        height: 150px;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        border-bottom-width: 1px;
        border-bottom-color: #D8D8D8;
    }
    .icon-btn{
        padding: 25px;
    }
    .icon-btn:active{
        background-color: #d8d8d8;
    }
    .icon{
        width: 330px;
        height: 226px;
        margin-bottom: 20px;
    }
    .con{
        background-color: #fff;
    }
    .font42{
        font-size: 42px;
    }
    .font-gray33{
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
    .select{
        width: 750px;
        padding-right: 15px;
        padding-left: 15px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .sec{
        flex: 1;
        padding-top: 30px;
        padding-bottom: 30px;
        align-items: center;
        justify-content: center;
    }
    .fontc-red{
        color: #cf411b;
    }
    .fontc-66{
        color: #666;
    }
    .font26{
        font-size: 26px;
    }
</style>
<script>
    import ordericon from '../../../assets/orderIcon/icon.js'
    export default {
        data() {
            return {
                waitIcon:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/purchase/wait.png',
                doneIcon:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/purchase/done.png',
                doneAcIcon:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/purchase/done-ac.png',
                waitAcIcon:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/purchase/wait-ac.png',
                liner: ordericon.liner,
                back: ordericon.itemBack,
                close: ordericon.smallClose,
                conf: ordericon.confAction,
                index: 0
            }
        },
        props:['show','type'],
        created(){

        },
        methods:{
            closeConfirm(){
                this.$emit('close','')
            },
            closeOrSelect(){
                this.$emit('submit','')
            },
            selectTrue(){
                this.$emit('select',true)
            },
            selectFalse(){
                this.$emit('select',false)
            },
            stopClick(){

            }
        },
        components:{

        }
    };
</script>