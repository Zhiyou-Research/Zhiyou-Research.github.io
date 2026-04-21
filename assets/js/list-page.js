async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return await res.json();
}

function renderPageHero(data) {
  const title = document.getElementById("pageTitle");
  const desc = document.getElementById("pageDesc");
  if (title) title.textContent = data.page.title;
  if (desc) desc.textContent = data.page.description;
}

function renderPostList(data) {
  const container = document.getElementById("postList");
  if (!container) return;

  container.innerHTML = "";
  data.posts.forEach(post => {
    const item = document.createElement("a");
    item.className = "post-card reveal";
    item.href = post.link;

    item.innerHTML = `
      <div class="post-cover" style="background-image:url('${post.cover || ""}')"></div>
      <div class="post-content">
        <div class="post-meta">
          <span class="meta-chip">${data.page.title}</span>
          <span class="meta-chip">${post.date}</span>
        </div>
        <h3>${post.title}</h3>
        <p>${post.summary}</p>
      </div>
    `;
    container.appendChild(item);
  });

  setupReveal();
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
  }, { threshold: 0.12 });

  items.forEach(item => io.observe(item));
}

async function initListPage() {
  const dataFile = document.body.dataset-source;
  if (!dataFile) return;

  try {
    const data = await loadJSON(dataFile);
    renderPageHero(data);
    renderPostList(data);
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", initListPage);