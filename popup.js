const copyBtn = document.getElementById("copyBtn");
const copyPack = document.getElementById("copyPack");
const status = document.getElementById("status");

function isArtifactsUrl(url) {
  try {
    if ((url.includes("https://jumbo-cf-dev.integrationsuite.cfapps.eu10.hana.ondemand.com") || url.includes("https://jumbo-cf-dev.it-cpi001.cfapps.eu10.hana.ondemand.com")) && url.includes("section=ARTIFACTS")) return true;
     return false;
  } catch {
    return false;
  }
}

chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  if (!tab || !isArtifactsUrl(tab.url)) {
    copyBtn.disabled = true;
    copyPack.disabled = true;
    status.textContent = "Not on a Package Artifacts screen.";
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
          status.textContent = "No selected Artifacts.";
          return;
        }

        if (response.draft){
          status.textContent = "Error: You have selected Drafts, that is not allowed.";
          status.classList.add("error");
          return;
        }

        navigator.clipboard.writeText(ids.join(","));
        status.textContent = `Copied ${ids.length} ID(s).`;
      }
    );
  });

  copyPack.addEventListener("click", () => {
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

        const vPackageId = response?.packageId;

        navigator.clipboard.writeText(vPackageId);
        status.textContent = `Copied Package ID.`;
      }
    );
  });
});
