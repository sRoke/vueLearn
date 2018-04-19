<template>
  <div class="wrapper">
    <div class="statusBar" :style="{height:statusBarH,backgroundColor:statusBarBg}"></div>
    <div class="bar">
        <div class="btn" @click="back">
            <image :src="closeIcon" class="icon"></image>
        </div>       
    </div>
<!--     <image src="https://img.alicdn.com/imgextra/i1/2779800881/TB2boHcbm.EF1JjSZPcXXaxaFXa_!!2779800881.jpg" resize="contain" style="width: 750px;height: 1000px;"></image>    -->
    <bu-scrol class="scroller" :style="{top:top}" :refresh="refresh">
        <text class="title">关于跑店</text>     
        <div class="item">
            <text class="font36 fontc-33">公司</text>
            <text class="font32 fontc-66">{{userInfo['USER.NAME']}}</text>
            <text class="font32 fontc-66">{{userInfo['USER.LOGIN_ID']}}</text>
        </div>  
        <div class="item br-t">
            <text class="font36 fontc-33">技术支持</text>
            <text class="font32 fontc-66" @click="callme">电话 {{phone}}</text>
            <text class="font32 fontc-66">QQ/微信 97559990</text>
        </div> 
        <div class="item br-t">
            <text class="font36 fontc-33">版本</text>
            <text class="font32 fontc-66">{{version.appVersion}}</text>
            <text class="font32 fontc-66">{{version.deviceModel}}  {{version.osVersion}}</text>
            <text class="font32 fontc-66">{{userVersion}}</text>
            <text class="font32 fontc-66">{{version.weexVersion}}</text>
        </div> 
    </bu-scrol>  
    <div class="foot">
        <div class="foot-btn" @click="over">
            <text class="font30 fontc-ff">退出账号</text>    
        </div>
    </div>  
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
        width: 690px;
        padding-bottom: 50px;
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
        background-color: #FFF;
        align-items: center;
    }
    .scroller{
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
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
    .foot-btn{
        width: 690px;
        height: 80px;
        background-color: #CF411B;
        border-radius: 10px;
        justify-content: center;
        align-items: center;
    }
    .foot-btn:active{
        background-color: #CF320A;
    }
    .foot{
        position: absolute;
        bottom: 0;
        width: 750px;
        height: 140px;
        justify-content: center;
        align-items: center;
    }
    .icon{
        width: 27px;
        height: 27px;
    }
    .br-t{
        border-top-color: #D8D8D8;
        border-top-width: 1px;
        padding-top: 30px;
    }
    .font30{
        font-size: 30px;
    }
    .font32{
        font-size: 32px;
        padding-top: 4px;
        padding-bottom: 4px;
    }
    .font36{
        font-size: 36px;
        padding-top: 10px;
        padding-bottom: 10px;
    }
    .fontc-33{
        color: #333;
    }
    .fontc-ff{
        color: #fff;
    }
    .fontc-66{
        color: #666;
    }
</style>

<script>
  import navigator from '../../common/navigator.js'
  import stream from '../../common/stream.js'
  import buScrol from '../../components/bu-scrol.vue'
  const modal = weex.requireModule('modal')
  const event = weex.requireModule('event')
  const storage = weex.requireModule('storage')
  export default {
    data: {

      closeIcon:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/orderIcon/close.png',
      statusBarH:'',
      statusBarBg: '#FFFFFF',
      top:'',
      refresh: false,
      phone:'400-6565-747',
      userInfo:{},
      version:{},
      userVersion:''
    },
    components:{
        buScrol
    },
    created(){
        this.setStatusBar()
        stream.fetch({
            methods:'GET',
            url:'/version/queryCurrentVersion'
        },res=>{
            this.userVersion = res.extraData['VERSION_NAME']
        })
    },
    mounted(){
        storage.getItem('login_user_info',res=>{
            this.userInfo = JSON.parse(res.data)
        })
        this.version = weex.config.env
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
        over(){
            modal.confirm({
                message: '确认退出？',
                okTitle:'确认',
                cancelTitle:'取消'
            },res =>{
                if(res === '确认'){
                    storage.removeItem('login_token',function(){
                        if(typeof event.newView == 'function'){
                            event.newView()
                        }                   
                    })
                }
            })         
        },
        callme(){
            if(typeof event.call == 'function'){
                event.call(this.phone)
            }
        },
        back(){
            navigator.pop()
        }
    }
  }
</script>