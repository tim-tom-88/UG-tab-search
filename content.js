let lastSongTitle = '';
let enabled = true;

// Get initial enabled state
chrome.storage.sync.get('enabled', (data) => {
  if (typeof data.enabled !== 'undefined') {
    enabled = data.enabled;
  }
});

// Listen for changes to the enabled setting
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.enabled) {
    enabled = changes.enabled.newValue;
  }
});

// Function to check for changes in media session metadata
function checkMediaSessionMetadata() {
  if ('mediaSession' in navigator && 'metadata' in navigator.mediaSession) {
    const songTitle = navigator.mediaSession.metadata.title;
    if (songTitle && songTitle !== lastSongTitle) {
      lastSongTitle = songTitle;
      sendSongTitle(songTitle);
    }
  }
}

// Send the song title to the background script
function sendSongTitle(songTitle) {
  if (enabled) {
    chrome.runtime.sendMessage({ songTitle });
  }
}

// Poll for changes in media session metadata every second
setInterval(checkMediaSessionMetadata, 1000);

// Mutation observer to detect changes in the document's head element
const observer = new MutationObserver(checkMediaSessionMetadata);
observer.observe(document.head, { subtree: true, childList: true });
