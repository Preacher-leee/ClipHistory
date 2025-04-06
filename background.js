// background.js

// Listen for messages from content.js or popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  chrome.storage.local.get({ clipboardHistory: [] }, (result) => {
    const history = result.clipboardHistory;
    const timestamp = new Date().toISOString();

    const newItem = {
      type: message.type,
      content: message.text || message.imageData,
      timestamp,
      pinned: false
    };

    // Avoid duplicate text entries (skip for images)
    if (
      newItem.type.startsWith("clipboard_") &&
      newItem.type !== "clipboard_image" &&
      history.length &&
      history[0].content === newItem.content
    ) {
      return;
    }

    // Add new item at the beginning
    history.unshift(newItem);

    // Keep pinned + up to 100 most recent unpinned items
    const pinnedItems = history.filter(item => item.pinned);
    const unpinnedItems = history.filter(item => !item.pinned).slice(0, 100);
    const updatedHistory = [...pinnedItems, ...unpinnedItems];

    chrome.storage.local.set({ clipboardHistory: updatedHistory });
  });
});

// Handle keyboard command (manual clipboard save)
chrome.commands.onCommand.addListener((command) => {
  if (command === "save_clipboard") {
    navigator.clipboard.readText()
      .then(text => {
        if (text.trim()) {
          chrome.runtime.sendMessage({
            type: "clipboard_text",
            text
          });
        }
      })
      .catch(err => {
        console.error("Clipboard read failed:", err);
      });
  }
});
