<template>
    <bu-view :config="configData" @event="viewEvent">
        <div class="item">
            <div class="item-sec">
                <input type="text" class="input" placeholder="收货人姓名" v-model="userName"/>
            </div>
            <div class="item-sec">
                <input type="tel" class="input" placeholder="收货人手机号" v-model="phone"/>
            </div>
            <div class="item-sec" @click="select">
                <text class="font34 c99" v-if="!province">省</text>
                <text class="font34 c33" v-if="province">{{province}}</text>
                <image class="icon mg-l" :src="icon"></image>
            </div>
            <div class="item-sec" @click="select">
                <text class="font34 c99" v-if="!city">市</text>
                <text class="font34 c33" v-if="city">{{city}}</text>
                <image class="icon mg-l" :src="icon"></image>
            </div>
            <div class="item-sec" @click="select">
                <text class="font34 c99" v-if="!county">县/区</text>
                <text class="font34 c33" v-if="county">{{county}}</text>
                <image class="icon mg-l" :src="icon"></image>
            </div>
            <div class="item-sec">
                <input type="text" class="input" placeholder="详细地址" v-model="detail"/>
            </div>
        </div>

        <div slot="footer" class="footer">
            <div class="btn" @click="submit">
              <text class="font32 white">确定</text>
            </div> 
        </div>
        <select-area slot="footer" :show="showArea" @close="closeArea" @getresult="getArea"></select-area>
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
    import buView from '../../../components/bu-view.vue'
    import selectArea from './components/select-area.vue'
    import stream from '../../../common/stream.js'
    import navigator from '../../../common/navigator.js'
    const modal = weex.requireModule('modal')
    const storage = weex.requireModule('storage')
    export default {
        data() {
            return {
                icon:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/orderIcon/itemGo.png',
                configData:{
                    title: '',
                    titleAlgin: 'left',
                    secondTitle:'',
                    bottom: '140px',
                    addEvent: '',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: 'refresh',
                    loadmore: false,
                    loadmoreEvent:'',
                    viewappear:'viewAppear'
                },
                uid:'',
                userName:'',
                phone: '',
                province:'',
                city: '',
                county: '',
                detail: '',
                showArea: false,
                addApi:'/bee/user/useraddr/add',
                modifyAddrApi:'/bee/user/useraddr/modifyById',
                pageType: '',
                addrid: ''
            };
        },
        components:{
            buView,
            selectArea
        },
        created(){
            this.uid = navigator.getQuery('id',this)
            // this.uid = '6156'
        },
        mounted(){
            this.pageType = navigator.getQuery('type',this)
            if(this.pageType === 'modify'){
                this.configData.title = '修改收货地址'
                this.queryAddr()
            }else{
                this.configData.title = '新增收货地址'
            }
        },  
        computed:{
        },
        methods:{
            queryAddr(id){
                storage.getItem('modify_addr_data',res =>{
                    let addr = JSON.parse(res.data)
                    this.userName = addr['USER_ADDR.USERNAME']
                    this.phone = addr['USER_ADDR.PHONE']
                    this.province = addr['USER_ADDR.ADDR_SHENG']
                    this.city = addr['USER_ADDR.ADDR_SHI']
                    this.county = addr['USER_ADDR.ADDR_XIAN']
                    this.detail = addr['USER_ADDR.ADDR_DETAIL']
                    this.addrid = addr['USER_ADDR.ADDR_ID']
                })
            },
            select(){
                this.showArea = true
            },
            getArea(p,c,county){
                this.province = p
                this.city = c
                this.county = county
            },
            closeArea(){
                this.showArea = false
            },
            viewEvent(name ,call){
                this[name](call)
            },
            submit(){
                if(this.isTrue()){
                    let obj = {
                        'USER_ADDR.USERNAME': this.userName,
                        'USER_ADDR.PHONE': this.phone,
                        'USER_ADDR.ADDR_GUO':'中国',
                        'USER_ADDR.UID': this.uid,
                        'USER_ADDR.ADDR_ID': this.addrid,
                        'USER_ADDR.ADDR_SHENG': this.province,
                        'USER_ADDR.ADDR_SHI': this.city,
                        'USER_ADDR.ADDR_XIAN': this.county,
                        'USER_ADDR.ADDR_DETAIL': this.detail
                    }
                    modal.confirm({message:'确认提交？', okTitle: '确认', cancelTitle:'取消'},res =>{
                        if(res == '确认'){
                            this.configData.pageRender = true
                            stream.fetch({
                                method:'POST',
                                url: this.pageType === 'modify' ? this.modifyAddrApi : this.addApi,
                                body: obj
                            },res =>{
                                navigator.pop()
                            },res=>{
                                this.configData.pageRender = false
                            })
                        }
                    })     
                }
            },
            isTrue(){
                if(this.userName == ''){
                    modal.alert({message:'收货人不能为空'})  
                    return false 
                }else if(this.phone.length != 11){
                    modal.alert({message:'收货人手机号格式不正确'})
                    return false
                }else if(this.detail == ''){
                    modal.alert({message:'详细地址不能为空'})
                    return false
                }else{
                    return true
                }
            }
        }
    };
</script>