let lastSongTitle = '';

function checkSongTitle() {
  const songTitleElement = document.querySelector('.title.style-scope.ytmusic-player-bar');
  const songTitle = songTitleElement?.innerText;

  if (songTitle && songTitle !== lastSongTitle) {
    lastSongTitle = songTitle;
    chrome.runtime.sendMessage({ songTitle });
  }
}

setInterval(checkSongTitle, 1000); // Check every second
