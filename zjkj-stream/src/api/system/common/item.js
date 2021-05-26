import request from '@/utils/request'

//项目信息
export function getEquipmentInfo(query) {
    return request({
      url: '/equ/getPage',
      method: 'post',
      params: query
    })
  }

  //修改项目信息
  export function updateItemInfo(data) {
    return request({
      url: '/equ/update',
      method: 'post',
      data
    })
  }

  //添加项目信息
  export function createItemInfo(data) {
    return request({
      url: '/equ/create',
      method: 'post',
      data
    })
  }

  //删除项目信息
  export function deleteItemInfo(query) {
    return request({
      url: `/equ/delete/${query}`,
      method: 'post'
    })
  }