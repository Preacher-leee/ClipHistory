// Load the saved options (dark mode, view style, etc.)
document.addEventListener('DOMContentLoaded', () => {
  // Load dark mode setting
  chrome.storage.local.get(['darkMode', 'viewStyle'], (result) => {
    if (result.darkMode) {
      document.body.classList.add('dark-mode');
      document.getElementById('darkModeToggle').checked = true;
    }
    if (result.viewStyle) {
      document.getElementById('viewStyleSelect').value = result.viewStyle;
    }
  });

  // Event listener for dark mode toggle
  document.getElementById('darkModeToggle').addEventListener('change', (event) => {
    const isDarkMode = event.target.checked;
    chrome.storage.local.set({ darkMode: isDarkMode }, () => {
      if (isDarkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    });
  });

  // Event listener for changing the view style (list/grid)
  document.getElementById('viewStyleSelect').addEventListener('change', (event) => {
    const viewStyle = event.target.value;
    chrome.storage.local.set({ viewStyle: viewStyle });
  });

  // Event listener for exporting clipboard history
  document.getElementById('exportBtn').addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'EXPORT_HISTORY' }, (response) => {
      const historyData = JSON.stringify(response, null, 2);
      const blob = new Blob([historyData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'clipboard_history.json';
      link.click();
      URL.revokeObjectURL(url);
    });
  });

  // Event listener for importing clipboard history
  document.getElementById('importBtn').addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.click();

    input.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function () {
          try {
            const importedHistory = JSON.parse(reader.result);
            chrome.runtime.sendMessage({ type: 'IMPORT_HISTORY', data: importedHistory });
            alert('Clipboard history imported successfully.');
          } catch (e) {
            alert('Invalid file format.');
          }
        };
        reader.readAsText(file);
      }
    });
  });
});
