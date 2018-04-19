<template>
    <div class="view">
        <div class="header" :style="{height: statusBarH,backgroundColor:topColor}"></div>
        <div class="bar">
            <div class="head-icon-warp active" @click="backEvent">
                <image class="head-back-icon" :src="backIcon"></image>
            </div>
            <div class="head-icon-warp active" @click="closeEvent">
                <image class="head-close-icon" :src="closeIcon"></image>
            </div>
        </div>
        <web class="web" :style="{top:top}" :src="src" ref="webview"></web> 
    </div>
</template>
<style scoped>
    .web{
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .view{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .bar{
        flex-direction: row;
        align-items: center;
    }
    .header{
        width: 750px;
    }
    .head-icon-warp{
        padding-left: 30px;
        padding-right: 30px;
        height: 78px;
        flex-direction:row;
        justify-content: center;
        align-items: center;        
    }
    .active:active{
        background-color: #d8d8d8;
    } 
    .title{
        opacity: 0;
        font-size: 32px;
    }
    .fontc-33{
        color: #333;
    }
    .head-back-icon{
        width:17px;
        height:30px;
    }
    .head-close-icon{
        width:27px;
        height:27px;
    }
</style>
<script>
    const event = weex.requireModule('event')
    const modal = weex.requireModule('modal')
    const webview = weex.requireModule('webview');
    import navigator from '../../common/navigator.js'
    export default {
        data(){
            return {
                src:'http://pd.eerrpp.cc/m/index.html?s=app',
                backIcon: 'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/orderIcon/itemBack.png',
                closeIcon:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/orderIcon/close.png',
                topColor:'#FFFFFF',
                statusBarH: '0px',
                theme:true,
                title:'',
                top:'78px'
            }
        },
        created(){
            this.setStatusBar()
        },
        methods:{
            /*
                获取头部高度  设置背景色 设置头部文字颜色
            */
            setStatusBar(){
                let config = weex.config.env
                let dpr = 1
                let device = config.osName
                let height = 0
                let bgColor = this.topColor
                if(device == 'android'){
                  if(config.osVersion/1 < 6){
                    bgColor = '#171B22'
                  }
                  dpr = 750/config.deviceWidth
                }else{
                  dpr = config.scale * 750/config.deviceWidth
                }
                if(typeof event.setStyle == 'function'){
                  event.setStyle(true,this.theme,bgColor,res =>{
                    height = res/1 * dpr
                    this.statusBarH  = height + 'px'
                    this.top = height + 78 + 'px'
                  })
                }else{
                    this.statusBarH = '0px'
                }
                
            },
            backEvent(){
                let ele = this.$refs.webview
                webview.goBack(ele)
            },
            closeEvent(){
                navigator.pop()
            }
        }
    }
</script>