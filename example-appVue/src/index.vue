<template>
  <div class="wrapper">
    <div class="statusBar" :style="{height:statusBarH,backgroundColor:statusBarBg}"></div>
    <scroller class="scrol" :style="{top:statusBarH}">
      <div class="content">
        <div class="row">
          <image class="title" :src="logo"></image>
          <div class="jump-btn" @click="jump">
            <text class="font30 fc-red">介绍</text>
            <image src="http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/baseIcon/rspec-right.png" class="btn-icon"></image> 
          </div>
        </div>
        <div class="header">
          <div class="btn" :class="[defaultType ? 'btn-border' : 'btn-border-o']" @click="change(1)">
             <text :class="[defaultType? 'font50' : 'font32']">登录</text>
          </div>
          <div class="btn" :class="[defaultType ? 'btn-border-o' : 'btn-border']" @click="change(2)">
            <text :class="[defaultType ? 'font32' : 'font50']">注册</text>
          </div>
        </div>
        <login :show="defaultType" @login="login"></login> 
        <register :show="!defaultType" :host="apiHost" @event="registerCall"></register> 
      </div>
    </scroller>
    <learn-through :show="defaultType" :host="apiHost" @event="login"></learn-through>
    <!-- 隐藏的入口 -->
    <div class="change" @click="show" :style="{backgroundColor:changBg}">
      <text class="fs-34 fc-ff">{{debug}}{{debugCode}}</text>
    </div>
    <div class="select" v-if="confirm" @click="closeConfirm">
      <div class="select-con">
        <div class="select-list" v-for="item in userList" @click="getService(item)">
          <text class="fs-34 fc-33">{{item['USER.NAME']}}</text>
        </div>  
      </div>
    </div>
    <div class="select" v-if="confirm2" @click="closeConfirm2">
      <div class="select-con">
        <div class="select-list" @click="getUser('1')">
          <text class="fs-34 fc-33">我要开发你</text>
        </div>  
        <div class="select-list" @click="getUser('2')">
          <text class="fs-34 fc-33">我要测试你</text>
        </div>
      </div>
    </div>
    <div class="inner" v-if="confirm3" @click="closeConfirm3">
        <div class="inner-item" @click="stop">
          <text class="fs-34 fc-33">是否使用调试码？</text>
          <div class="inner-con">
            <input class="inner-input" type="number" v-model="code1"/>
            <text class="fs-34 fc-33"> + udbu + </text>
            <input class="inner-input" type="number" v-model="code2"/>
          </div> 
          <div class="inner-bottom">
              <div class="inner-btn br-r" @click="closeConfirm3">
                <text class="fs-30 fc-33">否</text>
              </div>
              <div class="inner-btn" @click="setCode">
                <text class="fs-30 fc-red">是</text>
              </div>
          </div>
        </div>
    </div>
    <splashScreen @event="start"></splashScreen>
    <render-tip :render="render"></render-tip>
  </div>
</template>

<style scoped>
  .change{
    position: absolute;
    top: 0;
    width: 750px;
    height: 100px;
    align-items: center;
    justify-content: center;
  }
  .statusBar{
    width: 750px;
  }
  .wrapper{
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
  .scrol{
    left: 0;
    right: 0;
    bottom: 0;
  }
  .content{
    padding-top: 110px;
    padding-left: 50px;
    padding-right: 50px;
  }
  .title{
    width: 170px;
    height: 87px;
  }
  .header{
    height: 100px;
    width: 650px;
    margin-top: 60px;
    flex-direction: row;
    align-items: center;
    border-bottom-color: #D8D8D8;
    border-bottom-width: 1px;
  }
  .btn{
    margin-right: 117px;
    height: 100px;
    flex-direction:row;
    align-items: center;
    justify-content: center;
  }
  .btn-border{
    border-bottom-width: 4px;
    border-bottom-color: #cf411b;
  }
  .btn-border-o{
    border-bottom-width: 4px;
    border-bottom-color: rgba(0,0,0,0);
  }
  .font32{
    font-size: 32px;
    color: #999;
  }
  .font50{
    font-size: 50px;
    color: #333;    
  }
  .select{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    justify-content: flex-end;
    background-color: rgba(0,0,0,0.4);
  }
  .inner{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    align-items: center;
    justify-content: center;
    background-color: rgba(0,0,0,0.4);
  }
  .inner-item{
    width: 690px;
    padding-top: 30px;
    align-items: center;
    background-color: #fff;
  }
  .inner-con{
    margin-bottom: 30px;
    margin-top: 30px;
    flex-direction: row;
    align-items: center;
  }
  .inner-bottom{
    width: 690px;
    flex-direction: row;
    height: 100px;
    border-top-color: #D8D8D8;
    border-top-width: 1px;
  }
  .inner-btn{
    flex: 1;
    justify-content: center;
    align-items: center;
  }
  .inner-input{
    width: 120px;
    height: 100px;
    padding: 10px;
    background-color: #f3f3f3;
    color: #333;
    font-size: 34px;
  }
  .select-con{
    background-color: #FFF;
  }
  .select-list{
    height: 100px;
    width: 750px;
    border-bottom-width: 1px;
    border-bottom-color: #D8D8D8;
    justify-content: center;
    align-items: center;
  }
  .select-list:active{
    background-color: #D8D8D8;
  }
  .inner-btn:active{
    background-color: #D8D8D8;
  }
  .br-r{
    border-right-width: 1px;
    border-right-color: #D8D8D8;
  }
  .fs-34{
    font-size: 34px;
  }
  .fc-33{
    color: #333;
  }
  .fc-red{
    color: #cf411b;
  }
  .font30{
    font-size: 30px;
  }
  .fc-ff{
    color: #fff;
  }
  .row{
    width: 700px;
    flex-direction: row;
    justify-content: space-between;
  }
  .jump-btn{
    margin-top: 10px;
    width: 156px;
    height: 68px;
    padding-left: 35px;
    flex-direction: row;
    align-items: center;
    border-top-width: 1px;
    border-top-color: #cf411b;
    border-bottom-width: 1px;
    border-bottom-color: #cf411b;
    border-left-width: 1px;
    border-left-color: #cf411b;
    border-top-left-radius: 99px;
    border-bottom-left-radius: 99px;
  }
  .btn-icon{
    width: 25px;
    height: 17px;
    margin-left: 5px;
  }
</style>

<script>
  import navigator from './common/navigator.js'
  import splashScreen from './components/splash-screen.vue'
  import renderTip from './components/render-tip.vue'
  import login from './components/login.vue'
  import register from './components/register.vue'
  import learnThrough from './components/learn-through.vue'
  const stream = weex.requireModule('stream')
  const modal = weex.requireModule('modal')
  const storage = weex.requireModule('storage')
  const event = weex.requireModule('event')
  const notiEvent = weex.requireModule('notiEvent')
  export default {
    data: {
      logo:"http://img.ok.eerrpp.cc/img/login-logo.png",
      defaultApiHost:'http://ok.eerrpp.cc/orderking/bubu',
      devApiHost:'http://orderking.bubuhub.com/orderking/bubu',
      apiHost:'http://ok.eerrpp.cc/orderking/bubu',

      //测试环境
      testHost:'http://f.ok.eerrpp.cc/app/orderKing/dev',
      //默认正式环境
      defaultHost: 'http://f.ok.eerrpp.cc/app/orderKing/1000',
      //开发环境
      devHost: 'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/testApp',

      bubuid:'',
      token:'',
      statusBarH:'0px',
      statusBarBg: '#ffffff',
      channelId: '000',
      type:'000',
      confirm:false,
      confirm2:false,
      confirm3:false,
      render: false,
      userList:[],
      debug:'',
      debugCode:'',
      code1:'',
      code2:'',
      changBg:'rgba(0,0,0,0)',
      state:0,
      isLogin: false,
      defaultType:true
    },
    components:{
      splashScreen,
      renderTip,
      login,
      register,
      learnThrough
    },
    created(){
      if(notiEvent && typeof notiEvent.getChannelId == 'function'){
        notiEvent.getChannelId('channelid',(val) =>{
          this.channelId = val
          this.type = 'IOS_1004'
        })
      }else{
        storage.getItem('CHANNEL_ID',(e) =>{
          if(e.result == 'success' && e.data != 'undefined'){
            this.channelId = e.data
            this.type = 'AND_1002'
          }         
        })
      }
    },
    mounted(){
      storage.getItem('app_state_through',res =>{
        if(res.result == 'success'){
          storage.removeItem('app_state_through',res =>{})
        }else{
          this.checkLogin()
        }
      })
    },
    methods: {
      /*
        检查登录
      */
      checkLogin(){
        storage.getItem('login_token',res =>{
          if(res.result == 'success'){
            let result = JSON.parse(res.data)
            stream.fetch({
              headers:{
                token:result.bubuid,
                "Content-Type": 'application/x-www-form-urlencoded',
                "Accept-Encoding":'gzip'
              },
              method:'GET',
              type:'json',
              url:result.host + '/bee/user/user/checkLogin'
            },res =>{
              if(res.data.code == 0){
                this.isLogin = true 
              }
            })
          }
        }) 
      },
      registerCall(res){
        this.render = res
        if(res == 'success'){
          this.render = false
          this.defaultType = true
        }
      },
      /*闪屏结束执行的任务*/
      start(){
        if(this.isLogin) {
          navigator.push({
            'url': '/home',
          },res=>{})  
        }else{
          this.setStatusBar()
          storage.setItem('app_page_src_host',this.defaultHost,res=>{})
        }
      },
      change(key){
        if(key == '1'){
          this.defaultType = true
        }else{
          this.defaultType = false
        }
      },
      /*
        进入开发调试模式
      */
      show(){
        if(this.state > 4){
          this.confirm2 = true
        }else{
          this.state ++ 
        }
      },
      /*选择登录身份*/
      getUser(val){
        if(val == '1'){
          this.debug = '开发环境中'
          this.changBg = '#000'
          this.confirm3 = true
          this.apiHost = this.devApiHost
          storage.setItem('app_page_src_host',this.devHost,res=>{})
        }else{
          this.debug = '测试环境中'
          this.changBg = '#3AA4F8'
          this.apiHost = this.defaultApiHost
          storage.setItem('app_page_src_host',this.testHost,res=>{})
        }
        this.confirm2 = false
      },
      /* 设置调试码 */
      setCode(){
        if(this.code1.length == 4 && this.code2.length == 4){
          this.debugCode = this.code1 + 'udbu' + this.code2
        }
        this.confirm3 = false
      },
      //设置状态啦信息
      setStatusBar(){
        let config = weex.config.env
        let dpr = 1
        let device = config.osName
        if(device == 'android'){
          if(config.osVersion/1 < 6){
            this.statusBarBg = '#000000'
          }
          dpr = 750/config.deviceWidth
        }else{
          dpr = config.scale * 750/config.deviceWidth
        }
        if(typeof event.getHeight == 'function'){
          event.getHeight(1,res =>{
            this.statusBarH = res/1 * dpr + 'px'
          })
        }
      },
      login(user,pass,state,call){
        this.render = true
        stream.fetch({
          method: 'POST',
          url: this.apiHost+"/bee/user/user/loginByApp",
          type:'json',
          headers: {"Content-Type": 'application/x-www-form-urlencoded',"Accept-Encoding":'gzip'},
          body: this.param({
            'APP_TOKEN': '9C4F2C2F67E34BB29BF296DBDBF26922',
            'USER.LOGIN_ID':user,
            'USER.LOGIN_PASSWORD':pass,
            'DEVICE_NO': this.channelId,
            'DEVICE_TYPE': this.type
          }),
        },res=>{
          if(res.data.code == 0){
            let result = res.data.extraData
            let obj = {}
            this.bubuid = result.bubuId
            obj.bubuid = this.bubuid
            obj.host = this.apiHost
            this.debugCode != '' ? (obj.code = this.debugCode) : ''
            this.userList = result['USER_LIST']
            this.token = result.token
            storage.setItem('login_token',JSON.stringify(obj),()=>{
              if(state){
                this.addHistory(user , pass)
              }else{
                call()
              }
              if(this.userList.length > 1){
                  this.confirm = true
              }else{
                storage.setItem('login_user_info',JSON.stringify(this.userList[0]),res=>{
                  navigator.push({
                    'url': '/home',
                  },res=>{})  
                })
              }  
            })
          }else{
            modal.alert({message:res.data.msg})
          }
          this.render = false
        },res=>{})
      },
      addHistory(user , pass){
        storage.setItem('login_history',JSON.stringify({user:user,pass:pass}),res=>{

        })
      },
      closeConfirm(){
        this.confirm = false
      },
      closeConfirm2(){
        this.confirm2 = false
      },
      closeConfirm3(){
        this.confirm3 = false
      },
      // 如果账号出现多个角色  进行选择登录
      getService(item){
        this.render = true
        this.confirm = false
        stream.fetch({
          headers:{
            token:this.bubuid,
            "Content-Type": 'application/x-www-form-urlencoded',
            "Accept-Encoding":'gzip'
          },
          method: 'POST',
          url: this.apiHost+"/bee/user/user/selectAppService",
          type:'json',
          body: this.param({
            'TOKEN': this.token,
            'SERVICE_ID': item['USER.SERVICE_ID'],
            'DEVICE_NO': this.channelId,
            'DEVICE_TYPE':this.type,
            'TYPE_NAME': item['USER.TYPE_NAME']
          })
        }, res =>{ 
          if(res.data.code === 0){
            storage.setItem('login_user_info',JSON.stringify(item),res=>{
              navigator.push({
                'url': '/home',
              },res=>{})  
            })
          }else{
            modal.alert({message:res.data.msg})
          }
          this.render = false
        }, res =>{

        });
      },
      param(data) {

          var result = "";

          for (var attr in data) {
              if (data.hasOwnProperty(attr)) {
                  if(data[attr] != null && data[attr] != undefined && data[attr] != "")
                  result += attr + "=" + data[attr] + "&";
              }
          }

          result = result.substr(0, result.length - 1);  
          return result;
      },
      jump(){
        let num = 0
        storage.getItem('learn_through_history',res =>{
            if(res.result == 'success'){    
                num = res.data/1
            }          
            num ++ 
            storage.setItem('learn_through_history',num + '',res=>{  
              let version = weex.config.env
              stream.fetch({
                  methods:'GET',
                  type:'json',
                  url: this.apiHost + '/employee/sendExperienceMsgToAdmin?EXPERIENCE_TIME=' + num + '&EXPERIENCE_INFO='+ encodeURI(version.deviceModel +  version.osVersion + '查看了介绍'),
              },res=>{

              })
            })
        })
        navigator.push({url:'/modules/webView/webView'})
      },
      stop(){}
    }
  }
</script>