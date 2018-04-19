<template>
<div class="item">
    <div class="bar" :style="{backgroundColor:statusBarBg,height:statusBarH}"></div>
    <slot name="header"></slot>
    <div class="product" :style="{top:top}">
        <slot></slot>     
    </div>
    <div class="footer" v-if="!hidebottom">
<!--         <div class="btn-df" @click="setPrd">
            <text class="fontc-red font30">确认数量</text>
        </div> -->
        <div class="btn-ac bg-ac" @click="backTo">
            <text class="fontc-ff font30 ">选好了{{count ? (' ( ' + count + ' )') : ''}}</text>
        </div>
    </div>
    <slot name="confirm"></slot>
    <render-tip :render="render"></render-tip>
</div>
</template>
<style scoped>
    .item{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .bar{
        width: 750px;
    }
    .product{
        background-color: #fff;
        flex-direction: row;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 110;
        border-top-color: #d6d7dc;
        border-top-style: solid;
        border-top-width: 1;
    }
    .font30{
        font-size: 30px;
    }
    .fontc-ff{
        color: #fff;
    }
    .fontc-red{
        color: #cf411b;
    }
    .bg-ac{
        background-color: #cf411b;
    }
    .footer{
        position: absolute;
        bottom: 0;
        width: 750px;
        background-color: #fff;
        height: 110px;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
    .btn{
        width: 352.5px;
        height: 80px;
        border-radius: 4px;
        border-color: #cf411b;
        border-width: 1px;
        justify-content: center;
        align-items: center;
    }
    .btn-ac{
        width: 690px;
        height: 80px;
        border-radius: 4px;
        border-color: #cf411b;
        border-width: 1px;
        justify-content: center;
        align-items: center;
    }
    .btn-df{
        width: 352.5px;
        height: 80px;
        border-radius: 4px;
        border-color: #cf411b;
        border-width: 1px;
        justify-content: center;
        align-items: center;
    }
    .btn-ac:active{
        background-color: #C5320A;
    }
    .btn-df:active{
        background-color: rgba(207,65,27,0.1);
    }
</style>
<script>
    import renderTip from '../../../../components/render-tip.vue'
    const event = weex.requireModule('event')
    export default {
        data(){
            return{
                statusBarBg:'#FFFFFF',
                statusBarH:'',
                top:''
            }            
        },
        components:{
            renderTip
        },
        props:['render','count','hidebottom'],
        created(){
            this.setStatusBar()             
        },
        mounted(){

        },
        computed:{

        },
        methods: {
            backTo(){
                this.$emit('over')
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
                    this.top = height + 100 + 'px'
                  })
                }else{
                    this.statusBarH = 'px'
                    this.top = '100px'
                }
                
            },
        }
    }
</script>