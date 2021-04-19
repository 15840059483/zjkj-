import request from '@/utils/request'

export function orderInfoPage(query) {
  return request({
    url: `/wechat/order/orderInfoPage?${query}`,
    method: 'get'
  })
}

export function deptPage(query) {
  return request({
    url: `/hospt/deptPage?${query}`,
    method: 'get'
  })
}

export function getDeptInfo(query) {
  return request({
    url: '/hospt/getDeptInfo',
    method: 'post',
    params: query
  })
}

export function deleteDept(query) {
  return request({
    url: `/hospt/deleteDept/${query}`,
    method: 'post'
  })
}

export function createDept(query) {
  return request({
    url: '/hospt/createDept',
    method: 'post',
    params: query,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function updateDept(query) {
  return request({
    url: '/hospt/updateDept',
    method: 'post',
    params: query,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 医生管理
export function getDoctorPage(query) {
  return request({
    url: '/hospt/getDoctorPage',
    method: 'post',
    params: query
  })
}

export function deleteDoctor(query) {
  return request({
    url: `/hospt/delete/${query}`,
    method: 'post'
  })
}

export function deptAll() {
  return request({
    url: '/hospt/deptAll',
    method: 'get'
  })
}

export function createDoctor(query) {
  return request({
    url: '/hospt/create',
    method: 'post',
    params: query
  })
}

export function updateDoctor(query) {
  return request({
    url: '/hospt/update',
    method: 'post',
    query
  })
}

// 公告管理
export function noticeOrderInfoPage(query) {
  return request({
    url: '/notice/orderInfoPage',
    method: 'post',
    params: query
  })
}

export function deleteNotice(query) {
  return request({
    url: `/notice/delete/${query}`,
    method: 'post'
  })
}

export function createNotice(data) {
  return request({
    url: '/notice/create',
    method: 'post',
    data
  })
}

export function updateNotice(data) {
  return request({
    url: '/notice/update',
    method: 'post',
    data
  })
}