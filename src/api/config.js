import request from '@/utils/request'

export function listMall() {
  return request({
    url: '/StorePhysical/list',
    method: 'get'
  })
}

export function updateMall(data) {
  return request({
    url: '/config/mall',
    method: 'post',
    data
  })
}

export function listExpress() {
  return request({
    url: '/config/express',
    method: 'get'
  })
}

export function updateExpress(data) {
  return request({
    url: '/config/express',
    method: 'post',
    data
  })
}

export function listJoin(query) {//加盟列表
  return request({
    url: '/OutletsApply/list',
    method: 'get',
    params: query
  })
}

export function updateOrder(data) {
  return request({
    url: '/config/order',
    method: 'post',
    data
  })
}

export function listWx(query) {
  return request({
    url: '/base/download',
    method: 'get',
    params: query
  })
}

export function updateWx(data) {
  return request({
    url: '/base/updatebanben',
    method: 'post',
    params: data
  })
}
