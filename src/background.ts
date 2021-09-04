import { browser } from 'webextension-polyfill-ts'

browser.action.setBadgeBackgroundColor({ color: 'red' })
browser.action.setBadgeText({ text: '1234' })
