document.addEventListener("DOMContentLoaded", async function () {
  var mermaidBlocks = document.querySelectorAll("pre code.language-mermaid");
  if (!mermaidBlocks.length) {
    return;
  }

  try {
    var mermaidModule = await import("https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs");
    var mermaid = mermaidModule.default;

    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      theme: document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "default"
    });

    mermaidBlocks.forEach(function (codeBlock, index) {
      var pre = codeBlock.parentElement;
      var wrapper = document.createElement("div");
      wrapper.className = "mermaid";
      wrapper.textContent = codeBlock.textContent;
      wrapper.id = "mermaid-diagram-" + index;
      pre.parentNode.replaceChild(wrapper, pre);
    });

    await mermaid.run({
      querySelector: ".mermaid"
    });
  } catch (error) {
    console.error("Mermaid failed to load", error);
  }
});
