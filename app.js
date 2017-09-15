var coinmarket = require('./coinmarket')

var coinids = ['bitcoin','ethereum','ethereum-classic','neo','omisego','zcash','eos','tenx','civic','gas','siacoin']
coinids.map(function (coinid) {
    coinmarket.downloaddata(coinid)
})


