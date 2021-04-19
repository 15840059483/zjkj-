import request from '@/utils/request'

export function home(query) {
  return request({
    url: '/home/page',
    method: 'post',
    query
  })
}
