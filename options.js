// options.js

document.addEventListener('DOMContentLoaded', () => {
  // Get elements from the options page
  const pinningToggle = document.getElementById('pinningToggle');
  const darkModeToggle = document.getElementById('darkModeToggle');
  const clearHistoryButton = document.getElementById('clearHistoryButton');
  const resetDefaultsButton = document.getElementById('resetDefaultsButton');

  // Load settings from chrome.storage.local
  chrome.storage.local.get(['pinningEnabled', 'darkModeEnabled'], (result) => {
    pinningToggle.checked = result.pinningEnabled !== undefined ? result.pinningEnabled : true; // default to true
    darkModeToggle.checked = result.darkModeEnabled || false; // default to false (light mode)
  });

  // Listen for pinning toggle change
  pinningToggle.addEventListener('change', () => {
    const pinningEnabled = pinningToggle.checked;
    chrome.storage.local.set({ pinningEnabled });
  });

  // Listen for dark mode toggle change
  darkModeToggle.addEventListener('change', () => {
    const darkModeEnabled = darkModeToggle.checked;
    chrome.storage.local.set({ darkModeEnabled });
    // Toggle dark mode immediately on change
    document.body.classList.toggle('dark-mode', darkModeEnabled);
  });

  // Handle clear history button click
  clearHistoryButton.addEventListener('click', () => {
    // Clear history from chrome storage
    chrome.storage.local.remove('clipboardHistory', () => {
      alert('Clipboard history has been cleared.');
    });
  });

  // Handle reset to default settings button click
  resetDefaultsButton.addEventListener('click', () => {
    // Reset settings to default values
    chrome.storage.local.set({
      pinningEnabled: true,
      darkModeEnabled: false,
    }, () => {
      // Reset UI based on default values
      pinningToggle.checked = true;
      darkModeToggle.checked = false;
      document.body.classList.remove('dark-mode');
      alert('Settings have been reset to default.');
    });
  });
});
