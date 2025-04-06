// content.js

// Send clipboard text (for copy or paste)
function sendClipboardText(text, type = 'clipboard_text') {
  if (!text || !text.trim()) return;
  chrome.runtime.sendMessage({ type, text });
}

// Send clipboard image as Base64 (data URL)
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
    // navigator.clipboard.read() requires user gesture and permissions
    // Fail silently or log if debugging
    // console.warn('Clipboard image read failed', err);
  }
}

// Handle text copy (Ctrl+C, right-click Copy)
document.addEventListener('copy', () => {
  const selectedText = window.getSelection()?.toString() || '';
  sendClipboardText(selectedText, 'clipboard_text');
  sendClipboardImage(); // Attempt to capture image (if any)
});

// Handle text paste (Ctrl+V, right-click Paste)
document.addEventListener('paste', (e) => {
  const pastedText = (e.clipboardData || window.clipboardData)?.getData('text') || '';
  sendClipboardText(pastedText, 'clipboard_paste');
});
