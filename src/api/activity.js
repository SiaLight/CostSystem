import request from '@/utils/request'

export function getActivity() {
  return request({
    url: '/activity/all',
    method: 'get',
  })
}
export function editActivity(data) {
  return request({
    url: '/activity/'+data.id,
    method: 'put',
    data
  })
}

export function deleteActivity(data) {
  return request({
    url: '/activity/'+data.id,
    method: 'delete',
    data
  })
}
export function addActivity(data) {
  return request({
    url: '/activity',
    method: 'post',
    data
  })
}

