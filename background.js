let tabType = '';
let lastSongTitle = '';

// On installation set default tabType
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ tabType: '400' }); // assuming 'default' as your default tabType
});

// Load the stored tabType when the extension starts
chrome.storage.sync.get('tabType', function(data) {
  if (data.tabType) {
    tabType = data.tabType;
  }
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.songTitle) {
    const songTitle = request.songTitle;
    lastSongTitle = songTitle;
    searchSongOnUltimateGuitar(songTitle);
  }

  if (request.tabType) {
    tabType = request.tabType;
    chrome.storage.sync.set({ tabType: tabType });

    // If Ultimate Guitar tab is open, re-run the search with the new tab type
    if (lastSongTitle !== '') {
      searchSongOnUltimateGuitar(lastSongTitle);
    }
  }
});

async function searchSongOnUltimateGuitar(songTitle) {
  try {
    // Encoding the song title
    const encodedSongTitle = encodeURIComponent(songTitle);

    let tabs = await chrome.tabs.query({ url: '*://*.ultimate-guitar.com/*' });
    if (tabs.length > 0) {
      await chrome.tabs.update(tabs[0].id, { url: `https://www.ultimate-guitar.com/search.php?search_type=title&order=&value=${encodedSongTitle}&type=${tabType}`, active: true });
    } else {
      await chrome.windows.create({ url: `https://www.ultimate-guitar.com/search.php?search_type=title&order=&value=${encodedSongTitle}&type=${tabType}` });
    }
  } catch (error) {
    console.error(error);
  }
}
