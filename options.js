document.addEventListener('DOMContentLoaded', () => {
  // Load and apply user settings when the page is loaded
  loadSettings();

  // Event listener for Dark Mode toggle
  document.getElementById('darkModeToggle').addEventListener('change', toggleDarkMode);

  // Event listener for View Mode select
  document.getElementById('viewModeSelect').addEventListener('change', saveViewMode);

  // Event listener for Clear History Button
  document.getElementById('clearHistoryButton').addEventListener('click', clearHistory);
});

// Load settings from chrome storage
function loadSettings() {
  chrome.storage.local.get(['darkMode', 'viewMode'], (result) => {
    // Apply dark mode if enabled
    if (result.darkMode === true) {
      document.body.classList.add('dark-mode');
      document.getElementById('darkModeToggle').checked = true;
    }

    // Apply selected view mode
    if (result.viewMode === 'grid') {
      document.getElementById('viewModeSelect').value = 'grid';
    } else {
      document.getElementById('viewModeSelect').value = 'list';
    }
  });
}

// Toggle Dark Mode
function toggleDarkMode() {
  const darkModeEnabled = document.getElementById('darkModeToggle').checked;
  if (darkModeEnabled) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }

  // Save dark mode setting to storage
  chrome.storage.local.set({ darkMode: darkModeEnabled });
}

// Save selected view mode
function saveViewMode() {
  const viewMode = document.getElementById('viewModeSelect').value;
  chrome.storage.local.set({ viewMode: viewMode });
}

// Clear Clipboard History
function clearHistory() {
  chrome.storage.local.set({ clipboardHistory: [] }, () => {
    document.getElementById('message').classList.remove('hidden');
    setTimeout(() => {
      document.getElementById('message').classList.add('hidden');
    }, 2000);
  });
}
