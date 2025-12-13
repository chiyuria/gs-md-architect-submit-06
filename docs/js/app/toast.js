function toast(message, duration = 3000) {
  const container = document.querySelector(".toast-container");

  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = message;

  container.appendChild(t);

  requestAnimationFrame(() => {
    t.classList.add("show");
  });

  setTimeout(() => {
    t.classList.add("fadeout");
    setTimeout(() => t.remove(), 300);
  }, duration);
}
