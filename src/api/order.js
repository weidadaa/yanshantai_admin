import request from '@/utils/request'


export function listOrder(query) {
  return request({
    url: '/Order/list',
    method: 'get',
    params: query
  })
}
export function orderDetails(orderId) {
  return request({
    url: '/Order',
    method: 'get',
    params: {orderId}
  })
}

export function editDak(query) { //编辑订单备注
  return request({
    url: '/Order/update/bak',
    method: 'put',
    params: query
  })
}

export function editStar(query) { //编辑订单加星
  return request({
    url: '/Order/update/star',
    method: 'put',
    params: query
  })
}

