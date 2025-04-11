document.addEventListener('DOMContentLoaded', function () {
  // Elements
  const darkModeToggle = document.getElementById('darkModeToggle');
  const clipboardHistoryContainer = document.getElementById('clipboardHistory');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
  const optionsBtn = document.getElementById('optionsBtn');

  // Load and display clipboard history
  loadClipboardHistory();

  // Load dark mode preference
  chrome.storage.local.get('darkMode', (result) => {
    if (result.darkMode) {
      document.body.classList.add('dark-mode');
      darkModeToggle.checked = true;
    } else {
      document.body.classList.remove('dark-mode');
      darkModeToggle.checked = false;
    }
  });

  // Event listener for dark mode toggle
  darkModeToggle.addEventListener('change', function () {
    const isDarkMode = darkModeToggle.checked;
    chrome.storage.local.set({ darkMode: isDarkMode });
    document.body.classList.toggle('dark-mode', isDarkMode);
  });

  // Event listener for clear history button
  clearHistoryBtn.addEventListener('click', function () {
    chrome.storage.local.set({ clipboardHistory: [] }, function () {
      loadClipboardHistory();
    });
  });

  // Event listener for options button
  optionsBtn.addEventListener('click', function () {
    chrome.runtime.openOptionsPage();
  });

  // Load clipboard history from local storage and display it
  function loadClipboardHistory() {
    chrome.storage.local.get('clipboardHistory', function (result) {
      const history = result.clipboardHistory || [];
      clipboardHistoryContainer.innerHTML = ''; // Clear the container

      if (history.length === 0) {
        clipboardHistoryContainer.innerHTML = '<p>No clipboard history available.</p>';
        return;
      }

      history.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.classList.add('clipboard-history-item');

        // Display text or image
        if (item.type === 'text') {
          historyItem.innerHTML = `<p>${item.content}</p>`;
        } else if (item.type === 'image') {
          const img = document.createElement('img');
          img.src = item.content;
          img.alt = 'Copied Image';
          img.classList.add('clipboard-history-image');
          historyItem.appendChild(img);
        }

        // Append the item to the history container
        clipboardHistoryContainer.appendChild(historyItem);
      });
    });
  }
});
