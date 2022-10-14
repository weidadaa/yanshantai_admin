import request from '@/utils/request'

export function GMList(query) { //管理员列表
    return request({
        url: '/Admin/list',
        method: 'get',
        params: query
    })
}

export function addNews(query) { //添加管理员接口
    return request({
        url: '/Admin/manage',
        method: 'post',
        params: { uid: query }
    })
}

export function deleteNews(uid) {  //删除管理员
    return request({
        url: '/Admin',
        method: 'delete',
        params: { uid }
    })
}

