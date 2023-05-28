let tabType = ''
let lastSongTitle = ''

// On installation set default tabType
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ tabType })
})

// Load the stored tabType when the extension starts
chrome.storage.sync.get('tabType', function(data) {
  if (data.tabType) {
    tabType = data.tabType
  }
})

chrome.runtime.onMessage.addListener((request) => {
  if (request.songTitle) {
    const songTitle = request.songTitle
    lastSongTitle = songTitle
    searchSongOnUltimateGuitar(songTitle)
  }

  if (request.tabType) {
    tabType = request.tabType
    chrome.storage.sync.set({ tabType })

    // If Ultimate Guitar tab is open, re-run the search with the new tab type
    if (lastSongTitle !== '') {
      searchSongOnUltimateGuitar(lastSongTitle)
    }
  }
})

function searchSongOnUltimateGuitar(songTitle) {
  chrome.tabs.query({ url: '*://www.ultimate-guitar.com/*' }, (tabs) => {
    if (tabs.length > 0) {
      chrome.tabs.update(tabs[0].id, { url: `https://www.ultimate-guitar.com/search.php?search_type=title&order=&value=${songTitle}&type=${tabType}`, active: true })
    } else {
      chrome.windows.create({ url: `https://www.ultimate-guitar.com/search.php?search_type=title&order=&value=${songTitle}&type=${tabType}` })
    }
  })
}
