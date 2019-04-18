import request from '@/utils/request'

export function getPerformance(params) {
  return request({
    url: '/os/performance/all',
    method: 'get',
    params
  })
}

export function changePassword(params) {
  return request({
    url: '/os/auth/chpasswd',
    method: 'post',
    data: params
  })
}

export function setIp(params) {
  return request({
    url: '/os/ip/setip',
    method: 'post',
    data: params
  })
}

export function getInterfaces(params) {
  return request({
    url: '/os/ip/getifaces',
    method: 'post',
    data: params
  })
}

export function getIPs() {
  return request({
    url: '/srdstor/api/v1/device/ips',
    method: 'get'
  })
}

export function restart(params) {
  return request({
    url: '/os/init/shdreb',
    method: 'post',
    data: params
  })
}

export function shutdown(params) {
  return request({
    url: '/os/init/shdreb',
    method: 'post',
    data: params
  })
}

export function setEmailNotification(params) {
  return request({
    url: '/SRDStor/alert/email/setup',
    method: 'post',
    data: params
  })
}

export function getEmailConfig() {
  return request({
    url: '/SRDStor/alert/email/getconf',
    method: 'get'
  })
}
