import request from '@/utils/request'

export function listBase(query) {
    return request({
        url: '/base/download',
        method: 'get',
        params: query
    })
}

export function updateBase(query) {
    return request({
        url: '/base/updatebanben',
        method: 'post',
        data: query
    })
}