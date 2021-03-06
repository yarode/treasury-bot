const { Client } = require('discord.js')
const dotenv = require('dotenv')
const { getFundBalance, getYieldBalance, getMagBalanceUSD } = require('./fetchData')

const { numberWithCommas } = require('./utils')

dotenv.config()

const client = new Client()

// eslint-disable-next-line

client.on('ready', () => {
  console.log(`Bot successfully started as ${client.user.tag}`)
  client.user.setActivity(
    `Treasury Balance`,
    { type: 'WATCHING' },
  )
})

// Updates treasury balance on bot's status every X amount of time
client.setInterval(async () => {

  const treasuryBalance = await getFundBalance(process.env.TREASURY_ADDRESS)
  console.log(treasuryBalance)
  const innovationFundBalance = await getYieldBalance(process.env.INNOVATION_ADDRESS)
  console.log(innovationFundBalance)
  const yieldBalance = await getYieldBalance(process.env.MULTISIG_ADDRESS)
  console.log(yieldBalance)
  const magBalance = await getMagBalanceUSD()
  console.log(magBalance)
  const balance = (treasuryBalance + innovationFundBalance + yieldBalance - magBalance).toFixed(2)

  client.guilds.cache.forEach(async (guild) => {
    const botMember = guild.me
    await botMember.setNickname(`$${numberWithCommas(balance)}`)
  })

  console.log(`Updated to - $${numberWithCommas(balance)}`)
}, parseFloat(process.env.INTERVAL) * 60 * 1000)

client.login(process.env.DISCORD_API_TOKEN)
