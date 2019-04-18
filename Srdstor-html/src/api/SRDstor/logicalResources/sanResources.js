import request from '@/utils/request'

export function createSanResource(params) {
  return request({
    url: '/SRDStor/logicalresource/sanresource/create',
    method: 'post',
    data: params
  })
}

export function deleteSanResource(params) {
  return request({
    url: '/SRDStor/logicalresource/sanresource/delete',
    method: 'post',
    data: params
  })
}

export function getSanResources(params) {
  return request({
    url: '/SRDStor/logicalresource/sanresource/list',
    method: 'get'
  })
}

export function getSanResource(params) {
  return request({
    url: '/SRDStor/logicalresource/sanresource/fetch',
    method: 'post',
    data: params
  })
}

export function editSanResource(params) {
  return request({
    url: '/SRDStor/logicalresource/sanresource/rename',
    method: 'post',
    data: params
  })
}
