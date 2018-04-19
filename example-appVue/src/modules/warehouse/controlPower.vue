<template>
    <bu-view :config="configData" @event="viewEvent">
        <div class="item">
            <div class="sec" v-for="item in list" @click="select(item)">
                <div class="title">
                    <text class="f32 c33">{{item['EMPLOYEE_ROLE.ROLE_NAME']}}</text>
                    <image class="head-right-icon" :src="torightIcon"></image>
                </div>
                <div class="row">
                    <div class="content" v-for="con in roleMap[item['EMPLOYEE_ROLE.EMPLOYEE_ROLE_ID']]">
                        <text class="c66 f28">{{con['ROLE_APP_MAP.NAME']}}</text>
                    </div>
                </div>
                <div class="line"></div>
            </div> 
        </div>
        <!-- <div slot="footer" class="footer">
            <div class="btn" @click="submit">
              <text class="font32 white">确定</text>
            </div> 
        </div> -->
    </bu-view>       
</template>     
<style scoped>
    .head-right-icon{
        width: 14px;
        height: 24px;
    }
    .item{
        width: 750px;
        margin-top: 20px;
        align-items: center;
    }
    .sec{
        width: 720px;
        margin-top: 30px;
        align-items: center;   
    }
    .line{
        width: 690px;
        border-bottom-width: 1px;
        border-bottom-color: #D8D8D8;
    }
    .row{
        width: 720px;
        flex-direction: row;
        flex-wrap: wrap;
        margin-top: 25px;
    }
    .title{
        width: 690px;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .content{
        height: 62px;
        padding-left: 30px;
        padding-right: 30px;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        margin-right: 15px;
        margin-left: 15px;
        margin-bottom: 30px;
        background-color: #F5F6F5;
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
    .f28{
        font-size: 28px;
    }
    .c33{
        color: #333;
    }
    .c66{
        color: #666;
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
    import stream from '../../common/stream.js'
    import navigator from '../../common/navigator.js'
    import icon      from '../tagSection/icon/icon.js'
    const storage = weex.requireModule('storage')
    const modal = weex.requireModule('modal')
    export default {
        data() {
            return {
                addPage: '/modules/warehouse/addEmployee',
                modifyPage :'/modules/warehouse/powerSeting',
                torightIcon : icon.torightIcon,
                iconAc:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/baseIcon/radioAction.png',
                icon:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/baseIcon/radioDefault.png',
                configData:{
                    title: '员工权限',
                    titleAlgin: 'left',
                    headerBtnType:'default',
                    secondTitle:'',
                    bottom: '0px',
                    addEvent: 'jump',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: 'refresh',
                    loadmore: false,
                    loadmoreEvent:'',
                    viewappear: 'getData'
                },
                list:[],
                roleMap:{},
                selectObj:{},
                firstEnter: true
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
                url:'/employee/role/queryRoleAndAuths'
            },res=>{
                this.list = res.data 
                this.roleMap = res.extraData.roleAppMap
                let ids = navigator.getQuery('ids',this)
                this.selectAll(ids)
            })
        },  
        methods:{
            viewEvent(name,call){
                this[name](call)
            },
            getData(){
                stream.fetch({
                    method:'GET',
                    url:'/employee/role/queryRoleAndAuths'
                },res=>{
                    this.list = res.data 
                    this.roleMap = res.extraData.roleAppMap
                    let ids = navigator.getQuery('ids',this)
                    this.selectAll(ids)
                })
            },
            selectAll(list){
                this.list.forEach(ele =>{
                    let id = ele['EMPLOYEE_ROLE.EMPLOYEE_ROLE_ID']
                    if(list.indexOf(id) != '-1'){
                        this.selectObj = Object.assign({[id] : ele }, this.selectObj)
                    }
                })
            },
            select(item){

                // let id = item['EMPLOYEE_ROLE.EMPLOYEE_ROLE_ID']
                // if(this.selectObj[id]){
                //     this.$delete(this.selectObj , id)
                // }else{
                //     this.selectObj = Object.assign({[id] : item }, this.selectObj)
                // }
                var m = [];
                this.roleMap[item['EMPLOYEE_ROLE.EMPLOYEE_ROLE_ID']].forEach(function(item,key){
                    m.push(item['ROLE_APP_MAP.APP_ID'])
                })
                var x ={
                    name: item['EMPLOYEE_ROLE.ROLE_NAME'],
                    id: item['EMPLOYEE_ROLE.EMPLOYEE_ROLE_ID'],
                    roleId: item['EMPLOYEE_ROLE.EMPLOYEE_ROLE_ID'],
                    power: m
                }
                storage.setItem('employee_detail',JSON.stringify(x),event =>{
                    navigator.push({
                        url: this.modifyPage
                    },res=>{})
                })
            },
            // submit(){
            //     let arr = Object.keys(this.selectObj)
            //     if(arr.length > 0){
            //         storage.setItem('employee_select_power',JSON.stringify(this.selectObj),res=>{
            //             navigator.pop()
            //         }) 
            //     }else{
            //         modal.alert({message:'请至少选择一个角色权限'})
            //     }
            // },
            jump(){
                navigator.push({
                        url: this.addPage
                    },res=>{})
            }
        },
    };
</script>