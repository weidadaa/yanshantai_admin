import request from '@/utils/request'

export function listStorage(query) {
  return request({
    url: '/storage/list',
    method: 'get',
    params: query
  })
}

export function createStorage(data) {
  return request({
    url: '/storage/create',
    method: 'post',
    data
  })
}

export function readStorage(data) {
  return request({
    url: '/storage/read',
    method: 'get',
    data
  })
}

export function updateStorage(data) {
  return request({
    url: '/storage/update',
    method: 'post',
    data
  })
}

export function deleteStorage(data) {
  return request({
    url: '/storage/delete',
    method: 'post',
    data
  })
}


// const uploadPath = process.env.VUE_APP_BASE_API + '/storage/create'

// const uploadPath = 'http://yipinhui-admin-java.qianji.org.cn/admin/storage/create'; // 上线
const uploadPath = 'http://10.1.2.244:10111/yantaishan/file/upload'; // 上线

// const uploadPath = 'http://10.1.2.244:10111/admin/storage/create'; // 后端
const  getImg = 'http://10.1.2.244:10111/yantaishan/file/reload/';

// 因为原代码图片上传赋值参数没有弄明白，所以在这里写了个死数据

export { uploadPath ,getImg}
