import request from '@/utils/request'

export function createDevice(data) {
    return request({
      url: '/device',
      method: 'post',
      data
    })
  }

  export function allDevice() {
    return request({
      url: '/device/all',
      method: 'get',
    })
  }

  export function deleteDevice(data) {
    return request({
      url: '/device/'+data.deviceId,
      method: 'delete',
      data
    })
  }

  export function updateDeviceName(name,id) {
    return request({
      url: '/device/'+id,
      method: 'put',
      params:{name:name,deviceId:id}
    })
  }


