const dotenv = require('dotenv')
const { getTransactionsByAccount } = require('./utils')

dotenv.config()

const Web3 = require("web3")
const provider = new Web3.providers.HttpProvider(process.env.WEB3_URL)
const web3 = new Web3(provider)

const DECIMALS = 10**18
const SPECIFIC_DECIMALS = 10 ** parseFloat(process.env.TOKEN_DECIMAL_DIFFERENCE)

let lastInspected = null

const minABI = [
  // balanceOf
  {
    "constant":true,
    "inputs":[{"name":"_owner","type":"address"}],
    "name":"balanceOf",
    "outputs":[{"name":"balance","type":"uint256"}],
    "type":"function"
  },
  // decimals
  {
    "constant":true,
    "inputs":[],
    "name":"decimals",
    "outputs":[{"name":"","type":"uint8"}],
    "type":"function"
  },
  // totalSupply
  {
    "inputs":[],
    "name":"totalSupply",
    "outputs":
      [{
        "internalType":"uint256",
        "name":"",
        "type":"uint256"
      }],
    "stateMutability":"view",
    "type":"function"
  }
];

const mim_contract = new web3.eth.Contract(minABI, process.env.MIM_ADDRESS)
const mag_contract = new web3.eth.Contract(minABI, process.env.MAG_ADDRESS)
const lp_contract = new web3.eth.Contract(minABI, process.env.LP_ADDRESS)

async function getBalance(contract, target) {
  balance = await contract.methods.balanceOf(target).call()
  return balance
}

async function getPrice(base_contract, target_contract) {
  base_balance = await getBalance(base_contract, process.env.LP_ADDRESS)
  target_balance = await getBalance(target_contract, process.env.LP_ADDRESS)
  price = base_balance/target_balance
  price /= SPECIFIC_DECIMALS
  return price
}

async function getTokenPrice() {
  price = await getPrice(mim_contract, mag_contract, process.env.LP_ADDRESS)
  return price
}

async function getLPValue(mim_contract, lp_contract) {
  mim_balance = await getBalance(mim_contract, process.env.LP_ADDRESS)
  mim_balance /= DECIMALS

  mag_balance = await getBalance(mag_contract, process.env.LP_ADDRESS)
  mag_balance /= SPECIFIC_DECIMALS

  mag_price = await getTokenPrice()

  totalSupply = await lp_contract.methods.totalSupply().call()
  totalSupply /= DECIMALS

  totalValue = mim_balance + (mag_balance * mag_price)
  value = totalValue/totalSupply
  return value
}

exports.getFundBalance = async (fund) => {
  var lp_balance = await getBalance(lp_contract, fund)
  lp_balance /= DECIMALS

  var mim_balance = await getBalance(mim_contract, fund)
  mim_balance /= DECIMALS

  lp_value = await getLPValue(mim_contract, lp_contract)

  balance = mim_balance + (lp_balance * lp_value)
  return balance
}

exports.getLargeTransactions = async () => {
  transactions = await getTransactionsByAccount(process.env.TREASURY_ADDRESS, null, null)
}
