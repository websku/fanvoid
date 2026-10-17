async function loadComponent(targetSelector, filePath) {
  const target = document.querySelector(targetSelector);
  if (!target) return;
  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`Gagal memuat ${filePath}: ${response.status}`);
    target.innerHTML = await response.text();
  } catch (error) {
    console.error(error);
    target.innerHTML = '<p class="component-error">Komponen gagal dimuat. Jalankan proyek menggunakan Live Server.</p>';
  }
}

function initHeader() {
  const currentPage = document.body.dataset.page || "home";
  document.querySelectorAll("[data-nav]").forEach(link => {
    const active = link.dataset.nav === currentPage;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Buka menu");
    }));
  }
}

function initProductFilters() {
  const cards = [...document.querySelectorAll(".product-card")];
  const search = document.querySelector("#product-search");
  const filterButtons = [...document.querySelectorAll("[data-filter]")];
  if (!cards.length) return;
  let selectedFilter = "all";

  function updateProducts() {
    const query = (search?.value || "").trim().toLowerCase();
    let visibleCount = 0;
    cards.forEach(card => {
      const matchesCategory = selectedFilter === "all" || card.dataset.category === selectedFilter;
      const matchesQuery = (card.dataset.name || "").toLowerCase().includes(query);
      const visible = matchesCategory && matchesQuery;
      card.hidden = !visible;
      if (visible) visibleCount++;
    });
    const empty = document.querySelector("#empty-state");
    if (empty) empty.hidden = visibleCount > 0;
  }

  filterButtons.forEach(button => button.addEventListener("click", () => {
    selectedFilter = button.dataset.filter;
    filterButtons.forEach(item => item.classList.toggle("is-selected", item === button));
    updateProducts();
  }));
  search?.addEventListener("input", updateProducts);
}

function initContactForm() {
  const form = document.querySelector("#contact-form");
  const note = document.querySelector("#form-note");
  if (!form || !note) return;
  form.addEventListener("submit", event => {
    event.preventDefault();
    note.textContent = "Formulir demo berhasil divalidasi di browser, tetapi belum mengirim atau menyimpan data. Integrasi backend dapat ditambahkan nanti.";
  });
}

async function initSite() {
  await Promise.all([
    loadComponent("#site-header", "components/header.html"),
    loadComponent("#site-footer", "components/footer.html")
  ]);
  initHeader();
  initProductFilters();
  initContactForm();
  document.querySelectorAll("[data-current-year]").forEach(el => el.textContent = new Date().getFullYear());
}

document.addEventListener("DOMContentLoaded", initSite);
