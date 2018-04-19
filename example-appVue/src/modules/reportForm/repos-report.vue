<!-- 

    商品库存统计

 -->
<template>
  <bu-view :config="configData" @event="viewEvent">
        <div class="head">
            <div class="search">
                <div class="row">
                    <image class="icon" :src="icon"></image>   
                    <input class="font input" type="text" placeholder="商品名称/编码" return-key-type="search" v-model="inputValue" @return="search"/>
                </div>
                <!-- <image class="filter" :src="filterIcon"></image>    -->
            </div>
        </div>
        
        <form-nav :list="navList" :theme="configData.theme"></form-nav>
        <report-table :data="tableData" :theme="configData.theme" @jump="jump" :clickable="'true'"></report-table>
  </bu-view>
</template>    
<style scoped>
    .head{
        background-color: #171B22;
        width: 750px;
    }
    .search{
        background-color: #2B2C31;
        width: 690px;
        height: 66px;
        margin-top: 30px;
        margin-left: 30px;
        padding-left: 20px;
        padding-right: 20px;
        border-radius: 10px;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .row{
        flex-direction: row;
        align-items: center;
    }
    .filter{
        width: 25px;
        height: 25px;
    }
    .icon{
        width: 30px;
        height: 31px;
    }
    .font{
        color: #fff;
        font-size: 28px;
    }
    .input{
        width: 500px;
        height: 60px;
        padding-left: 10px;
        padding-right: 10px;
        background-color: rgba(0,0,0,0);
    }
</style> 
<script>
    import buView from '../../components/bu-view.vue'
    import formNav from './components/form-nav.vue'
    import reportTable from './components/report-table.vue'
    import selector from './components/selector.vue'
    import stream from '../../common/stream.js'
    import navigator from '../../common/navigator.js'
    import filters from '../../common/filters.js'
    export default {
        data() {
            return {
                icon:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/baseIcon/search-dark.png',
                filterIcon:'http://jiaorder-img.oss-cn-shanghai.aliyuncs.com/blackIcon/baseIcon/filterIocn.png',
                // 页面配置
                configData:{
                    theme:'dark',
                    title: '库存统计',
                    titleAlgin: 'left',
                    bottom: '0px',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: 'refresh',
                    loadmore: true,
                    loadmoreEvent:'loadmore'
                },
                // 导航栏
                navList: [{
                  title:'总成本',
                  theme:'purple',
                  value:'0',
                  showCoin: true
                },{
                  title:'总货值',
                  theme:'orange',
                  value:'0',
                  showCoin: true
                },{
                  title:'有货品种',
                  theme:'blue',
                  value:'0',
                },{
                  title:'缺货品种',
                  theme:'purple',
                  value:'0',
                }],
                tableData:[{
                  title: '商品名称',
                  value: []
                },{
                  title: '可售数',
                  value: []
                },{
                  title: '成本',
                  value: []
                },{
                  title: '锁定数',
                  value: []
                },{
                  title: '货值',
                  value: []
                }],
                allData:[],
                nowData:[],
                skuIdList:[],
                inputValue:'',
                searchKey:'',
                pageNumber: 1    
            };
        },
        components:{
            buView,
            formNav,
            selector,
            reportTable
        },
        mounted(){
            this.renderData()
        },
        computed:{

        },
        watch:{
            inputValue(){
                if(this.inputValue == ''){
                    this.searchKey = ''
                    this.recoverData()
                    this.getData()
                }
            },
        },
        methods:{
            viewEvent(name , call){
                this[name](call)
            },
            renderData(){
              this.getData()
              this.getReport()
            },
            getData(key){
                if(this.pageNumber == 1){
                    this.configData.pageRender = true
                }
              stream.fetch({
                method:'GET',
                url:'/bee/reposProduct/reposReport' + '?PAGE_SIZE=30&PN=' + this.pageNumber + (this.searchKey !== '' ? ('&SEARCH=' + encodeURI(this.searchKey)) : '')
              },res =>{
                let value = res.data
                let arr1 = [] 
                let arr2 = []
                let arr3 = []
                let arr4 = []
                let arr5 = []
                value.forEach(ele =>{ 
                  arr1.push(ele['PRODUCT_SPU.PRD_NAME'])
                  arr2.push(filters.census(ele['ONE_UNLOCK']))
                  arr3.push(filters.census(ele['ONE_COST']))
                  arr4.push(filters.census(ele['ONE_LOCK']))
                  arr5.push(filters.census(ele['ONE_MONEY']))
                  this.skuIdList = this.skuIdList.concat(ele['PRODUCT_SKU.SKU_ID'])
                })
                this.tableData[0].value = this.tableData[0].value.concat(arr1)
                this.tableData[1].value = this.tableData[1].value.concat(arr2)
                this.tableData[2].value = this.tableData[2].value.concat(arr3)
                this.tableData[3].value = this.tableData[3].value.concat(arr4)
                this.tableData[4].value = this.tableData[4].value.concat(arr5)
              },res=>{
                this.configData.pageRender = false
              })
            },
            getReport(start , end){
              stream.fetch({
                method:'GET',
                url:'/bee/reposProduct/reposRegion'
              },res =>{
                let value = res.data[0]
                this.navList[0].value = filters.census(value.ALL_COST)
                this.navList[1].value = filters.census(value.ALL_MONEY)
                this.navList[2].value = filters.census(value.ALL_YH)
                this.navList[3].value = filters.census(value.ALL_QH)
              },res=>{

              })
            },
            search(){
                if(this.inputValue !== ''){
                    this.recoverData()
                    this.searchKey = this.inputValue
                    this.getData()
                }
            },
            jump(index){
                navigator.push({
                    url:'/modules/reposSection/repos-detail',
                    query:'?id=' + this.skuIdList[index]
                })
            },
            recoverData(){
                this.tableData.forEach(ele =>{
                    ele.value = []
                })
                this.skuIdList = []
                this.pageNumber = 1
            },
            loadmore(){
                this.pageNumber ++ 
                this.getData()
            }
        }
    };
</script>