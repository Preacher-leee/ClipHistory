// content.js

function sendClipboardText(text, type = 'clipboard_text') {
  if (!text.trim()) return;
  chrome.runtime.sendMessage({ type, text });
}

async function sendClipboardImage() {
  try {
    const items = await navigator.clipboard.read();
    for (const item of items) {
      for (const type of item.types) {
        if (type.startsWith('image/')) {
          const blob = await item.getType(type);
          const reader = new FileReader();
          reader.onloadend = () => {
            chrome.runtime.sendMessage({
              type: 'clipboard_image',
              imageData: reader.result
            });
          };
          reader.readAsDataURL(blob);
        }
      }
    }
  } catch (err) {
    // Clipboard read requires user gesture and permission
  }
}

// Capture Ctrl+C or right-click > Copy
document.addEventListener('copy', () => {
  const selected = window.getSelection()?.toString() || '';
  sendClipboardText(selected);
  sendClipboardImage(); // optional: may not work without user gesture
});

// Capture Ctrl+V or right-click > Paste
document.addEventListener('paste', (e) => {
  const pastedText = (e.clipboardData || window.clipboardData)?.getData('text') || '';
  sendClipboardText(pastedText, 'clipboard_paste');
  // Do not read clipboard image here; navigator.clipboard.read() not allowed
});
