const FILTER_GROUPS = [
  {
    label: "期間",
    filters: [
      { id: "hour", label: "1時間以内", sp: "EgIIAQ%3D%3D", deprecated: true },
      { id: "today", label: "今日", sp: "EgIIAg%3D%3D" },
      { id: "this_week", label: "今週", sp: "EgIIAw%3D%3D" },
      { id: "this_month", label: "今月", sp: "EgIIBA%3D%3D" },
      { id: "this_year", label: "今年", sp: "EgIIBQ%3D%3D" },
    ],
  },
  {
    label: "並び替え",
    filters: [
      { id: "sort_relevance", label: "関連度順", sp: "CAASAhAB" },
      { id: "sort_views", label: "人気順", sp: "CAMSAhAB" },
      { id: "sort_rating", label: "評価順", sp: "CAESAhAB", deprecated: true },
    ],
  },
];

function buildFilterUrl(sp) {
  const url = new URL(window.location.href);
  url.searchParams.set("sp", sp);
  return url.toString();
}

function createFilterButtons() {
  if (document.getElementById("ytfb-container")) return;

  const container = document.createElement("div");
  container.id = "ytfb-container";

  for (const group of FILTER_GROUPS) {
    const groupEl = document.createElement("div");
    groupEl.className = "ytfb-group";

    const labelEl = document.createElement("span");
    labelEl.className = "ytfb-group-label";
    labelEl.textContent = group.label;
    groupEl.appendChild(labelEl);

    for (const filter of group.filters) {
      const btn = document.createElement("a");
      btn.className = filter.deprecated
        ? "ytfb-btn ytfb-btn--deprecated"
        : "ytfb-btn";
      btn.textContent = filter.deprecated
        ? `[実験] ${filter.label}`
        : filter.label;
      if (filter.deprecated) {
        btn.title = "YouTube UIから削除済み。動作しない可能性があります";
      }
      btn.href = buildFilterUrl(filter.sp);
      groupEl.appendChild(btn);
    }

    container.appendChild(groupEl);
  }

  return container;
}

function insertButtons() {
  if (!window.location.pathname.startsWith("/results")) return;
  if (document.getElementById("ytfb-container")) return;

  const chipBar = document.querySelector(
    "ytd-search-header-renderer, #chip-bar"
  );
  if (chipBar) {
    const container = createFilterButtons();
    if (container) {
      chipBar.parentElement.insertBefore(container, chipBar.nextSibling);
    }
    return;
  }

  const header = document.querySelector("ytd-section-list-renderer");
  if (header) {
    const container = createFilterButtons();
    if (container) {
      header.parentElement.insertBefore(container, header);
    }
  }
}

function init() {
  const observer = new MutationObserver(insertButtons);
  observer.observe(document.body, { childList: true, subtree: true });
  insertButtons();
}

init();
