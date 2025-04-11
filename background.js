let clipboardHistory = [];

// Load clipboard history from storage on startup
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get(['clipboardHistory'], (result) => {
    if (result.clipboardHistory) {
      clipboardHistory = result.clipboardHistory;
    }
  });
});

// Listen for messages from content or popup scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SAVE_CLIPBOARD_ITEM') {
    const item = {
      id: Date.now(),
      content: message.content,
      contentType: message.contentType,
      timestamp: new Date().toISOString(),
      pinned: false,
      category: message.category || '',
    };

    // Avoid storing empty or duplicate text
    if (
      item.contentType === 'text' &&
      (!item.content || clipboardHistory.some(i => i.content === item.content))
    ) {
      return;
    }

    clipboardHistory.unshift(item);
    chrome.storage.local.set({ clipboardHistory });
  }

  if (message.type === 'GET_HISTORY') {
    sendResponse(clipboardHistory);
  }

  if (message.type === 'PIN_ITEM') {
    clipboardHistory = clipboardHistory.map(item =>
      item.id === message.id ? { ...item, pinned: !item.pinned } : item
    );
    chrome.storage.local.set({ clipboardHistory });
  }

  if (message.type === 'DELETE_ITEM') {
    clipboardHistory = clipboardHistory.filter(item => item.id !== message.id);
    chrome.storage.local.set({ clipboardHistory });
  }

  if (message.type === 'CLEAR_HISTORY') {
    clipboardHistory = [];
    chrome.storage.local.set({ clipboardHistory });
  }

  if (message.type === 'EXPORT_HISTORY') {
    sendResponse(clipboardHistory);
  }

  if (message.type === 'IMPORT_HISTORY') {
    const imported = message.data || [];
    clipboardHistory = imported.concat(clipboardHistory);
    chrome.storage.local.set({ clipboardHistory });
  }
});
