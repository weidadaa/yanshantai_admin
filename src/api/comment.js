import request from '@/utils/request'

export function listComment(query) {
  return request({
    url: '/Comment/list',
    method: 'get',
    params: query
  })
}

export function deleteComment(cid) {
  return request({
    url: '/Comment',
    method: 'delete',
    params: { cid }
  })
}
export function editComment(query) { //编辑
  return request({
    url: '/Comment',
    method: 'put',
    params:query
  })
}

