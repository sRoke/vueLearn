import request from '@/utils/request'

export function createiSCSITarget(params) {
  return request({
    url: '/srdstor/api/v1/iscsi/target',
    method: 'post',
    data: params
  })
}

export function getiSCSITargets() {
  return request({
    url: '/srdstor/api/v1/iscsi/target/list',
    method: 'get'
  })
}

export function getiSCSITarget(id) {
  return request({
    url: `/srdstor/api/v1/iscsi/target/${id}`,
    method: 'get'
  })
}

export function updateiSCSITarget(id, params) {
  return request({
    url: `/srdstor/api/v1/iscsi/target/${id}`,
    method: 'put',
    data: params
  })
}

export function deleteiSCSITarget(id) {
  return request({
    url: `/srdstor/api/v1/iscsi/target/${id}`,
    method: 'delete'
  })
}
