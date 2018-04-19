<template>
  <div class="wrapper">
    <div class="statusBar" :style="{height:statusBarH,backgroundColor:statusBarBg}"></div>
    <div class="bar">
        <div class="btn" @click="back">
            <image :src="closeIcon" class="icon"></image>
        </div>       
    </div>
    <bu-scrol class="scroller" :style="{top:top}" @refresh="refreshEvent" :refresh="refresh">
        <text class="tip" v-if="list.length == 0 && list2.length == 0">暂无消息</text>
        <div class="item" v-if="list.length != 0">
            <text class="title">未读</text>
            <div class="list" v-for="item in list">
                <text class="font32 fontc-33">{{item.CONTENT}}</text>
            </div>
        </div>
        <div class="item" v-if="list.length != 0">
            <text class="title">已读</text>
            <div class="list" v-for="item in list">
                <text class="font32 fontc-99">{{item.CONTENT}}</text>
            </div>
        </div>          
    </bu-scrol>    
  </div>
</template>

<style scoped>
    .statusBar{
        width: 750px;
    }
    .title{
        font-size: 50px;
        color: #333;
        margin-bottom: 30px;
        margin-top: 30px;
        width: 690px;
    }
    .item{
        width: 750px;
        align-items: center;
    }
    .tip{
        font-size: 40px;
        color: #999;
        width: 750px;
        text-align: center;
        margin-top: 200px;
    }
    .wrapper{
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background-color: #F0F0F0;
        align-items: center;
    }
    .scroller{
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
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
    .list{
        width: 690px;
        padding-left: 30px;
        padding-right: 30px;
        padding-top: 47px;
        padding-bottom: 47px;
        background-color: #fff;
        margin-bottom: 30px;
        border-radius: 11px;
    }
    .icon{
        width: 27px;
        height: 27px;
    }
    .font32{
        font-size: 32px;
    }
    .fontc-33{
        color: #333;
    }
    .fontc-99{
        color: #999;
    }
</style>

<script>
  import navigator from '../../common/navigator.js'
  import stream from '../../common/stream.js'
  import buScrol from '../../components/bu-scrol.vue'
  const modal = weex.requireModule('modal')
  const event = weex.requireModule('event')
  export default {
    data: {

      closeIcon:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/orderIcon/close.png',
      statusBarH:'',
      statusBarBg: '#F0F0F0',
      top:'',
      refresh: true,
      list: [],
      list2: []
    },
    components:{
        buScrol
    },
    created(){
        this.setStatusBar()
    },
    mounted(){
        this.renderData()
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
        renderData(){
            stream.fetch({
                method:'GET',
                url:'/bee/message/getAllMessage?PAGE_SIZE=50'
            },res=>{
                this.list = res.extraData.IS_SHOW
                this.list2 = res.extraData.NOT_SHOW
            },res=>{

            })
        },
        refreshEvent(call){
            setTimeout(()=>{
                call()
            },1000)
        },
        back(){
            navigator.pop()
        }
    }
  }
</script>