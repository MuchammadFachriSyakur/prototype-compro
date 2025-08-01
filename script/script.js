// Sticky nav + mobile nav
const nav = document.getElementById("nav");
const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");

window.addEventListener("scroll", () =>
  nav.classList.toggle("scrolled", window.scrollY > 40)
);
hamburger.addEventListener("click", () => {
  nav.classList.toggle("open");
});

// Counter animation
const counters = document.querySelectorAll("[data-counter]");
const observerCounters = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = +el.getAttribute("data-counter");
        let cur = 0;
        const step = Math.ceil(target / 60);
        const int = setInterval(() => {
          cur += step;
          if (cur >= target) {
            cur = target;
            clearInterval(int);
          }
          el.textContent = cur.toLocaleString();
        }, 20);
        observerCounters.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);
counters.forEach((c) => observerCounters.observe(c));

const observerProgress = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const item = entry.target;
        const bar = item.querySelector(".bar span");
        const num = item.querySelector("[data-target]");

        const target = parseFloat(bar.dataset.bar); // e.g. 12
        if (!isNaN(target)) {
          bar.style.width = target + "%";
        }

        if (num) {
          let cur = 0;
          const step = Math.ceil(target / 50);
          const int = setInterval(() => {
            cur += step;
            if (cur >= target) {
              cur = target;
              clearInterval(int);
            }
            num.textContent = cur + "%";
          }, 20);
        }

        observerProgress.unobserve(item);
      }
    });
  },
  { threshold: 0.4 }
);

// FAQ toggle
document.addEventListener("click", (e) => {
  if (e.target.matches(".faq-q")) {
    e.target.parentElement.classList.toggle("active");
  }
});

// Toast dummy form
const FORM_ENDPOINT = "";
const form = document.getElementById("orderForm");
const toast = document.getElementById("toast");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());

  if (!FORM_ENDPOINT) {
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 4000);
    form.reset();
    return;
  }

  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 4000);
      form.reset();
    } else {
      alert("Gagal mengirim form. Silakan coba lagi.");
    }
  } catch (err) {
    alert("Terjadi kesalahan. Silakan coba lagi.");
  }
});

// ===============================
// Main translation logic
// ===============================
let currentLang = document.documentElement.lang || "id";
let translations = {};

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("data/translations.json");
    translations = await res.json();
    renderAll();
  } catch (err) {
    console.error("Gagal memuat translations.json:", err);
  }

  try {
    const res = await fetch("data/products.json");
    const products = await res.json();
    renderProducts(products);
  } catch (err) {
    console.error("Gagal memuat produk:", err);
  }

  document.getElementById("langSwitcher")?.addEventListener("click", () => {
    currentLang = currentLang === "id" ? "en" : "id";
    document.documentElement.lang = currentLang;
    renderAll();
  });
});

function renderAll() {
  renderText(translations, currentLang);
  renderMisi();
  renderWhy();
  renderTimeline();
  renderProgress();
  renderFAQ();
  renderKontak();
  renderMutu();
}

// ===============================
// Data-i18n renderer
// ===============================
function renderText(data, lang) {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const rawKey = el.dataset.i18n;

    // Placeholder format: [placeholder]form_contact.name
    if (rawKey.startsWith("[placeholder]")) {
      const key = rawKey.replace("[placeholder]", "").trim();
      const keys = key.split(".");
      let value = data?.[lang];
      for (const k of keys) value = value?.[k];

      if (value !== undefined) {
        el.setAttribute("placeholder", value);
      } else {
        el.setAttribute("placeholder", `[${key} not found]`);
      }
    } else {
      // Regular text replacement (innerText)
      const keys = rawKey.split(".");
      let value = data?.[lang];
      for (const k of keys) value = value?.[k];

      if (value !== undefined) {
        el.textContent = value;
      } else {
        el.textContent = `[${rawKey} not found]`;
      }
    }
  });

  // Ubah ikon bahasa
  const langBtn = document.getElementById("langSwitcher");
  if (langBtn) {
    const img = langBtn.querySelector("img");
    img.src =
      currentLang === "id"
        ? "https://flagcdn.com/w20/gb.png"
        : "https://flagcdn.com/w20/id.png";
  }
}

// ===============================
// Manual render functions
// ===============================
function renderMisi() {
  const list = translations[currentLang]?.about?.misi_list || [];
  const el = document.getElementById("misiList");
  if (!el) return;
  el.innerHTML = "";
  list.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    el.appendChild(li);
  });
}

function renderWhy() {
  const items = translations[currentLang]?.about?.why || [];
  const wrap = document.getElementById("whyWrap");
  if (!wrap) return;
  wrap.innerHTML = "";
  items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "why-item";
    div.innerHTML = `<h4>${item.title}</h4><p>${item.desc}</p>`;
    wrap.appendChild(div);
  });
}

function renderProducts(products) {
  const container = document.getElementById("productGrid");
  if (!container) return;
  container.innerHTML = "";
  products.forEach((p) => {
    const item = document.createElement("div");
    item.className = "product-item";
    item.innerHTML = `
      <img src="${p.image}" alt="${p.name[currentLang]}" />
      <div class="info">
        <h3>${p.name[currentLang]}</h3>
        <p>${p.desc[currentLang]}</p>
      </div>
    `;
    container.appendChild(item);
  });
}

function renderTimeline() {
  const steps = translations[currentLang]?.proses?.steps || [];
  const container = document.getElementById("timeline");
  if (!container) return;
  container.innerHTML = steps
    .map(
      (step, i) => `
    <div class="step" data-step="${i + 1}">
      <div class="num">${step.title}</div>
      <div class="text">${step.desc}</div>
    </div>`
    )
    .join("");
}

function renderMutu() {
  const mutuTitle = translations[currentLang]?.proses?.mutu;
  const mutuItems = translations[currentLang]?.proses?.mutu_items || [];

  const titleEl = document.getElementById("mutuTitle");
  const container = document.getElementById("mutuContent");

  if (titleEl) titleEl.textContent = mutuTitle;
  if (!container) return;

  container.innerHTML = mutuItems
    .map(
      (item) => `
        <div class="progress">
          <div class="progress-title">
            <span>${item.label}</span>
            <span><b data-target="${item.value}">0</b></span>
          </div>
          <div class="bar"><span data-bar="${item.value}"></span></div>
        </div>
      `
    )
    .join("");

  // ✅ Akses semua .progress setelah render selesai
  const progressItems = document.querySelectorAll("#mutuContent .progress");
  progressItems.forEach((item) => {
    observerProgress.observe(item);
  });
}

function renderProgress() {
  const bars = translations[currentLang]?.proses?.progress || [];
  const container = document.getElementById("progressWrap");
  if (!container) return;
  container.innerHTML = bars
    .map(
      (b) => `
    <div class="progress-item">
      <div class="progress-title">
        <span>${b.label}</span>
        <b data-target="${b.value}">0</b>
      </div>
      <div class="progress-bar">
        <div class="bar" data-bar="${b.value}"></div>
      </div>
    </div>`
    )
    .join("");
}

function renderFAQ() {
  const faqs = translations[currentLang]?.faq?.items || [];
  const container = document.getElementById("faqContent");
  if (!container) return;
  container.innerHTML = faqs
    .map(
      (f) => `
    <div class="faq-item">
      <div class="faq-q">${f.q}</div>
      <div class="faq-a">${f.a}</div>
    </div>`
    )
    .join("");
}

function renderKontak() {
  const kontak = translations[currentLang]?.kontak;
  const container = document.getElementById("kontakContent");
  if (!container || !kontak) return;

  container.innerHTML = `
    <div class="kontak-item"><b>Nama</b><p>${kontak.name}</p></div>
    <div class="kontak-item"><b>Alamat</b><p>${kontak.address}</p></div>
    <div class="kontak-item"><b>Email</b><p>${kontak.email}</p></div>
    <div class="kontak-item"><b>${kontak.contact}</b></div>
    <div class="kontak-item"><b>WhatsApp 1</b><p>${kontak.wa1}</p></div>
    <div class="kontak-item"><b>WhatsApp 2</b><p>${kontak.wa2}</p></div>
    <div class="kontak-item"><b>Website</b><p>${kontak.site}</p></div>
  `;
}
