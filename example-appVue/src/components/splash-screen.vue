<template>      
    <div class="splash" v-if="display" :style="{height:height}">
        <image :src="src" class="img" resize="cover" :style="{marginTop:margin}"></image>
        <div class="bottom">
            <image :src="bottomSrc" class="img2"  resize="cover"></image>
        </div>
    </div>
</template>     
<style scoped>
   .splash{
    position: absolute;
    top: 0;
    left: 0;
    width: 750px;
    align-items: center;
    background-color: #CF411B;
   }
   .img{
        width: 144px;
        height: 455px;
   }
   .img2{
        width: 231px;
        height: 143px;
   }
   .bottom{
        position: absolute;
        bottom: 0;
        width: 750px;
        height: 243px;
        justify-content: center;
        align-items: center;
   }
</style>
<script>
    const event = weex.requireModule('event')
    export default {
        data() {
            return {
                src:'http://img.ok.eerrpp.cc/img/welcome-content.png',
                bottomSrc:'http://img.ok.eerrpp.cc/img/welcome-theme.png',
                display: true,
                height:''
            }
        },
        created(){
            if(typeof event.getHeight == 'function'){
                event.getHeight(-1,res=>{})
            }
            this.height = 750/weex.config.env.deviceWidth*weex.config.env.deviceHeight + 'px'
            let dis = parseFloat(this.height) - 243 - 455
            this.margin = (dis > 0 ? dis/2 : 50) + 'px'
            this.close()
        },
        methods:{
            close(){
                setTimeout(()=>{
                    this.$emit('event')
                    setTimeout(() =>{
                        this.display = false
                    },500)
                },3500)
            }
        }  
    };
</script>