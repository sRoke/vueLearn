<!-- 2018 02 27 czw -->
<!-- 共用显示图片的页面 -->
<template>
    <div class="page" ref="page" :style="{transform: translate, width: width}">
        <div class="image" v-for="img in imgSrc">
            <image resize="contain" :style="{height:height}" :src="img" class="image" @click="back" @swipe="change"></image>
        </div>  
    </div>
</template>
<style scoped>
    .page{
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        justify-content: center;
        align-items: center;
        flex-direction: row;
        overflow: hidden;
        background-color: #000;
    }
    .image{
        width: 750px;
        background-color: #000;
    }
    .indicator{
        position: absolute;
        bottom: 50px;
        left: 0px;
        width: 750px;
        height: 30px;
        justify-content: center;
        align-items: center;
        item-color: rgba(255,255,255,0.2);
        item-selected-color: #cf411b;
        item-size: 10;
    }
</style>
<script>
    import navigator from '../../common/navigator.js'
    const animation = weex.requireModule('animation')
    const event = weex.requireModule('event')
    const storage = weex.requireModule('storage')
    const modal = weex.requireModule('modal')
    export default {
        data(){
            return {
                imgSrc: [],
                height: '',
                index: 0,
                translate: 'translateX(0px)',
                width: ''
            }
        },
        components:{
        },
        created(){
            this.setStatusBar()
            storage.getItem('image_wait_show', res => {
                let data = JSON.parse(res.data)
                this.width = (data.src.length * 750) + 'px'
                this.index = data.index
                this.translate = 'translateX(' + (this.index * -750) + 'px)' 
                this.imgSrc = data.src 
            })
        },
        methods:{
            back() {
                navigator.pop()
            },
            /*
                获取头部高度  设置背景色 设置头部文字颜色
            */
            setStatusBar(){
                let config = weex.config.env
                this.height = (750/config.deviceWidth * config.deviceHeight) + 'px'
                if(typeof event.setStyle === 'function'){
                  event.setStyle(false,false,'#000000',res =>{
                  })
                }  
            },
            change(res) {
                let direction = res.direction
                if(direction === 'left' || direction === 'right'){
                    let dir = direction === 'left' ? 1 : -1
                    if((dir === -1 && this.index > 0) || (dir === 1 && this.index < this.imgSrc.length -1)) {
                        this.index += dir
                    }
                    let ele = this.$refs.page
                    animation.transition(ele, {
                      styles: {
                        transform: 'translateX('+ (this.index * -750) + 'px)',
                      },
                      duration: 200, //ms
                      timingFunction: 'ease',
                      needLayout:false,
                      delay: 0 //ms
                    }, function () {

                    })
                }  
            }
        }
    }
</script>
