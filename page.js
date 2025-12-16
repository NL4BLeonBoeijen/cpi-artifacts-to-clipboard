(() => {
  function pickId(obj) {
    if (obj.Version === 'Draft'){
      throw new CustomError(obj.Name + " is in Draft version");
    }
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
    let drafts = false;

    for (const cb of checked) {
      const el = sap.ui.core.Element.closestTo(cb);
      let cur = el;

      while (cur) {
        const ctx = cur.getBindingContext?.();
        const obj = ctx?.getObject?.();
        try{
        const id = pickId(obj);
        if (id) {
          ids.push(String(id));
          break;
        }
      } catch (e){
        drafts = true;
      }
        cur = cur.getParent?.();
      }
    }

    let vPackageId = window.location.pathname.split("/").pop();

    return { ids: [...new Set(ids)], error: null, packageId: vPackageId, draft: drafts };
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
