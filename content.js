(() => {
  // Inject page.js into the MAIN world
  const s = document.createElement("script");
  s.src = chrome.runtime.getURL("page.js");
  s.onload = () => s.remove();
  (document.head || document.documentElement).appendChild(s);

  
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type !== "CPI_IFLOW_IDS_REQUEST") return;

    const handler = (event) => {
      if (event.source !== window) return;
      if (event.data?.type !== "CPI_IFLOW_IDS_RESULT") return;

      window.removeEventListener("message", handler);
      sendResponse(event.data);
    };

    window.addEventListener("message", handler);
    window.postMessage({ type: "CPI_IFLOW_IDS_REQUEST" }, "*");

    // async response
    return true;
  });
})();
