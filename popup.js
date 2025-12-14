const copyBtn = document.getElementById("copyBtn");
const status = document.getElementById("status");

function isArtifactsUrl(url) {
  try {
    if (url.includes("https://jumbo-cf-dev.integrationsuite.cfapps.eu10.hana.ondemand.com") && url.includes("section=ARTIFACTS")) return true;
     return false;
  } catch {
    return false;
  }
}

chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  if (!tab || !isArtifactsUrl(tab.url)) {
    copyBtn.disabled = true;
    status.textContent = "Not on CPI Artifacts screen.";
    return;
  }

  copyBtn.addEventListener("click", () => {
    chrome.tabs.sendMessage(
      tab.id,
      { type: "CPI_IFLOW_IDS_REQUEST" },
      (response) => {
        if (chrome.runtime.lastError) {
          status.textContent = "Content script not available.";
          return;
        }

        if (response?.error) {
          status.textContent = response.error;
          return;
        }

        const ids = response?.ids || [];
        if (!ids.length) {
          status.textContent = "No selected iFlows.";
          return;
        }

        navigator.clipboard.writeText(ids.join(","));
        status.textContent = `Copied ${ids.length} iFlow ID(s).`;
      }
    );
  });
});
