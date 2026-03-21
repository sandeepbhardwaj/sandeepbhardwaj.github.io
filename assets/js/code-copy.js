document.addEventListener("DOMContentLoaded", function () {
  var FEEDBACK_MS = 1800;
  var blocks = document.querySelectorAll(".page__content div.highlighter-rouge");
  var LANGUAGE_LABELS = {
    bash: "Bash",
    console: "Console",
    html: "HTML",
    java: "Java",
    javascript: "JavaScript",
    json: "JSON",
    markdown: "Markdown",
    md: "Markdown",
    plaintext: "Plain text",
    shell: "Shell",
    sql: "SQL",
    text: "Example",
    xml: "XML",
    yaml: "YAML",
    yml: "YAML"
  };

  function inferLanguageLabel(block, code) {
    var classes = ((block.className || "") + " " + (code.className || "")).split(/\s+/);
    var language = "";

    Array.prototype.forEach.call(classes, function (className) {
      if (!language && className.indexOf("language-") === 0) {
        language = className.slice("language-".length).toLowerCase();
      }
    });

    if (!language) return "Code";
    if (LANGUAGE_LABELS[language]) return LANGUAGE_LABELS[language];

    return language
      .split(/[-_]/)
      .map(function (part) {
        return part ? part.charAt(0).toUpperCase() + part.slice(1) : "";
      })
      .join(" ");
  }

  function resetButton(button) {
    button.classList.remove("is-copied");
    button.textContent = "Copy";
  }

  function showFeedback(button, label) {
    if (button._copyResetTimer) {
      window.clearTimeout(button._copyResetTimer);
    }

    button.classList.add("is-copied");
    button.textContent = label;
    button._copyResetTimer = window.setTimeout(function () {
      resetButton(button);
      button._copyResetTimer = null;
    }, FEEDBACK_MS);
  }

  function copyWithFallback(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise(function (resolve, reject) {
      var textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";

      document.body.appendChild(textarea);
      textarea.select();

      try {
        document.execCommand("copy");
        resolve();
      } catch (error) {
        reject(error);
      } finally {
        document.body.removeChild(textarea);
      }
    });
  }

  Array.prototype.forEach.call(blocks, function (block) {
    if (block.dataset.copyEnabled === "true") return;

    var code = block.querySelector("pre code");
    if (!code || code.classList.contains("language-mermaid")) return;

    block.dataset.copyEnabled = "true";
    block.classList.add("code-copy-block");
    block.setAttribute("data-language", inferLanguageLabel(block, code));

    var button = document.createElement("button");
    button.type = "button";
    button.className = "code-copy-button";
    button.setAttribute("aria-label", "Copy code");
    button.textContent = "Copy";

    button.addEventListener("click", function () {
      var text = code.innerText.replace(/\n$/, "");

      copyWithFallback(text)
        .then(function () {
          showFeedback(button, "Copied");
        })
        .catch(function () {
          showFeedback(button, "Error");
        });
    });

    block.appendChild(button);
  });
});
