import request from '@/utils/request'

export function getCourse() {
  return request({
    url: '/course/all',
    method: 'get',
  })
}
export function editCourse(data) {
  return request({
    url: '/course/'+data.id,
    method: 'put',
    data
  })
}
export function addCourse(data) {
    return request({
      url: '/course/'+data.activity.id,
      method: 'post',
      data
    })
  }

  export function deleteCourse(data) {
    return request({
      url: '/course/'+data.id,
      method: 'delete',
      data
    })
  }