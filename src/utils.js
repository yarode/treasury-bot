const dotenv = require('dotenv')

dotenv.config()

exports.numberWithCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
