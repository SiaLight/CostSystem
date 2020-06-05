import request from '@/utils/request'


export function logout() {
  return request({
    url: '/user/logout',
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
    url: '/user/update',
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
    url: '/user/login',
    method: 'post',
    params:{username:stuId,password:password}
  })
}

export function removeRole(userId,roleId) {
  return request({
    url: '/user/role/remove',
    method: 'get',
    params:{userId:userId,roleId:roleId}
  })
}
export function addRole(userId,roleId) {
  return request({
    url: '/user/role/add',
    method: 'get',
    params:{userId:userId,roleId:roleId}
  })
}

export function userInfo(userId){
  return request({
    url: '/user/'+userId,
    method: 'get',
  })
}

export function updateName(userId,name) {
  return request({
    url: '/user/name',
    method: 'post',
    params:{userId:userId,name:name}
  })
}

export function updatePhone(userId,phone) {
  return request({
    url: '/user/phone',
    method: 'post',
    params:{userId:userId,phone:phone}
  })
}

export function updatePassword(userId,password) {
  return request({
    url: '/user/password',
    method: 'post',
    params:{userId:userId,password:password}
  })
}

export function updateLock(userId) {
  return request({
    url: '/user/lock',
    method: 'post',
    params:{userId:userId}
  })
}



