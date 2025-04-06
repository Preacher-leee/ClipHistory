// popup.js

document.addEventListener('DOMContentLoaded', () => {
  const historyContainer = document.getElementById('history');
  const clearBtn = document.getElementById('clearHistory');
  const searchInput = document.getElementById('searchInput');
  const scrollBtn = document.getElementById('scrollTopBtn');

  let history = []; // Store history here for search/filtering

  // Fetch and render clipboard history
  chrome.runtime.sendMessage({ type: 'get_history' }, (response) => {
    history = response.history || [];
    renderHistory(history);
  });

  // Filter history based on search input
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filteredHistory = history.filter(item =>
      item.text.toLowerCase().includes(query)
    );
    renderHistory(filteredHistory);
  });

  // Render clipboard history to UI
  function renderHistory(historyData) {
    historyContainer.innerHTML = ''; // Clear current history display

    if (historyData.length === 0) {
      historyContainer.innerHTML = '<p class="empty">No matches found.</p>';
      return;
    }

    // Sort: pinned first
    historyData.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

    historyData.forEach((item) => {
      const entry = document.createElement('div');
      entry.className = 'entry';

      const text = document.createElement('textarea');
      text.readOnly = true;
      text.value = item.text || item;
      text.className = 'clip-text';
      text.title = "Click to copy";
      text.addEventListener('click', () => {
        navigator.clipboard.writeText(text.value).then(() => {
          text.classList.add('copied');
          setTimeout(() => text.classList.remove('copied'), 1000);
        });
      });

      const pin = document.createElement('button');
      pin.className = 'pin-btn';
      pin.textContent = item.pinned ? '📌' : '📍';
      pin.title = item.pinned ? 'Unpin' : 'Pin';

      pin.addEventListener('click', () => {
        chrome.runtime.sendMessage({
          type: 'toggle_pin',
          text: text.value
        }, () => location.reload());
      });

      entry.appendChild(pin);
      entry.appendChild(text);
      historyContainer.appendChild(entry);
    });
  }

  // Clear history
  clearBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'clear_history' }, () => {
      historyContainer.innerHTML = '<p class="empty">Clipboard history cleared.</p>';
    });
  });

  // Scroll to top button functionality
  window.addEventListener('scroll', () => {
    scrollBtn.style.display = window.scrollY > 100 ? 'block' : 'none';
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
