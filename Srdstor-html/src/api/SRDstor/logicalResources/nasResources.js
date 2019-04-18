import request from '@/utils/request'

export function createNasResource(params) {
  return request({
    url: '/SRDStor/logicalresource/nasresource/create',
    method: 'post',
    data: {
      params
    }
  })
}

export function deleteNasResource(params) {
  return request({
    url: '/SRDStor/logicalresource/nasresource/delete',
    method: 'post',
    data: {
      params
    }
  })
}

export function getNasResources(params) {
  return request({
    url: '/SRDStor/logicalresource/nasresource/list',
    method: 'get'
  })
}

export function getNasResource(params) {
  return request({
    url: '/SRDStor/logicalresource/nasresource/fetch',
    method: 'post',
    data: {
      params
    }
  })
}
