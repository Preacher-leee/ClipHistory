// background.js

// Helper to get existing clipboard history
function getClipboardHistory(callback) {
  chrome.storage.local.get(['clipboardHistory'], (result) => {
    const history = result.clipboardHistory || [];
    callback(history);
  });
}

// Save clipboard text to local storage
function saveClipboardText(text) {
  if (!text || !text.trim()) return;

  getClipboardHistory((history) => {
    const exists = history.find(item => item.text === text);
    if (exists) return;

    const newEntry = { text, pinned: false };
    history.unshift(newEntry);
    // Limit history to 100 entries
    if (history.length > 100) {
      history = history.slice(0, 100);
    }

    chrome.storage.local.set({ clipboardHistory: history });
  });
}

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'save_clipboard') {
    saveClipboardText(message.text);
    sendResponse({ status: 'saved' });
  }

  if (message.type === 'get_history') {
    getClipboardHistory((history) => {
      sendResponse({ history });
    });
    return true; // Needed to use async sendResponse
  }

  if (message.type === 'clear_history') {
    chrome.storage.local.set({ clipboardHistory: [] }, () => {
      sendResponse({ status: 'cleared' });
    });
    return true;
  }

  if (message.type === 'toggle_pin') {
    getClipboardHistory((history) => {
      const index = history.findIndex(item => item.text === message.text);
      if (index !== -1) {
        history[index].pinned = !history[index].pinned;
        chrome.storage.local.set({ clipboardHistory: history }, () => {
          sendResponse({ status: 'toggled' });
        });
      } else {
        sendResponse({ status: 'not_found' });
      }
    });
    return true;
  }
});
