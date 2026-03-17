const enabledCheckbox = document.getElementById('extensionEnabled');
const enabledState = document.getElementById('enabledState');
const statusMessage = document.getElementById('statusMessage');
const selectedTypeSummary = document.getElementById('selectedTypeSummary');
const statusPill = document.getElementById('statusPill');

const tabTypeToIdMap = {
  '900': 'official',
  '300': 'chords',
  '200': 'tab',
  '500': 'guitarPro',
  '600': 'power',
  '400': 'bass',
  '700': 'drums',
  '100': 'video',
  '800': 'ukulele'
};

const tabTypeLabels = {
  '900': 'Official',
  '300': 'Chords',
  '200': 'Tab',
  '500': 'Guitar Pro',
  '600': 'Power',
  '400': 'Bass',
  '700': 'Drums',
  '100': 'Video',
  '800': 'Ukulele'
};

document.querySelectorAll('input[name="tabType"]').forEach((el) => {
  el.addEventListener('change', (event) => {
    const tabType = event.target.value;
    chrome.storage.sync.set({ tabType });
    chrome.runtime.sendMessage({ tabType });
    updateSelectedType(tabType);
  });
});

function updateSelectedType(tabType) {
  const label = tabTypeLabels[tabType] || 'Bass';
  selectedTypeSummary.textContent = `Preferred result: ${label}`;
}

function updateUI(enabled) {
  enabledState.textContent = enabled ? 'On' : 'Off';
  enabledCheckbox.checked = enabled;
  statusPill.textContent = enabled ? 'Active' : 'Paused';
  statusMessage.textContent = enabled
    ? 'Listening for tracks on supported music sites.'
    : 'Auto search is paused. Turn it back on to resume opening Ultimate Guitar results.';
  if (enabled) {
    document.body.classList.remove('disabled');
  } else {
    document.body.classList.add('disabled');
  }
}

enabledCheckbox.addEventListener('change', function(event) {
    const enabled = event.target.checked;
    chrome.storage.sync.set({ enabled });
    chrome.runtime.sendMessage({ enabled });
    updateUI(enabled);
  });

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'sync') {
    return;
  }

  if (changes.enabled) {
    updateUI(changes.enabled.newValue);
  }

  if (changes.tabType) {
    const selectedTabType = changes.tabType.newValue;
    const correspondingId = tabTypeToIdMap[selectedTabType];
    if (correspondingId) {
      document.getElementById(correspondingId).checked = true;
      updateSelectedType(selectedTabType);
    }
  }
});

window.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(['tabType', 'enabled'], function(data) {
    const selectedTabType = data.tabType || '400';
    const correspondingId = tabTypeToIdMap[selectedTabType];
    document.getElementById(correspondingId).checked = true;
    updateSelectedType(selectedTabType);

    const enabled = (typeof data.enabled !== 'undefined') ? data.enabled : true;
    updateUI(enabled);
  });
});
