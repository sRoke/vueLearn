<template>
    <div class="con" v-if="show">
        <div class="item">
            <input class="input" type="text" placeholder="公司名称" v-model="companyName"/>
        </div>
        <div class="item">
            <input class="input" type="tel" placeholder="手机号" v-model="phoneNumber"/>
        </div>
        <div class="item">
            <input class="input" type="password" placeholder="密码" v-model="password"/>
        </div>
        <div class="item">
            <input class="input" type="password" placeholder="确认密码" v-model="passwordS"/>
        </div>
        <div class="item">
            <input class="input" type="tel" placeholder="短信验证码" v-model="smsCode" />
            <div class="tip" @click="getSMS">
                <text class="font28 fc-red" v-if="!getting">获取验证码</text>
                <text class="font28 fc-99" v-if="getting">重新获取 ({{time}}s)</text>
            </div>
        </div>
        <div class="btn" @click="register">
            <text class="btn-t">注册</text>    
        </div>
    </div>
</template>
<style scoped>
    .con{
        padding-top: 30px;
        padding-bottom: 100px;
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
    .tip{
        position: absolute;
        right: 0;
        bottom: 10px;
        width: 200px;
        height: 65px;
        border-width: 1px;
        border-color: #cf411b;
        border-radius: 7px;
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
    .font28{
        font-size: 28px;
    } 
    .fc-red{
        color: #cf411b;
    }
    .fc-99{
        color: #999;
    }
</style>
<script>
    import modal from '../common/modal.js'
    const stream = weex.requireModule('stream')
    export default {
        props:['show','host'],
        data(){
            return {
                companyName:'',
                smsCode:'',
                phoneNumber:'',
                password:'',
                passwordS:'',
                getting: false,
                time: 59,
                bubuid:''
            }
        },
        methods:{
            register(){
                if(this.check()){
                    this.$emit('event',true)
                    stream.fetch({
                        methods:'GET',
                        headers:{token:this.bubuid},
                        url:this.host + '/employee/register?SMS_CODE=' + this.smsCode + encodeURI('&USER.NAME=' + this.companyName + '&USER.LOGIN_ID=' + this.phoneNumber + '&USER.LOGIN_PASSWORD=' + this.password + '&APP_TOKEN=9C4F2C2F67E34BB29BF296DBDBF26922'),
                        type:'json'
                    },res =>{
                        if(res.data.code == 0){
                            modal.alert({message:'注册成功'})
                            this.$emit('event','success') 
                        }else{
                            modal.alert({message:res.data.msg})
                            this.$emit('event',false)  
                        }    
                    },res =>{

                    })
                }
            },
            /*
                表单验证
            */
            check(){
                if(this.companyName == ''){
                    modal.alert({message:'公司名称不能为空'})
                }else if(this.phoneNumber == ''){
                    modal.alert({message:'手机号码不能为空'})
                }else if(this.password == ''){
                    modal.alert({message:'密码不能为空'})
                }else if(this.passwordS != this.password){
                    modal.alert({message:'两次密码输入不一致'})
                }else if(this.smsCode == ''){
                    modal.alert({message:'验证码不能为空'})
                }else if(this.phoneNumber.length != 11){
                    modal.alert({message:'手机号码格式不正确'})
                }else{
                    return true
                }
            },
            /*
                获取短信验证码  同时获取注册的服务ID
            */
            getSMS(){
                if(!this.getting){
                    if(this.phoneNumber.length != 11){
                        modal.alert({message:'请填写正确的手机号码'})
                    }else{
                        this.getting = true
                        function dis(that) {
                            setTimeout(()=>{
                                that.time -- 
                                if(that.time == 0){
                                    that.getting = false
                                    that.time = 59
                                }else{
                                    dis(that)
                                }
                            },1000)
                        }
                        dis(this)
                        stream.fetch({
                            methods:'GET',
                            url: this.host + '/employee/sendSMS?PHONE='+ this.phoneNumber,
                            type:'json'
                        },res =>{
                            if(res.data.code == 0){
                                this.bubuid = res.data.extraData.bubuId
                            }else{
                                modal.alert({message:res.data.msg})
                            }     
                        },res =>{

                        })
                    } 
                }
            }
        }
    }
</script>