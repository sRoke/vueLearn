import request from '@/utils/request'

export function createTimeView(params) {
  return request({
    url: '/SRDStor/logicalresource/timeview/create',
    method: 'post',
    data: params
  })
}

export function deleteTimeView(params) {
  return request({
    url: '/SRDStor/logicalresource/timeview/delete',
    method: 'post',
    data: params
  })
}

export function getTimeViews() {
  return request({
    url: '/SRDStor/logicalresource/timeview/list',
    method: 'get'
  })
}

export function getTimeView(params) {
  return request({
    url: '/SRDStor/logicalresource/timeview/fetch',
    method: 'post',
    data: params
  })
}

export function setTimeViewReservation(params) {
  return request({
    url: '/SRDStor/logicalresource/timeview/set/reservation',
    method: 'post',
    data: params
  })
}
