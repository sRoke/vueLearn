/*
    体验用户被禁用的APi
*/
let obj = {
    '/buyer/addBuyerForOrderKing' : true,//添加客户
    '/bee/order/new/parent/addByAdmin' : true,// 提交订单
    '/bee/order/new/parent/addByAdmin' : true,// 提交退货单
    '/buyer/modifyByBuyerId' : true,// 修改客户信息
    '/bee/order/new/waithandgoods/bill/allApplyDelivery' : true,//  订单核销
    '/bee/order/new/waithandgoods/bill/allNotApply' : true,//  不予交货
    '/buyer/modifyByBuyerId' : true,// 订单核销
    '/bee/returnOrder/order/checkAndPass' : true,// 退货核销
    '/money/confirm/payMoney' : true,//添加收款单
    '/buyers/tags/group/updateTagGroupAndTagInfo' : true,//  标签管理
    '/buyers/tags/group/delelteTagGroupAndTagInfo' : true,// 删除标签
    '/buyers/tags/group/addBuyersTagsGroupAndTags' : true,//  新增标签
    '/saleman/rule/group/deleteSaleManGroup' : true,// 删除销售区域
    '/saleman/rule/group/addSaleManGroup' : true,// 添加销售团队
    '/saleman/rule/group/updateSaleManGroup' : true,// 销售团队修改
    '/bee/order/new/parent/generalModifyOrder' : true, //修改订单
    '/employee/add': true, //员工新增
    '/employee/modifyById': true //员工修改
}
export default obj