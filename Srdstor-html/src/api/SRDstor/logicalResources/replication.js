import request from '@/utils/request'

export function getReplicationList() {
  return request({
    url: '/SRDStor/logicalresource/replicate/list',
    method: 'get'
  })
}

export function createReplication(params) {
  return request({
    url: '/SRDStor/logicalresource/replicate/copy',
    method: 'post',
    data: params
  })
}

export function updateReplication(params) {
  return request({
    url: '/SRDStor/logicalresource/replicate/editconfig',
    method: 'post',
    data: params
  })
}

export function elevateReplication(params) {
  return request({
    url: '/SRDStor/logicalresource/replicate/elevate',
    method: 'post',
    data: params
  })
}

export function getHostname() {
  return request({
    url: '/SRDStor/logicalresource/replicate/gethost',
    method: 'get'
  })
}
