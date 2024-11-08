import $ from 'jquery'
import { dealResult } from './dealResult'
// import Headers from './headers';
import { message } from 'antd'

function ajaxRequestJson(methods, url, params) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: methods,
            url: url,
            data: params,
            dataType: 'JSON',
            contentType: 'application/json',
            beforeSend: function (request) {
             try{
               const user = JSON.parse(localStorage.getItem("userInfo"))
               request.setRequestHeader('admin-token', user.nickname);
             } catch (e){
               console.log(e, "token error")
             }
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: resp => {
                let flog = dealResult(resp)
                if (!flog) {
                    message.error(resp.message)
                    return
                }
                resolve(resp)
            },
            error: err => {
                console.log('errcc', err)
                reject(err)
            }
        })
    })
}

function ajaxRequest(methods, url, params) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: methods,
            url: url,
            data: params,
            dataType: 'JSON',
            // contentType:'application/json',
            beforeSend: function(request) {
              try{
                const user = JSON.parse(localStorage.getItem("userInfo"))
                request.setRequestHeader('admin-token', user.nickname);
              } catch (e){
                console.log(e, "token error")
              }
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: resp => {
                let flog = dealResult(resp)
                if (!flog) {
                    message.error(resp.message)
                    return
                }
                resolve(resp)
            },
            error: err => {
                console.log('errcc', err)
                reject(err)
            }
        })
    })
}

function ajaxRequestUpload(methods, url, params) {
    return new Promise((resolve, reject) => {
        console.log('params', params)
        var formData = new FormData()
        let fileType = params.file.type
        let typeStr = fileType.match(/\/([^/]*)$/)[1]
        formData.append('file', params.file)
        // formData.append('type', typeStr)

        $.ajax({
            type: methods,
            url: url,
            processData: false,
            data: formData,
            xhrFields: {
                withCredentials: true
            },
            // dataType: 'json',
            contentType: false,
            success: resp => {
                let flog = dealResult(resp)
                if (!flog) {
                    message.error(resp.message)
                    return
                }
                resolve(resp)
            },
            error: err => {
                console.log('errcc', err)
                reject(err)
            }
        })
    })
}

function ajaxRequestUploadM(methods, url, params) {
    return new Promise((resolve, reject) => {
        console.log('params', params)
        var formData = new FormData()
        formData.append('file', params.file)
        if (params.id) {
            formData.append('id', params.id)
        }

        $.ajax({
            type: methods,
            url: url,
            processData: false,
            data: formData,
            xhrFields: {
                withCredentials: true
            },
            // dataType: 'json',
            contentType: false,
            success: resp => {
                let flog = dealResult(resp)
                if (!flog) {
                    message.error(resp.message)
                    return
                }
                resolve(resp)
            },
            error: err => {
                console.log('errcc', err)
                reject(err)
            }
        })
    })
}

function ajaxRequestFile(methods, url, params) {
    return new Promise((resolve, reject) => {
        // let headers = Headers.getHeaders();
        // let data =
        //     methods === 'POST' || methods === 'PUT' ?
        //     JSON.stringify(params) :
        //     methods === 'GET' || methods === 'DELETE' ?
        //     params :
        //     null
        const token = localStorage.getItem('token') ? localStorage.getItem('token') : ''
        // params = {
        //     ...params,
        //     Authorization: token
        // }
        $.ajax({
            type: methods,
            url: url,
            data: params,
            xhrFields: {
                responseType: 'arraybuffer'
            },
            beforeSend: function(request) {
                request.setRequestHeader('Authorization', token)
            },
            withCredentials: true,
            success: (resp, status, xhr) => {
                console.log('xhr....', xhr)
                console.log('resp', resp)
                let Disposition = xhr.getResponseHeader('Content-Disposition')
                let fileName = Disposition.split("'")[1]
                console.log('fileName', fileName)
                let content = resp
                let blob = new Blob([content], {
                    type: 'application/vnd.ms-excel'
                })
                if ('download' in document.createElement('a')) {
                    // 非IE下载
                    let link = document.createElement('a')
                    link.download = fileName
                    link.style.display = 'none'
                    link.href = URL.createObjectURL(blob)
                    document.body.appendChild(link)
                    link.click()
                    URL.revokeObjectURL(link.href) // 释放URL 对象
                    document.body.removeChild(link)
                } else {
                    // IE10+下载
                    navigator.msSaveBlob(blob)
                }

                // resolve(xhr)
            },
            error: (err, status, xhr) => {
                console.log('err', err)
                console.log('status', status)
                console.log('xhr', xhr)
                reject(err, status, xhr)
            }
        })
    })
}

function ajaxRequestDownload(methods, url, params) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: methods,
            url: url,
            data: params,
            xhrFields: {
                responseType: 'arraybuffer'
            },
            // beforeSend: function(request) {
            //     request.setRequestHeader('Authorization', token)
            // },
            withCredentials: true,
            success: (resp, status, xhr) => {
                let Disposition = xhr.getResponseHeader('Content-Disposition')
                let fileName = Disposition.split("'")[1]
                let content = resp
                let blob = new Blob([content], {
                    type: 'application/vnd.ms-excel'
                })
                if ('download' in document.createElement('a')) {
                    // 非IE下载
                    let link = document.createElement('a')
                    link.download = fileName
                    link.style.display = 'none'
                    link.href = URL.createObjectURL(blob)
                    document.body.appendChild(link)
                    link.click()
                    URL.revokeObjectURL(link.href) // 释放URL 对象
                    document.body.removeChild(link)
                } else {
                    // IE10+下载
                    navigator.msSaveBlob(blob)
                }
            }
        })
    })
}

export default {
    post(url, params) {
        return ajaxRequest('POST', url, params)
    },
    get(url, params) {
        return ajaxRequest('GET', url, params)
    },
    file(url, params) {
        return ajaxRequestFile('GET', url, params)
    },
    upload(url, params) {
        return ajaxRequestUpload('POST', url, params)
    },
    uploadM(url, params) {
        return ajaxRequestUploadM('POST', url, params)
    },
    postJson(url, params) {
        return ajaxRequestJson('POST', url, params)
    },
    getJson(url, params) {
        return ajaxRequestJson('GET', url, params)
    },
    download(url, params) {
        return ajaxRequestDownload('GET', url, params)
    }
}
