console.log('IT’S ALIVE!');

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