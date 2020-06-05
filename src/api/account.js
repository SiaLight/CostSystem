import request from '@/utils/request'

export function addAccount(data) {
    return request({
        url: '/account',
        method: 'post',
        data
    })
}
//根据账单状态查找账单
export function findAccountByStatus(status) {
    return request({
        url: '/account/status',
        method: 'get',
        params:{status:status}
    })
}

//审核账单并通过
export function passAccount(id,des) {
    return request({
        url: '/account/pass',
        method: 'post',
        params:{accountId:id,des:des}
    })
}

//审核账单并不通过
export function noPassAccount(id,des) {
    return request({
        url: '/account/noPass',
        method: 'post',
        params:{accountId:id,des:des}
    })
}

//根据登录用户和账单状态查找其提交的账单
export function submitAccount(status) {
    return request({
        url: '/account/submitUser',
        method: 'get',
        params:{status:status}
    })
}

export function printPdf(id) {
    return request({
        url: '/account/pdf',
        method: 'post',
        params:{accountId:id}
    })
}

export function deleteAccount(id) {
    return request({
        url: '/account/'+id,
        method: 'delete',
    })
}


