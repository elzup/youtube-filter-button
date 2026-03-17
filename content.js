const ALL_FILTERS = [
  { id: "today", label: "今日", sp: "EgIIAQ%3D%3D" },
  { id: "this_week", label: "今週", sp: "EgIIAg%3D%3D" },
  { id: "this_month", label: "今月", sp: "EgIIAw%3D%3D" },
  { id: "this_year", label: "今年", sp: "EgIIBA%3D%3D" },
];

const DEFAULT_FILTER_IDS = ["today", "this_week"];

function buildFilterUrl(sp) {
  const url = new URL(window.location.href);
  url.searchParams.set("sp", sp);
  return url.toString();
}

function createFilterButtons(filters) {
  if (document.getElementById("ytfb-container")) return;

  const container = document.createElement("div");
  container.id = "ytfb-container";

  for (const filter of filters) {
    const btn = document.createElement("a");
    btn.className = "ytfb-btn";
    btn.textContent = filter.label;
    btn.href = buildFilterUrl(filter.sp);
    container.appendChild(btn);
  }

  return container;
}

function insertButtons(filters) {
  if (!window.location.pathname.startsWith("/results")) return;
  if (document.getElementById("ytfb-container")) return;

  const chipBar = document.querySelector(
    "ytd-search-header-renderer, #chip-bar"
  );
  if (chipBar) {
    const container = createFilterButtons(filters);
    if (container) {
      chipBar.parentElement.insertBefore(container, chipBar.nextSibling);
    }
    return;
  }

  const header = document.querySelector("ytd-section-list-renderer");
  if (header) {
    const container = createFilterButtons(filters);
    if (container) {
      header.parentElement.insertBefore(container, header);
    }
  }
}

function getEnabledFilters(filterIds) {
  return ALL_FILTERS.filter((f) => filterIds.includes(f.id));
}

function init() {
  chrome.storage.sync.get({ filterIds: DEFAULT_FILTER_IDS }, (result) => {
    const filters = getEnabledFilters(result.filterIds);

    const tryInsert = () => insertButtons(filters);

    const observer = new MutationObserver(tryInsert);
    observer.observe(document.body, { childList: true, subtree: true });
    tryInsert();
  });
}

init();
