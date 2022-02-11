import request from '@/utils/request'

// 删除
export function delData(id) {
  return request({
    url: '/system/operation/'+id,
    method: 'delete'
  })
}

// 新增
export function addData(data) {
  return request({
    url: '/system/operation',
    method: 'post',
    data: data
  })
}

// 查看
export function getData(query) {
  return request({
    url: '/system/operation/list',
    method: 'get',
    params: query
  })
}

// 更新
export function updateData(data) {
  return request({
    url: '/system/operation',
    method: 'put',
    data: data
  })
}

// 导出
export function exportXlsx() {
  return request({
    url: '/system/operation/export',
    method: 'get',
  })
}
//导入
export function importXlsx(data) {
  return request({
    url: '/system/operation/importData',
    method: 'post',
    data: data
  })
}