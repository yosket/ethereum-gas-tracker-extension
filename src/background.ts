import { browser } from 'webextension-polyfill-ts'

start()

async function start() {
  console.log(browser.alarms)
  browser.alarms.create({ periodInMinutes: 1 / 12 })
  browser.alarms.onAlarm.addListener(update)
  console.info('[Ethereum Gas Tracker] Started!')
}

async function update() {
  try {
    const {
      result: { ProposeGasPrice }
    } = await getGasData()
    browser.action.setBadgeText({ text: ProposeGasPrice })
    browser.action.setBadgeBackgroundColor({ color: '#18A0FB' })
  } catch (e) {
    console.error(e)
    browser.action.setBadgeText({ text: '!' })
    browser.action.setBadgeBackgroundColor({ color: '#F24D4D' })
  }
}

async function getGasData() {
  const res = await fetch(
    `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${
      import.meta.env.VITE_ETHERSCAN_API_KEY_TOKEN
    }`
  )
  return await res.json()
}
