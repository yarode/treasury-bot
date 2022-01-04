# Treasury bot

A Discord bot to show treasury statistics.

## Developer quick start 👩‍💻

`npm run dev` will launch the bot locally, with hot reloading included.

There are a few other scripts provided:

- `start`: Starts up the bot without hot reloading; used for the Heroku deployment.

### Configuration 🔧

First, install the dependencies:
`npm install`
`npm install -D`

For the bot to run, it needs these variables, laid out in the `.env.sample` file:

- `DISCORD_API_TOKEN`: Your discord API token. [See this guide on how to obtain one](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token).
- `WEB3_URL`: Your web3 endpoint
- `TOKEN_DECIMAL_DIFFERENCE`: Difference in decimals between MAG & MIM
- `TREASURY_ADDRESS`
- `INNOVATION_ADDRESS`
- `LP_ADDRESS`
- `MAG_ADDRESS`
- `MIM_ADDRESS`
