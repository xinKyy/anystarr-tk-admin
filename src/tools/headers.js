import md5 from 'js-md5'
import { sha256, sha224 } from 'js-sha256'

/* 生成uuid */
const guid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0
        const v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}

const getHeaders = () => {
    let headers = {}
    // const token = sessionStorage.getItem('token');
    // const noncestr = Math.random().toString(36).substr(2).substring(0, 8);
    // const sign = md5(noncestr + token + noncestr);
    // headers['tk-data'] = JSON.stringify({
    //     noncestr,
    //     sign,
    //     token
    // });
    // headers['traceId'] = guid();

    const Authorization = localStorage.getItem('x-tk') ? localStorage.getItem('x-tk') : ''
    console.log('Authorization', Authorization)
    const userId = localStorage.getItem('x-ud') ? localStorage.getItem('x-ud') : ''
    let timestamp = new Date().getTime()
    let strAuth = Authorization + timestamp + ''
    console.log('strAuth', strAuth)
    let strAuthA = md5(strAuth)
    let strAuthB = sha256.hmac('Dj4UcRNr2q0GztZiVxSRqjYnRIne06gR', strAuthA)
    let strAuthC = md5(strAuthB)
    headers['Authorization'] = Authorization
    headers['x-ca-sign'] = strAuthC
    headers['x-ca-user-id'] = userId
    headers['Content-Type'] = 'application/json'
    headers['x-ca-timestamp'] = timestamp
    return headers
}

export default {
    getHeaders
}
