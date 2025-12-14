(() => {
  function pickId(obj) {
    return (
      obj?.Name ||
      null
    );
  }

  function collectIds() {
    if (!window.sap?.ui?.getCore) {
      return { ids: [], error: "SAPUI5 not ready" };
    }

    const ids = [];
    const checked = document.querySelectorAll('input[type="checkbox"]:checked');

    for (const cb of checked) {
      const el = sap.ui.core.Element.closestTo(cb);
      let cur = el;

      while (cur) {
        const ctx = cur.getBindingContext?.();
        const obj = ctx?.getObject?.();
        const id = pickId(obj);
        if (id) {
          ids.push(String(id));
          break;
        }
        cur = cur.getParent?.();
      }
    }

    return { ids: [...new Set(ids)], error: null };
  }

  window.addEventListener("message", (event) => {
    if (event.data?.type !== "CPI_IFLOW_IDS_REQUEST") return;
    const result = collectIds();
    window.postMessage(
      { type: "CPI_IFLOW_IDS_RESULT", ...result },
      "*"
    );
  });
})();
