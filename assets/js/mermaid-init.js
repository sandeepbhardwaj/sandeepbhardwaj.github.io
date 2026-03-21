document.addEventListener("DOMContentLoaded", async function () {
  var ICONS = {
    expand:
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<path d="M9 4H4v5h2V6h3V4zm9 0h-5v2h3v3h2V4zM6 15H4v5h5v-2H6v-3zm12 0h-2v3h-3v2h5v-5z" fill="currentColor"></path>' +
      "</svg>",
    fit:
      '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">' +
        '<path fill="currentColor" d="M1.75 2A1.75 1.75 0 0 1 3.5.25h9A1.75 1.75 0 0 1 14.25 2v12A1.75 1.75 0 0 1 12.5 15.75h-9A1.75 1.75 0 0 1 1.75 14V2Zm1.5 0a.25.25 0 0 0-.25.25v12c0 .138.112.25.25.25h9a.25.25 0 0 0 .25-.25V2a.25.25 0 0 0-.25-.25h-9ZM4 5.25A.75.75 0 0 1 4.75 4.5h6.5a.75.75 0 0 1 0 1.5h-6.5A.75.75 0 0 1 4 5.25Zm0 5.5A.75.75 0 0 1 4.75 10h6.5a.75.75 0 0 1 0 1.5h-6.5A.75.75 0 0 1 4 10.75Z"></path>' +
      "</svg>",
    actual:
      '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">' +
        '<path fill="currentColor" d="M1.75 1.5A.75.75 0 0 1 2.5.75h3a.75.75 0 0 1 0 1.5H3.25V4.5a.75.75 0 0 1-1.5 0v-3Zm8.75 0a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0V2.25H11.5a.75.75 0 0 1-.75-.75Zm4.5 10a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1 0-1.5h2.25V12.25a.75.75 0 0 1 .75-.75Zm-13.5 0a.75.75 0 0 1 .75.75v2.25H5.5a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75v-3a.75.75 0 0 1 .75-.75Z"></path>' +
      "</svg>",
    open:
      '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">' +
        '<path fill="currentColor" d="M3.75 3.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25V8a.75.75 0 0 1 1.5 0v4.25A1.75 1.75 0 0 1 12.25 14h-8.5A1.75 1.75 0 0 1 2 12.25v-8.5A1.75 1.75 0 0 1 3.75 2h4.5a.75.75 0 0 1 0 1.5h-4.5Zm5-1.75a.75.75 0 0 1 .75-.75h3.75c.414 0 .75.336.75.75V5.5a.75.75 0 0 1-1.5 0V3.56L8.78 7.28a.75.75 0 0 1-1.06-1.06L11.44 2.5H9.5a.75.75 0 0 1-.75-.75Z"></path>' +
      "</svg>",
    download:
      '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">' +
        '<path fill="currentColor" d="M8.75 1.5a.75.75 0 0 0-1.5 0v6.19L5.03 5.47a.75.75 0 1 0-1.06 1.06l3.5 3.5a.75.75 0 0 0 1.06 0l3.5-3.5a.75.75 0 0 0-1.06-1.06L8.75 7.69V1.5Z"></path><path fill="currentColor" d="M2.5 10.75a.75.75 0 0 1 .75.75v1c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-1a.75.75 0 0 1 1.5 0v1A1.75 1.75 0 0 1 12 14.25H3.5A1.75 1.75 0 0 1 1.75 12.5v-1a.75.75 0 0 1 .75-.75Z"></path>' +
      "</svg>",
    close:
      '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">' +
        '<path fill="currentColor" d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 1 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"></path>' +
      "</svg>"
  };
  var mermaidBlocks = Array.prototype.slice.call(
    document.querySelectorAll("pre code.language-mermaid")
  );
  var viewerState = {
    activeShell: null,
    objectUrl: null,
    openerButton: null,
    mode: "actual",
    dragging: false,
    dragPointerId: null,
    dragStartX: 0,
    dragStartY: 0,
    dragScrollLeft: 0,
    dragScrollTop: 0
  };
  var viewerDom = null;

  if (!mermaidBlocks.length) {
    return;
  }

  function siteFontFamily() {
    var fontFamily = window.getComputedStyle(document.body).fontFamily;
    return fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  }

  function cssVariable(name, fallback) {
    var value = window.getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return value || fallback;
  }

  function themeVariables() {
    return {
      background: cssVariable("--mermaid-bg", "#ffffff"),
      primaryColor: cssVariable("--mermaid-bg-strong", "#eff6ff"),
      primaryBorderColor: cssVariable("--mermaid-border", "#0284c7"),
      primaryTextColor: cssVariable("--mermaid-text", "#0f172a"),
      secondaryColor: cssVariable("--mermaid-bg", "#ffffff"),
      secondaryTextColor: cssVariable("--mermaid-text", "#0f172a"),
      tertiaryColor: cssVariable("--mermaid-bg-soft", "#f8fafc"),
      tertiaryBorderColor: cssVariable("--mermaid-border-soft", "#cbd5e1"),
      tertiaryTextColor: cssVariable("--mermaid-text", "#0f172a"),
      mainBkg: cssVariable("--mermaid-bg-strong", "#eff6ff"),
      secondBkg: cssVariable("--mermaid-bg", "#ffffff"),
      tertiaryBkg: cssVariable("--mermaid-bg-soft", "#f8fafc"),
      lineColor: cssVariable("--mermaid-line", "#2563eb"),
      defaultLinkColor: cssVariable("--mermaid-line", "#2563eb"),
      textColor: cssVariable("--mermaid-text-muted", "#334155"),
      nodeBorder: cssVariable("--mermaid-border", "#0284c7"),
      nodeTextColor: cssVariable("--mermaid-text", "#0f172a"),
      clusterBkg: cssVariable("--mermaid-bg-soft", "#f8fafc"),
      clusterBorder: cssVariable("--mermaid-border-soft", "#cbd5e1"),
      titleColor: cssVariable("--mermaid-text", "#0f172a"),
      edgeLabelBackground: cssVariable("--mermaid-label-bg", "#ffffff"),
      actorBkg: cssVariable("--mermaid-bg-strong", "#eff6ff"),
      actorBorder: cssVariable("--mermaid-border", "#0284c7"),
      actorTextColor: cssVariable("--mermaid-text", "#0f172a"),
      actorLineColor: cssVariable("--mermaid-border", "#0284c7"),
      signalColor: cssVariable("--mermaid-text-muted", "#334155"),
      signalTextColor: cssVariable("--mermaid-text-muted", "#334155"),
      labelBoxBkgColor: cssVariable("--mermaid-bg-strong", "#eff6ff"),
      labelBoxBorderColor: cssVariable("--mermaid-border", "#0284c7"),
      labelTextColor: cssVariable("--mermaid-text", "#0f172a"),
      loopTextColor: cssVariable("--mermaid-text", "#0f172a"),
      noteBkgColor: cssVariable("--mermaid-note-bg", "#fff7ed"),
      noteBorderColor: cssVariable("--mermaid-note-border", "#f59e0b"),
      noteTextColor: cssVariable("--mermaid-text", "#0f172a"),
      activationBorderColor: cssVariable("--mermaid-border-soft", "#cbd5e1"),
      activationBkgColor: cssVariable("--mermaid-bg-soft", "#f8fafc"),
      sequenceNumberColor: cssVariable("--mermaid-line", "#2563eb"),
      fontFamily: siteFontFamily(),
      fontSize: "15px"
    };
  }

  function themeCss() {
    return [
      ".node rect, .node circle, .node ellipse, .node polygon, .node path, .actor, .classBox, .label-container, .cluster rect, .note {",
      "  stroke-width: 1.6px;",
      "}",
      ".edgePath .path, .flowchart-link, .messageLine0, .messageLine1 {",
      "  stroke-width: 1.45px;",
      "}",
      ".node rect, .node circle, .node ellipse, .node polygon, .node path, .actor, .classBox, .label-container {",
      "  fill: " + cssVariable("--mermaid-bg-strong", "#eff6ff") + " !important;",
      "  stroke: " + cssVariable("--mermaid-border", "#0284c7") + " !important;",
      "}",
      ".cluster rect {",
      "  fill: " + cssVariable("--mermaid-bg-soft", "#f8fafc") + " !important;",
      "  stroke: " + cssVariable("--mermaid-border-soft", "#cbd5e1") + " !important;",
      "}",
      ".edgePath .path, .flowchart-link, .messageLine0, .messageLine1, .actor-line {",
      "  stroke: " + cssVariable("--mermaid-line", "#2563eb") + " !important;",
      "}",
      ".arrowheadPath, .arrowMarkerPath {",
      "  fill: " + cssVariable("--mermaid-line", "#2563eb") + " !important;",
      "  stroke: " + cssVariable("--mermaid-line", "#2563eb") + " !important;",
      "}",
      ".edgeLabel rect, .labelBox {",
      "  fill: " + cssVariable("--mermaid-label-bg", "#ffffff") + " !important;",
      "  stroke: " + cssVariable("--mermaid-border-soft", "#cbd5e1") + " !important;",
      "}",
      ".note {",
      "  fill: " + cssVariable("--mermaid-note-bg", "#fff7ed") + " !important;",
      "  stroke: " + cssVariable("--mermaid-note-border", "#f59e0b") + " !important;",
      "}",
      ".nodeLabel, .cluster-label, .edgeLabel text, .messageText, .labelText {",
      "  font-weight: 600;",
      "}"
    ].join("\n");
  }

  function buildConfig() {
    var fontFamily = siteFontFamily();

    return {
      startOnLoad: false,
      securityLevel: "loose",
      theme: "base",
      htmlLabels: true,
      fontFamily: fontFamily,
      themeVariables: themeVariables(),
      themeCSS: themeCss(),
      flowchart: {
        useMaxWidth: true,
        diagramPadding: 16,
        nodeSpacing: 58,
        rankSpacing: 70,
        wrappingWidth: 240,
        curve: "linear"
      },
      sequence: {
        useMaxWidth: true,
        wrap: true,
        mirrorActors: false,
        rightAngles: false,
        showSequenceNumbers: false,
        diagramMarginX: 24,
        diagramMarginY: 16,
        actorMargin: 68,
        messageMargin: 36,
        noteMargin: 16,
        actorFontFamily: fontFamily,
        actorFontSize: 15,
        actorFontWeight: 700,
        noteFontFamily: fontFamily,
        noteFontSize: 14,
        noteFontWeight: 600,
        messageFontFamily: fontFamily,
        messageFontSize: 15,
        messageFontWeight: 600
      }
    };
  }

  function revokeViewerUrl() {
    if (!viewerState.objectUrl) {
      return;
    }

    window.URL.revokeObjectURL(viewerState.objectUrl);
    viewerState.objectUrl = null;
  }

  function currentViewerFilename() {
    var index = viewerState.activeShell && viewerState.activeShell.getAttribute("data-mermaid-index");
    return "mermaid-diagram-" + (index || "export") + ".svg";
  }

  function setViewerMode(mode) {
    if (!viewerDom) {
      return;
    }

    stopViewerDrag();
    viewerState.mode = mode === "fit" ? "fit" : "actual";
    viewerDom.root.classList.toggle("is-fit-width", viewerState.mode === "fit");
    viewerDom.fitButton.setAttribute("aria-pressed", String(viewerState.mode === "fit"));
    viewerDom.actualButton.setAttribute("aria-pressed", String(viewerState.mode === "actual"));
    updateViewerPannableState();
  }

  function stopViewerDrag() {
    if (!viewerDom) {
      return;
    }

    if (viewerState.dragPointerId !== null) {
      try {
        viewerDom.stage.releasePointerCapture(viewerState.dragPointerId);
      } catch (_error) {
        // Ignore cases where the stage no longer owns the pointer capture.
      }
    }

    viewerState.dragging = false;
    viewerState.dragPointerId = null;
    viewerDom.root.classList.remove("is-dragging");
  }

  function canPanViewer() {
    if (!viewerDom || viewerState.mode !== "actual") {
      return false;
    }

    return (
      viewerDom.stage.scrollWidth > viewerDom.stage.clientWidth + 1 ||
      viewerDom.stage.scrollHeight > viewerDom.stage.clientHeight + 1
    );
  }

  function updateViewerPannableState() {
    if (!viewerDom) {
      return;
    }

    viewerDom.root.classList.toggle("is-pannable", canPanViewer());
  }

  function beginViewerDrag(event) {
    if (!canPanViewer()) {
      return;
    }

    if (typeof event.button === "number" && event.button !== 0) {
      return;
    }

    viewerState.dragging = true;
    viewerState.dragPointerId = event.pointerId;
    viewerState.dragStartX = event.clientX;
    viewerState.dragStartY = event.clientY;
    viewerState.dragScrollLeft = viewerDom.stage.scrollLeft;
    viewerState.dragScrollTop = viewerDom.stage.scrollTop;

    viewerDom.root.classList.add("is-dragging");

    if (typeof viewerDom.stage.setPointerCapture === "function") {
      viewerDom.stage.setPointerCapture(event.pointerId);
    }

    event.preventDefault();
  }

  function moveViewerDrag(event) {
    if (!viewerState.dragging || event.pointerId !== viewerState.dragPointerId) {
      return;
    }

    viewerDom.stage.scrollLeft = viewerState.dragScrollLeft - (event.clientX - viewerState.dragStartX);
    viewerDom.stage.scrollTop = viewerState.dragScrollTop - (event.clientY - viewerState.dragStartY);
    event.preventDefault();
  }

  function endViewerDrag(event) {
    if (!viewerState.dragging) {
      return;
    }

    if (event && event.pointerId !== viewerState.dragPointerId) {
      return;
    }

    stopViewerDrag();
  }

  function openViewerInNewTab() {
    if (!viewerState.objectUrl) {
      return;
    }

    window.open(viewerState.objectUrl, "_blank", "noopener,noreferrer");
  }

  function downloadViewerDiagram() {
    if (!viewerState.objectUrl) {
      return;
    }

    var link = document.createElement("a");
    link.href = viewerState.objectUrl;
    link.download = currentViewerFilename();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function closeViewer() {
    if (!viewerDom) {
      return;
    }

    var openerButton = viewerState.openerButton;

    stopViewerDrag();
    viewerDom.root.hidden = true;
    viewerDom.stage.innerHTML = "";
    viewerDom.root.classList.remove("is-pannable");
    document.body.classList.remove("mermaid-viewer-open");
    viewerState.activeShell = null;
    viewerState.openerButton = null;
    revokeViewerUrl();

    if (openerButton && typeof openerButton.focus === "function") {
      openerButton.focus();
    }
  }

  function ensureViewer() {
    if (viewerDom) {
      return viewerDom;
    }

    var root = document.createElement("div");
    root.className = "mermaid-viewer";
    root.hidden = true;
    root.innerHTML =
      '<div class="mermaid-viewer__dialog" role="dialog" aria-modal="true" aria-labelledby="mermaid-viewer-title">' +
        '<div class="mermaid-viewer__header">' +
          '<div class="mermaid-viewer__header-copy">' +
            '<h3 id="mermaid-viewer-title" class="mermaid-viewer__title">Diagram viewer</h3>' +
            '<p class="mermaid-viewer__hint">Switch between fit width and actual size, then drag to pan large diagrams.</p>' +
          "</div>" +
          '<div class="mermaid-viewer__controls">' +
            '<button type="button" class="mermaid-viewer__icon-button" data-action="fit" aria-pressed="false" aria-label="Fit width" title="Fit width">' + ICONS.fit + '<span class="sr-only">Fit width</span></button>' +
            '<button type="button" class="mermaid-viewer__icon-button" data-action="actual" aria-pressed="true" aria-label="Actual size" title="Actual size">' + ICONS.actual + '<span class="sr-only">Actual size</span></button>' +
            '<button type="button" class="mermaid-viewer__icon-button" data-action="open" aria-label="Open image in new tab" title="Open in new tab">' + ICONS.open + '<span class="sr-only">Open in new tab</span></button>' +
            '<button type="button" class="mermaid-viewer__icon-button" data-action="download" aria-label="Download SVG" title="Download SVG">' + ICONS.download + '<span class="sr-only">Download SVG</span></button>' +
            '<button type="button" class="mermaid-viewer__icon-button mermaid-viewer__icon-button--close" data-action="close" aria-label="Close viewer" title="Close">' + ICONS.close + '<span class="sr-only">Close</span></button>' +
          "</div>" +
        "</div>" +
          '<div class="mermaid-viewer__body">' +
          '<div class="mermaid-viewer__stage"></div>' +
        "</div>" +
      "</div>";

    document.body.appendChild(root);

    viewerDom = {
      root: root,
      title: root.querySelector("#mermaid-viewer-title"),
      stage: root.querySelector(".mermaid-viewer__stage"),
      fitButton: root.querySelector('[data-action="fit"]'),
      actualButton: root.querySelector('[data-action="actual"]'),
      openButton: root.querySelector('[data-action="open"]'),
      downloadButton: root.querySelector('[data-action="download"]'),
      closeButton: root.querySelector('[data-action="close"]')
    };

    viewerDom.fitButton.addEventListener("click", function () {
      setViewerMode("fit");
    });

    viewerDom.actualButton.addEventListener("click", function () {
      setViewerMode("actual");
    });

    viewerDom.openButton.addEventListener("click", openViewerInNewTab);
    viewerDom.downloadButton.addEventListener("click", downloadViewerDiagram);
    viewerDom.closeButton.addEventListener("click", closeViewer);
    viewerDom.stage.addEventListener("pointerdown", beginViewerDrag);
    viewerDom.stage.addEventListener("pointermove", moveViewerDrag);
    viewerDom.stage.addEventListener("pointerup", endViewerDrag);
    viewerDom.stage.addEventListener("pointercancel", endViewerDrag);
    viewerDom.stage.addEventListener("lostpointercapture", stopViewerDrag);

    root.addEventListener("click", function (event) {
      if (event.target === root) {
        closeViewer();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && viewerDom && !viewerDom.root.hidden) {
        closeViewer();
      }
    });

    return viewerDom;
  }

  function refreshViewerDiagram() {
    if (!viewerState.activeShell) {
      return;
    }

    ensureViewer();

    var svg = viewerState.activeShell.querySelector(".mermaid-diagram svg");
    if (!svg) {
      return;
    }

    revokeViewerUrl();

    var serializer = new XMLSerializer();
    var svgMarkup = serializer.serializeToString(svg);
    var blob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
    var image = document.createElement("img");
    var index = viewerState.activeShell.getAttribute("data-mermaid-index") || "";

    viewerState.objectUrl = window.URL.createObjectURL(blob);
    image.className = "mermaid-viewer__image";
    image.alt = "Expanded Mermaid diagram";
    image.src = viewerState.objectUrl;
    image.draggable = false;
    image.decoding = "async";

    viewerDom.title.textContent = index ? "Diagram " + index : "Diagram viewer";
    viewerDom.stage.innerHTML = "";
    viewerDom.stage.appendChild(image);
    viewerDom.stage.scrollLeft = 0;
    viewerDom.stage.scrollTop = 0;
    image.addEventListener("load", updateViewerPannableState, { once: true });
    window.requestAnimationFrame(updateViewerPannableState);
  }

  function openViewer(shell, openerButton) {
    ensureViewer();

    viewerState.activeShell = shell;
    viewerState.openerButton = openerButton || null;
    setViewerMode("actual");
    refreshViewerDiagram();

    viewerDom.root.hidden = false;
    document.body.classList.add("mermaid-viewer-open");
    viewerDom.closeButton.focus();
  }

  function mountMermaidBlocks() {
    mermaidBlocks.forEach(function (codeBlock, index) {
      var pre = codeBlock.parentElement;
      if (!pre || !pre.parentNode) {
        return;
      }

      var shell = document.createElement("div");
      var actions = document.createElement("div");
      var button = document.createElement("button");
      var wrapper = document.createElement("div");
      var source = codeBlock.textContent;

      shell.className = "mermaid-shell";
      shell.setAttribute("data-mermaid-index", String(index + 1));

      actions.className = "mermaid-shell__actions";

      button.type = "button";
      button.className = "mermaid-viewer-button";
      button.setAttribute("aria-label", "View diagram larger");
      button.setAttribute("title", "View larger");
      button.innerHTML = ICONS.expand;
      button.addEventListener("click", function () {
        openViewer(shell, button);
      });

      wrapper.className = "mermaid mermaid-diagram";
      wrapper.id = "mermaid-diagram-" + index;
      wrapper.setAttribute("data-mermaid-source", source);
      wrapper.textContent = source;

      actions.appendChild(button);
      shell.appendChild(actions);
      shell.appendChild(wrapper);

      pre.parentNode.replaceChild(shell, pre);
    });
  }

  function resetDiagramNodes() {
    document.querySelectorAll(".mermaid-diagram").forEach(function (diagram) {
      var source = diagram.getAttribute("data-mermaid-source") || "";
      diagram.removeAttribute("data-processed");
      diagram.textContent = source;
    });
  }

  async function renderDiagrams(mermaid) {
    mermaid.initialize(buildConfig());
    resetDiagramNodes();

    await mermaid.run({
      querySelector: ".mermaid-diagram"
    });

    refreshViewerDiagram();
  }

  try {
    mountMermaidBlocks();

    var mermaidModule = await import("https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs");
    var mermaid = mermaidModule.default;
    var renderQueue = Promise.resolve();

    function queueRender() {
      renderQueue = renderQueue
        .then(function () {
          return renderDiagrams(mermaid);
        })
        .catch(function (error) {
          console.error("Mermaid failed to render", error);
        });
    }

    queueRender();

    window.addEventListener("site-theme-change", function (_event) {
      window.requestAnimationFrame(function () {
        queueRender();
      });
    });
  } catch (error) {
    console.error("Mermaid failed to load", error);
  }
});
