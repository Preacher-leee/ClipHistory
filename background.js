let clipboardHistory = [];

// Listen for messages from content.js or popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'COPY' || message.type === 'PASTE') {
    // Handle the copied or pasted content
    const newItem = {
      content: message.content,
      contentType: message.contentType, // 'text' or 'image'
      timestamp: new Date().toISOString(),
      action: message.type, // 'copy' or 'paste'
      pinned: false, // Will implement pinning in the future
    };

    clipboardHistory.unshift(newItem); // Add new item to history
    if (clipboardHistory.length > 20) clipboardHistory.pop(); // Limit history size to 20 items

    // Save clipboard history to localStorage (or chrome.storage for persistence)
    chrome.storage.local.set({ clipboardHistory: clipboardHistory });

    // Notify popup.js to update the UI
    chrome.runtime.sendMessage({ type: 'UPDATE_HISTORY', history: clipboardHistory });
  }

  // Handle requests for the current clipboard history (from popup.js)
  if (message.type === 'GET_HISTORY') {
    sendResponse({ history: clipboardHistory });
  }

  // Handle pinning action (future feature implementation)
  if (message.type === 'PIN_ITEM') {
    const { index } = message;
    if (clipboardHistory[index]) {
      clipboardHistory[index].pinned = !clipboardHistory[index].pinned;
      chrome.storage.local.set({ clipboardHistory: clipboardHistory });
      sendResponse({ history: clipboardHistory });
    }
  }

  // Handle clearing clipboard history (future feature implementation)
  if (message.type === 'CLEAR_HISTORY') {
    clipboardHistory = [];
    chrome.storage.local.set({ clipboardHistory: [] });
    sendResponse({ history: clipboardHistory });
  }
});

// Load clipboard history when extension starts
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get('clipboardHistory', (data) => {
    if (data.clipboardHistory) {
      clipboardHistory = data.clipboardHistory;
    }
  });
});
