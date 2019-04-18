import request from '@/utils/request'

// 获取客户端管理磁盘列表
export function addAppSafe(params, ip) {
  return request({
    url: '/appSafe/server/add?ip=' + ip,
    method: 'post',
    data: params
  })
}

// 删除客户端管理
export function deleteClient(params, ip) {
  return request({
    url: '/appSafe/server/delete?ip=' + ip,
    method: 'post',
    data: params
  })
}

// 客户端详情
export function detailClient(params, ip) {
  return request({
    url: '/appSafe/server/fetch?ip=' + ip,
    method: 'post',
    data: params
  })
}

// 获取机械码
export function getMcode(params, ip) {
  return request({
    url: '/appSafe/license/mcode?ip=' + ip,
    method: 'post',
    data: params
  })
}

// 添加许可
export function addLicense(params, ip) {
  return request({
    url: '/appSafe/license/register?ip=' + ip,
    method: 'post',
    data: params
  })
}

// 替换许可
export function replaceLicense(params, ip) {
  return request({
    url: '/appSafe/license/replace?ip=' + ip,
    method: 'post',
    data: params
  })
}

// 查看警告
export function getWarnings(params, ip) {
  return request({
    url: '/appSafe/alarm/fetch?ip=' + ip,
    method: 'post',
    data: params
  })
}

// 获取许可信息
export function getLicenseInfo(params, ip) {
  return request({
    url: '/appSafe/license/view?ip=' + ip,
    method: 'post',
    data: params
  })
}

// 删除许可
export function delLicense(params, ip) {
  return request({
    url: '/appSafe/license/delete?ip=' + ip,
    method: 'post',
    data: params
  })
}

// 远端保护
export function remoteProtect(params, ip) {
  return request({
    url: '/appSafe/disk/remoteProtect?ip=' + ip,
    method: 'post',
    data: params
  })
}

// 本地保护
export function protect(params, ip) {
  return request({
    url: '/appSafe/disk/protect?ip=' + ip,
    method: 'post',
    data: params
  })
}

// 卸载保护
export function unProtect(params, ip) {
  return request({
    url: '/appSafe/disk/unprotect?ip=' + ip,
    method: 'post',
    data: params
  })
}

// 获取系统盘
export function getSysDisk(ip) {
  return request({
    url: '/appSafe/disk/getSysDisk?ip=' + ip,
    method: 'get'
  })
}

// 获取客户端管理磁盘列表
export function getDisks(params, ip) {
  return request({
    url: '/appSafe/disk/list?ip=' + ip,
    method: 'post',
    data: params
  })
}
// 查询被保护盘的状态信息
export function getStat(params, ip) {
  return request({
    url: '/appSafe/disk/stat?ip=' + ip,
    method: 'post',
    data: params
  })
}
// 同步磁盘
export function setSync(params, ip) {
  return request({
    url: '/appSafe/disk/sync?ip=' + ip,
    method: 'post',
    data: params
  })
}
// 取消同步磁盘
export function stopSync(params, ip) {
  return request({
    url: '/appSafe/disk/stopsync?ip=' + ip,
    method: 'post',
    data: params
  })
}
// 暂停磁盘保护
export function suspend(params, ip) {
  return request({
    url: '/appSafe/disk/suspend?ip=' + ip,
    method: 'post',
    data: params
  })
}
// 恢复磁盘保护
export function resume(params, ip) {
  return request({
    url: '/appSafe/disk/resume?ip=' + ip,
    method: 'post',
    data: params
  })
}
// 分析磁盘数据
export function analyze(params, ip) {
  return request({
    url: '/appSafe/disk/analyze?ip=' + ip,
    method: 'post',
    data: params
  })
}
// 卸载数据检验分析
export function unanalyze(params, ip) {
  return request({
    url: '/appSafe/disk/unanalyze?ip=' + ip,
    method: 'post',
    data: params
  })
}
// 设置同步速度
export function setSpeed(params, ip) {
  return request({
    url: '/appSafe/disk/speed?ip=' + ip,
    method: 'post',
    data: params
  })
}
