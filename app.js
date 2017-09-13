var request = require('request')
var options = {
    method: 'GET',
    url: 'https://coinmarketcap.com/',
    headers: {'cache-control': 'no-cache'}
}

request(options, function (error, response, body) {
    if (error) {
        throw new Error(error)
    }
    console.log('body',body)
})