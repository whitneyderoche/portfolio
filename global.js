console.log('IT’S ALIVE!');

// Lab 3: Step 2:
// // tiny helper: $$("selector", root?) -> Array<Element>
// const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// const navLinks = $$("nav a");

// const normalize = (p) => p.replace(/\/index\.html$/, "/");

// const hereHost = location.host;
// const herePath = normalize(location.pathname);

// const currentLink = navLinks.find((a) => {
//   const link = new URL(a.getAttribute("href"), location.href); // handles relative hrefs
//   return link.host === hereHost && normalize(link.pathname) === herePath;
// });
// currentLink?.classList.add("current");



// ---------- config ----------
const REPO_NAME = "portfolio"; // <-- your GitHub repo name

// Listing pages (relative URLs for internal pages)
const pages = [
  { url: "",           title: "Home" },
  { url: "projects/",  title: "Projects" },
  { url: "contact/",   title: "Contact" },
  { url: "resume/",    title: "Resume" },
  { url: "https://github.com/whitneyderoche", title: "GitHub" }, // external
];

// ---------- helpers ----------
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const normalize = (p) => p.replace(/\/index\.html$/, "/");

// Base path: local vs GitHub Pages
const IS_LOCAL = location.hostname === "localhost" || location.hostname === "127.0.0.1";
const BASE_PATH = IS_LOCAL ? "/" : `/${REPO_NAME}/`;

// Turn a page URL into an href that works locally and on Pages
const hrefFor = (url) =>
  url.startsWith("http") ? url : BASE_PATH + url;

// ---------- build nav ----------
const nav = document.createElement("nav");
document.body.prepend(nav);

for (const { url, title } of pages) {
  const href = hrefFor(url);
  const isExternal = href.startsWith("http");

  // Add the link HTML
  nav.insertAdjacentHTML(
    "beforeend",
    `<a href="${href}" ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ""}>${title}</a>`
  );
}

// ---------- mark current page ----------
(() => {
  const herePath = normalize(location.pathname);

  // Find the <a> whose resolved pathname matches the current page
  const currentLink = $$("nav a").find((a) => {
    const abs = new URL(a.getAttribute("href"), location.href);
    return abs.host === location.host && normalize(abs.pathname) === herePath;
  });

  currentLink?.classList.add("current");
})();