var request = require('request')
var cheerio = require('cheerio')
var MongoClient = require('mongodb').MongoClient;
var co = require('co')

var home = 'https://coinmarketcap.com/currencies'
var options = {
    method: 'GET',
    url: home,
    headers: {'cache-control': 'no-cache'}
}

var downloaddata = function (coinid) {
    return new Promise(function (resolve, reject) {
        co(function *() {
            yield connectMongodb('mongodb://localhost:27017/cryptocurrencymarket')
            var url = home + '/'+coinid+'/#markets'
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
                    var volume = +tds.eq(3).find('span').attr('data-usd')
                    var price = +tds.eq(4).find('span').attr('data-usd')
                    var volumepercent = tds.eq(5).text()
                    volumepercent = +volumepercent.slice(0,volumepercent.length-1)
                    var update = tds.eq(6).text()
                    mongodb.collection('coinmarketcap').insertOne({
                        coinid:coinid,
                        number:i,
                        source:source,
                        pair:pair,
                        volume:volume,
                        price:price,
                        volumepercent:volumepercent,
                        update:update,
                        createtime:new Date
                    })
                })
                resolve(true)
            })
        })
    })

}

exports.downloaddata = downloaddata

function connectMongodb(url) {
    return new Promise(function (resolve) {
        MongoClient.connect(url,function (err,db) {
            if (err) {
                console.error("connect to mongo error,"+err.message);
                resolve(null)
            } else {
                global.mongodb = db;
                resolve(true)
            }
        })
    })
}