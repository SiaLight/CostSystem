import request from '@/utils/request'

export function getTeam() {
  return request({
    url: '/team/all',
    method: 'get',
  })
}
export function updateTeam(data) {
      return request({
        url: '/team/'+ data.teamId,
        method: 'put',
        data
      })
    }

    export function createTeam(data) {
      return request({
        url: '/team',
        method: 'post',
        data
      })
    }

    export function deleteTeam(data) {
      return request({
        url: '/team/'+data.teamId,
        method: 'delete',
        data
      })
    }