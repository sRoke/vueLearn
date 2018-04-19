/*
    显示价格的过滤器 
    如果存在小数 保留两位小数 否则取整 
    并且加上货币符号
*/

function price(val){
    if(!val || Number(val) === NaN) return '¥0'

    return Math.abs(val % 1) < 0.01 ? ('¥' + (val | 0)) : ('¥' + Number(val).toFixed(2))
}
/*
    数字保留两位小数
*/
function number(val){
    if(!val || Number(val) === NaN) return 0

    return Math.abs(val % 1) < 0.01 ? ((val | 0)) : (Number(val).toFixed(2))
}
/*
    统计报表使用 对数字的处理 大于10000的时候 不保留小数位
*/
function census(val){
    if(!val || Number(val) === NaN) return 0

    return Math.abs(val/1) > 10000 ? (val | 0) : (Math.abs(val % 1) < 0.01 ? (val | 0) : Number(val).toFixed(2))
}
/*
    用于显示数量过滤器 防止失去精度
*/
function count(val){
    if(!val || Number(val) === NaN) return 0

    return Math.abs(val % 1) < 0.01 ? (val | 0) : (Number(val) + '')
}
function address(obj){
    let str = ''
    if(obj['USER_ADDR.ADDR_GUO'] === '中国'){
        str = (obj['USER_ADDR.ADDR_SHENG'] ? obj['USER_ADDR.ADDR_SHENG'] : '') + (obj['USER_ADDR.ADDR_SHI'] ? obj['USER_ADDR.ADDR_SHI'] : '') + (obj['USER_ADDR.ADDR_XIAN'] ? obj['USER_ADDR.ADDR_XIAN'] : '') + (obj['USER_ADDR.ADDR_DETAIL'] ? obj['USER_ADDR.ADDR_DETAIL'] : '')
    }else{
        str = obj['USER_ADDR.ADDR_GUO'] + (obj['USER_ADDR.ADDR_DETAIL'] ? obj['USER_ADDR.ADDR_DETAIL'] : '')
    }
    return str
}
/*
    商品的图片过滤器
*/
function imgUrl(val,px){
    return 'http://u.ok.eerrpp.cc/' + val + '?x-oss-process=image/resize,m_mfit,h_'+px+',w_'+px
}
var filter = {
    price : price,
    number : number,
    census : census,
    count : count,
    image : imgUrl,
    address: address
}
export default filter