document.addEventListener("DOMContentLoaded", function () {
  var FEEDBACK_MS = 1800;
  var blocks = document.querySelectorAll(".page__content div.highlighter-rouge");

  function resetButton(button) {
    button.classList.remove("is-copied");
    button.classList.remove("is-error");
    button.setAttribute("data-feedback", "");
    button.setAttribute("aria-label", "Copy code");
    button.setAttribute("title", "Copy code");
  }

  function showFeedback(button, state, label) {
    if (button._copyResetTimer) {
      window.clearTimeout(button._copyResetTimer);
    }

    button.classList.toggle("is-copied", state === "copied");
    button.classList.toggle("is-error", state === "error");
    button.setAttribute("data-feedback", label);
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);
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

    var button = document.createElement("button");
    button.type = "button";
    button.className = "code-copy-button";
    button.setAttribute("data-feedback", "");
    button.setAttribute("aria-label", "Copy code");
    button.setAttribute("title", "Copy code");

    button.addEventListener("click", function () {
      var text = code.innerText.replace(/\n$/, "");

      copyWithFallback(text)
        .then(function () {
          showFeedback(button, "copied", "Copied");
        })
        .catch(function () {
          showFeedback(button, "error", "Copy failed");
        });
    });

    block.appendChild(button);
  });
});
