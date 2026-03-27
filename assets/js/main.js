(function () {
  "use strict";

  var siteBaseUrl = window.__SITE_BASEURL || "";
  var searchIndex = null;
  var searchPending = null;
  var searchState = {
    lastTrigger: null
  };

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

  function isFocusable(element) {
    if (!element || typeof element.matches !== "function") return false;
    if (element.hidden || element.getAttribute("aria-hidden") === "true") return false;
    if (element.hasAttribute("disabled") || element.getAttribute("tabindex") === "-1") return false;
    return true;
  }

  function focusableElements(root) {
    return queryAll(
      'a[href], button, input, select, textarea, summary, [tabindex]:not([tabindex="-1"])',
      root
    ).filter(isFocusable);
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
    var tocAside = tocRoot ? tocRoot.closest(".page-shell__toc") : null;
    var pageShell = tocRoot ? tocRoot.closest(".page-shell") : null;

    if (!tocRoot || !tocList || !contentRoot) return;

    var headings = collectArticleHeadings(contentRoot);

    if (!headings.length) {
      tocRoot.hidden = true;
      if (tocAside) {
        tocAside.hidden = true;
      }
      if (pageShell) {
        pageShell.classList.remove("page-shell--with-toc");
      }
      return;
    }

    if (tocAside) {
      tocAside.hidden = false;
    }
    if (pageShell) {
      pageShell.classList.add("page-shell--with-toc");
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
        tocProgressBar.style.transform = "scaleX(" + progress + ")";
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
      .then(function (response) {
        if (!response.ok) {
          throw new Error("search index request failed");
        }
        return response.json();
      })
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
          '<h3 class="search-result__title"><a href="' + escapeHtml(documentEntry.relative_url || "#") + '">' + escapeHtml(documentEntry.title) + "</a></h3>" +
          '<p class="search-result__meta">' + escapeHtml(meta.join(" · ")) + "</p>" +
          '<p class="search-result__excerpt">' + escapeHtml(summary) + "</p>" +
        "</article>"
      );
    }).join("");
  }

  function initSearch() {
    var panel = document.querySelector("[data-search-panel]");
    var dialog = document.querySelector("[data-search-dialog]");
    var input = document.querySelector("[data-search-input]");
    var results = document.querySelector("[data-search-results]");
    var status = document.querySelector("[data-search-status]");

    if (!panel || !dialog || !input || !results || !status) return;

    function setBackgroundInteractivity(disabled) {
      Array.prototype.forEach.call(document.body.children, function (child) {
        if (child === panel || child.tagName === "SCRIPT") return;

        if (disabled) {
          child.dataset.searchManaged = "true";
          child.dataset.searchPrevAriaHidden = child.getAttribute("aria-hidden") || "";
          child.setAttribute("aria-hidden", "true");
          child.inert = true;
          return;
        }

        if (child.dataset.searchManaged !== "true") return;

        if (child.dataset.searchPrevAriaHidden) {
          child.setAttribute("aria-hidden", child.dataset.searchPrevAriaHidden);
        } else {
          child.removeAttribute("aria-hidden");
        }

        child.inert = false;
        delete child.dataset.searchManaged;
        delete child.dataset.searchPrevAriaHidden;
      });
    }

    function openSearch(opener) {
      if (!panel.hidden) return;

      searchState.lastTrigger = opener || document.activeElement;
      panel.hidden = false;
      panel.setAttribute("aria-hidden", "false");
      document.body.classList.add("search-open");
      setBackgroundInteractivity(true);
      window.setTimeout(function () {
        input.focus();
        input.select();
      }, 0);

      fetchSearchIndex().catch(function () {
        status.textContent = "Search index failed to load.";
      });
    }

    function closeSearch() {
      if (panel.hidden) return;

      panel.hidden = true;
      panel.setAttribute("aria-hidden", "true");
      document.body.classList.remove("search-open");
      setBackgroundInteractivity(false);

      if (searchState.lastTrigger && typeof searchState.lastTrigger.focus === "function") {
        searchState.lastTrigger.focus();
      }
    }

    queryAll("[data-search-open]").forEach(function (button) {
      button.addEventListener("click", function () {
        openSearch(button);
      });
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
        return;
      }

      if (event.key === "Tab" && !panel.hidden) {
        var focusables = focusableElements(dialog);
        if (!focusables.length) {
          event.preventDefault();
          dialog.focus();
          return;
        }

        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        var active = document.activeElement;

        if (event.shiftKey && (active === first || !dialog.contains(active))) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
      }

      if (event.key === "/" && panel.hidden) {
        var targetTag = event.target && event.target.tagName ? event.target.tagName.toLowerCase() : "";
        var isTypingContext = /input|textarea|select/.test(targetTag) || (event.target && event.target.isContentEditable);
        if (!isTypingContext) {
          event.preventDefault();
          openSearch(document.activeElement);
        }
      }
    });
  }

  function initTaxonomyAccordions() {
    var accordionSections = queryAll(".taxonomy__sections--accordion .taxonomy__section");
    if (!accordionSections.length) return;
    var indexLinks = queryAll(".taxonomy__index-link");
    var filterInput = document.querySelector("[data-taxonomy-filter]");
    var noMatch = document.querySelector("[data-taxonomy-no-match]");
    var sectionsById = {};

    accordionSections.forEach(function (section) {
      sectionsById[section.id] = section;
    });

    function setActiveLink(activeId) {
      indexLinks.forEach(function (link) {
        var targetId = (link.getAttribute("href") || "").replace(/^.*#/, "");
        link.classList.toggle("is-active", targetId === activeId);
      });
    }

    function openOnly(targetId) {
      if (!sectionsById[targetId]) return;

      accordionSections.forEach(function (section) {
        section.open = section.id === targetId;
      });

      setActiveLink(targetId);
    }

    function openSectionFromHash() {
      var hash = window.location.hash ? window.location.hash.slice(1) : "";
      if (!hash) {
        if (accordionSections.length) {
          openOnly(accordionSections[0].id);
        }
        return;
      }

      var decodedHash = decodeURIComponent(hash);
      if (sectionsById[decodedHash]) {
        openOnly(decodedHash);
      }
    }

    indexLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        window.setTimeout(function () {
          openSectionFromHash();
        }, 0);
      });
    });

    accordionSections.forEach(function (section) {
      section.addEventListener("toggle", function () {
        if (!section.open) return;

        accordionSections.forEach(function (otherSection) {
          if (otherSection !== section) {
            otherSection.open = false;
          }
        });

        setActiveLink(section.id);
      });
    });

    if (filterInput) {
      filterInput.addEventListener("input", function () {
        var query = String(filterInput.value || "").trim().toLowerCase();
        var visibleCount = 0;
        var firstVisibleId = "";

        indexLinks.forEach(function (link) {
          var labelNode = link.querySelector(".taxonomy__label");
          var label = labelNode ? labelNode.textContent.trim().toLowerCase() : "";
          var targetId = (link.getAttribute("href") || "").replace(/^.*#/, "");
          var isVisible = !query || label.indexOf(query) !== -1;
          var item = link.closest(".taxonomy__index-item");
          var section = sectionsById[targetId];

          if (item) {
            item.hidden = !isVisible;
          }
          if (section) {
            section.hidden = !isVisible;
          }
          if (isVisible) {
            visibleCount += 1;
            if (!firstVisibleId) {
              firstVisibleId = targetId;
            }
          }
        });

        if (noMatch) {
          noMatch.hidden = visibleCount !== 0;
        }

        if (!query) {
          openSectionFromHash();
        } else if (firstVisibleId) {
          openOnly(firstVisibleId);
        }
      });
    }

    window.addEventListener("hashchange", openSectionFromHash);
    openSectionFromHash();
  }

  onReady(function () {
    initNav();
    initCopyLinkButtons();
    buildToc();
    initHeadingAnchors();
    initReadingProgress();
    initSearch();
    initTaxonomyAccordions();
  });
})();
