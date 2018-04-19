
<template>
    <div class="page" @viewappear="viewappear">
        <top-bar :title="title" :show="showTitle" :barh="statusBarH" :barbg="statusBarBg"></top-bar>
        <scroller class="scrol" :style="{top:top}" show-scrollbar="false">
            <div class="header">
                <text class="font-26 fontc-99">拨浪鼓旗下产品</text>
                <div class="tream">
                    <image class="logo" :src="logo" @appear="hidden('-1')" @disappear="hidden('1')" @click="clipImg"></image>
                    <div class="row" v-if="isNormal">
                      <div class="btn" @click="jumpUser">
                        <image class="mine-icon" :src="mine"></image>
                      </div>
                      <div class="btn" @click="jumpMessage">
                        <image class="msg-icon" :src="message"></image>
                      </div>
                    </div> 
                    <div class="row" v-if="!isNormal" @click="endThrough">
                      <text class="font-32 fontc-red">退出体验</text>
                    </div>   
                </div>
            </div>
            <div class="item">
              <slider class="slider" interval="3000" auto-play="true">
                  <div class="frame" v-for="(img,index) in imageList" @click="jumpToBanner(index)">
                      <image class="image" resize="cover" :src="img"></image>
                  </div>
                  <indicator class="indicator"></indicator>
              </slider>
            </div>
            <waitting-tip ref="waittingtip"></waitting-tip>      
            <div class="menu" v-for="(first,key) in menuList">
              <text v-if="key != 0" class="font-50 fontc-33 mg-l" @click="jumpToNewPrd">{{first['MENU.DISPLAY_NAME']}}</text>
              <div class="list" v-for="sec in first['MENU_LIST']">
                  <div class="list-item" v-for="(item,index) in sec['MENU_LIST']" @click="jump(item)">
                      <image :src="item['MENU.ICON_URL']" class="icon" resize="cover"></image>
                      <div class="list-item-con" :class="[index != sec['MENU_LIST'].length - 1 ?'border':'no-border']">
                          <text class="font-32 fontc-33">{{item['MENU.NAME']}}</text>
                          <image :src="jumpIcon" class="jump-icon"></image>
                      </div>
                  </div>
              </div>     
            </div>      
        </scroller>       
    </div>
</template>     
<style scoped>
    .msg-icon{
        width: 45.26px;
        height: 44.95px;
    }
    .logo{
      width: 96px;
      height: 50px;
    }
    .mine-icon{
      width: 38px;
      height: 44px;
    }
   .page{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    background-color: #fff;
   }
   .header{
    width: 750px;
    padding-left: 30px;
   }
   .tream{
    width: 720px;
    height: 100px;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
   }
   .indicator{
    position: absolute;
    bottom: 30px;
    right: 35px;
    width: 100px;
    height: 20px;
    item-color: rgba(0,0,0,0.2);
    item-selected-color: #fff;
   }
   .btn{
    width: 100px;
    height: 100px;
    justify-content: center;
    align-items: center;
   }
   .btn:active{
    background-color: #d8d8d8;
   }
   .slider{
    width: 690px;
    height: 494px;
    margin-top: 20px;
    margin-bottom: 20px;
    align-items: center;
   }
   .frame{
    width: 690px;
    border-radius: 20px;
    overflow: hidden;
   }
   .image{
    border-radius: 20px;
    width: 690px;
    height: 494px;
   }
   .list-item-con{
    width: 588px;
    height: 109px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
   }
   .scrol{
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 750px;
   }
   .item{
    width: 750px;
    align-items: center;
   }
   .menu{
    margin-bottom: 90px;
   }
   .mg-l{
    margin-left: 30px;
   }
   .list{
    width: 750px;
    margin-top: 50px;
   }
   .list-item{
    width: 750px;
    height: 109px;
    background-color: #fff;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-left: 30px;
    padding-right: 30px;
   }
   .list-item:active{
    background-color: #D8D8D8;
   }
   .font-32{
    font-size: 32px;
   }
   .font-26{
    font-size: 26px;
   }
   .font-50{
    font-size: 50px;
   }
   .fontc-99{
    color: #999;
   }
   .fontc-33{
    color: #333;
   }
   .fontc-red{
    color: #cf411b;
    padding-left: 30px;
    padding-right: 30px;
   }
   .icon{
    width: 82px;
    height: 82px;
    border-radius: 17px;
   }
   .jump-icon{
    width: 14px;
    height: 25px;
   }
   .border{
    border-bottom-color: #D8D8D8;
    border-bottom-width: 1px;
   }
   .no-border{
    border-bottom-color: #fff;
    border-bottom-width: 1px;
   }
   .row{
    flex-direction: row;
    align-items: center;
   }
</style>
<script>
    import topBar from './components/top-bar.vue'
    import stream from './common/stream.js'
    import navigator from './common/navigator.js'
    import waittingTip from './components/waitting-tip.vue'
    const storage = weex.requireModule('storage')
    const event = weex.requireModule('event')
    export default {
        data() {
            return {
                logo:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/baseIcon/menu-logo.png',
                title: '跑店',
                getMenuApi:'/menu/runtime/menuForOrderKing?MENU_RUNTIME.SYS_ID=jiaorder&MENU_RUNTIME.TYPE=WORK&MENU_RUNTIME.CLASS_NAME=MOBILE_ADMIN',
                message:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/baseIcon/home-message-icon.png',
                mine:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/baseIcon/mine.png',
                jumpIcon:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/baseIcon/home-jump.png',
                showTitle: false,
                menuList: [],
                imageList:['http://img.ok.eerrpp.cc/img/banner1.png','http://img.ok.eerrpp.cc/img/banner2.png','http://img.ok.eerrpp.cc/img/banner3.png'],
                index:1,
                statusBarBg:'#FFFFFF',
                statusBarH:'',
                top:'',
                isNormal: true
            };
        },
        components:{
            topBar,
            waittingTip
        },
        created(){
          this.setStatusBar()
          storage.getItem('app_state_through',res =>{
            if(res.result == 'success'){
              this.isNormal = false
            }
          })
        },
        mounted(){
            stream.fetch({method:'GET',url:this.getMenuApi},res =>{
                this.menuList = res.extraData.menuList
            })
        },
        methods:{
            /*
              测试截图功能
            */
            clipImg(){

              event.screenshot()
              
            },
            jumpToNewPrd() {
                navigator.push({
                    url:'/modules/productManage/product-manage'
                })
            },
            hidden(ret){
                this.showTitle = (ret == '1' ? true : false)
            },
            jumpToOrder(item){

                navigator.push({
                    url:item.url
                },res=>{})

            },
            jumpMessage(){
              navigator.push({
                url:'/modules/messageSection/message-list'
              })
            },
            jumpUser(){
              navigator.push({
                url:'/modules/userInfo/user'
              })
            },
            jump(item){
              let query = ""
              let url = item['MENU.ACTION_URL']
              let index = url.indexOf('?')
              if(index != -1){
                query = url.substr(index)
                url = url.substr(0,index)
              }            
              navigator.push({
                url:url,
                query:query
              })
            },
            jumpToBanner(index){
              if(index == 1){
                if(typeof event.call == 'function'){
                    event.call('400-6565-747')
                }
              }else{
                navigator.push({
                  url:'/modules/webView/bannerCon',
                })
              }
            },
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
                    this.statusBarH = '0px'
                    this.top = '78px'
                }
                
            },
            viewappear(){
              this.$refs.waittingtip.render()
              if(this.menuList.length > 0){
                let config = weex.config.env
                let device = config.osName
                if(device != 'android'){
                  if(typeof event.setStyle == 'function'){
                    event.setStyle(true,true,'#FFFFFF',res =>{
                    })
                  }
                }
              }   
            },
            /*退出体验*/
            endThrough(){
                if(typeof event.newView == 'function'){
                    event.newView()
                } 
            },
        },
    };
</script>