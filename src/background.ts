import { browser } from 'webextension-polyfill-ts'

start()

function start() {
  const { href: url } = getApiUrl()
  browser.alarms.create({ periodInMinutes: 1 })
  browser.alarms.onAlarm.addListener(() => update(url))
  console.info('[Ethereum Gas Tracker] Started!')
  update(url)
}

function getApiUrl(): URL {
  const token = (import.meta.env.VITE_ETHERSCAN_API_KEY_TOKEN || '') as string
  const apiUrl = new URL('https://api.etherscan.io/api')
  apiUrl.searchParams.set('module', 'gastracker')
  apiUrl.searchParams.set('action', 'gasoracle')
  apiUrl.searchParams.set('apikey', token)
  return apiUrl
}

async function update(url: string) {
  try {
    const {
      result: { ProposeGasPrice }
    } = await getGasData(url)

    // undefinedの場合は何もしない
    if (!ProposeGasPrice) {
      return
    }

    browser.action.setBadgeText({ text: formatNumber(ProposeGasPrice) })
    browser.action.setBadgeBackgroundColor({ color: '#18A0FB' })
  } catch (e) {
    console.error(e)
    browser.action.setBadgeText({ text: '!' })
    browser.action.setBadgeBackgroundColor({ color: '#F24D4D' })
  }
}

async function getGasData(url: string) {
  const res = await fetch(url)
  return await res.json()
}

function formatNumber(numStr: string): string {
  const num = parseFloat(numStr)

  if (num >= 10) {
    return Math.floor(num).toString()
  } else {
    return num.toFixed(2)
  }
}
