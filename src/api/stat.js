import request from '@/utils/request'

export function listStoreNewsCategory(query) {//分类列表
  return request({
    url: '/StoreNewsCategory/list',
    method: 'get',
    params: query
  })
}

export function StoreNewsCategory(data) { //添加新闻分类
  return request({
    url: '/StoreNewsCategory',
    method: 'post',
   data
  })
}

export function delNewsCategory(newsCategoryId) { //删除新闻分类
  return request({
    url: '/StoreNewsCategory',
    method: 'delete',
    params: { newsCategoryId }
  })
}

export function upDataNewsCategory(data) { //修改新闻分类
  return request({
    url: '/StoreNewsCategory',
    method: 'put',
    data
  })
}
export function listNews(query) {//新闻列表
  return request({
    url: '/StoreNews/list',
    method: 'get',
    params: query
  })
}


export function detailNews(query) {//新闻详情
  return request({
    url: '/StoreNews',
    method: 'get',
    params: query
  })
}


export function upDataNews(data) { //修改新闻
  return request({
    url: '/StoreNews',
    method: 'put',
    data
  })
}

export function delNews(newsId) { //删除新闻
  return request({
    url: '/StoreNews',
    method: 'delete',
    params: { newsId }
  })
}

export function storeNews(data) { //添加新闻分类
    return request({
        url: '/StoreNews',
        method: 'post',
        data
    })
}


export function statGoods(query) { //图表数据
  return request({
    url: '/Order/overview',
    method: 'get',
    params: query
  })
}
