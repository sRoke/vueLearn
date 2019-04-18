import request from '@/utils/request'

export function createSanpshot(params) {
  return request({
    url: '/SRDStor/logicalresource/snapshot/create',
    method: 'post',
    data: params
  })
}

export function deleteSanpshot(params) {
  return request({
    url: '/SRDStor/logicalresource/snapshot/delete',
    method: 'post',
    data: params
  })
}

export function getSanpshot(params) {
  return request({
    url: '/SRDStor/logicalresource/snapshot/fetch',
    method: 'post',
    data: params
  })
}

export function getSanpshots(params) {
  return request({
    url: '/SRDStor/logicalresource/snapshot/list',
    method: 'post',
    data: params
  })
}
