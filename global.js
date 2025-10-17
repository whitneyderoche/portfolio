console.log('IT’S ALIVE!');

/* =========================
   CONFIG
========================= */
const REPO_NAME = "portfolio";
const PAGES = [
  { url: "",          title: "Home" },
  { url: "projects/", title: "Projects" },
  { url: "contact/",  title: "Contact" },
  { url: "resume/",   title: "Resume" },
  { url: "https://github.com/whitneyderoche", title: "GitHub" },
];

/* =========================
   HELPERS
========================= */
const normalize = (p) => p.replace(/\/index\.html$/, "/");
const IS_LOCAL = ["localhost", "127.0.0.1"].includes(location.hostname);
const BASE_PATH = IS_LOCAL ? "/" : `/${REPO_NAME}/`;
const hrefFor = (url) => (url.startsWith("http") ? url : BASE_PATH + url);

// Modern navigation type (Navigation Timing Level 2) + legacy fallback
const navEntry = performance.getEntriesByType?.("navigation")?.[0];
const NAV_TYPE =
  navEntry?.type ??
  (performance.navigation && performance.navigation.type === 1 ? "reload" : "navigate");

/* =========================
   NAV: build once on every page
========================= */
// Remove any legacy nav to avoid duplicates
document.querySelectorAll("nav").forEach((n) => n.remove());

// Build fresh nav
const nav = document.createElement("nav");
document.body.prepend(nav);

for (const { url, title } of PAGES) {
  const a = document.createElement("a");
  a.href = hrefFor(url);
  a.textContent = title;

  const abs = new URL(a.href, location.href);

  // Highlight current page
  a.classList.toggle(
    "current",
    abs.host === location.host &&
      normalize(abs.pathname) === normalize(location.pathname)
  );

  // External links → new tab (and safe)
  const isExternal = abs.host !== location.host;
  if (isExternal) {
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  }

  nav.append(a);
}

/* =========================
   THEME SWITCH (Steps 4.2–4.5)
   - Auto/Light/Dark
   - Persist within this tab (sessionStorage)
   - Reset to Auto on full reload
========================= */
const prefersDark = matchMedia("(prefers-color-scheme: dark)").matches;
const schemeLabel = document.createElement("label");
schemeLabel.className = "color-scheme";
schemeLabel.innerHTML = `
  Theme:
  <select aria-label="Color scheme">
    <option value="light dark">Automatic (${prefersDark ? "Dark" : "Light"})</option>
    <option value="light">Light</option>
    <option value="dark">Dark</option>
  </select>
`;
nav.after(schemeLabel);

const select = schemeLabel.querySelector("select");

// helpers for applying + persisting scheme (sessionStorage = per-tab)
const setColorScheme = (scheme) => {
  document.documentElement.style.setProperty("color-scheme", scheme);
};
const saveScheme = (scheme) => {
  // Only store explicit Light/Dark; Auto clears storage so new tabs start in Auto
  if (scheme === "light dark") sessionStorage.removeItem("colorScheme");
  else sessionStorage.setItem("colorScheme", scheme);
};
const loadScheme = () => sessionStorage.getItem("colorScheme");

// Keep “Automatic (Light/Dark)” label accurate if OS flips while Auto selected
const media = matchMedia("(prefers-color-scheme: dark)");
const updateAutoLabel = () => {
  const opt = select.querySelector('option[value="light dark"]');
  if (opt) opt.textContent = `Automatic (${media.matches ? "Dark" : "Light"})`;
};
updateAutoLabel();
media.addEventListener?.("change", () => {
  if (select.value === "light dark") updateAutoLabel();
});

// INIT behavior:
// - On RELOAD: force Auto
// - Otherwise: use session value if present; else Auto
if (NAV_TYPE === "reload") {
  setColorScheme("light dark");
  select.value = "light dark";
  sessionStorage.removeItem("colorScheme");
} else {
  const initial = loadScheme() ?? "light dark";
  setColorScheme(initial);
  select.value = initial;
}

// Respond to user changes + persist within this tab
select.addEventListener("input", (e) => {
  const scheme = e.target.value; // "light dark" | "light" | "dark"
  setColorScheme(scheme);
  saveScheme(scheme);
  updateAutoLabel();
});

/* =========================
   BETTER CONTACT FORM (Step 5)
   - Properly encode subject/body with % escapes
========================= */
(() => {
  const form = document.querySelector("form.contact-form"); // only on contact page
  form?.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const params = [];

    for (const [name, value] of data) {
      if (!value) continue; // skip empty fields
      params.push(`${encodeURIComponent(name)}=${encodeURIComponent(value)}`);
    }

    const url = params.length ? `${form.action}?${params.join("&")}` : form.action;
    location.href = url; // opens mail client for mailto:
  });
})();