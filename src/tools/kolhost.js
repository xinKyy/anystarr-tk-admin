var kolhost = 'http://papi.anystarr.com/kol'

if (window.location.href.indexOf('padmin.anystarr') != -1) {
    kolhost = 'http://papi.anystarr.com/kol'
} else if (window.location.href.indexOf('anystarr') != -1) {
    kolhost = 'https://api.anystarr.com/kol'
}

module.exports = kolhost
