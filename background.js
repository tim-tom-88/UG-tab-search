let tabType = ''
let lastSongTitle = ''
let enabled = true

// On installation set default tabType
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ tabType: '400', enabled: true }) // set defaults
})

// Load stored settings when the extension starts
chrome.storage.sync.get(['tabType', 'enabled'], function (data) {
  if (data.tabType) {
    tabType = data.tabType
  }
  if (typeof data.enabled !== 'undefined') {
    enabled = data.enabled
  }
})

chrome.runtime.onMessage.addListener((request) => {
  if (request.songTitle) {
    const songTitle = request.songTitle
    lastSongTitle = songTitle
    if (enabled) {
      searchSongOnUltimateGuitar(songTitle)
    }
  }

  if (request.tabType) {
    tabType = request.tabType
    chrome.storage.sync.set({ tabType: tabType })

    // If Ultimate Guitar tab is open, re-run the search with the new tab type
    if (enabled && lastSongTitle !== '') {
      searchSongOnUltimateGuitar(lastSongTitle)
    }
  }

  if (typeof request.enabled !== 'undefined') {
    enabled = request.enabled
    chrome.storage.sync.set({ enabled })
    if (enabled && lastSongTitle !== '') {
      searchSongOnUltimateGuitar(lastSongTitle)
    }
  }
})

async function searchSongOnUltimateGuitar(songTitle) {
  try {
    // Remove any text enclosed in brackets or after brackets
    const cleanSongTitle = songTitle.replace(/\(.*\)/, '')

    // Encoding the song title
    const encodedSongTitle = encodeURIComponent(cleanSongTitle)

    let tabs = await chrome.tabs.query({ url: '*://*.ultimate-guitar.com/*' })
    if (tabs.length > 0) {
      await chrome.tabs.update(tabs[0].id, {
        url: `https://www.ultimate-guitar.com/search.php?search_type=title&order=&value=${encodedSongTitle}&type=${tabType}`,
        active: true
      })
    } else {
      await chrome.windows.create({
        url: `https://www.ultimate-guitar.com/search.php?search_type=title&order=&value=${encodedSongTitle}&type=${tabType}`
      })
    }
  } catch (error) {
    console.error(error)
  }
}
