<template>
    <bu-view :config="configData" @event="viewEvent">
      <div class="list" v-if="index == 0">
          <div class="item" v-for="item in supplierList" @click="selectSupplier(item)">
                <text class="fonts-34 fontc-33 line1">{{item['SUPPLIER.SUPPLIER_NAME']}}</text>
                <div class="row-between">
                    <text class="fonts-30 fontc-66 line1">{{item['SUPPLIER.ADDR_GUO'] && item['SUPPLIER.ADDR_GUO'] != '中国' ? item['SUPPLIER.ADDR_GUO'] : ''}}{{item['SUPPLIER.ADDR_SHENG'] ? item['SUPPLIER.ADDR_SHENG'] : ''}}{{item['SUPPLIER.ADDR_SHI'] ? item['SUPPLIER.ADDR_SHI'] : ''}}{{item['SUPPLIER.ADDR_XIAN'] ? item['SUPPLIER.ADDR_XIAN'] : ''}}{{item['SUPPLIER.ADDR_DETAIL'] ? item['SUPPLIER.ADDR_DETAIL'] : ''}}</text>
                </div>
          </div>
      </div>
      <div class="list" v-if="index == 1">    
          <div class="item" v-for="item in reposList" @click="selectRepos(item)">
                <text class="fonts-34 fontc-33 line1">{{item['REPOSITORY.REPOS_NAME']}}</text>
                <div class="row-between">
                    <text class="fonts-30 fontc-66 line1">{{item['REPOSITORY.ADDR_GUO'] && item['REPOSITORY.ADDR_GUO'] != '中国' ? item['REPOSITORY.ADDR_GUO'] : ''}}{{item['REPOSITORY.ADDR_SHENG'] ? item['REPOSITORY.ADDR_SHENG'] : ''}}{{item['REPOSITORY.ADDR_SHI'] ? item['REPOSITORY.ADDR_SHI'] : ''}}{{item['REPOSITORY.ADDR_XIAN'] ? item['REPOSITORY.ADDR_XIAN'] : ''}}{{item['REPOSITORY.ADDR_DETAIL'] ? item['REPOSITORY.ADDR_DETAIL'] : ''}}</text>
                </div>
          </div>
      </div> 
    </bu-view>
            
</template>     
<style scoped>
   .page{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
   }
   .scrol{
    position: absolute;
    top: 78px;
    bottom: 0px;
    left: 0px;
    width: 750px;
   }
   .tag{
    margin-top: 10px;
    margin-right: 10px;
    border-width: 1px;
    border-color: #cf411b;
    border-radius: 3px;
    padding-top: 3px;
    padding-bottom: 3px;
    padding-right: 8px;
    padding-left: 8px;
   }
   .list{
     align-items: center;
   }
   .row{
    flex-direction: row;
   }
   .row-between{
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
   }
   .item{
    width: 690px;
    padding-top: 40px;
    padding-bottom: 40px;
    border-bottom-width: 1px;
    border-bottom-color: #EBEBEB;
   }
   .item:active{
    background-color: #d8d8d8;
   }
   .fw{
    font-weight: bold;
   }
   .line1{
    width: 600px;
    lines:1;
    text-overflow: ellipsis;
   }
   .fonts-34{
    font-size: 34px;
   }
   .fonts-30{
    font-size: 30px;
   }
   .fonts-28{
    font-size: 28px;
   }
   .fonts-26{
    font-size: 26px;
   }
   .fonts-22{
    font-size: 22px;
   }
   .fontc-66{
    color: #666;
   }
   .fontc-99{
    color: #999;
   }
   .fontc-33{
    color: #333;
   }
   .fontc-red{
    color: #cf411b;
   }
</style>
<script>
    import buView from '../../components/bu-view.vue'
    import stream from '../../common/stream.js'
    import navigator from '../../common/navigator.js'
    import modal from '../../common/modal.js'
    const storage = weex.requireModule('storage')
    export default {
        data() {
            return {
                getSupplierApi:'/SUPPLIER/queryAll',
                getReposApi:'/repository/query',
                supplierList: [],
                configData:{
                    title: '选择供应商',
                    titleAlgin: 'left',
                    secondTitle:'',
                    bottom: '0px',
                    addEvent: 'add',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: 'refresh',
                    loadmore: false,
                    loadmoreEvent:'',
                },
                reposList:[],
                repos:'',
                supplier:'',
                index: 0,
                titleList:['选择供应商','选择仓库'],
                type:'',
                newId:''
            };
        },
        components:{
            buView
        },
        props:[],
        created(){
          this.type = navigator.getQuery('type',this)
        },
        mounted(){
            this.configData.pageRender = true
            this.getSupplier()
            stream.fetch({
                method:'GET',
                url:this.getReposApi
            },res =>{
                this.reposList = res.data
            },res =>{
              this.configData.pageRender = false
            })
        },
        methods:{
            viewEvent(name , call){
              this[name](call)
            },
            add(){
              modal.prompt({
                message:'请输入供应商名称',
                okTitle:'确认',
                cancelTitle:'取消'
              },res=>{
                if(res.result == '确认'){
                  this.configData.pageRender = true
                  stream.fetch({
                    method:'GET',
                    url:'/SUPPLIER/addByName?SUPPLIER.SUPPLIER_NAME=' + encodeURI(res.data)
                  },res =>{
                      modal.toast({message:'供应商添加成功'})
                      this.index = 0
                      this.configData.title = this.titleList[0]
                      this.repos = ''
                      this.supplier = ''
                      this.getSupplier()
                  },res=>{
                    this.configData.pageRender = false
                  })
                }
              })
            },
            getSupplier(){
              stream.fetch({
                  method:'GET',
                  url:this.getSupplierApi
              },res =>{
                  this.supplierList = res.data
              },res =>{

              })
            },
            selectSupplier(item){
              this.supplier = item
              if(!this.repos){
                this.index = 1
                this.configData.title = this.titleList[1]
              }else{
                this.jump()
              }
            },
            selectRepos(item){
              this.repos = item
              if(!this.supplier){
                this.index = 0
                this.configData.title = this.titleList[0]
              }else{
                this.jump()
              }
            },
            jump(item){
                storage.setItem('repos_supplier_info',JSON.stringify({repos:this.repos,supplier:this.supplier}),res=>{
                    let url  
                    if(this.type == 'add'){
                      url = '/modules/purchaseSection/add-purchase'
                    }else if(this.type == 'return'){
                      url = '/modules/purchaseSection/return-purchase'
                    }
                    navigator.push({
                        url:url
                    },res=>{
                      this.index = 0
                      this.configData.title = this.titleList[0]
                      this.repos = ''
                      this.supplier = ''
                    })
                })
            }
        },
    };
</script>