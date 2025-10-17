console.log('IT’S ALIVE!');

// ---- Dark mode switch (Step 4.2) ----

// Detect current OS preference for labeling
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const autoLabel = `Automatic (${prefersDark ? "Dark" : "Light"})`;

// Create the label+select block
const wrapper = document.createElement("label");
wrapper.className = "color-scheme";
wrapper.innerHTML = `
  Theme:
  <select aria-label="Color scheme">
    <option value="light dark">${autoLabel}</option>
    <option value="light">Light</option>
    <option value="dark">Dark</option>
  </select>
`;

// ---- config ----
const REPO_NAME = "portfolio";
const pages = [
  { url: "",          title: "Home" },
  { url: "projects/", title: "Projects" },
  { url: "contact/",  title: "Contact" },
  { url: "resume/",   title: "Resume" },
  { url: "https://github.com/whitneyderoche", title: "GitHub" },
];

// ---- helpers ----
const normalize = (p) => p.replace(/\/index\.html$/, "/");
const IS_LOCAL = ["localhost", "127.0.0.1"].includes(location.hostname);
const BASE_PATH = IS_LOCAL ? "/" : `/${REPO_NAME}/`;
const hrefFor = (url) => (url.startsWith("http") ? url : BASE_PATH + url);

// ---- build nav (remove any old ones just in case) ----
document.querySelectorAll("nav").forEach(n => n.remove());
const nav = document.createElement("nav");
document.body.prepend(nav);

for (const { url, title } of pages) {
  const a = document.createElement("a");
  a.href = hrefFor(url);
  a.textContent = title;

  const abs = new URL(a.href, location.href);

  // highlight current page
  a.classList.toggle(
    "current",
    abs.host === location.host &&
    normalize(abs.pathname) === normalize(location.pathname)
  );

   // external links → new tab (and safe)
   const isExternal = abs.host !== location.host;
   if (isExternal) {
     a.target = "_blank";
     a.rel = "noopener noreferrer";
   }

  nav.append(a);
}

// ==== THEME SWITCH — Steps 4.4 & 4.5 ====

(() => {
  // 1) Create the UI
  const prefersDark = matchMedia("(prefers-color-scheme: dark)").matches;
  const autoLabel = `Automatic (${prefersDark ? "Dark" : "Light"})`;

  const schemeLabel = document.createElement("label");
  schemeLabel.className = "color-scheme";
  schemeLabel.innerHTML = `
    Theme:
    <select aria-label="Color scheme">
      <option value="light dark">${autoLabel}</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  `;

    const navEl = document.querySelector("nav");
  navEl ? navEl.after(schemeLabel) : document.body.insertAdjacentElement("afterbegin", schemeLabel);

  const select = schemeLabel.querySelector("select");

  // 2) Helpers to apply & persist
  const setColorScheme = (scheme) => {
    // sets <html style="color-scheme: ...">
    document.documentElement.style.setProperty("color-scheme", scheme);
  };
  const saveScheme = (scheme) => localStorage.setItem("colorScheme", scheme);
  const loadScheme = () => localStorage.getItem("colorScheme");

  // 3) Initialize from saved preference (or Auto)
  const initial = loadScheme() ?? "light dark";
  setColorScheme(initial);
  select.value = initial;

  // Keep the Auto label updated if OS theme flips while Auto is selected
  const media = matchMedia("(prefers-color-scheme: dark)");
  const updateAutoLabel = () => {
    const opt = select.querySelector('option[value="light dark"]');
    if (opt) opt.textContent = `Automatic (${media.matches ? "Dark" : "Light"})`;
  };
  updateAutoLabel();
  media.addEventListener?.("change", () => {
    if (select.value === "light dark") updateAutoLabel();
  });

  // 4) React to user changes + persist
  select.addEventListener("input", (e) => {
    const scheme = e.target.value; // "light dark" | "light" | "dark"
    setColorScheme(scheme);

    saveScheme(scheme);

    updateAutoLabel();
  });
})();

// ---- Step 5: Better Contact Form (build a properly encoded mailto) ----
(() => {
  const form = document.querySelector('form.contact-form'); // only on contact page
  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const params = [];

    for (const [name, value] of data) {
      if (!value) continue; // skip empty fields
      // Proper percent-encoding so spaces/newlines etc. work in all mail clients
      params.push(`${encodeURIComponent(name)}=${encodeURIComponent(value)}`);
    }

    // Build final mailto URL: action is "mailto:you@example.com"
    const url = params.length ? `${form.action}?${params.join('&')}` : form.action;

    // Open the user's mail client with prefilled Subject/Body
    location.href = url;
  });
})();
