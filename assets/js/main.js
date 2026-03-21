(function () {
  "use strict";

  var siteBaseUrl = window.__SITE_BASEURL || "";
  var searchIndex = null;
  var searchPending = null;

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  }

  function queryAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function truncate(value, limit) {
    if (!value || value.length <= limit) return value || "";
    return value.slice(0, limit - 1).trim() + "...";
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function currentHeaderOffset() {
    var header = document.querySelector(".site-header");
    if (!header) return 0;

    var headerStyle = window.getComputedStyle(header);
    return /sticky|fixed/.test(headerStyle.position) ? header.offsetHeight : 0;
  }

  function initNav() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var menu = document.querySelector("[data-nav-menu]");

    if (!toggle || !menu) return;

    function closeMenu() {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function () {
      var isOpen = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    queryAll("a", menu).forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", function (event) {
      if (!menu.classList.contains("is-open")) return;
      if (menu.contains(event.target) || toggle.contains(event.target)) return;
      closeMenu();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  function initCopyLinkButtons() {
    queryAll("[data-copy-link]").forEach(function (button) {
      button.addEventListener("click", function () {
        var originalLabel = button.textContent;
        var url = button.getAttribute("data-copy-link");
        var copyAction = navigator.clipboard && navigator.clipboard.writeText
          ? navigator.clipboard.writeText(url)
          : Promise.reject(new Error("clipboard unavailable"));

        copyAction
          .then(function () {
            button.textContent = "Copied";
            window.setTimeout(function () {
              button.textContent = originalLabel;
            }, 1800);
          })
          .catch(function () {
            button.textContent = "Copy failed";
            window.setTimeout(function () {
              button.textContent = originalLabel;
            }, 1800);
          });
      });
    });
  }

  function collectArticleHeadings(contentRoot) {
    if (!contentRoot) return [];

    return queryAll("h2[id], h3[id], h4[id]", contentRoot)
      .filter(function (heading) {
        return !heading.classList.contains("no_toc");
      })
      .map(function (heading) {
        var text = heading.getAttribute("data-toc-text") || heading.textContent.trim();
        heading.setAttribute("data-toc-text", text);

        return {
          id: heading.id,
          level: parseInt(heading.tagName.replace("H", ""), 10),
          node: heading,
          text: text
        };
      });
  }

  function buildToc() {
    var tocRoot = document.querySelector("[data-toc-container]");
    var tocList = document.querySelector("[data-toc-list]");
    var tocCount = tocRoot ? tocRoot.querySelector("[data-toc-count]") : null;
    var tocCurrent = tocRoot ? tocRoot.querySelector("[data-toc-current]") : null;
    var contentRoot = document.querySelector(".page__content");

    if (!tocRoot || !tocList || !contentRoot) return;

    var headings = collectArticleHeadings(contentRoot);

    if (!headings.length) {
      tocRoot.hidden = true;
      return;
    }

    if (tocCount) {
      tocCount.textContent = headings.length + " section" + (headings.length === 1 ? "" : "s");
    }

    tocList.innerHTML = headings.map(function (heading) {
      return (
        '<li class="page__toc-item page__toc-item--level-' + heading.level + '">' +
          '<a class="page__toc-link" href="#' + escapeHtml(heading.id) + '">' + escapeHtml(heading.text) + "</a>" +
        "</li>"
      );
    }).join("");

    var tocLinks = queryAll(".page__toc-link", tocRoot);
    var linksById = {};
    headings.forEach(function (heading, index) {
      linksById[heading.id] = tocLinks[index];
    });

    function setActiveHeading(activeId) {
      tocLinks.forEach(function (link) {
        link.classList.toggle("is-active", link.getAttribute("href") === "#" + activeId);
      });

      if (tocCurrent) {
        for (var i = 0; i < headings.length; i += 1) {
          if (headings[i].id === activeId) {
            tocCurrent.textContent = headings[i].text;
            break;
          }
        }
      }
    }

    function syncActiveHeading() {
      var offset = currentHeaderOffset() + 30;
      var activeId = headings[0].id;

      for (var i = 0; i < headings.length; i += 1) {
        if (headings[i].node.getBoundingClientRect().top <= offset) {
          activeId = headings[i].id;
        } else {
          break;
        }
      }

      setActiveHeading(activeId);
    }

    var ticking = false;
    function requestSync() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        syncActiveHeading();
        ticking = false;
      });
    }

    setActiveHeading(headings[0].id);
    requestSync();
    window.addEventListener("scroll", requestSync, { passive: true });
    window.addEventListener("resize", requestSync);
  }

  function initHeadingAnchors() {
    var contentRoot = document.querySelector(".page__content");
    if (!contentRoot) return;

    collectArticleHeadings(contentRoot).forEach(function (headingEntry) {
      var heading = headingEntry.node;
      if (heading.querySelector(".heading-anchor")) return;

      var anchor = document.createElement("a");
      anchor.className = "heading-anchor";
      anchor.href = "#" + headingEntry.id;
      anchor.setAttribute("aria-label", "Link to section " + headingEntry.text);
      anchor.textContent = "#";
      heading.appendChild(anchor);
    });
  }

  function initReadingProgress() {
    var contentRoot = document.querySelector(".page__content");
    var header = document.querySelector(".site-header");
    var progressShell = document.querySelector("[data-reading-progress]");
    var progressBar = document.querySelector("[data-reading-progress-bar]");
    var tocProgressBar = document.querySelector("[data-toc-progress-bar]");
    var tocProgressLabel = document.querySelector("[data-toc-progress-label]");
    var headerIsSticky = header && /sticky|fixed/.test(window.getComputedStyle(header).position);

    if (!contentRoot || (!progressBar && !tocProgressBar && !tocProgressLabel)) return;

    if (progressShell && headerIsSticky) {
      progressShell.hidden = false;
    }

    function syncProgress() {
      var headerOffset = currentHeaderOffset();
      var viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
      var contentTop = window.scrollY + contentRoot.getBoundingClientRect().top;
      var start = Math.max(contentTop - headerOffset - 24, 0);
      var end = Math.max(start + contentRoot.offsetHeight - viewportHeight * 0.45, start + 1);
      var progress = clamp((window.scrollY - start) / (end - start), 0, 1);
      var percentage = Math.round(progress * 100);

      if (progressBar) {
        progressBar.style.transform = "scaleX(" + progress + ")";
      }

      if (tocProgressBar) {
        tocProgressBar.style.transform = "scaleY(" + progress + ")";
      }

      if (tocProgressLabel) {
        tocProgressLabel.textContent = percentage + "% read";
      }
    }

    var ticking = false;
    function requestProgressSync() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        syncProgress();
        ticking = false;
      });
    }

    syncProgress();
    window.addEventListener("scroll", requestProgressSync, { passive: true });
    window.addEventListener("resize", requestProgressSync);
  }

  function fetchSearchIndex() {
    if (searchIndex) {
      return Promise.resolve(searchIndex);
    }

    if (searchPending) {
      return searchPending;
    }

    searchPending = fetch(siteBaseUrl + "/search.json")
      .then(function (response) { return response.json(); })
      .then(function (data) {
        searchIndex = data;
        return data;
      })
      .finally(function () {
        searchPending = null;
      });

    return searchPending;
  }

  function scoreDocument(documentEntry, tokens, query) {
    var haystack = [
      documentEntry.title,
      (documentEntry.categories || []).join(" "),
      (documentEntry.tags || []).join(" "),
      documentEntry.excerpt,
      documentEntry.content
    ].join(" ").toLowerCase();

    var title = (documentEntry.title || "").toLowerCase();
    var taxonomy = ((documentEntry.categories || []).join(" ") + " " + (documentEntry.tags || []).join(" ")).toLowerCase();
    var score = 0;

    for (var i = 0; i < tokens.length; i += 1) {
      var token = tokens[i];
      if (haystack.indexOf(token) === -1) return -1;
      if (title.indexOf(token) !== -1) score += 6;
      if (taxonomy.indexOf(token) !== -1) score += 3;
      if ((documentEntry.excerpt || "").toLowerCase().indexOf(token) !== -1) score += 2;
      if ((documentEntry.content || "").toLowerCase().indexOf(token) !== -1) score += 1;
    }

    if (title.indexOf(query) !== -1) score += 4;
    return score;
  }

  function renderSearchResults(resultsRoot, statusRoot, documents, rawQuery) {
    var query = rawQuery.trim().toLowerCase();

    if (!query) {
      statusRoot.textContent = "Start typing to search the site.";
      resultsRoot.innerHTML = "";
      return;
    }

    var tokens = query.split(/\s+/).filter(Boolean);
    var matches = documents
      .map(function (documentEntry) {
        return {
          documentEntry: documentEntry,
          score: scoreDocument(documentEntry, tokens, query)
        };
      })
      .filter(function (entry) { return entry.score >= 0; })
      .sort(function (left, right) { return right.score - left.score; })
      .slice(0, 12);

    if (!matches.length) {
      statusRoot.textContent = 'No results for "' + rawQuery + '".';
      resultsRoot.innerHTML = "";
      return;
    }

    statusRoot.textContent = matches.length + ' result' + (matches.length === 1 ? "" : "s") + ' for "' + rawQuery + '".';
    resultsRoot.innerHTML = matches.map(function (match) {
      var documentEntry = match.documentEntry;
      var summary = truncate(documentEntry.excerpt || documentEntry.content || "", 180);
      var type = documentEntry.type === "page" ? "Page" : "Post";
      var meta = [type];

      if (documentEntry.date) meta.push(documentEntry.date);
      if (documentEntry.categories && documentEntry.categories.length) meta.push(documentEntry.categories.join(", "));

      return (
        '<article class="search-result">' +
          '<h3 class="search-result__title"><a href="' + escapeHtml(documentEntry.relative_url || documentEntry.url) + '">' + escapeHtml(documentEntry.title) + "</a></h3>" +
          '<p class="search-result__meta">' + escapeHtml(meta.join(" · ")) + "</p>" +
          '<p class="search-result__excerpt">' + escapeHtml(summary) + "</p>" +
        "</article>"
      );
    }).join("");
  }

  function initSearch() {
    var panel = document.querySelector("[data-search-panel]");
    var input = document.querySelector("[data-search-input]");
    var results = document.querySelector("[data-search-results]");
    var status = document.querySelector("[data-search-status]");

    if (!panel || !input || !results || !status) return;

    function openSearch() {
      panel.hidden = false;
      document.body.classList.add("search-open");
      window.setTimeout(function () { input.focus(); }, 0);
      fetchSearchIndex().catch(function () {
        status.textContent = "Search index failed to load.";
      });
    }

    function closeSearch() {
      panel.hidden = true;
      document.body.classList.remove("search-open");
    }

    queryAll("[data-search-open]").forEach(function (button) {
      button.addEventListener("click", openSearch);
    });

    queryAll("[data-search-close]").forEach(function (button) {
      button.addEventListener("click", closeSearch);
    });

    input.addEventListener("input", function () {
      fetchSearchIndex()
        .then(function (documents) {
          renderSearchResults(results, status, documents, input.value);
        })
        .catch(function () {
          status.textContent = "Search index failed to load.";
        });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !panel.hidden) {
        closeSearch();
      }

      if (event.key === "/" && panel.hidden) {
        var targetTag = event.target && event.target.tagName ? event.target.tagName.toLowerCase() : "";
        var isTypingContext = /input|textarea|select/.test(targetTag) || (event.target && event.target.isContentEditable);
        if (!isTypingContext) {
          event.preventDefault();
          openSearch();
        }
      }
    });
  }

  onReady(function () {
    initNav();
    initCopyLinkButtons();
    buildToc();
    initHeadingAnchors();
    initReadingProgress();
    initSearch();
  });
})();
