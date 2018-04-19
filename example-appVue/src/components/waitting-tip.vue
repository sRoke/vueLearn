<template>
    <div class="item" v-if="showitem">
        <div class="sec" @click="jumpTo">
            <div class="row">
                <div class="icon">
                    <image :src="waiticon" class="waiticon"></image>
                    <text class="f18 c33">待上传</text>
                </div>
                <text class="f30 c33">有照片待上传</text> 
            </div> 
            <image class="goIcon" :src="itemGo"></image> 
        </div>
    </div>
</template>
<style scoped>
    .item{
        width: 750px;
        align-items: center;
    }
    .sec{
        height: 87px;
        padding-left: 30px;
        padding-right: 30px;
        margin-top: 20px;
        border-radius: 99px;
        border-width: 1px;
        border-color: #DBD9D9;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .sec:active{
        background-color: #D8D8D8;
    }
    .icon{
        width: 69px;
        height: 69px;
        justify-content: center;
        align-items: center;
        margin-right: 25px;
    }
    .row{
        flex-direction: row;
        align-items: center;
    }
    .waiticon{
        width: 69px;
        height: 69px;
        position: absolute;
        top: 0;
        left: 0;
    }
    .goIcon{
        width: 11px;
        height: 19px;
        margin-left: 20px;
    }
    .f30{
        font-size: 30px;
    }
    .f18{
        font-size: 18px;
    }
    .c30{
        color: #333;
    }
</style>
<script>
    import navigator from '../common/navigator.js'
    const photoEvent = weex.requireModule('photoEvent');
    const storage = weex.requireModule('storage');
    export default {
        data(){
            return {
                showitem: false,
                waiticon:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/baseIcon/waittingIcon.png',
                itemGo:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/orderIcon/itemGo.png'
            }
        },
        created(){

        },
        methods:{
            jumpTo(){
                navigator.push({
                    url:'/modules/visiting/waitupdataImg'
                })
                this.showitem = false
            },
            render(){
                storage.getItem('login_user_info',event=>{
                let result = JSON.parse(event.data)
                var m = {
                    'uid': parseInt(result['USER.UID']),
                    'serviceId': parseInt(result['USER.SERVICE_ID']),
                    'state': 'wait'
                }
                if(photoEvent){
                    photoEvent.getOfflinePhotos(m,res =>{
                        if(res.length > 0){
                            this.showitem = true
                        }else{
                            this.showitem = false
                        }
                    })
                } 
            })
            }
        }
    }
</script>