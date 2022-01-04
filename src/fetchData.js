const gql = require('graphql-tag')
const { GraphQLWrapper } = require('@aragon/connect-thegraph')
const dotenv = require('dotenv')

dotenv.config()

const Web3 = require("web3")
const provider = new Web3.providers.HttpProvider(process.env.WEB3_URL)
const web3 = new Web3(provider)

const SUBGRAPH_URL = process.env.SUBGRAPH

const PRICE_QUERY = gql`
  query {
    token(id: "${process.env.TOKEN_ID}") {
      symbol
    }
  }
`

const fetchData = async () => {
  const graphqlClient = new GraphQLWrapper(SUBGRAPH_URL)
  const result = await graphqlClient.performQuery(PRICE_QUERY)
  if (!result.data) return undefined
  return result
}

async function getBalance(contract) {
  balance = await contract.methods.balanceOf(process.env.SOURCE_ADDRESS).call()
  return balance
}

async function getPrice(base_contract, target_contract) {
  base_balance = await getBalance(base_contract)
  target_balance = await getBalance(target_contract)
  price = base_balance/target_balance
  if(process.env.TOKEN_DECIMAL_DIFFERENCE) {
    price /= 10 ** parseInt(process.env.TOKEN_DECIMAL_DIFFERENCE)
  }
  return price.toFixed(2)
}

exports.getTokenPrice = async () => {
  let minABI = [
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
    }
  ];

  let base_contract = new web3.eth.Contract(minABI, process.env.BASE_ADDRESS)
  let target_contract = new web3.eth.Contract(minABI, process.env.TOKEN_ID)
  price = await getPrice(base_contract, target_contract)
  return price
}

exports.getTokenSymbol = async () => {
  const res = await fetchData()
  return res.data.token.symbol
}
