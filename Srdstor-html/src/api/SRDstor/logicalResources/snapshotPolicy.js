import request from '@/utils/request'

export function createSnapshotPolicy(params) {
  return request({
    url: '/SRDStor/logicalresource/snapshotstrategy/create',
    method: 'post',
    data: params
  })
}

export function getSnapshotPolicy(params) {
  return request({
    url: '/SRDStor/logicalresource/snapshotstrategy/fetch',
    method: 'post',
    data: params
  })
}

export function deleteSnapshotPolicy(params) {
  return request({
    url: '/SRDStor/logicalresource/snapshotstrategy/delete',
    method: 'post',
    data: params
  })
}
