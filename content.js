// content.js

// Function to handle clipboard data (both text and images)
function handleClipboardData(event) {
  // Check if the clipboard event contains data
  if (event.clipboardData && event.clipboardData.items) {
    for (let i = 0; i < event.clipboardData.items.length; i++) {
      const item = event.clipboardData.items[i];

      // If the item is text
      if (item.type.indexOf('text') === 0) {
        const clipboardText = event.clipboardData.getData('text');
        if (clipboardText) {
          // Send the clipboard text to background.js for saving
          chrome.runtime.sendMessage({
            type: 'save_clipboard',
            text: clipboardText
          });
        }
      }
      
      // If the item is an image
      if (item.type.indexOf('image') === 0) {
        const clipboardImage = item.getAsFile();
        if (clipboardImage) {
          const reader = new FileReader();

          reader.onloadend = function () {
            const base64Image = reader.result;
            // Send the base64 image to background.js for saving
            chrome.runtime.sendMessage({
              type: 'save_clipboard',
              text: base64Image,
              isImage: true
            });
          };

          // Read the image as base64
          reader.readAsDataURL(clipboardImage);
        }
      }
