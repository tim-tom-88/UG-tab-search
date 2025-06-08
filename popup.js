document.getElementById('tabTypeForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const tabType = document.querySelector('input[name="tabType"]:checked').value;

    // Store the selected tab type
    chrome.storage.sync.set({ tabType });

    // Send the tab type to the background script
    chrome.runtime.sendMessage({ tabType });

    // Close the popup
    window.close();
  });

document.getElementById('extensionEnabled').addEventListener('change', function(event) {
    const enabled = event.target.checked;
    chrome.storage.sync.set({ enabled });
    chrome.runtime.sendMessage({ enabled });
  });

// When the popup is loaded, retrieve stored settings
window.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['tabType', 'enabled'], function(data) {
      if (data.tabType) {
        const tabTypeToIdMap = {
          "900": "official",
          "300": "chords",
          "200": "tab",
          "500": "guitarPro",
          "600": "power",
          "400": "bass",
          "700": "drums",
          "100": "video",
          "800": "ukulele"
        };
        const correspondingId = tabTypeToIdMap[data.tabType];
        document.getElementById(correspondingId).checked = true;
      }
      if (typeof data.enabled !== 'undefined') {
        document.getElementById('extensionEnabled').checked = data.enabled;
      } else {
        document.getElementById('extensionEnabled').checked = true;
      }
    });
  });
