<template>
    <div class="item" v-if="render" @click="stopClick">
        <div class="load" ref="rotate">
        </div>
        <div class="close" @click="stop" v-if="showClose">
            <image class="icon" :src="icon"></image>
        </div>
    </div>
</template>
<style scoped>
    .item{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        justify-content: center;
        align-items: center;
    }
    .load{
        width: 80;
        height: 80;
        border-right-color: #f2f2f2;
        border-right-width: 4;
        border-right-style: solid;
        border-top-color: #f2f2f2;
        border-top-width: 4;
        border-top-style: solid;
        border-bottom-color: #f2f2f2;
        border-bottom-width: 4;
        border-bottom-style: solid;
        border-left-color: #cf411b;
        border-left-width: 4;
        border-left-style: solid;
        justify-content: center;
        align-items: center;
        border-radius: 99;
    }
    .icon{
        width: 30px;
        height: 30px;
    }
    .close{
        position: absolute;
        top: 100px;
        right: 0px;
        width: 90px;
        height: 90px;
        justify-content: center;
        align-items: center;
    }
    .close:active{
        background-color: #D8D8D8;
    }
</style>
<script>
    const animation = weex.requireModule('animation')
    import navigator from '../common/navigator.js'
    export default{
        data () {
            return {
                icon:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/orderIcon/close.png',
                showClose: false
            }
        },
        created: function(){
          
        },
        props:['render'],
        watch:{
            render(){
                var self = this
                if(self.render){
                    self.showClose = false
                    setTimeout(function(){
                        var ele = self.$refs.rotate
                        self.animation(ele,360)
                        setTimeout(function(){
                            self.showClose = true
                        },4000)  
                    },100)                            
                }   
            }
        },
        methods:{
            animation(ele,deg){
                var self = this
                animation.transition(ele, {
                    styles: {
                      transform: 'rotate('+ deg +'deg)',
                    },
                    duration: 500, //ms
                    timingFunction: 'linear',
                    delay: 0 //ms

                  }, function () {
                    if(self.render){
                        self.animation(ele,deg + 180)
                    }
                })
            },
            stop(){
                navigator.pop()
            },
            stopClick(){}
        }
    }
</script>