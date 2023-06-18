let lastSongTitle = ''

// Function to check for changes in media session metadata
function checkMediaSessionMetadata() {
  if ('mediaSession' in navigator && 'metadata' in navigator.mediaSession) {
    const songTitle = navigator.mediaSession.metadata.title
    if (songTitle && songTitle !== lastSongTitle) {
      lastSongTitle = songTitle
      sendSongTitle(songTitle)
    }
  }
}

// Send the song title to the background script
function sendSongTitle(songTitle) {
  chrome.runtime.sendMessage({ songTitle })
}

// Poll for changes in media session metadata every second
setInterval(checkMediaSessionMetadata, 1000)

// Mutation observer to detect changes in navigator.mediaSession.metadata object
const observer = new MutationObserver(checkMediaSessionMetadata)
observer.observe(navigator.mediaSession, { subtree: true, childList: true })
