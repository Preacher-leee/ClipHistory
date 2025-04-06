document.addEventListener('DOMContentLoaded', () => {
  // Get elements
  const historyContainer = document.getElementById('historyContainer');
  const clearHistoryButton = document.getElementById('clearHistory');
  const searchInput = document.getElementById('searchInput');

  // Get view mode from localStorage and set the layout
  const viewMode = localStorage.getItem('viewMode') || 'list'; // Default to list if not set

  // Apply the view mode setting to the history container
  if (viewMode === 'grid') {
    historyContainer.classList.add('grid-view');
    historyContainer.classList.remove('list-view');
  } else {
    historyContainer.classList.add('list-view');
    historyContainer.classList.remove('grid-view');
  }

  // Function to render clipboard history
  const renderHistory = (historyItems) => {
    historyContainer.innerHTML = ''; // Clear current items
    
    historyItems.forEach(item => {
      const historyItem = document.createElement('div');
      historyItem.classList.add('history-item');
      
      if (item.type === 'image') {
        // If it's an image, create an image element
        const imageElement = document.createElement('img');
        imageElement.src = item.content;
        imageElement.alt = 'Clipboard Image';
        historyItem.appendChild(imageElement);
      } else {
        // If it's text, display it as text
        const textElement = document.createElement('div');
        textElement.classList.add('text-content');
        textElement.textContent = item.content;
        historyItem.appendChild(textElement);
      }
      
      // Optional: Add ability to delete or pin items in history
      historyItem.addEventListener('click', () => {
        navigator.clipboard.writeText(item.content); // Automatically copy the content when clicked
      });

      historyContainer.appendChild(historyItem);
    });
  };

  // Function to filter clipboard history based on search
  searchInput.addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();
    const filteredHistory = clipboardHistory.filter(item =>
      item.content.toLowerCase().includes(query) || item.type.includes(query)
    );
    renderHistory(filteredHistory);
  });

  // Load clipboard history from storage and render it
  chrome.storage.local.get(['clipboardHistory'], (result) => {
    const historyItems = result.clipboardHistory || [];
    renderHistory(historyItems);
  });

  // Clear clipboard history functionality
  clearHistoryButton.addEventListener('click', () => {
    chrome.storage.local.set({ clipboardHistory: [] }, () => {
      renderHistory([]); // Clear the displayed history as well
    });
  });
});
