<template>
    <div class="item">
        <div class="progress">
            <div ref="bar" class="progress-ac"></div>
        </div>
        <div class="title">
            <text class="fs" v-for="(item,index) in process" :class="[item.state ?  'cred' : 'c99']">{{item.name}}</text>
        </div>
        <image :src="liner" class="line" resize="cover"></image>
    </div>   
</template>
<style scoped>
    .item{
        width: 750px;
        align-items: center;
        padding-top: 8px;
        
    }
    .progress{        
        width: 690px;
        height: 7px;
        background-color: #EFEFEF;
        border-radius: 99px;
        overflow: hidden;
    }
    .progress-ac{
        height: 7px;
        width: 0px;
        background-color: #cf411b;
        border-radius: 99px;
    }
    .line{
        width: 690px;
        height: 1px;
    }
    .title{
        width: 690px;
        padding-top: 13px;
        padding-bottom: 13px;
        margin-bottom: 55px;
        flex-direction: row;
    }
    .fs{
        font-size: 28px;
        flex: 1;
        text-align: center;
    }
    .c99{
        color: #999;
    }
    .cred{
        color: #cf411b;
    }
</style>
<script>
    const animation = weex.requireModule('animation')
    export default {
        data(){
            return {
                liner:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/orderIcon/line-xuxian.png',
                addProcess: [{name:'开单',type:'',state:0},{name:'配货',type:'WAIT',state:0},{name:'发货',type:'DELIVERY',state:0},{name:'完成',type:'DONE',state:0}],
                returnProcess:[{name:'待确认',type:'WAIT',state:0},{name:'已确认',type:'DONE',state:0}],
            }
        },
        props:['state','type'],
        computed:{
            process(){
                if(this.type == 'add'){
                    return this.addProcess
                }else if(this.type == 'return'){
                    return this.returnProcess
                }
            },
            processWidth(){
                let s
                let l = this.process.length
                if(this.state == 'CANCEL'){
                    s = 690
                }else if(this.state){
                    this.process.forEach((ele,index)=>{
                        if(ele.type == this.state){
                            if(index == l - 1){
                                s = 690
                            }else{
                                s = 690/l * index + 690/(2*l)
                            }                       
                        }
                    })
                }               
                return s + ''
            }
        },
        watch:{
            processWidth(){
                let ele = this.$refs.bar
                let lg = this.process.length
                animation.transition(ele, {
                  styles: {
                    width: this.processWidth + 'px',
                  },
                  duration: 500, //ms
                  timingFunction: 'ease',
                  needLayout:false,
                  delay: 0 //ms
                }, function () {

                })
                this.process.forEach((ele,index)=>{
                    if(this.processWidth >= 690/lg * index){
                        ele.state = 1 
                    }
                })
            },
            state(){
                if(this.state == 'CANCEL'){
                    this.process[this.process.length - 1].name = '取消'
                    this.process[this.process.length - 1].type = 'CANCEL'
                }
            }
        },
        methods:{
          
        }
    }
</script>