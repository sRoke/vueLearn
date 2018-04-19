<template>
    <bu-view :config="configData" @event="viewEvent">
        <div class="item">
            <div class="sec">
                <div class="title" v-for="(item,index) in list" @click="select(item)">
                    <text class="f32 c33">{{item['SALEMAN_RULE_GROUP.GROUP_NAME']}}</text>
                    <image class="icon" :src="selectCon[item['SALEMAN_RULE_GROUP.SALEMAN_RULE_GROUP_ID']] ? iconAc : icon"></image>   
                </div>
            </div>
        </div>
        <div slot="footer" class="footer">
            <div class="btn" @click="submit">
              <text class="f32 white">确定</text>
            </div> 
        </div>
    </bu-view>       
</template>     
<style scoped>
    .item{
        width: 750px;
        margin-top: 20px;
        align-items: center;
    }
    .sec{
        width: 690px;
        margin-top: 30px;
        align-items: center; 
        border-top-width: 1px;
        border-top-color: #D8D8D8;  
    }
    .title{
        width: 690px;
        height: 115px;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        border-bottom-width: 1px;
        border-bottom-color: #D8D8D8;  
    }
    .title:active{
        background-color: #D8D8D8;
    }
    .font32{
        font-size: 32px;
    }
    .white{
        color: #fff;
    }
    .f32{
        font-size: 32px;
    }
    .c33{
        color: #333;
    }
    .footer{
        position: absolute;
        bottom: 0;
        width: 750px;
        height: 140px;
        align-items: center;
        justify-content: center;
    }
    .btn{
        width: 690px;
        height: 80px;
        border-radius: 10px;
        background-color: #CF411B;
        align-items: center;
        flex-direction: row;
        justify-content: center;
    }
    .btn:active{
        background-color: #CF320A;
    }
    .icon{
        width: 42px;
        height: 42px;
    }
</style>
<script>
    import buView from '../../components/bu-view.vue'
    import navigator from '../../common/navigator.js'
    import stream from '../../common/stream.js'
    const storage = weex.requireModule('storage')
    const modal = weex.requireModule('modal')
    export default {
        data() {
            return {
                iconAc:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/baseIcon/radioAction.png',
                icon:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/baseIcon/radioDefault.png',
                configData:{
                    title: '选择销售团队',
                    titleAlgin: 'left',
                    btnText:'管理',
                    headerBtnType:'default',
                    secondTitle:'',
                    bottom: '140px',
                    addEvent: 'selectAll',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: 'refresh',
                    loadmore: false,
                    loadmoreEvent:'',
                },
                list:[],
                selectCon: {}
            };
        },
        components:{
            buView
        },
        created(){
            
        },
        mounted(){
            stream.fetch({
                method:'GET',
                url:'/saleman/rule/group/querySaleManGroup'
            },res=>{
                this.list = res.data 
                let ids = navigator.getQuery('ids',this)
                this.selectAll(ids)
            })
        },  
        methods:{
            viewEvent(name,call){
                this[name](call)
            },
            selectAll(list){
                this.list.forEach(ele =>{
                    let id = ele['SALEMAN_RULE_GROUP.SALEMAN_RULE_GROUP_ID']
                    if(list.indexOf(id) != '-1'){
                        this.selectCon = Object.assign({[id] : (ele['SALEMAN_RULE_GROUP.GROUP_NAME'] ? ele['SALEMAN_RULE_GROUP.GROUP_NAME'] : '匿名') }, this.selectCon)
                    }
                })
            },
            submit(){
                let arr = Object.keys(this.selectCon)
                if(arr.length > 0){
                    storage.setItem('employee_select_sale',JSON.stringify(this.selectCon),res=>{})
                    navigator.pop()
                }else{
                    modal.alert({message:'请至少选择一个销售团队'})
                }
            },
            select(item){
                let id = item['SALEMAN_RULE_GROUP.SALEMAN_RULE_GROUP_ID']
                if(this.selectCon[id]){
                    this.$delete(this.selectCon , id)
                }else{
                    this.selectCon = Object.assign({[id] : (item['SALEMAN_RULE_GROUP.GROUP_NAME'] ? item['SALEMAN_RULE_GROUP.GROUP_NAME'] : '匿名') }, this.selectCon)
                }
                
            },
            jump(){}
        },
    };
</script>