// popup.js

// DOM elements
const darkModeCheckbox = document.getElementById('dark-mode-checkbox');
const searchInput = document.getElementById('search-input');
const typeFilter = document.getElementById('type-filter');
const dateFrom = document.getElementById('date-from');
const dateTo = document.getElementById('date-to');
const clipboardHistoryList = document.getElementById('clipboard-history');
const deleteSelectedButton = document.getElementById('delete-selected');
const pinSelectedButton = document.getElementById('pin-selected');

// Local storage keys
const DARK_MODE_KEY = 'darkModeEnabled';
const CLIPBOARD_HISTORY_KEY = 'clipboardHistory';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Check dark mode preference
  const isDarkMode = localStorage.getItem(DARK_MODE_KEY) === 'true';
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    darkModeCheckbox.checked = true;
  }

  // Load clipboard history
  loadClipboardHistory();

  // Event listeners
  darkModeCheckbox.addEventListener('change', toggleDarkMode);
  searchInput.addEventListener('input', filterHistory);
  typeFilter.addEventListener('change', filterHistory);
  dateFrom.addEventListener('input', filterHistory);
  dateTo.addEventListener('input', filterHistory);
  deleteSelectedButton.addEventListener('click', deleteSelectedItems);
  pinSelectedButton.addEventListener('click', pinSelectedItems);
});

// Toggle Dark Mode
function toggleDarkMode() {
  const isDarkMode = darkModeCheckbox.checked;
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
  localStorage.setItem(DARK_MODE_KEY, isDarkMode.toString());
}

// Load clipboard history from local storage
function loadClipboardHistory() {
  chrome.storage.local.get([CLIPBOARD_HISTORY_KEY], (result) => {
    const history = result[CLIPBOARD_HISTORY_KEY] || [];
    displayHistory(history);
  });
}

// Display history items in the UI
function displayHistory(history) {
  clipboardHistoryList.innerHTML = '';
  history.forEach((item, index) => {
    const listItem = document.createElement('li');
    listItem.classList.add(item.pinned ? 'pinned' : '');
    listItem.dataset.index = index;

    const content = document.createElement('div');
    content.textContent = item.content.slice(0, 50) + '...'; // Show truncated content

    listItem.appendChild(content);
    clipboardHistoryList.appendChild(listItem);
  });
}

// Filter clipboard history based on search criteria
function filterHistory() {
  const searchText = searchInput.value.toLowerCase();
  const filterType = typeFilter.value;
  const fromDate = dateFrom.value ? new Date(dateFrom.value) : null;
  const toDate = dateTo.value ? new Date(dateTo.value) : null;

  chrome.storage.local.get([CLIPBOARD_HISTORY_KEY], (result) => {
    let history = result[CLIPBOARD_HISTORY_KEY] || [];

    // Filter by text search
    if (searchText) {
      history = history.filter(item => item.content.toLowerCase().includes(searchText));
    }

    // Filter by type (text/image)
    if (filterType && filterType !== 'all') {
      history = history.filter(item => item.type === `clipboard_${filterType}`);
    }

    // Filter by date range
    if (fromDate) {
      history = history.filter(item => new Date(item.timestamp) >= fromDate);
    }
    if (toDate) {
      history = history.filter(item => new Date(item.timestamp) <= toDate);
    }

    displayHistory(history);
  });
}

// Multi-select actions
function toggleSelected(item) {
  item.classList.toggle('selected');
  const selectedItems = document.querySelectorAll('.selected');
  deleteSelectedButton.disabled = selectedItems.length === 0;
  pinSelectedButton.disabled = selectedItems.length === 0;
}

// Handle deleting selected items
function deleteSelectedItems() {
  const selectedItems = document.querySelectorAll('.selected');
  const indicesToDelete = Array.from(selectedItems).map(item => item.dataset.index);
  
  chrome.storage.local.get([CLIPBOARD_HISTORY_KEY], (result) => {
    let history = result[CLIPBOARD_HISTORY_KEY] || [];
    history = history.filter((_, index) => !indicesToDelete.includes(index.toString()));
    chrome.storage.local.set({ [CLIPBOARD_HISTORY_KEY]: history });
    loadClipboardHistory(); // Reload after delete
  });
}

// Handle pinning selected items
function pinSelectedItems() {
  const selectedItems = document.querySelectorAll('.selected');
  const indicesToPin = Array.from(selectedItems).map(item => item.dataset.index);
  
  chrome.storage.local.get([CLIPBOARD_HISTORY_KEY], (result) => {
    let history = result[CLIPBOARD_HISTORY_KEY] || [];
    history.forEach((item, index) => {
      if (indicesToPin.includes(index.toString())) {
        item.pinned = true;
      }
    });
    chrome.storage.local.set({ [CLIPBOARD_HISTORY_KEY]: history });
    loadClipboardHistory(); // Reload after pinning
  });
}
