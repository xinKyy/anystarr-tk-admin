module.exports = {
    //获取的列表加key
    getKeyList: function(list) {
        return list.map((item, index) => {
            let ramStr = randomString()
            item.key = index
            return item
        })
    }
}

function randomString(len) {
    len = len || 32
    let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
    let maxPos = $chars.length
    let pwd = ''
    for (let i = 0; i < len; i++) {
        pwd = $chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return pwd
}
