import request from '@/utils/request'

export function createScript(params) {
  return request({
    url: '/autorecover/script/create',
    method: 'post',
    data: params
  })
}

export function updateScript(id, params) {
  return request({
    url: `/autorecover/script/update/${id}`,
    method: 'put',
    data: params
  })
}

export function deleteScript(id) {
  return request({
    url: `/autorecover/script/delete/${id}`,
    method: 'delete'
  })
}

export function getScripts() {
  return request({
    url: '/autorecover/script/list',
    method: 'get'
  })
}

export function getScript(id) {
  return request({
    url: `/autorecover/script/single/${id}`,
    method: 'get'
  })
}

export function startTask(params) {
  return request({
    url: '/autorecover/task/start',
    method: 'post',
    data: params
  })
}

export function stopTask(id) {
  return request({
    url: `/autorecover/task/stop/${id}`,
    method: 'put'
  })
}

export function bootVM(id) {
  return request({
    url: `/autorecover/vm/start/${id}`,
    method: 'put'
  })
}

export function shutDownVM(id) {
  return request({
    url: `/autorecover/vm/shutdown/${id}`,
    method: 'put'
  })
}

export function forcedShutDownVM(id) {
  return request({
    url: `/autorecover/vm/forceshutdown/${id}`,
    method: 'put'
  })
}

export function rebootVM(id) {
  return request({
    url: `/autorecover/vm/reboot/${id}`,
    method: 'put'
  })
}

export function suspendVM(id) {
  return request({
    url: `/autorecover/vm/suspend/${id}`,
    method: 'put'
  })
}

export function resumeVM(id) {
  return request({
    url: `/autorecover/vm/resume/${id}`,
    method: 'put'
  })
}

export function queryVMStatus(id) {
  return request({
    url: `/autorecover/vm/status/${id}`,
    method: 'get'
  })
}

export function queryTimeViewUsedStatus(id) {
  return request({
    url: `/autorecover/task/timeview/status/${id}`,
    method: 'get'
  })
}

export function queryStatusOfClientUsedByAutoRecover(id) {
  return request({
    url: `/autorecover/script/client/${id}`,
    method: 'get'
  })
}

