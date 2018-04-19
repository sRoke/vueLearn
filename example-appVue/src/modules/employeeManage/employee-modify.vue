<template>
    <bu-view :config="configData" @event="viewEvent">
        <div class="item">
            <div class="item-sec">
                <input type="text" class="input" v-model="userName"/>
            </div>
            <div class="item-sec">
                <input type="tel" class="input" v-model="phone"/>
            </div>
            <div class="item-sec" @click="showConfirmEvent">
                <text class="font34 c99" v-if="jobIndex == -1">员工岗位</text>
                <text class="font34 c33" v-if="jobIndex != -1">{{jobList[jobIndex].NAME}}</text>
                <image class="icon mg-l" :src="icon"></image>
            </div>
            <div class="item-sec" @click="jumpSale" v-if="jobIndex != -1 && jobList[jobIndex].CODE == 'SALEMAN'">
                <text class="font34 c99" v-if="!saleGroup">销售团队</text>
                <text class="font34 c33" v-if="saleGroup">{{saleGroup}}</text>
                <image class="icon mg-l" :src="icon"></image>
            </div>
            <div class="item-sec" @click="jumpPower">
                <text class="font34 c99" v-if="!powers">员工权限</text>
                <text class="font34 c33" v-if="powers">{{powers}}</text>
                <image class="icon mg-l" :src="icon"></image>
            </div>
            <div class="item-sec" @click="jumpRepo">
                <text class="font34 c99" v-if="!repos">选择仓库</text>
                <text class="font34 c33" v-if="repos">{{repos}}</text>
                <image class="icon mg-l" :src="icon"></image>
            </div>
        </div>

        <div slot="footer" class="footer">
            <div class="btn" @click="submit">
              <text class="font32 white">确定</text>
            </div> 
        </div>
        <confirm slot="footer" ref="submit" :title="'员工岗位'" @ok="getWork">
            <radioList :list="jobList" :index="jobIndex" ref="radio"></radioList>
        </confirm>
    </bu-view>       
</template>     
<style scoped>
  .item{
    width: 750px;
    margin-top: 90px;
    align-items: center;
  }
  .item-sec{
    width: 550px;
    height: 136px;
    margin-top: 10px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-bottom-color: #d8d8d8;
    border-bottom-width: 1px;
  }
  .item-sec:active{
    background-color: #D8D8D8;
  }
  .font34{
    font-size: 34px;
  }
  .font32{
    font-size: 32px;
  }
  .mg-l{
    margin-left: 20px;
  }
  .input{
    height: 130px;
    width: 550px;
    text-align: center;
    font-size: 34px;
    color: #333;
  }
  .c99{
    color: #999;
  }
  .white{
    color: #fff;
  }
  .c33{
    color: #333;
  }
  .icon{
    width: 14px;
    height: 24px;
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
    import confirm from './components/confirm.vue'
    import radioList from './components/radio-list.vue'
    const storage = weex.requireModule('storage')
    const modal = weex.requireModule('modal')
    export default {
        data() {
            return {
                applyId:null,
                icon:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/orderIcon/itemGo.png',
                configData:{
                    title: '员工资料',
                    titleAlgin: 'left',
                    secondTitle:'',
                    bottom: '140px',
                    addEvent: 'todel',
                    btnText:'删除',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: 'refresh',
                    loadmore: false,
                    loadmoreEvent:'',
                    viewappear:'viewAppear'
                },
                showConfirm: false,
                type:'',
                userName:'',
                phone:'',
                getJobApi:'/employee/queryWork',

                addEmployeeApi:'/employee/add',
                modifyEmployeeApi:'/employee/modifyById',
                jobList:[],
                reposList:[],
                reposVal:'ALL',
                repos:'全部仓库',
                powers:'',
                powerVal: '',
                powerList:[],
                saleList:[],
                jobCode:'',
                uid:'',
                jobIndex: -1,
                saleGroup:'',
                sale:''
            };
        },
        components:{
            buView,
            confirm,
            radioList
        },
        created(){
            this.type = navigator.getQuery('type',this)
            if(this.type == 'add'){
                storage.getItem('employee_info_add',res=>{
                    let result = JSON.parse(res.data)
                    this.applyId =result['REG_APPLY.REG_APPLY_ID']
                    this.userName = result['REG_APPLY.NAME']
                    this.phone = result['REG_APPLY.PHONE']
                    this.getJobList()
                    this.getRepos()
                })
            }else if(this.type == 'change'){
                // this.configData['addEvent'] = 'todel';
                // this.configData['btnText'] = '删除';
                storage.getItem('employee_info_change',res=>{
                    let result = JSON.parse(res.data)
                    this.userName = result['EMPLOYEE.NAME']
                    this.phone = result['EMPLOYEE.LOGIN_ID']
                    this.jobCode = result['EMPLOYEE.TYPE']
                    this.powerList = JSON.parse(result['EMPLOYEE.ROLE_DETAIL'])
                    this.reposVal = result['EMPLOYEE.REPOS'] == null ? 'ALL' : result['EMPLOYEE.REPOS']
                    this.uid = result['EMPLOYEE.EMPLOYEE_ID']
                    this.renderGroups(result.saleGroup)
                    this.renderPower()
                    this.getRepos()
                    this.getJobList()
                })
            }
            storage.removeItem('employee_select_repos',res=>{})
            storage.removeItem('employee_select_power',res=>{})
        },
        mounted(){

        },  
        computed:{
        },
        methods:{
            todel(){
                modal.confirm({message:'确认删除？', okTitle: '删除', cancelTitle:'取消'},res =>{
                        if(res == '删除'){
                            if(this.type == 'add'){
                                stream.fetch({
                                    method:'GET',
                                    url:'/reg/apply/delById?REG_APPLY.REG_APPLY_ID='+this.applyId
                                },res=>{
                                    if(res.code==0){
                                        modal.toast({message:'删除成功',duration:1});
                                        storage.setItem('employee_page_refresh','true',res=>{
                                            navigator.pop()
                                        })
                                    }
                                })
                            }else{
                                stream.fetch({
                                    method:'GET',
                                    url:'/employee/delById?EMPLOYEE.EMPLOYEE_ID='+this.uid
                                },res=>{
                                    if(res.code==0){
                                        modal.toast({message:'删除成功',duration:1});
                                        storage.setItem('employee_page_refresh','true',res=>{
                                            navigator.pop()
                                        })
                                    }
                                })
                            }
                        }
                })
            },
            getRepos(){
                stream.fetch({
                    method:'GET',
                    url:'/repository/query'
                },res=>{
                    let list = res.data
                    let arr = []
                    storage.setItem('employee_repos_info',JSON.stringify(list),res=>{})
                    if(this.reposVal != 'ALL'){
                        list.forEach(ele =>{
                            if(this.reposVal.indexOf(ele['REPOSITORY.REPOSITORY_ID']) != -1){
                                arr.push(ele['REPOSITORY.REPOS_NAME'])
                            }
                        })
                        this.repos = arr.join(',')
                    }
                })
            },
            getJobList(){
                stream.fetch({
                    method:'GET',
                    url:this.getJobApi
                },res=>{
                    let obj = res.extraData.workList
                    for(let i in obj){
                        this.jobList.push(obj[i])
                    }
                    this.jobList.forEach((ele,index)=>{
                        if(ele['CODE'] == this.jobCode){
                            this.jobIndex = index
                        }
                    })
                },res=>{

                })
            },
            renderPower(){
                let arr = []
                let arr2 = []
                this.powerList.forEach(ele=>{
                    arr.push(ele['EMPLOYEE_ROLE.EMPLOYEE_ROLE_ID'])
                    arr2.push(ele['EMPLOYEE_ROLE.ROLE_NAME'])
                })
                this.powerVal = arr.join(',')
                this.powers = arr2.join(',')
            },
            viewAppear(){
                storage.getItem('employee_select_repos',res=>{
                    if(res.result == 'success'){
                        if(res.data == 'ALL'){
                            this.reposVal = 'ALL'
                            this.repos = '全部仓库'
                        }else{
                            let obj = JSON.parse(res.data)
                            let arr = []
                            for(let i in obj){
                                arr.push(obj[i])
                            }
                            this.reposVal = Object.keys(obj).join(',')
                            this.repos = arr.join(',')
                        }
                        storage.removeItem('employee_select_repos',res=>{})
                    }
                })
                storage.getItem('employee_select_power',res=>{
                    if(res.result == 'success'){
                        let obj = JSON.parse(res.data)
                        let arr = []
                        this.powerList = []
                        for(let i in obj){
                            arr.push(obj[i]['EMPLOYEE_ROLE.ROLE_NAME'])
                            this.powerList.push(obj[i])
                        }
                        this.powerVal = Object.keys(obj).join(',')
                        this.powers = arr.join(',')
                        storage.removeItem('employee_select_power',res=>{})
                    }
                })
                storage.getItem('employee_select_sale',res=>{
                    if(res.result == 'success'){
                        let obj = JSON.parse(res.data)
                        let arr = []
                        for(let i in obj){
                            arr.push(obj[i])
                        }
                        this.sale = Object.keys(obj).join(',')
                        this.saleGroup = arr.join(',')
                        storage.removeItem('employee_select_sale',res=>{})
                    }
                })
            },
            renderGroups(arr){
                let val1 = []
                let val2 = []
                arr.forEach(ele=>{
                    val1.push(ele['SALEMAN_RULE_GROUP.GROUP_NAME'])
                    val2.push(ele['SALEMAN_RULE_GROUP_SALEMAN.SALEMAN_RULE_GROUP_ID'])
                })
                this.saleGroup = val1.join(',')
                this.sale = val2.join(',')
            },
            jumpRepo(){
                navigator.push({
                    url:'/modules/employeeManage/employee-repos',
                    query:'?ids=' + this.reposVal
                })
            },
            jumpPower(){
                navigator.push({
                    url:'/modules/employeeManage/employee-power',
                    query:'?ids=' + this.powerVal
                })
            },
            jumpSale(){
                navigator.push({
                    url:'/modules/employeeManage/employee-sale',
                    query:'?ids=' + this.sale
                })
            },
            viewEvent(name,call){
                this[name](call)
            },
            showConfirmEvent(){
                this.$refs.submit.show = true
            },
            getWork(){
                this.jobIndex = this.$refs.radio.nowIndex
                this.$refs.submit.show = false
            },
            submit(){
                if(this.userName == ''){
                    modal.alert({message:'员工名称不能为空'})   
                }else if(this.phone.length != 11){
                    modal.alert({message:'手机号码格式不正确'})
                }else if(this.jobIndex == -1){
                    modal.alert({message:'请选择员工岗位'})
                }else if(this.powerVal == ''){
                    modal.alert({message:'请选择员工权限'})
                }else if(this.jobList[this.jobIndex].CODE == 'SALEMAN' && this.sale == ''){
                    modal.alert({message:'请选择销售团队'})
                }else{
                    modal.confirm({message:'确认提交？', okTitle: '确认', cancelTitle:'取消'},res =>{
                        if(res == '确认'){
                            this.configData.pageRender = true
                            let form = {
                                'EMPLOYEE.EMPLOYEE_ID' : (this.type == 'add' ? '' : this.uid),
                                'EMPLOYEE.NAME' :  this.userName,               
                                'EMPLOYEE.LOGIN_ID' : this.phone,         
                                'EMPLOYEE.REPOS': this.reposVal,               
                                'EMPLOYEE.ROLE_DETAIL': JSON.stringify(this.powerList),
                                'EMPLOYEE.TYPE': this.jobList[this.jobIndex].CODE,               
                                'LOGIN_PASSWORD': this.phone,
                                'EMPLOYEE.SALEMAN_GROUP_ID': this.jobList[this.jobIndex].CODE == 'SALEMAN' ? this.sale  : '[$null]'    
                            }
                            stream.fetch({
                                method:'POST',
                                url: this.type == 'add' ? this.addEmployeeApi : this.modifyEmployeeApi,
                                body: form
                            },res=>{
                                modal.alert({message: this.type == 'add'?'新增成功':'修改成功'})
                                storage.setItem('employee_page_refresh','true',res=>{
                                    navigator.pop()
                                })
                            },res=>{
                                this.configData.pageRender = false
                            })
                        }
                    })  
                }
            }
        },
    };
</script>