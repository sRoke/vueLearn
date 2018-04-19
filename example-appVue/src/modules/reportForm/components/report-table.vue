<template>
    <div class="table" :style="{backgroundColor:theme == 'light'?'#FFF':'#04050A'}">
        <div>
            <div class="head">
                <div class="row">
                    <text class="title wd-290">{{data[0].title}}</text>
                </div>
            </div>
            <div class="con" v-for="(item,index) in data[0].value" @click="jump(index)">
                <text class="font30 header" :class="[theme == 'light' ? 'fontc-33' :'fontc-white']">{{item}}</text>    
            </div>
        </div>
        <slider class="slider" interval="3000" auto-play="false">
            <div class="frame" v-for="item in sliderList">
                <div class="list-item" v-for="val in item">
                    <div class="head wd-180">
                        <div class="row">
                            <text class="title wd-160 al-right">{{val.title}}</text>
                        </div>
                        <image class="icon" :src="theme == 'light' ? lightIcon:icon"></image>
                    </div>
                    <div class="con" v-for="(item2,index) in val.value" @click="jump(index)">
                        <text class="font36 wd-160 al-right" :class="[val.title == '利润率' ? (parseFloat(item2) > 0 ? 'fontc-red' : 'fontc-green') : (theme == 'light' ? 'fontc-33' :'fontc-white')]">{{item2}}</text>    
                    </div>
                </div>    
            </div>
        </slider>
        <div :class="[theme == 'light' ? '' :'line']"></div>
    </div>
</template>
<style scoped>
    .table{
        width: 750px;
        flex-direction: row;
        padding-right: 30px;
        padding-left: 30px;
    }
    .header{
        width: 300px;
        lines: 2;
        text-overflow: ellipsis;
    }
    .frame{
        width: 390px;
        flex-direction: row;
        justify-content: space-between;
    }
    .slider{
        width: 390px;
        flex-direction: row;
    }
    .row{
        flex-direction: row;
        align-items: center;
    }
    .scrol{
        width: 750px;
        flex-direction: row;
    }
    .title{
        font-size: 28px;
        color: #888888;
    }
    .wd-290{
        width: 290px;
    }
    .al-right{
        text-align: right;
    }
    .wd-160{
        width: 175px;
    }
    .wd-180{
        width: 195px;
    }
    .icon{
        width: 14.81px;
        height: 25px;
    }
    .down{
        transform: rotate(180deg);
    }
    .head{
        flex-direction: row;
        height: 94px;
        justify-content: space-between;
        align-items: center;
    }
    .con{
        height: 104px;
        justify-content: center;
    }
    .font{
        text-overflow: ellipsis;
        lines: 1;
        margin-right: 10px;
    }
    .font30{
        font-size: 30px;
    }
    .font36{
        font-size: 36px;
    }
    .fontc-red{
        color: #B43100;
    }
    .fontc-green{
        color: #49BA06;
    }
    .fontc-white{
        color: #FFFFFF;
    }
    .fontc-33{
        color: #333;
    }
    .mg-30{
        margin-right: 24.81px;
    }
    .line{
        position: absolute;
        left: 0;
        top: 94px;
        width: 750px;
        border-bottom-color: #2B2B2B;
        border-bottom-width: 1px;
    }
</style>
<script>
    export default {
        data(){
            return {
                icon: 'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/baseIcon/table-sort.png',
                lightIcon: 'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/baseIcon/sort-light.png'
            }
        },
        props:['data','theme','clickable'],
        computed:{
            sliderList(){
                let arr = []
                let obj = []
                this.data.forEach( ( ele , index )=> {
                    if( index != 0 ) {
                        obj.push(ele)
                        if( obj.length == 2 || index == this.data.length - 1 ) {
                            arr.push(JSON.parse(JSON.stringify(obj)))
                            obj = []
                        }
                    }
                })
                return arr
            }
        },
        methods:{
            jump(index){
                if(this.clickable){
                    this.$emit('jump',index)
                }
            }
        },
    }
</script>