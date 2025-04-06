// Listen for 'copy' event to capture copied content (text or image)
document.addEventListener('copy', function (event) {
  setTimeout(() => {
    // Check for text content in the clipboard
    navigator.clipboard.readText().then(text => {
      if (text) {
        // If text content is copied, send it to the background script
        chrome.runtime.sendMessage({
          type: 'COPY',
          content: text,
          contentType: 'text' // Mark content type as text
        });
      }
    }).catch(err => {
      console.error('Clipboard read failed during copy (text)', err);
    });

    // Check for image content in the clipboard
    navigator.clipboard.read().then(items => {
      for (const item of items) {
        if (item.types.includes('image/png')) { // Adjust this for other image types if needed
          item.getType('image/png').then(blob => {
            const reader = new FileReader();
            reader.onload = function () {
              const imageData = reader.result;
              // Send image data to the background script
              chrome.runtime.sendMessage({
                type: 'COPY',
                content: imageData,
                contentType: 'image' // Mark content type as image
              });
            };
            reader.readAsDataURL(blob);
          });
        }
      }
    }).catch(err => {
      console.error('Clipboard read failed during copy (image)', err);
    });
  }, 100);
});

// Listen for 'paste' event to capture pasted content (text or image)
document.addEventListener('paste', function (event) {
  setTimeout(() => {
    // Check for text content in the clipboard
    navigator.clipboard.readText().then(text => {
      if (text) {
        // If text content is pasted, send it to the background script
        chrome.runtime.sendMessage({
          type: 'PASTE',
          content: text,
          contentType: 'text' // Mark content type as text
        });
      }
    }).catch(err => {
      console.error('Clipboard read failed during paste (text)', err);
    });

    // Check for image content in the clipboard
    navigator.clipboard.read().then(items => {
      for (const item of items) {
        if (item.types.includes('image/png')) { // Adjust this for other image types if needed
          item.getType('image/png').then(blob => {
            const reader = new FileReader();
            reader.onload = function () {
              const imageData = reader.result;
              // Send image data to the background script
              chrome.runtime.sendMessage({
                type: 'PASTE',
                content: imageData,
                contentType: 'image' // Mark content type as image
              });
            };
            reader.readAsDataURL(blob);
          });
        }
      }
    }).catch(err => {
      console.error('Clipboard read failed during paste (image)', err);
    });
  }, 100);
});
