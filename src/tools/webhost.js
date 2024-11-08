var webhost = 'http://admin.clubchopp.com'

// if (process.env.NODE_ENV === 'production') {
//     host = 'https://www.anystarr.com/any-starr'
// }

// if (window.location.href.indexOf('pt5658') === -1) {
//     host = 'http://any.clubchopp.com'
// }

if (window.location.href.indexOf('local') !== -1) {
    webhost = 'http://local.clubchopp.com:3001'
} else if (window.location.href.indexOf('padmin.anystarr') != -1) {
    webhost = 'http://padmin.anystarr.com'
} else if (window.location.href.indexOf('anystarr') != -1) {
    webhost = 'https://admin.anystarr.com'
}

module.exports = webhost
