import { message } from 'antd'

// 统一处理服务端的返回结果
export const dealResult = resp => {
    if (resp.code == 1) {
        return true
    }
    if (resp.code == '45000') {
        return (window.location.href = '/login')
    }
    return false
}
