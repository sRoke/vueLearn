<template>
    <div class="item" v-if="show">
        <text class="fc-red" @click="through">体验试用</text>
        <text class="fc-99">拜访 开单 签到 拍照</text>
    </div>
</template>
<style scoped>
    .item{
        position: absolute;
        bottom: 0;
        padding-bottom: 55px;
        width: 750px;
        justify-content: center;
        align-items: center;
    }
    .fc-red{
        font-size: 28px;
        color: #cf411b;
    }
    .fc-red:active{
        color: #CF320A;
    }
    .fc-99{
        margin-top: 10px;
        font-size: 26px;
        color: #999;
    }
</style>
<script>
    const storage = weex.requireModule('storage')
    const stream = weex.requireModule('stream')
    export default {
        data(){
            return {
                defaultUser: '18088888888',
                defaultPassword: '123456'
            }
        },
        props:['show','host'],
        methods:{
            through(){
                let num = 0
                storage.getItem('learn_through_history',res =>{
                    if(res.result == 'success'){    
                        num = res.data/1
                    }          
                    num ++ 
                    storage.setItem('learn_through_history',num + '',res=>{
                        storage.setItem('app_state_through','true',res =>{
                            let version = weex.config.env
                            this.$emit('event',this.defaultUser,this.defaultPassword,false,res=>{
                                stream.fetch({
                                    methods:'GET',
                                    type:'json',
                                    url: this.host + '/employee/sendExperienceMsgToAdmin?EXPERIENCE_TIME=' + num + '&EXPERIENCE_INFO='+ encodeURI(version.deviceModel +  version.osVersion),
                                },res=>{

                                })
                            })
                        })
                    })
                })
            }
        }
    }
</script>