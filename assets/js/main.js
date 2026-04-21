async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return await res.json();
}

function createChip(text) {
  const span = document.createElement("span");
  span.className = "meta-chip";
  span.textContent = text;
  return span;
}

function renderRecentPosts(posts) {
  const box = document.getElementById("recentPosts");
  if (!box) return;

  box.innerHTML = "";
  posts.forEach(post => {
    const card = document.createElement("a");
    card.className = "post-card reveal";
    card.href = post.link;

    card.innerHTML = `
      <div class="post-cover" style="background-image:url('${post.cover || ""}')"></div>
      <div class="post-content">
        <div class="post-meta">
          <span class="meta-chip">${post.category}</span>
          <span class="meta-chip">${post.date}</span>
        </div>
        <h3>${post.title}</h3>
        <p>${post.summary}</p>
      </div>
    `;
    box.appendChild(card);
  });

  setupReveal();
}

async function initHome() {
  const heroTitle = document.getElementById("heroTitle");
  const heroSubtitle = document.getElementById("heroSubtitle");
  const heroTags = document.getElementById("heroTags");

  try {
    const site = await loadJSON("assets/data/site.json");
    heroTitle.textContent = site.home.title;
    heroSubtitle.textContent = site.home.subtitle;

    heroTags.innerHTML = "";
    site.home.tags.forEach(tag => heroTags.appendChild(createChip(tag)));

    const [daily, science, reading] = await Promise.all([
      loadJSON("assets/data/daily.json"),
      loadJSON("assets/data/science.json"),
      loadJSON("assets/data/reading.json")
    ]);

    const merged = [
      ...daily.posts.map(p => ({...p, category:"日常杂谈"})),
      ...science.posts.map(p => ({...p, category:"科学随笔"})),
      ...reading.posts.map(p => ({...p, category:"阅读感悟"}))
    ]
      .sort((a,b) => new Date(b.sortDate) - new Date(a.sortDate))
      .slice(0, 6);

    renderRecentPosts(merged);
  } catch (err) {
    console.error(err);
  }
}

function setupMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const siteNav = document.getElementById("siteNav");
  if (!menuToggle || !siteNav) return;

  menuToggle.addEventListener("click", () => {
    siteNav.classList.toggle("open");
  });
}

function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  items.forEach(item => io.observe(item));
}

document.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  setupReveal();
  if (document.body.dataset.page === "home") {
    initHome();
  }
});