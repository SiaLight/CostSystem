import request from '@/utils/request'

// export function login() {
//   return request({
//     url: '/user/myself',
//     method: 'get',
//   })
// }

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/signOut',
    method: 'post'
  })
}

export function createUser(data) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}
export function updateUser(data) {
  return request({
    url: '/user/'+data.id,
    method: 'put',
    data
  })
}

export function deleteUser(data) {
  return request({
    url: '/user/'+data.id,
    method: 'delete',
    data
  })
}


export function allUser(data) {
  return request({
    url: '/user/all',
    method: 'get',
    data
  })
}

export function login(stuId,password) {
  return request({
    url: '/webLogin',
    method: 'post',
    params:{stuId:stuId,password:password}
  })
}