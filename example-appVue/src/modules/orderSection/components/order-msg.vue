<template>
    <div class="item">
        <div class="content">
            <div class="header" v-if="remark">
                <text class="font32 font-gray33">{{remark}}</text>
            </div>
            <div class="list-item">
                <div class="list" v-for="item in changeList">
                    <text class="font32 font-gray33" v-for="val in item" v-if="val.value && val.value != 'undefined'">{{val.name}}：{{val.value}}</text>
                </div>
            </div>            
        </div>
    </div>  
</template>
<style scoped>
    .item{
        width: 750px;
        align-items: center;
    }
    .content{
        width: 690px;
        padding-top: 70px;
    }
    .header{
        width: 690px;
        border-radius: 10px;
        background-color: #FFF5F0;
        padding: 20px;
        margin-bottom: 20px;
    }
    .list-item{
        padding-left: 20px;
        padding-right: 20px; 
        padding-bottom: 20px;
    }
    .list{
        width: 690px;
        margin-bottom: 50px;
    }
    .font32{
        margin-bottom: 5px;
        margin-top: 5px;
        font-size: 32px;
    }
    .font30{
        font-size: 30px;
    }
    .font-gray33{
        color:#333;
    }
    .font-gray66{
        color:#666;
    }
    .font-gray99{
        color:#999;
    }
    .row{
        flex-direction:row;
        align-items: center;
    }
</style>
<script>
    export default {
        data(){
            return {

            }
        },
        props:['list','remark'],
        filters:{
       
        },
        computed:{
            changeList(){
                let list = []
                this.list.forEach((ele,index) =>{
                    let state = false
                    ele.forEach(ele2 =>{
                        if(ele2.value && ele2.value != 'undefined'){
                            state = true
                        }
                    })
                    if(state){
                        list.push(ele)
                    }
                })
                return list
            }
        }
    }
</script>