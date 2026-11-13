const root = document.documentElement;
const themeKey = "codex-theme";
const themeToggle = document.querySelector("[data-theme-toggle]");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

function getStoredTheme() {
  try {
    return localStorage.getItem(themeKey);
  } catch {
    return null;
  }
}

function effectiveTheme() {
  return root.dataset.theme || (prefersDark.matches ? "dark" : "light");
}

function updateThemeToggle() {
  if (!themeToggle) return;
  const isDark = effectiveTheme() === "dark";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "Schakel lichte modus" : "Schakel donkere modus");
}

function setTheme(theme) {
  root.dataset.theme = theme;
  try {
    localStorage.setItem(themeKey, theme);
  } catch {
    // localStorage is niet beschikbaar
  }
  updateThemeToggle();
}

updateThemeToggle();
themeToggle?.addEventListener("click", () => {
  setTheme(effectiveTheme() === "dark" ? "light" : "dark");
});

prefersDark.addEventListener?.("change", () => {
  if (!getStoredTheme()) updateThemeToggle();
});

const searchInput = document.querySelector("[data-song-search]");
const searchResults = document.querySelector("[data-search-results]");
const searchRoot = document.querySelector("[data-search]");

function normalize(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function collectSongs() {
  const headings = [...document.querySelectorAll("main h2, main h3")];
  let category = "";
  const songs = [];

  headings.forEach((heading) => {
    if (heading.tagName === "H2") {
      category = heading.textContent.trim();
      return;
    }

    if (heading.tagName === "H3" && heading.id) {
      songs.push({
        id: heading.id,
        title: heading.textContent.trim(),
        category,
        search: normalize(`${heading.textContent} ${category}`),
      });
    }
  });

  return songs;
}

let activeResult = -1;
let songs = [];

function resultLinks() {
  return [...searchResults.querySelectorAll(".search__result")];
}

function setActiveResult(index) {
  const links = resultLinks();
  if (!links.length) return;
  activeResult = (index + links.length) % links.length;
  links.forEach((link, linkIndex) => {
    const isActive = linkIndex === activeResult;
    link.classList.toggle("is-active", isActive);
    link.setAttribute("aria-selected", String(isActive));
  });
  searchInput?.setAttribute("aria-activedescendant", links[activeResult].id);
  links[activeResult].scrollIntoView({ block: "nearest" });
}

function hideResults() {
  if (!searchResults) return;
  searchResults.hidden = true;
  searchInput?.setAttribute("aria-expanded", "false");
  searchInput?.removeAttribute("aria-activedescendant");
  activeResult = -1;
}

function showResults() {
  if (!searchResults) return;
  searchResults.hidden = false;
  searchInput?.setAttribute("aria-expanded", "true");
}

function renderResults(matches) {
  if (!searchResults || !searchInput) return;
  searchResults.replaceChildren();
  searchInput.removeAttribute("aria-activedescendant");
  activeResult = -1;

  if (!searchInput.value.trim()) {
    hideResults();
    return;
  }

  if (!matches.length) {
    const empty = document.createElement("p");
    empty.className = "search__empty";
    empty.textContent = "Geen liedjes gevonden.";
    searchResults.append(empty);
    showResults();
    return;
  }

  matches.slice(0, 12).forEach((song) => {
    const link = document.createElement("a");
    const title = document.createElement("span");
    const category = document.createElement("small");

    link.className = "search__result";
    link.href = `#${song.id}`;
    link.id = `search-result-${song.id}`;
    link.setAttribute("role", "option");
    link.setAttribute("aria-selected", "false");
    title.textContent = song.title;
    category.textContent = song.category;
    link.append(title, category);
    link.addEventListener("click", hideResults);
    searchResults.append(link);
  });

  showResults();
}

if (searchInput && searchResults && searchRoot) {
  songs = collectSongs();

  searchInput.addEventListener("input", () => {
    const query = normalize(searchInput.value);
    const matches = query ? songs.filter((song) => song.search.includes(query)) : [];
    renderResults(matches);
  });

  searchInput.addEventListener("focus", () => {
    if (searchInput.value.trim()) {
      const query = normalize(searchInput.value);
      renderResults(songs.filter((song) => song.search.includes(query)));
    }
  });

  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveResult(activeResult + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveResult(activeResult - 1);
    } else if (event.key === "Enter" && activeResult >= 0) {
      event.preventDefault();
      resultLinks()[activeResult]?.click();
    } else if (event.key === "Escape") {
      hideResults();
      searchInput.blur();
    }
  });

  searchInput.addEventListener("blur", () => {
    window.setTimeout(() => {
      if (!searchRoot.contains(document.activeElement)) hideResults();
    }, 120);
  });

  document.addEventListener("pointerdown", (event) => {
    if (!searchRoot.contains(event.target)) hideResults();
  });

  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const isTyping =
      target instanceof HTMLElement &&
      (target.matches("input, textarea, select") || target.isContentEditable);

    if (event.key === "/" && !isTyping) {
      event.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
  });
}

function copyText(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }

  return new Promise((resolve, reject) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();

    try {
      document.execCommand("copy") ? resolve() : reject(new Error("Kopiëren mislukt"));
    } catch (error) {
      reject(error);
    } finally {
      textarea.remove();
    }
  });
}

let toastTimer;

function showToast(message) {
  const toast = document.querySelector("[data-toast]");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

const copyIcon = `
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M10 13a5 5 0 0 0 7.07 0l1.42-1.42a5 5 0 0 0-7.07-7.07L10 5.93" />
    <path d="M14 11a5 5 0 0 0-7.07 0L5.5 12.42a5 5 0 0 0 7.07 7.07L14 18.07" />
  </svg>
`;

document.querySelectorAll("main h3").forEach((heading) => {
  if (!heading.id) return;

  const title = heading.textContent.trim();
  const button = document.createElement("button");
  button.type = "button";
  button.className = "copy-link";
  button.innerHTML = copyIcon;
  button.setAttribute("aria-label", `Kopieer link naar ${title}`);
  button.title = "Kopieer link";

  button.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const url = new URL(`#${heading.id}`, window.location.href).href;

    try {
      await copyText(url);
      showToast("Link gekopieerd");
      button.classList.add("is-copied");
      button.setAttribute("aria-label", `Link naar ${title} gekopieerd`);
      window.setTimeout(() => {
        button.classList.remove("is-copied");
        button.setAttribute("aria-label", `Kopieer link naar ${title}`);
      }, 1600);
    } catch {
      showToast("Kopiëren is niet gelukt");
    }
  });

  heading.append(button);
});

const backToTop = document.querySelector("[data-back-to-top]");

if (backToTop) {
  const updateBackToTop = () => {
    backToTop.classList.toggle("is-visible", window.scrollY > 700);
  };

  updateBackToTop();
  window.addEventListener("scroll", updateBackToTop, { passive: true });

  backToTop.addEventListener("click", () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });
}
