export const getYearMonthDay = timeStamp => {
    return (
        (new Date(timeStamp).getDate() < 10 ? '0' + new Date(timeStamp).getDate() : new Date(timeStamp).getDate()) +
        '.' +
        (new Date(timeStamp).getMonth() < 9
            ? '0' + (new Date(timeStamp).getMonth() + 1)
            : new Date(timeStamp).getMonth() + 1) +
        '.' +
        new Date(timeStamp).getFullYear()
    )
}

export const getYearMonthDayNormal = timeStamp => {
    let date = new Date(timeStamp)
    let YY = new Date(timeStamp).getFullYear()
    let MM =
        new Date(timeStamp).getMonth() < 9
            ? '0' + (new Date(timeStamp).getMonth() + 1)
            : new Date(timeStamp).getMonth() + 1
    let DD = new Date(timeStamp).getDate() < 10 ? '0' + new Date(timeStamp).getDate() : new Date(timeStamp).getDate()
    let hh = new Date(timeStamp).getHours() < 10 ? '0' + new Date(timeStamp).getHours() : new Date(timeStamp).getHours()
    let mm =
        new Date(timeStamp).getMinutes() < 10
            ? '0' + new Date(timeStamp).getMinutes()
            : new Date(timeStamp).getMinutes()
    let ss =
        new Date(timeStamp).getSeconds() < 10
            ? '0' + new Date(timeStamp).getSeconds()
            : new Date(timeStamp).getSeconds()
    return `${YY}-${MM}-${DD} ${hh}:${mm}:${ss}`
}

export const getYearMonthDayTime = timeStamp => {
    let date = new Date(timeStamp)
    let YY = new Date(timeStamp).getFullYear()
    let MM =
        new Date(timeStamp).getMonth() < 9
            ? '0' + (new Date(timeStamp).getMonth() + 1)
            : new Date(timeStamp).getMonth() + 1
    let DD = new Date(timeStamp).getDate() < 10 ? '0' + new Date(timeStamp).getDate() : new Date(timeStamp).getDate()
    let hh = new Date(timeStamp).getHours() < 10 ? '0' + new Date(timeStamp).getHours() : new Date(timeStamp).getHours()
    let mm =
        new Date(timeStamp).getMinutes() < 10
            ? '0' + new Date(timeStamp).getMinutes()
            : new Date(timeStamp).getMinutes()
    let ss =
        new Date(timeStamp).getSeconds() < 10
            ? '0' + new Date(timeStamp).getSeconds()
            : new Date(timeStamp).getSeconds()
    return `${DD}.${MM}.${YY} ${hh}:${mm}:${ss}`
}

export const getYearMonthDayTimeNew = time => {
    time = time.replace(' ', 'T')
    let timeStamp = new Date(time)
    let date = new Date(timeStamp)
    let YY = new Date(timeStamp).getFullYear()
    let MM =
        new Date(timeStamp).getMonth() < 9
            ? '0' + (new Date(timeStamp).getMonth() + 1)
            : new Date(timeStamp).getMonth() + 1
    let DD = new Date(timeStamp).getDate() < 10 ? '0' + new Date(timeStamp).getDate() : new Date(timeStamp).getDate()
    let hh = new Date(timeStamp).getHours() < 10 ? '0' + new Date(timeStamp).getHours() : new Date(timeStamp).getHours()
    let mm =
        new Date(timeStamp).getMinutes() < 10
            ? '0' + new Date(timeStamp).getMinutes()
            : new Date(timeStamp).getMinutes()
    let ss =
        new Date(timeStamp).getSeconds() < 10
            ? '0' + new Date(timeStamp).getSeconds()
            : new Date(timeStamp).getSeconds()
    return `${DD}.${MM}.${YY} ${hh}:${mm}:${ss}`
}

export const getLendTime = time => {
    let timeStamp = new Date(time)
    let timeStampNow = new Date()
    let res = Math.floor((timeStampNow - timeStamp) / 3600 / 1000)
    return res == 1 ? res + ' hour' : res + ' hours'
}

export const getLendTimeNew = (time1, time2) => {
    // if(time1) {
    //     time1 = time1.replace(' ','T')
    // }
    // if(time2) {
    //     time2 = time2.replace(' ','T')
    // }
    if (!time1 && !time2) {
        return ''
    }

    let timeStamp = new Date(time1)
    let timeStampNow

    if (!time2) {
        timeStampNow = new Date()
    } else {
        timeStampNow = new Date(time2)
    }
    let res = Math.floor((timeStampNow - timeStamp) / 3600 / 1000)
    return res == 1 ? res + ' hour' : res + ' hours'
}

export const isJSON = str => {
    if (typeof str == 'string') {
        try {
            var obj = JSON.parse(str)
            if (typeof obj == 'object' && obj) {
                return true
            } else {
                return false
            }
        } catch (e) {
            console.log('error：' + str + '!!!' + e)
            return false
        }
    }
}

export const getCleanedParams = params => {
    for (let i in params) {
        if (params[i] === '') {
            params[i] = null
        }
    }
    return params
}
