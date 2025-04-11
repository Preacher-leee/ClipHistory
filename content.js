// Function to handle copied text or image and send it to the background script
function handleClipboardEvent(event) {
  // Allow only successful text or image pasting or copying
  const clipboardData = event.clipboardData || window.clipboardData;

  if (clipboardData) {
    // Check for text content in the clipboard
    if (clipboardData.types.includes('text/plain')) {
      const textContent = clipboardData.getData('text/plain');
      if (textContent) {
        // Send copied text content to the background script for saving
        chrome.runtime.sendMessage({
          type: 'SAVE_CLIPBOARD_ITEM',
          content: textContent,
          contentType: 'text',
        });
      }
    }

    // Check for image content in the clipboard
    if (clipboardData.types.includes('image/png') || clipboardData.types.includes('image/jpeg')) {
      const imageBlob = clipboardData.items[0].getAsFile();
      if (imageBlob) {
        const reader = new FileReader();
        reader.onloadend = function () {
          // Send copied image data as base64 to the background script for saving
          const imageData = reader.result.split(',')[1]; // Base64 data
          chrome.runtime.sendMessage({
            type: 'SAVE_CLIPBOARD_ITEM',
            content: imageData,
            contentType: 'image',
          });
        };
        reader.readAsDataURL(imageBlob);
      }
    }
  }
}

// Listen for copy events (keyboard and mouse)
document.addEventListener('copy', handleClipboardEvent);

// Listen for paste events (keyboard and mouse)
document.addEventListener('paste', handleClipboardEvent);
