# Clipboard History Chrome Extension

A Chrome extension that stores your clipboard history, allowing you to access and manage copied content. It supports both text and image data and provides useful features like dark mode, clipboard search, and export/import functionality.

## Features

- **Clipboard History**: Automatically stores copied text and images.
- **Dark Mode**: Switch between light and dark modes with a simple toggle.
- **Clear History**: Delete clipboard history with a button.
- **Search**: Filter clipboard history by content type (text/image) and date range.
- **Export/Import**: Export and import clipboard history to a file for backup or sharing.
- **Custom Labels**: Categorize clipboard entries with custom tags (e.g., "code", "notes").
- **Sensitive Content Filter**: Detect and warn before saving sensitive data like passwords.
- **Lock with Passcode**: Protect your clipboard history with a PIN.

## Installation

1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top right.
4. Click on **Load unpacked** and select the extension's folder.
5. The extension will be installed and ready to use!

## Usage

1. **Access Clipboard History**:
   - Click the extension icon in the Chrome toolbar to open the clipboard history popup.
   - The clipboard history will display both text and images.
   - Click on any item to view the full content.

2. **Enable/Disable Dark Mode**:
   - Toggle the dark mode switch in the extension popup to switch between light and dark themes.

3. **Clear History**:
   - Click the "Clear History" button to remove all saved clipboard history.

4. **Export/Import Clipboard Data**:
   - Use the options page to export your clipboard history to a `.json` file and import it later for backup or sharing.

5. **Filter Clipboard History**:
   - Use the search functionality to filter clipboard items by type (text or image) and by date range.

6. **Categorize Clipboard Entries**:
   - Add custom labels to organize your clipboard history (e.g., "code", "notes").

7. **Lock Clipboard History with Passcode**:
   - Set a PIN to protect your clipboard history and prevent unauthorized access.

## Options Page

1. **Dark Mode**: Toggle the dark mode theme for the extension's popup.
2. **View Style**: Choose between list view or grid view for displaying clipboard history items.
3. **Sensitive Content Filter**: Enable or disable the filter to prevent saving sensitive information like passwords.
4. **Passcode Lock**: Set a PIN to lock access to your clipboard history.
5. **Export/Import Clipboard Data**: Manage your clipboard history by exporting it to a file or importing it from one.

## Development

### Running the Extension Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/clipboard-history-extension.git
