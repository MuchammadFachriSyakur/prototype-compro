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

// Progress bar animation
const bars = document.querySelectorAll("[data-bar]");
const nums = document.querySelectorAll(".progress-title b");
const observerBars = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        bars.forEach((bar) => {
          bar.style.width = bar.dataset.bar + "%";
        });
        nums.forEach((num) => {
          const target = +num.dataset.target;
          let cur = 0;
          const step = Math.ceil(target / 50);
          const int = setInterval(() => {
            cur += step;
            if (cur >= target) {
              cur = target;
              clearInterval(int);
            }
            num.textContent = cur;
          }, 20);
        });
        observerBars.disconnect();
      }
    });
  },
  { threshold: 0.4 }
);
if (bars.length) observerBars.observe(bars[0].parentElement);

// FAQ toggle
document.querySelectorAll(".faq-q").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.parentElement;
    item.classList.toggle("active");
  });
});

// Dummy form submit
const FORM_ENDPOINT = "";
const form = document.getElementById("orderForm");
const toast = document.getElementById("toast");
form.addEventListener("submit", async (e) => {
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
