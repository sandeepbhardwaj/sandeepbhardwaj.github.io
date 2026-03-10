document.addEventListener("DOMContentLoaded", function () {
  var COPY_ICON = '<i class="far fa-copy" aria-hidden="true"></i>';
  var SUCCESS_ICON = '<i class="fas fa-check" aria-hidden="true"></i>';
  var ERROR_ICON = '<i class="fas fa-exclamation" aria-hidden="true"></i>';
  var FEEDBACK_MS = 1800;

  var blocks = document.querySelectorAll(".page__content div.highlighter-rouge");

  function resetButton(button) {
    button.classList.remove("is-copied");
    button.innerHTML = COPY_ICON;
  }

  function showFeedback(button, iconMarkup) {
    if (button._copyResetTimer) {
      window.clearTimeout(button._copyResetTimer);
    }

    button.classList.add("is-copied");
    button.innerHTML = iconMarkup;
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
    if (block.dataset.copyEnabled === "true") {
      return;
    }

    var code = block.querySelector("pre code");
    if (!code || code.classList.contains("language-mermaid")) {
      return;
    }

    block.dataset.copyEnabled = "true";
    block.classList.add("code-copy-block");

    var button = document.createElement("button");
    button.type = "button";
    button.className = "code-copy-button";
    button.setAttribute("aria-label", "Copy");
    button.setAttribute("title", "Copy");
    button.innerHTML = COPY_ICON;

    button.addEventListener("click", function () {
      var text = code.innerText.replace(/\n$/, "");

      copyWithFallback(text)
        .then(function () {
          showFeedback(button, SUCCESS_ICON);
        })
        .catch(function () {
          showFeedback(button, ERROR_ICON);
        });
    });

    block.appendChild(button);
  });
});
