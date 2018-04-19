<!-- 2018 01 10 czw -->
<!-- this is base view for every weex page   please write page into this view -->
<template>
    <div class="page" @viewappear="appear" @viewdisappear="disappear" :class="[config.theme == 'dark' ? 'dark' : 'light']">
        <top-bar :theme="config.theme" :title="config.title" :show="showTitle" :barh="statusBarH" :barbg="topColor" :back="back" :add="add" :con="config.btnText" :type="config.headerBtnType" @event="topEvent"></top-bar>
        <bu-scrol :theme="config.theme" class="scroller" :style="{top:top,bottom:bottom}" @refresh="refresh" @loadmore="loadmore" :refresh="config.refresh" :loadmore="config.loadmore">
            <div v-if="config.titleAlgin && config.titleAlgin == 'center'">
                <header-center :theme="config.theme" :title="config.title" :content="config.secondTitle" @hidden="hidden"></header-center>
            </div>
            <div v-if="config.titleAlgin && config.titleAlgin == 'left'">
                <header-left :theme="config.theme" :title="config.title" @hidden="hidden" :scan="config.scanEvent" @scanevent="scanEvent"></header-left>
            </div>  
            <slot></slot>    
        </bu-scrol>
        <slot name="footer"></slot>
        <!-- 页面右上角下拉选择菜单 -->
        <div class="select-item" :style="{top:top}" v-if='showDrop' @click="closeDrop">
            <div class="select-area">
                <div class="select-radio" v-for="item in config.dropDownList" @click="selectMenu(item)">
                    <text class="fs32 fc-33">{{item.name}}</text>    
                </div>
            </div>
        </div>
        <render-tip :render="config.pageRender"></render-tip>            
    </div>
</template>
<style scoped>
    .page{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .dark{
        background-color: #04050A;
    }
    .light{
        background-color: #FFFFFF;
    }
    .scroller{
        position: absolute;
        left: 0;
        right: 0;
    }
    .select-item{
        background-color: rgba(0,0,0,0.2);
        position: absolute;
        left: 0;
        width:750px;
        bottom: 0px;
        padding-top: 10px; 
        padding-right: 30px;
        align-items: flex-end;
    }
    .select-area{
        background-color: #fff;
        width: 250px;
        border-radius: 5px;
    }
    .select-radio{
        height: 78px;
        justify-content: center;
        align-items: center;
        border-bottom-width: 1px;
        border-bottom-color: #D8D8D8;
    }
    .select-radio:active{
        background-color: #D8D8D8;
    }
    .fs32{
        font-size: 32px;
    }
    .fc-33{
        color: #333;
    }
</style>
<script>
    import topBar from './top-bar.vue'
    import headerCenter from './header-center.vue'
    import headerLeft from './header-left.vue'
    import buScrol from './bu-scrol.vue'
    import renderTip from './render-tip.vue'
    const event = weex.requireModule('event')
    export default {
        data(){
            return {
                showTitle: false,
                statusBarH:'',
                top:'',
                showDrop: false,
                isRender: false
            }
        },
        props:['config'],
        components:{
            topBar,
            renderTip,
            buScrol,
            headerLeft,
            headerCenter
        },
        created(){
            this.setStatusBar()
        },
        computed:{
            theme(){
                return this.config.theme === 'dark' ? false : true
            },
            topColor(){
                return this.config.theme === 'dark' ? '#171B22' : '#FFFFFF'
            },
            back(){
                return this.config.back === false ? false : true
            },
            add(){
                return this.config.addEvent ? true : false
            },
            text(){
                return this.config.textEvent ? true : false
            },
            bottom(){
                return this.config.bottom ? this.config.bottom : '0px'
            }
        },
        methods:{
            appear(){
                /*ios系统 在重新显示页面的时候 重置状态栏  因为可能被跳转的页面覆盖*/
                weex.config.env.osName !== 'android' && this.appearSetIosBar()
                if(this.config.viewappear){
                    this.$emit('event',this.config.viewappear)
                }              
            },
            disappear(){
                if(this.config.disviewappear){
                    this.$emit('event',this.config.disviewappear)
                }
            },
            refresh(call){
                this.$emit('event',this.config.refreshEvent,call)
            },
            loadmore(){
                this.$emit('event',this.config.loadmoreEvent)
            },
            scanEvent(){
                this.$emit('event',this.config.scanEvent)
            },
            topEvent(){
                if(this.config.dropDownList && this.config.dropDownList.length > 0) {
                    this.showDrop = true
                }else{
                    this.$emit('event',this.config.addEvent)  
                }
            },
            closeDrop(){
                this.showDrop = false
            },
            selectMenu(item){
                this.$emit('event',this.config.addEvent,item) 
                this.closeDrop() 
            },
            hidden(ret){
                this.showTitle = (ret === '1' ? true : false)
            },
            /*
                获取头部高度  设置背景色 设置头部文字颜色
            */
            setStatusBar(){
                let config = weex.config.env
                let dpr = 1
                let device = config.osName
                let height = 0
                let bgColor = this.topColor
                if(device === 'android'){
                  if(config.osVersion/1 < 6){
                    bgColor = '#171B22'
                  }
                  dpr = 750/config.deviceWidth
                }else{
                  dpr = config.scale * 750/config.deviceWidth
                }
                if(typeof event.setStyle === 'function'){
                  event.setStyle(true,this.theme,bgColor,res =>{
                    height = res/1 * dpr
                    this.statusBarH  = height + 'px'
                    this.top = height + 78 + 'px'
                  })
                }else{
                    this.statusBarH = '0px'
                    this.top = '78px'
                }    
            },
            appearSetIosBar() {
                if(typeof event.setStyle === 'function'){
                  event.setStyle(true,this.theme,this.topColor,res =>{})
                } 
            }
        }
    }
</script>
