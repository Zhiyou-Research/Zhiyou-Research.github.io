document.addEventListener("DOMContentLoaded", () => {
  const article = document.querySelector(".article-content");
  if (!article) return;

  const imgs = article.querySelectorAll("img");
  imgs.forEach(img => {
    img.loading = "lazy";
  });
});