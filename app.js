var request = require('request')
var cheerio = require('cheerio')
var home = 'https://coinmarketcap.com/currencies'
var options = {
    method: 'GET',
    url: home,
    headers: {'cache-control': 'no-cache'}
}

var downloaddata = function (id) {
    var url = home + '/'+id+'/#markets'
    var options = {
        method: 'GET',
        url: url,
        headers: {'cache-control': 'no-cache'}
    }
    request(options, function (error, response, body) {
        if (error) {
            throw new Error(error)
        }
        // console.log('body',body)
        $ = cheerio.load(body)
        var tr = $('#markets-table').find('tbody').find('tr')
        tr.map(function(i, el) {
            var tds = $(el).children('td')
            var source = tds.eq(1).text()
            var pair = tds.eq(2).find('a').text()
            var volume = tds.eq(3).find('span').attr('data-usd')
            var price = tds.eq(4).find('span').attr('data-usd')
            var volumepercent = tds.eq(5).text()
            var update = tds.eq(6).text()
            console.log(i,source,pair,volume,price,volumepercent,update)
        })
    })
}

downloaddata('bitcoin')