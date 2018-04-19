<template>
    <div class="con" v-if="show">
        <div class="item">
            <input class="input" type="text" placeholder="账号" v-model="userName" />
        </div>
        <div class="item">
            <input class="input" type="password" placeholder="密码" v-model="password" />
        </div>
        <div class="btn" @click="login">
            <text class="btn-t">登录</text>    
        </div>
    </div>
</template>
<style scoped>
    .con{
        padding-top: 30px;
    }
    .item{
        width: 650px;
        height: 100px;
        margin-top: 10px;
        justify-content: flex-end;
        border-bottom-width: 1px;
        border-bottom-color: #D8D8D8;
    }  
    .input{
        font-size: 32px;
        color: #333;
        height: 80px;
    } 
    .btn{
        margin-top: 70px;
        width: 650px;
        height: 90px;
        border-radius: 10px;
        background-color: #cf411b;
        justify-content: center;
        align-items: center;
    }
    .btn:active{
        background-color: #CF320A;
    }
    .btn-t{
        font-size: 30px;
        color: #fff;
    } 
</style>
<script>
    const storage = weex.requireModule('storage')
    export default {
        props:['show'],
        data(){
            return {
                userName : '',
                password : '',

            }
        },
        mounted(){
            storage.getItem('login_history',res=>{
              if(res.result == 'success'){
                let val = JSON.parse(res.data)
                this.userName = val.user
                this.password = val.pass
              }
            })
        },
        methods:{
            login(){
                this.$emit('login',this.userName , this.password , true)
            }
        }
    }
</script>