<template>
  <div class="wrapper">
    <div class="statusBar" :style="{height:statusBarH,backgroundColor:statusBarBg}"></div>
    <div class="bar">
        <div class="btn" @click="back">
            <image :src="closeIcon" class="icon"></image>
        </div>       
    </div>
    <web :src="pagesrc" class="web" :style="{top:top}"></web> 
  </div>
</template>

<style scoped>
    .statusBar{
        width: 750px;
    }
    .wrapper{
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background-color: #FFF;
        align-items: center;
    }
    .bar{
        height: 78px;
        width: 750px;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
    }
    .btn{
        width: 86px;
        height: 78px;
        justify-content: center;
        align-items: center;
    }
    .btn:active{
        background-color: #d8d8d8;
    }
    .icon{
        width: 27px;
        height: 27px;
    }
    .web{
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        width: 750px;
    }
</style>

<script>
  import navigator from '../../../common/navigator.js'
  const event = weex.requireModule('event')
  export default {
    data() {
        return{
            closeIcon:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/orderIcon/close.png',
            statusBarH:'',
            statusBarBg: '#FFFFFF',
            top:''
        }
    },
    props:['pagesrc'],
    created(){
        this.setStatusBar()
    },
    mounted(){
    },
    methods: {
        setStatusBar(){
            let config = weex.config.env
            let dpr = 1
            let device = config.osName
            let height = 0
            if(device == 'android'){
              if(config.osVersion/1 < 6){
                this.statusBarBg = '#171B22'
              }
              dpr = 750/config.deviceWidth
            }else{
              dpr = config.scale * 750/config.deviceWidth
            }
            if(typeof event.setStyle == 'function'){
              event.setStyle(true,true,this.statusBarBg,res =>{
                height = res/1 * dpr
                this.statusBarH  = height + 'px'
                this.top = height + 78 + 'px'
              })
            }else{
                this.statusBarH = 'px'
                this.top = '78px'
            }
            
        },
        back(){
            navigator.pop()
        }
    }
  }
</script>