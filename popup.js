document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("clipboardContainer");
  const darkToggle = document.getElementById("darkModeToggle");
  const searchInput = document.getElementById("searchInput");
  const scrollToTopBtn = document.getElementById("scrollToTop");
  const listViewBtn = document.getElementById("listViewBtn");
  const gridViewBtn = document.getElementById("gridViewBtn");

  // Load clipboard history and dark mode preference
  chrome.storage.local.get(["clipboardHistory", "darkMode", "viewMode"], (result) => {
    const history = result.clipboardHistory || [];
    const isDark = result.darkMode ?? window.matchMedia("(prefers-color-scheme: dark)").matches;
    const view = result.viewMode || "list";

    document.body.classList.toggle("dark-mode", isDark);
    darkToggle.checked = isDark;
    container.className = view + "-view";
    renderClipboard(history);
  });

  // Dark mode toggle
  darkToggle.addEventListener("change", () => {
    const isEnabled = darkToggle.checked;
    chrome.storage.local.set({ darkMode: isEnabled });
    document.body.classList.toggle("dark-mode", isEnabled);
  });

  // View toggle
  listViewBtn.addEventListener("click", () => {
    container.className = "list-view";
    chrome.storage.local.set({ viewMode: "list" });
  });

  gridViewBtn.addEventListener("click", () => {
    container.className = "grid-view";
    chrome.storage.local.set({ viewMode: "grid" });
  });

  // Scroll to top button
  scrollToTopBtn.addEventListener("click", () => {
    container.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Search filtering
  searchInput.addEventListener("input", (e) => {
    const keyword = e.target.value.toLowerCase();
    chrome.storage.local.get("clipboardHistory", (data) => {
      const filtered = (data.clipboardHistory || []).filter(entry =>
        entry.type === "text"
          ? entry.content.toLowerCase().includes(keyword)
          : entry.type === "image"
          ? entry.content.toLowerCase().includes(keyword)
          : false
      );
      renderClipboard(filtered);
    });
  });

  function renderClipboard(history) {
    container.innerHTML = "";
    history.slice().reverse().forEach((entry, i) => {
      const div = document.createElement("div");
      div.className = "clipboard-item";
      if (entry.type === "text") {
        div.textContent = entry.content;
      } else if (entry.type === "image") {
        const img = document.createElement("img");
        img.src = entry.content;
        img.alt = "Copied Image";
        div.appendChild(img);
      }
      container.appendChild(div);
    });
  }
});
