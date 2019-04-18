import request from '@/utils/request'

export function createSanClient(params) {
  return request({
    url: '/srdstor/api/v1/client/create',
    method: 'post',
    data: params
  })
}

export function getSanClients(params) {
  return request({
    url: 'srdstor/api/v1/client/list',
    method: 'get',
    params
  })
}

export function getSanClient(id) {
  return request({
    url: `/srdstor/api/v1/client/${id}`,
    method: 'get'
  })
}

export function updateSanClient(id, params) {
  return request({
    url: `/srdstor/api/v1/client/${id}`,
    method: 'put',
    data: params
  })
}

export function deleteSanClient(id) {
  return request({
    url: `srdstor/api/v1/client/${id}`,
    method: 'delete'
  })
}

export function getiSCSIClientInitiators(params) {
  return request({
    url: '/srdstor/api/v1/initiator/list',
    method: 'get',
    params
  })
}

export function createiSCSIClientInitator(params) {
  return request({
    url: '/srdstor/api/v1/initiator/create',
    method: 'post',
    data: params
  })
}

export function assignVirtualDeviceToClient(params) {
  return request({
    url: '/srdstor/api/v1/iscsi/target/allocation',
    method: 'post',
    data: params
  })
}

export function getDeviceStatus(id) {
  return request({
    url: '/srdstor/api/v1/device/' + id,
    method: 'get',
    params: {}
  })
}

export function unassignVirtualDeviceFromClient(params) {
  return request({
    url: '/srdstor/api/v1/iscsi/target/delete_allocation',
    method: 'delete',
    data: params
  })
}
