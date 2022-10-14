import request from '@/utils/request'


export function listOrder(query) {
  return request({
    url: '/Order/codpay',
    method: 'get',
    params: query,
  })
}

export function refundOrder(data) {
  return request({
    url: '/order/refund',
    method: 'post',
    data
  })
}

export function payOrder(data) {
  return request({
    url: '/order/pay',
    method: 'post',
    data
  })
}

export function deleteOrder(data) {
  return request({
    url: '/order/delete',
    method: 'post',
    data
  })
}

export function replyComment(data) {
  return request({
    url: '/order/reply',
    method: 'post',
    data
  })
}

export function listChannel(id) {
  return request({
    url: '/order/channel',
    method: 'get'
  })
}
