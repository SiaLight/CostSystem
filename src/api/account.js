import request from '@/utils/request'

export function addAccount(id, price, des, items) {
    return request({
        url: '/account',
        method: 'post',
        params: {
            id: id,
            price: price,
            des: des,
            items: items
        }
    })
}
