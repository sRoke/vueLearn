<template> 
    <div>
        <div class="statusBar" :style="{height:barh,backgroundColor:barbg}"></div>
        <div class="header" :class="[theme == 'dark' ? 'bg-black' : 'bg-f']">
            <div class="algin-left head-icon-warp" :class="[theme == 'dark' ? 'active-dark' : 'active']"  @click="backEvent" v-if="back">
                <image class="head-back-icon" :src="theme == 'dark' ? backWhiteIcon : backIcon"></image>
            </div>
            <text class="title" :class="[theme == 'dark' ? 'fontc-ff' : 'fontc-33']" ref="title">{{title}}</text>
            <div class="algin-right head-icon-warp" :class="[theme == 'dark' ? 'active-dark' : 'active']" @click="addEvent" v-if="add && !con">
                <image class="head-close-icon" :src="addIcon"></image>
            </div>
            <div class="algin-right head-icon-warp" @click="addEvent" v-if="add && con">
                <text class="btn-text" :class="[type == 'default' ? 'fontc-33' : 'fontc-red']">{{con}}</text>
            </div>
        </div>
    </div>       
</template>     
<style scoped>
    .header{
        height: 78px;
        width: 750px;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .bg-f{
        background-color: #fff;
    }
    .bg-black{
        background-color: #171B22;
    }
    .btn-text{
        font-size: 32px;
    }
    .fontc-red{
        color: #cf411b;
    }
    .head-icon-warp{
        padding-left: 30px;
        padding-right: 30px;
        height: 78px;
        flex-direction:row;
        justify-content: center;
        align-items: center;        
    }
    .statusBar{
        width: 750px;
      }
    .algin-left{
        position: absolute;

        left: 0;
    }
    .active:active{
        background-color: #d8d8d8;
    } 
    .active-dark:active{
        background-color: #04050A;
    }  
    .algin-right{
        position: absolute;
        right: 0;
    }
    .title{
        opacity: 0;
        font-size: 32px;
    }
    .fontc-33{
        color: #333;
    }
    .fontc-ff{
        color: #fff;
    }
    .head-back-icon{
        width:17px;
        height:30px;
    }
    .head-close-icon{
        width:38px;
        height:38px;
    }
</style>
<script>
    import navigator from '../common/navigator.js'
    import ordericon from '../assets/orderIcon/icon.js'
    const animation = weex.requireModule('animation')
    export default {
        data() {
            return {
                addIcon: 'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/baseIcon/addIcon.png', 
                backIcon: 'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/orderIcon/itemBack.png',
                backWhiteIcon: 'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/baseIcon/backWhiteIcon.png'
                
            };
        },
        props:['title','show','back','add','barh','barbg','con','theme','type'],
        created(){

        },
        watch:{
            show(){
                let ele = this.$refs.title
                animation.transition(ele, {
                    styles: {
                        opacity: (this.show ? '1' : '0'),
                    },
                    duration: 200, //ms
                    timingFunction: 'linear',
                    needLayout:false,
                    delay: 0 //ms
                }, function () {
                   
                })
            }
        },
        methods:{
            backEvent(ret){
                navigator.pop()   
            },
            addEvent(){
                this.$emit('event')
            }
        }
    };
</script>