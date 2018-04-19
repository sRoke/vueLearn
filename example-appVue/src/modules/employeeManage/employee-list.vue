<template>
    <bu-view :config="configData" @event="viewEvent">
      <div class="item" v-if="applyList.length > 0">
          <text class="font38 c33">申请加入员工</text>  
          <div class="item-sec" v-for="item in applyList" @click="jumpToAdd(item)">
            <div class="row">
              <!-- <image class="photo"></image> -->
              <div class="photo">
                <text class="font28 white">跑店</text>  
              </div>
              <div class="mg-l">
                <text class="font30 c33">{{item['REG_APPLY.NAME']}}</text>
                <text class="font26 c66">{{item['REG_APPLY.PHONE']}}</text>    
              </div>
            </div>
            <div class="row">
              <text class="font32 red">同意</text>
              <image class="icon mg-l" :src="icon"></image>  
            </div>
          </div>
      </div>
      <div class="item mg-t" v-if="employeeList.length > 0">
          <text class="font38 c33">已加入员工</text>  
          <div class="item-sec" v-for="item in employeeList" @click="jumpToSet(item)">
            <div class="row">
              <!-- <image class="photo"></image> -->
              <div class="photo">
                <text class="font28 white">跑店</text>  
              </div>
              <div class="mg-l">
                <text class="font30 c33">{{item['EMPLOYEE.NAME']}}</text>
                <text class="font26 c66">{{item['EMPLOYEE.LOGIN_ID']}}</text>    
              </div>
            </div>
            <div class="row">
              <image class="icon mg-l" :src="icon"></image>  
            </div>
          </div>
      </div>
      <div slot="footer" class="footer">
        <div class="btn" @click="share">
          <image class="wxicon" :src="wxicon"></image> 
          <text class="font32 white mg-l">微信邀请员工加入</text>
        </div> 
      </div>
    </bu-view>       
</template>     
<style scoped>
  .item{
    width: 750px;
    margin-top: 45px;
    padding-left: 30px;
  }
  .row{
    flex-direction: row;
    align-items: center;
  }
  .mg-t{
    margin-top: 60px;
  }
  .mg-l{
    margin-left: 20px;
  }
  .font38{
    font-size: 38px;
  }
  .font30{
    font-size: 30px;
    margin-bottom: 5px;
  }
  .font26{
    font-size: 26px;
  }
  .font28{
    font-size: 28px;
  }
  .font32{
    font-size: 32px;
  }
  .c66{
    color: #666;
  }
  .red{
    color: #cf411b;
  }
  .white{
    color: #fff;
  }
  .c33{
    color: #333;
  }
  .item-sec{
    width: 690px;
    height: 160px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom-width: 1px;
    border-bottom-color: #D8D8D8;
  }
  .item-sec:active{
    background-color: #D8D8D8;
  }
  .photo{
    background-color: #cf411b;
    width: 80px;
    height: 80px;
    border-radius: 10px;
    justify-content: center;
    align-items: center;
  }
  .icon{
    width: 14px;
    height: 24px;
  }
  .wxicon{
    width: 41px;
    height: 33px;
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
    background-color: #38A444;
    align-items: center;
    flex-direction: row;
    justify-content: center;
  }
  .btn:active{
    background-color: #2d7d36;
  }
</style>
<script>
    import buView from '../../components/bu-view.vue'
    import stream from '../../common/stream.js'
    import navigator from '../../common/navigator.js'
    const storage = weex.requireModule('storage')
    const modal = weex.requireModule('modal')
    const wxShareEvent = weex.requireModule('wxShareEvent')
    export default {
        data() {
            return {
                controlPage: '/modules/warehouse/controlPower',
                icon:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/orderIcon/itemGo.png',
                wxicon:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/baseIcon/wx-logo.png',
                configData:{
                    title: '我的员工',
                    titleAlgin: 'left',
                    secondTitle:'',
                    bottom: '140px',
                    addEvent: 'toEmployee',
                    btnText: '角色管理',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: 'refresh',
                    loadmore: false,
                    loadmoreEvent:'',
                    viewappear:'viewAppear'
                },
                companyName:'',
                service:'',
                host:'',
                applyApi:'/reg/apply/getApplyList?REG_APPLY.STATE=-1',
                queryApi:'/employee/queryAllNew',
                employeeList: [],
                applyList:[]
            };
        },
        components:{
            buView
        },
        created(){
          storage.getItem('login_user_info',res=>{
            let result = JSON.parse(res.data)
            this.companyName = result['USER.NAME']
            this.service = result['USER.SERVICE_ID']
          })
          storage.getItem('login_token',res=>{
            this.host = JSON.parse(res.data).host
          })
        },
        mounted(){
          this.getAll()
          this.getApplyList();
        },
        methods:{
          viewEvent(name,call){
            this[name](call)
          },
          toEmployee(){
            navigator.push({
                url: this.controlPage
            },res=>{})
          },
          viewAppear(){
            storage.getItem('employee_page_refresh',res=>{
              if(res.result == 'success' && res.data == 'true'){
                this.getAll()
                this.getApplyList();
                storage.removeItem('employee_page_refresh',res=>{})
              }
            })
            
          },
          getApplyList(){
            stream.fetch({
              method:'GET',
              url: this.applyApi
            },res=>{
              this.applyList = res.data
            })
          },
          getAll(){
            this.configData.pageRender = true
            stream.fetch({
              method:'GET',
              url: this.queryApi
            },res=>{
              this.employeeList = res.data
            },res=>{
              this.configData.pageRender = false
            })
          },
          jumpToSet(item){
            this.configData.pageRender = true
            stream.fetch({method:'GET',url:'/employee/getById?EMPLOYEE.EMPLOYEE_ID=' + item['EMPLOYEE.EMPLOYEE_ID']},res =>{
                let obj = res.data[0]
                obj.saleGroup = res.extraData.groups || []
                storage.setItem('employee_info_change',JSON.stringify(obj),res=>{
                  navigator.push({
                    url:'/modules/employeeManage/employee-modify',
                    query:'?type=change'
                  })
                })
            },res=>{
              this.configData.pageRender = false
            })
           
          },
          jumpToAdd(item){
            storage.setItem('employee_info_add',JSON.stringify(item),res=>{
              navigator.push({
                url:'/modules/employeeManage/employee-modify',
                query:'?type=add'
              })
            })
          },
          /*

            WEIXIN 分享
          */
          share(){
              storage.getItem('app_state_through',res =>{
                if(res.result === 'success'){
                  modal.alert({message:'体验状态不支持此操作'})
                }else{
                  if(typeof wxShareEvent.shareHtml == 'function'){
                    let url = 'http://f.ok.eerrpp.cc/app/orderKing/1000/html/shareHtml/share-join.html' + '?service=' + this.service + '&name=' + encodeURI(this.companyName) + '&host=' + this.host
                    let imgUrl = 'http://u.ok.eerrpp.cc/logo.png'
                    let title = '邀请您加入' + this.companyName + '大家庭'
                    let desc = '『跑店』APP，让业务员跑店更高效。拜访、签到、拍照、开单，更能查库存、管业务。'
                    wxShareEvent.shareHtml(url,title,desc,imgUrl,false);
                  }
                }
              }) 
          }
        },
    };
</script>