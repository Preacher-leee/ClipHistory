// Listen for copy events (Ctrl+C, Command+C, right-click -> Copy)
document.addEventListener('copy', () => {
  getClipboardData('copy');
});

// Listen for paste events (Ctrl+V, Command+V, right-click -> Paste)
document.addEventListener('paste', () => {
  getClipboardData('paste');
});

// Function to get clipboard data when copy or paste event occurs
async function getClipboardData(action) {
  try {
    const clipboardItems = await navigator.clipboard.read();
    const clipboardHistory = [];

    for (let item of clipboardItems) {
      const types = item.types;

      for (let type of types) {
        if (type.startsWith('text/')) {
          const text = await item.getType(type);
          clipboardHistory.push({ type: 'text', content: await text.text() });
        } else if (type.startsWith('image/')) {
          const blob = await item.getType(type);
          const url = URL.createObjectURL(blob);
          clipboardHistory.push({ type: 'image', content: url });
        }
      }
    }

    // Save clipboard data to chrome storage
    chrome.storage.local.get(['clipboardHistory'], (result) => {
      const existingHistory = result.clipboardHistory || [];
      const newHistory = [...clipboardHistory, ...existingHistory];
      chrome.storage.local.set({ clipboardHistory: newHistory });
    });
  } catch (error) {
    console.error('Error reading clipboard data:', error);
  }
}
