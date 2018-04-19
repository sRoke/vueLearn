<template>
    <scroller class="scrol" loadmoreoffset="10" @loadmore="onloadmore">
        <refresh v-if="refresh" :class="[theme == 'dark' ? 'bg-f' : 'bg']" @refresh="onrefresh" :display="refreshing ? 'show' : 'hide'">
          <text class="indicator">{{data}}</text>
        </refresh>
        <slot></slot>
    </scroller>  
</template>
<script>
    export default {
        data(){
            return {
                refreshing : false,
                data:'正在刷新...'
            }
        },
        props:['refresh','loadmore','theme'],
        methods:{
            onrefresh(){
                this.refreshing = true
                this.$emit('refresh',() =>{
                    this.data = '刷新成功'
                    setTimeout(()=>{
                        this.refreshing = false
                        setTimeout(()=>{
                            this.data = '正在刷新...'
                        },300)                       
                    },200)     
                })
            },
            onloadmore(){
                if(this.loadmore){
                    this.$emit('loadmore','')
                }             
            }
        }
    }
</script>
<style scoped>
  .indicator {
    width: 750px;
    color: #D8D8D8;
    font-size: 28px;
    padding-top: 40px;
    padding-bottom: 40px;
    text-align: center;
  }
  .bg{
    background-color: #333;
  }
  .bg-f{
    background-color: #fff;
  }
</style>