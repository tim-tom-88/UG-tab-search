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
  
  // When the popup is loaded, retrieve the stored tab type
  window.addEventListener('DOMContentLoaded', (event) => {
    chrome.storage.sync.get('tabType', function(data) {
      // If a tab type has been stored, set the corresponding radio button to be checked
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
    });
  });
  