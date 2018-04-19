<template>
    <div class="item">
        <div class="content" @click="getPhoto">
            <image :src="addIcon" class="icon"></image>   
            <text class="c99 s28">添加商品图册</text>
            <text class="c99 s26">（上限10张 960*960）</text>
            <slider class="slider" interval="3000" auto-play="true">
                <div class="image" v-for="(img,index) in imageList" @click="change">
                    <image class="image" resize="cover" :src="img"></image>
                </div>
                <indicator v-if="imageList.length > 1" class="indicator"></indicator>
            </slider>
            <div class="button" v-if="imageList.length > 0 && count > 1" @click="photoManage">
                <image :src="cameraIcon" class="camera"></image>
            </div>
        </div>
    </div>     
</template>     
<style scoped>
    .item{
        width: 750px;
        padding-top: 30px;
        align-items: center;
    }
    .icon{
        width: 133px;
        height: 133px;
        margin-bottom: 20px;
    }
    .content{
        width: 690px;
        height: 452px;
        background-color: #f7f7f7;
        justify-content: center;
        align-items: center;
    }
    .camera{
        width: 33px;
        height: 29px;
    }
    .button{
        width: 75px;
        height: 75px;
        justify-content: center;
        align-items: center;
        border-radius: 99px;
        background-color: #000;
        position: absolute;
        right: 30px;
        bottom: 30px;
    }
    .slider{
        width: 690px;
        height: 452px;
        position: absolute;
        top: 0;
        left: 0;
    }
    .image{
        width: 690px;
        height: 452px;
    }
    .c99{
        color: #999;
    }
    .s28{
        font-size: 28px;
        margin-bottom: 10px;
    }
    .s26{
        font-size: 26px;
    }
    .indicator{
        position: absolute;
        bottom: 20px;
        left: 0px;
        width: 690px;
        height: 20px;
        justify-content: center;
        align-items: center;
        item-color: rgba(0,0,0,0.2);
        item-selected-color: #cf411b;
        item-size: 15;
    }
</style>
<script>
    import navigator from '../../../common/navigator.js'
    import common from '../commonJs/common.js'
    export default {
        data () {
            return {
                imageList: [],
                addIcon: 'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/product/bigAddIcon.png',
                cameraIcon: 'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/product/cameraIcon.png'
            }
        },
        props:['count'],
        methods: {
            /*
                打开照片选择  （可选数量  是否打开相机）
            */
            getPhoto() {
               common.getPhoto.call(this)
            },
            /*
                当照片区存在图片的时候  进入照片管理页面
            */
            photoManage() {
                navigator.push({
                    url: '/modules/productManage/photo-manage'
                })
            },
            getImgUrl() {
                if(this.imageList.length > 0 && this.count > 1){
                    common.getStorageImg.call(this)   
                }else{
                    common.getImgUrl.call(this)   
                }
            },
            change() {
                if(this.count === 1) {
                    common.getPhoto.call(this)
                }
            }
        }
    }
</script>