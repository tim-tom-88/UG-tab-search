let lastSongTitle = '';

function checkSongTitle() {
  try {
    const songTitleElement = document.querySelector('.title.style-scope.ytmusic-player-bar');
    const songTitle = songTitleElement?.innerText;

    if (songTitle && songTitle !== lastSongTitle) {
      lastSongTitle = songTitle;
      chrome.runtime.sendMessage({ songTitle });
    }
  } catch (error) {
    chrome.runtime.sendMessage({ error: error.message });
  }
}

setInterval(checkSongTitle, 1000); // Check every second
