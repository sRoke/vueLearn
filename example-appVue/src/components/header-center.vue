<template>
    <!-- 次标题 -->
    <div class="head-warp" :class=" [theme == 'dark' ? 'dark' : 'light'] ">        
        <text class="title" :class=" [theme == 'dark' ? 'f-dark' : 'f-light'] "  @appear="hide" @disappear="show">{{title}}</text>  
        <div class="row">
            <text class="subtitle" :class=" [theme == 'dark' ? 'f-dark' : 'f-light'] ">{{content}}</text>
            <div class="tag" v-if="tag">
                <text class="tagText">{{tag}}</text>
            </div>
        </div>         
    </div>
</template>     
<style scoped>
    .head-warp{      
        align-items: center;
        justify-content: center;
        height: 164px;
        padding-bottom: 20px;
        width: 750px;
    }
    .dark{
        background-color: #171B22;
    }
    .light{
        background-color: #fff;
    }
    .f-dark{
        color: #fff;
    }
    .f-light{
        color: #333;
    }
    .tag{
        padding-left: 5px;
        padding-right: 5px;
        border-width: 1px;
        border-color: #cf411b;
        border-radius: 4px;
        margin-left: 10px;
    }
    .row{
        margin-top: 5px;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .title{
        font-size: 50px;
        font-weight: bold;
    }
    .subtitle{
        font-size: 32px;
    }
    .tagText{
        font-size: 24px;
        color: #cf411b;
    }
</style>
<script>
    export default {
        data() {
            return {
               
            };
        },
        props:['title','content','tag','theme'],
        created(){

        },
        methods:{
            hide(){
                this.$emit('hidden',false)
            },
            show(){
                this.$emit('hidden',true)
            }
        }
    };
</script>