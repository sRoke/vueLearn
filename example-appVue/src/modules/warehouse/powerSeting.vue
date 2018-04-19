<template>
    <bu-view :config="configData" @event="viewEvent">
        <div class="bodys">
            <input type="text" class="input-item" placeholder="权限名称"    v-model="name"></input>
            <text class="oneLeave">PC管理端</text>
            <div  v-for="(item1,key1) in pclist" :class="[key1==pclist.length-1?'twoleave1':'twoleave']">
                <text class="twoleave-name">{{item1['MENU.NAME']}}</text>
                <div class="label-indexs">
                    <div class="label-index" @click="ifchoose(key1,key2)" v-for="(item2,key2) in item1['childList']" :class="[item2['ifchoose']?'ischoosed':'notchoosed']">
                        <text class="label-text">{{item2['MENU.NAME']}}</text>
                        <image class="choose-img" :src="redgouIcon" v-if="item2['ifchoose']"></image>
                    </div>
                </div>
            </div>
            <text class="oneLeave">移动管理端</text>
            <div  v-for="(item3,key3) in applist" :class="[key3==applist.length-1?'twoleave1':'twoleave']">
                <text class="twoleave-name">{{item3['MENU.NAME']}}</text>
                <div class="label-indexs">
                    <div class="label-index" @click="ifchooses(key3,key4)" v-for="(item4,key4) in item3['childList']" :class="[item4['ifchoose']?'ischoosed':'notchoosed']">
                        <text class="label-text">{{item4['MENU.NAME']}}</text>
                        <image class="choose-img" :src="redgouIcon" v-if="item4['ifchoose']"></image>
                    </div>
                </div>
            </div>
        </div>
        <div slot="footer" class="footer">
            <div class="btn" @click="save">
              <text class="font32 white">保存</text>
            </div> 
        </div>
    </bu-view>       
</template>     
<style scoped>
    .ischoosed{
        background-color: #fff;
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-bottom-color: #CF411B;
        border-top-style: solid;
        border-top-width: 1px;
        border-top-color: #CF411B;
        border-left-style: solid;
        border-left-width: 1px;
        border-left-color: #CF411B;
        border-right-style: solid;
        border-right-width: 1px;
        border-right-color: #CF411B;
    }
    .notchoosed{
        background-color: #F5F6F5;
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-bottom-color: #F5F6F5;
        border-top-style: solid;
        border-top-width: 1px;
        border-top-color: #F5F6F5;
        border-left-style: solid;
        border-left-width: 1px;
        border-left-color: #F5F6F5;
        border-right-style: solid;
        border-right-width: 1px;
        border-right-color: #F5F6F5;
    }
    .choose-img{
        width:23px;
        height: 23px;
        margin-top: 4px;
        margin-left: 5px;
    }
    .label-indexs{
        margin-top: 30px;
        /*width:750px;*/
        flex-direction: row;
        justify-content: start;
        -webkit-box-pack: justify;
        -webkit-box-align: center;
        align-items: center;
        flex-wrap:wrap;
    }
    .label-text{
        color: #666;
        font-size: 28px;
    }
    .label-index:first-child{
        margin-left: 0;
    }
    .label-index{
        padding-right: 15px;
        padding-left: 15px;
        padding-top: 15px;
        padding-bottom: 15px;
        margin-right: 30px;
        margin-bottom: 30px;
        
        flex-direction: row;
        justify-content: space-between;
    }
    .twoleave-name{
        font-size: 32px;
        color:#333
    }
    .twoleave{
        width: 690px;
        border-bottom-style: solid;
        border-bottom-color: #D8D8D8;
        border-bottom-width: 1px;
        padding-top: 30px;
    }
    .twoleave1{
        width: 690px;
        padding-top: 30px;
    }
    .oneLeave{
        width: 690px;
        border-bottom-style: solid;
        border-bottom-color: #D8D8D8;
        border-bottom-width: 1px;
        height: 150px;
        line-height: 210px;
        color: #333;
        font-size: 38px;
        font-weight: bold;
    }
    .input-item{
        width: 690px;
        border-bottom-style: solid;
        border-bottom-color: #D8D8D8;
        border-bottom-width: 1px;
        height: 95px;
        line-height: 95px;
        color: #333;
        text-align: center;
        font-size: 36px;
    }
    .bodys{
        width: 750px;
        padding-right: 30px;
        padding-left: 30px;
        flex-direction: column;
        margin-top: 30px;
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
                redgouIcon : icon.redgouIcon,
                name: '',
                configData:{
                    title: '权限设置',
                    titleAlgin: 'left',
                    secondTitle:'',
                    bottom: '140px',
                    addEvent: 'todel',
                    btnText: '删除',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: 'refresh',
                    loadmore: false,
                    loadmoreEvent:'',
                },
                pclist:[],
                applist:[],
                infos: {},
                currentId: null,
                currentroleId:null
            };
        },
        components:{
            buView
        },
        created(){
    
        },
        mounted(){
            var that = this;
            storage.getItem('employee_detail', event => {
                this.infos =JSON.parse(event.data);
                this.name = this.infos.name;
                this.currentId = this.infos.id;
                this.currentroleId = this.infos.roleId;
                stream.fetch({
                    method:'GET',
                    url:'/menu/runtime/menuForOrderKing?MENU_RUNTIME.SYS_ID=jiaorder&MENU_RUNTIME.TYPE=WORK&$DEBUG=2084udbu2587'
                },res=>{
                    this.pclist = res.extraData['menuMap']['devMenu'];
                    this.pclist.forEach(function(item,key){
                        item['childList'].forEach(function(item1,key1){   
                            if(that.infos.power.indexOf(item1['MENU.APP_ID'])>=0){
                                item1['ifchoose'] = true
                            }else{
                                item1['ifchoose'] = false
                            }
                        })
                    })
                    this.applist = res.extraData['menuMap']['mobileMenu'];
                    this.applist.forEach(function(item,key){
                        item['childList'].forEach(function(item1,key1){
                            if(that.infos.power.indexOf(item1['MENU.APP_ID'])>=0){
                                item1['ifchoose'] = true
                            }else{
                                item1['ifchoose'] = false
                            }
                        })
                    })
                })
            })
        },  
        methods:{
            viewEvent(name,call){
                this[name](call)
            },
            todel(){
                modal.confirm({message:'确认删除？', okTitle: '删除', cancelTitle:'取消'},res =>{
                    if(res=='删除'){
                        stream.fetch({
                            method:'GET',
                            url:'/employee/role/delById?EMPLOYEE_ROLE.EMPLOYEE_ROLE_ID='+parseInt(this.currentId)+'&ROLE_APP_MAP.EMPLOYEE_ROLE_ID='+this.currentroleId,
                        },res=>{
                            if(res.code == 0){
                                modal.toast({message:'删除成功',duration:1})    
                                setTimeout(()=>{
                                    navigator.pop()
                                },1500)
                            }
                        })
                    }
                })
            },   
            save(){
                if(this.name == ''){
                    modal.toast({message:'权限名称不能为空',duration:1})
                    return
                }
                var x = [];
                this.pclist.forEach(function(item,key){
                    item['childList'].forEach(function(item1,key1){
                        if(item1['ifchoose']==true){
                            x.push(item1['MENU.APP_ID'])
                        }
                    })
                })
                this.applist.forEach(function(item,key){
                    item['childList'].forEach(function(item1,key1){
                        if(item1['ifchoose']==true){
                            x.push(item1['MENU.APP_ID'])
                        }
                    })
                })
                if(x.length==0){
                    modal.toast({message:'至少勾选一个权限',duration:1})
                    return
                }
                x=x.join(',');
                x.replace('"','');
                stream.fetch({
                    method:'POST',
                    url:'/role/app/map/modifyBatch',
                    body: {
                        'EMPLOYEE_ROLE.ROLE_NAME' : this.name,
                        'EMPLOYEE_ROLE.ROLE_ID' : this.currentId,
                        'APP_IDS' : x,
                        'ROLE_APP_MAP.EMPLOYEE_ROLE_ID': this.currentroleId
                    }
                },res=>{
                    if(res.code == 0){
                        modal.toast({message:'修改成功',duration:1})    
                        setTimeout(()=>{
                            navigator.pop()
                        },1500)  
                    }
                })
            },
            ifchoose(key1,key2){
                var that = this
                this.pclist[key1]['childList'][key2]['ifchoose'] = !this.pclist[key1]['childList'][key2]['ifchoose']
                this.$set(this.pclist[key1]['childList'],key2,this.pclist[key1]['childList'][key2])
            },
            ifchooses(key1,key2){
                var that = this
                this.applist[key1]['childList'][key2]['ifchoose'] = !this.applist[key1]['childList'][key2]['ifchoose']
                this.$set(this.applist[key1]['childList'],key2,this.applist[key1]['childList'][key2])
            },

        },
    };
</script>