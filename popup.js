// Define elements
const historyContainer = document.getElementById('historyContainer');
const clearButton = document.getElementById('clearHistory');
const searchInput = document.getElementById('searchInput');
const darkModeToggle = document.getElementById('darkModeToggle');

// Store dark mode state
let darkMode = false;

// Function to create a list item for clipboard history
function createHistoryItem(item, index) {
  const historyItem = document.createElement('div');
  historyItem.classList.add('history-item');
  
  // Add a 'pinned' class if the item is pinned
  if (item.pinned) {
    historyItem.classList.add('pinned');
  }

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('content');

  // Display text or image content
  if (item.contentType === 'text') {
    const textContent = document.createElement('div');
    textContent.classList.add('text-content');
    textContent.textContent = item.content;
    contentDiv.appendChild(textContent);
  } else if (item.contentType === 'image') {
    const imageContent = document.createElement('img');
    imageContent.classList.add('image-content');
    imageContent.src = item.content;
    contentDiv.appendChild(imageContent);
  }

  // Add a button to toggle pinning
  const pinButton = document.createElement('button');
  pinButton.classList.add('pin-button');
  pinButton.textContent = item.pinned ? 'Unpin' : 'Pin';
  pinButton.addEventListener('click', () => togglePin(index));

  // Add a delete button
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => deleteItem(index));

  // Append elements
  historyItem.appendChild(contentDiv);
  historyItem.appendChild(pinButton);
  historyItem.appendChild(deleteButton);

  return historyItem;
}

// Function to display clipboard history
function displayHistory(history) {
  historyContainer.innerHTML = ''; // Clear the current history
  history.forEach((item, index) => {
    const historyItem = createHistoryItem(item, index);
    historyContainer.appendChild(historyItem);
  });
}

// Function to load clipboard history from background.js
function loadHistory() {
  chrome.runtime.sendMessage({ type: 'GET_HISTORY' }, (response) => {
    const history = response.history || [];
    displayHistory(history);
  });
}

// Function to clear the clipboard history
clearButton.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'CLEAR_HISTORY' }, (response) => {
    displayHistory(response.history);
  });
});

// Function to toggle pinning/unpinning
function togglePin(index) {
  chrome.runtime.sendMessage({ type: 'PIN_ITEM', index: index }, (response) => {
    displayHistory(response.history);
  });
}

// Function to delete an item from clipboard history
function deleteItem(index) {
  const history = JSON.parse(localStorage.getItem('clipboardHistory')) || [];
  history.splice(index, 1);
  localStorage.setItem('clipboardHistory', JSON.stringify(history));
  displayHistory(history);
}

// Event listener for searching/filtering clipboard history
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  chrome.runtime.sendMessage({ type: 'GET_HISTORY' }, (response) => {
    const filteredHistory = response.history.filter(item => {
      const content = item.content.toLowerCase();
      return content.includes(query);
    });
    displayHistory(filteredHistory);
  });
});

// Toggle dark mode
darkModeToggle.addEventListener('click', () => {
  darkMode = !darkMode;
  document.body.classList.toggle('dark-mode', darkMode);
  localStorage.setItem('darkMode', darkMode); // Store dark mode preference
});

// Check if dark mode preference is stored
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
  darkMode = true;
}

// Initialize the extension by loading the clipboard history
loadHistory();
