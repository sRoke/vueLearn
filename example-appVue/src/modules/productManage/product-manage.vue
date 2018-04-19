<template>
    <bu-view :config="configData" @event="viewEvent">
        <div class="view">
            <prd-img ref="image" :count="imageCount"></prd-img>
            <div class="header">
                <text class="label">*</text>  
                <input type="text" class="input" placeholder="输入商品名称" v-model="product.name"></input>   
            </div>
            
            <div class="form">
                <buSelect title="分类" label="true" :value="product.class.name" @clickEvent="selectClass"></buSelect>
                <buSelect title="单位" label="true" :value="unitMsg" @clickEvent="selectUnit"></buSelect>
                <buSelect v-if="isMuchUnit" title="价格" label="true" :value="priceMsg" @clickEvent="setPrice"></buSelect>
                <buInput v-if="!isMuchUnit" type="number" title="价格(￥)" label="true" placeholder="输入价格" v-model="product.price.small"></buInput>
            </div>
            <div class="form">
                <buSelect title="价格政策" label="false" @clickEvent="setSpecPrice"></buSelect>
                <pricePlan :list="levelList" :type="isMuchUnit" :setted="product.pricePlan" :price="product.price" :unit="scopedUnit" v-if="isShowPlan"></pricePlan>
                <buInput v-if="!isMuchUnit" title="成本" label="false" type="number" placeholder="输入成本" v-model="product.costPrice.small"></buInput>
                <buSelect v-if="isMuchUnit" title="成本" label="false" :value="costMsg" @clickEvent="setCost"></buSelect>
                <buInput v-if="!isMuchUnit" title="库存" label="false" type="number" placeholder="输入库存" v-model="product.count.small"></buInput>
                <buSelect v-if="isMuchUnit" title="库存" label="false" :value="countMsg" @clickEvent="setCount"></buSelect>
            </div>
            <div class="form">
                <buBigSelect v-if="isMuchUnit" title="条码" label="false" :value="barCodeMsg" @clickEvent="setBarCode"></buBigSelect>
                <scanInput v-if="!isMuchUnit" title="条码" label="false" :value="product.barCode.small" @clickEvent="barCodeScanOn('small')"></scanInput>
                <buInput v-if="!isMuchUnit" title="编码" label="false" type="text" placeholder="输入编码" v-model="product.code.small"></buInput>
                <buBigSelect v-if="isMuchUnit" title="编码" label="false" :value="codeMsg" @clickEvent="setCode"></buBigSelect>
            </div>
            <div class="form">
                <buSelect title="品牌" label="false" :value="product.brand.name" @clickEvent="selectBrand"></buSelect>
                <buInput title="规格" label="false" type="number" placeholder="输入规格" v-model="product.spec"></buInput>
            </div>
        </div>
        <ButtonItem slot="footer">
            <Button type="primary" @clickEvent="save">保存</Button>
        </ButtonItem>
        <classManage 
            v-if="showClass" 
            slot="footer" 
            :data="classList" 
            v-model="product.class" 
            @close="classOff" 
            @refreshClass="refreshClass"
            @modifyClass="modifyClass"
            @delClass="delClass">
        </classManage>
        <unitManage
            v-if="showUnit" 
            slot="footer"
            :data="unitList"
            :type="isMuchUnit"
            v-model="product.unit"
            :defaultunit="defaultUnit"
            @newUnit="newUnit"
            @changeUnit="changeUnit"
            @delUnit="delUnit"
            @close="unitOff" >
            
        </unitManage>
        <brandManage
            v-if="showBrand" 
            slot="footer"
            :data="brandList"
            v-model="product.brand"
            @newBrand="newBrand"
            @delBrand="delBrand"
            @close="brandOff" >  
        </brandManage>
        <price-manage
            v-if="showPrice"
            slot="footer"
            :unit="product.unit"
            :price="product.price"
            @submit="changePrice"
            @close="priceOff">
        </price-manage>
        <costprice-manage
            v-if="showCost"
            slot="footer"
            :unit="product.unit"
            :price="product.costPrice"
            @submit="changeCostPrice"
            @close="costPriceOff">
        </costprice-manage>
        <count-manage
            v-if="showCount"
            slot="footer"
            :unit="product.unit"
            :count="product.count"
            @submit="changeCount"
            @close="countOff">
        </count-manage>
        <code-manage
            v-if="showCode"
            slot="footer"
            :unit="product.unit"
            :code="product.code"
            @submit="changeCode"
            @close="codeOff">
        </code-manage>
        <barcode-manage
            v-if="showBarCode"
            slot="footer"
            :unit="product.unit"
            :code="product.barCode"
            @scanOn="barCodeScanOn"
            @submit="barCodeOff"
            @close="barCodeOff">
        </barcode-manage>
        <priceplan-manage
            slot="footer"
            v-if="showPricePlan"
            :list="levelList" 
            :type="isMuchUnit" 
            :price="product.price" 
            :unit="product.unit" 
            :setted="product.pricePlan"
            ref="pricePlan"
            @close="priceplanOff"
            @submit="changePricePlan">
        </priceplan-manage>
    </bu-view>       
</template>     
<style scoped>
    .view{
        background-color: #fff;
        padding-bottom: 50px;
    }
    .form{
        padding-top: 20px;
        background-color: #EEEEEE;
    }
    .label{
        position: absolute;
        top: 25px;
        left: 14px;
        font-size: 24px;
        color: #E32E1B;
    }
    .header{
        width: 750px;
        margin-top: 20px;
        align-items: center;
    }
    .input{
        font-size: 38px;
        color: #333;
        width: 690px;
        padding-top: 20px;
        padding-bottom: 20px;
    }
</style>
<script>
    import buView from '../../components/bu-view.vue'
    import prdImg from './components/product-img.vue'
    import navigator from '../../common/navigator.js'
    import stream from '../../common/stream.js'
    import buInput from './basicComponents/Input.vue'
    import scanInput from './basicComponents/ScanInput.vue'
    import buSelect from './basicComponents/Select.vue'
    import buBigSelect from './basicComponents/BigSelect.vue'
    import buSwitch from './basicComponents/Switch.vue'
    import SelectRadio from './basicComponents/SelectRadio.vue'
    import classManage from './components/class-manage.vue'
    import priceManage from './components/price-manage.vue'
    import unitManage from './components/unit-manage.vue'
    import costpriceManage from './components/costprice-manage.vue'
    import barcodeManage from './components/barcode-manage.vue'
    import brandManage from './components/brand-manage.vue'
    import countManage from './components/count-manage.vue'
    import codeManage from './components/code-manage.vue'
    import pricePlan from './components/pricePlan.vue'
    import priceplanManage from './components/priceplan-manage.vue'
    import components from '../../basicComponents'
    const storage = weex.requireModule('storage')
    const modal = weex.requireModule('modal')
    const globalEvent = weex.requireModule('globalEvent')
    import formVali from '../../common/formValidation.js'
    export default {
        data() {
            return {
                configData:{
                    title: '新增商品',
                    titleAlgin: 'left',
                    btnText:'扫码识别',
                    headerBtnType:'default',
                    secondTitle:'',
                    bottom: '140px',
                    addEvent: 'selectAll',
                    pageRender: false,
                    refresh:false,
                    refreshEvent: 'refresh',
                    loadmore: false,
                    loadmoreEvent:'',
                    viewappear:'getImgData'
                },
                imageCount: 1,
                product: {
                    name: '',
                    class: {
                        name: '',
                        id: ''
                    },
                    unit: [{name: '', id: '' , range: '', type: 'small'},{name: '', id: '' , range: '', type: 'middle'},{name: '', id: '' , range: '', type: 'large'}],
                    price: {
                        small: '',
                        middle: '',
                        large: ''
                    },
                    pricePlan: {},
                    costPrice: {
                        small: '',
                        middle: '',
                        large: ''
                    },
                    count: {
                        small: '',
                        middle: '',
                        large: ''
                    },
                    code: {
                        small: '',
                        middle: '',
                        large: ''
                    },
                    barCode: {
                        small: '',
                        middle: '',
                        large: ''
                    },
                    brand: {
                        name: '',
                        id: ''
                    },
                    spec: ''
                },
                classList:[],
                showClass: false,
                unitList: [],
                isMuchUnit: false,
                showUnit: false,
                defaultUnit: {},
                showPrice: false,
                showCost: false,
                showCount: false,
                showBrand: false,
                brandList: [],
                showBarCode: false,
                scanType: {},
                showCode: false,
                levelList: [],
                showPricePlan: false
            };
        },
        components:{
            buView,
            prdImg,
            buInput,
            buSelect,
            ButtonItem: components.ButtonItem,
            Button: components.Button,
            classManage,
            unitManage,
            priceManage,
            costpriceManage,
            countManage,
            brandManage,
            scanInput,
            buBigSelect,
            barcodeManage,
            pricePlan,
            codeManage,
            priceplanManage,
        },
        created(){
            globalEvent.addEventListener("globalScan", val => {
                this.product[this.scanType.key][this.scanType.type] = val.scanInfo
            })
        },
        mounted(){
            this.getClassData()
            this.getUnitData()
            this.getBrandData()
            this.getLevelData()
        },  
        methods:{
            selectClass(){
                this.showClass = true
            },
            classOff(){
                this.showClass = false
            },
            unitOff() {
                this.showUnit = false
            },
            viewEvent(name,call){
                this[name](call)
            },
            click(res) {
                console.log(res)
            },
            getImgData() {
                this.$refs.image && this.$refs.image.getImgUrl()
            },
            save(){
                for(let i in this.product) {
                    if(typeof this.product[i] === 'object') {
                        console.log(formVali.islegal(JSON.stringify(this.product[i])))
                    }else {
                        console.log(formVali.islegal(this.product[i]))
                    }
                }
                
            },
            getClassData() {
                stream.fetch({
                    url: '/bee/prdclass/queryByLayer',
                }, res => {
                    let arr = res.data
                    function filter (arr){
                        return arr.map(res => {
                            return {
                                id: res['PRODUCT_CLASS.PRODUCT_CLASS_ID'],
                                name: res['PRODUCT_CLASS.CLASS_NAME'],
                                deploy: false,
                                list: res.childList && res.childList.length > 0 ? filter(res.childList) : []
                            }
                        })
                    }
                    this.classList = filter(arr)
                }, res => {

                })
            },
            setPrice(){
                this.showPrice = true
            },
            getUnitData() {
                stream.fetch({
                    url: '/bee/unit/query?PRODUCT_UNIT.IS_DEL=-1',
                }, res => {
                    let arr = res.data
                    function filter (arr){
                        return arr.map(res => {
                            return {
                                id: res['PRODUCT_UNIT.PRODUCT_UNIT_ID'],
                                name: res['PRODUCT_UNIT.UNIT']
                            }
                        })
                    }
                    this.unitList = filter(arr)
                }, res => {

                })
            },
            changeUnit(res,defaultunit){
                if(res) {
                    this.defaultUnit = defaultunit
                    this.product.unit = res
                    this.isMuchUnit= true
                }else{
                    this.isMuchUnit= false
                }
                
            },
            delUnit(item , call){
                this.configData.pageRender = true
                stream.fetch({
                    method: 'POST',
                    url: '/bee/unit/delByIds',
                    body: {
                        'PRODUCT_UNIT.PRODUCT_UNIT_ID': item.id
                    }
                }, res => {
                    this.getUnitData()
                    call()
                },res => {
                    this.configData.pageRender = false
                })
            },
            /*
                新增分类之后 更新分类信息
            */
            refreshClass(name , id) {
                this.configData.pageRender = true
                stream.fetch({
                    method:'POST',
                    url:'/bee/prdclass/add',
                    body: {
                        'PRODUCT_CLASS.CLASS_NAME': name,
                        'PRODUCT_CLASS.PARENT_CLASS_ID': id
                    }
                },res => {
                    this.product.class = {
                        name: name,
                        id: res.extraData.ID
                    }
                    this.getClassData()
                    modal.toast({message:'新赠成功并选中',duration: 2})
                },res => {
                    this.configData.pageRender = false
                })
            },
            /*
                修改分类名称
            */
            modifyClass(item) {
                this.configData.pageRender = true
                stream.fetch({
                    method: 'POST',
                    url: '/bee/prdclass/modifyByIds',
                    body: {
                        'PRODUCT_CLASS.CLASS_NAME': item.name,
                        'PRODUCT_CLASS.PRODUCT_CLASS_ID': item.id,
                        'PRODUCT_CLASS.PARENT_CLASS_ID': item.parent
                    }
                }, res => {
                    this.product.class = {
                        name: item.name,
                        id: item.id
                    }
                    this.getClassData()
                    modal.toast({message:'修改成功并选中',duration: 2})
                },res => {
                    this.configData.pageRender = false
                })
            },
            // 删除分类
            delClass(item , call) {
                this.configData.pageRender = true
                stream.fetch({
                    method: 'POST',
                    url: '/bee/prdclass/delByIds',
                    body: {
                        'PRODUCT_CLASS.PRODUCT_CLASS_ID': item.id
                    }
                }, res => {
                    this.getClassData()
                    call()
                },res => {
                    this.configData.pageRender = false
                })
            },
            selectUnit() {
                this.showUnit = true
            },
            newUnit(res,call) {
                this.configData.pageRender = true
                stream.fetch({
                    method: 'POST',
                    url: '/bee/unit/add',
                    body: {
                        'PRODUCT_UNIT.UNIT': res
                    }
                },res=>{
                    call(res.extraData.ID)
                    modal.toast({message:'新增成功并选中',duration: 2})
                    this.getUnitData()
                },res=>{
                    this.configData.pageRender = false
                })
            },
            changePrice(res) {
                this.product.price = res
            },
            priceOff(){
                this.showPrice = false
            },
            setCost(){
                this.showCost = true
            },
            changeCostPrice(res) {
                this.product.costPrice = res
            },
            costPriceOff(){
                this.showCost = false
            },
            setCount(){
                this.showCount = true
            },
            changeCount(res) {
                this.product.count = res
            },
            countOff(){
                this.showCount = false
            },
            selectBrand() {
                this.showBrand = true
            },
            getBrandData() {
                stream.fetch({
                    url: '/bee/brand/query?PRODUCT_BRAND.IS_DEL=-1',
                }, res => {
                    let arr = res.data
                    function filter (arr){
                        return arr.map(res => {
                            return {
                                id: res['PRODUCT_BRAND.PRODUCT_BRAND_ID'],
                                name: res['PRODUCT_BRAND.BRAND_NAME']
                            }
                        })
                    }
                    this.brandList = filter(arr)
                }, res => {

                })
            },
            brandOff(){
                this.showBrand = false
            },
            delBrand(item , call) {
                this.configData.pageRender = true
                stream.fetch({
                    method: 'POST',
                    url: '/bee/brand/delByIds',
                    body: {
                        'PRODUCT_BRAND.PRODUCT_BRAND_ID': item.id
                    }
                }, res => {
                    this.getBrandData()
                    call()
                },res => {
                    this.configData.pageRender = false
                })
            },
            newBrand(res,call) {
                this.configData.pageRender = true
                stream.fetch({
                    method: 'POST',
                    url: '/bee/brand/add',
                    body: {
                        'PRODUCT_BRAND.BRAND_NAME': res
                    }
                },res=>{
                    call(res.extraData.ID)
                    modal.toast({message:'新增成功并选中',duration: 2})
                    this.getBrandData()
                },res=>{
                    this.configData.pageRender = false
                })
            },
            setBarCode() {
                this.showBarCode = true
            },
            barCodeOff() {
                this.showBarCode = false
            },
            barCodeScanOn(type) {
                this.scanType = {
                    key: 'barCode',
                    type: type
                }
            },
            setCode() {
                this.showCode = true
            },
            codeOff() {
                this.showCode = false
            },
            changeCode(res) {
                this.product.code = res
            },
            // 获取客户等级
            getLevelData(){
                stream.fetch({
                    method: 'GET',
                    url: '/buyerlevel/queryAll'
                }, res => {
                    this.levelList = res.data
                }) 
            },
            // 价格政策
            setSpecPrice() {
                if(this.isShowPlan) {
                    this.showPricePlan = true
                }else {
                    modal.toast({message: '请先设置单位和价格', duration: 2})
                }
            },
            priceplanOff() {
                this.showPricePlan = false
            },
            changePricePlan(res){
                this.product.pricePlan = res
            }
        },
        computed: {
            unitMsg () {
                let strArr = []
                let arr = this.product.unit
                if (!this.isMuchUnit) {
                    return arr[0].name
                }else {
                    let scopeArr = []
                    arr.forEach(ele => {
                        if(ele.id) {
                            scopeArr.push(ele)
                        }
                    })
                    for(let i = scopeArr.length - 1 ; i >= 0 ; i --) {
                        strArr.push((scopeArr[scopeArr.length -1].range/scopeArr[i].range) + scopeArr[i].name) 
                    }

                }
                return strArr.join(' = ')
            },
            priceMsg () {
                let str = []
                let arr = this.product.unit
                let price = this.product.price
                for(let i = arr.length - 1 ; i >= 0 ; i --) {
                    if(arr[i].id && price[arr[i].type]) {
                        str.push('￥' + price[arr[i].type] + arr[i].name)
                    }
                }
                return str.join(' / ')
            },
            costMsg () {
                let str = []
                let arr = this.product.unit
                let price = this.product.costPrice
                for(let i = arr.length - 1 ; i >= 0 ; i --) {
                    if(arr[i].id && price[arr[i].type]) {
                        str.push('￥' + price[arr[i].type] + arr[i].name)
                    }
                }
                return str.join(' / ')
            },
            countMsg() {
                let str = []
                let arr = this.product.unit
                let count = this.product.count
                for(let i = arr.length - 1 ; i >= 0 ; i --) {
                    if(arr[i].id && count[arr[i].type]) {
                        str.push(count[arr[i].type] + arr[i].name)
                    }
                }
                return str.join(' / ')
            },
            barCodeMsg() {
                let str = []
                let code = this.product.barCode
                for(let i in code) {
                    if(code[i]) {
                        str.push(code[i])
                    }
                }
                return str
            },
            codeMsg() {
                let str = []
                let code = this.product.code
                for(let i in code) {
                    if(code[i]) {
                        str.push(code[i])
                    }
                }
                return str
            },
            scopedUnit() {
                let arr = []
                if(!this.isMuchUnit && this.product.unit[0].id) {
                    arr.push(this.product.unit[0])
                }else {
                    this.product.unit.forEach(ele => {
                        if(ele.id) {
                            arr.push(ele)
                        }
                    })
                }
                return arr
            },
            isShowPlan() {
                if(this.scopedUnit.length === 0) {
                    return false
                }else {
                    let res = true
                    this.scopedUnit.forEach(ele => {
                        if(this.product.price[ele.type] === '') {
                            res = false
                        }
                    })
                    return res
                }
            }
        }
    };
</script>