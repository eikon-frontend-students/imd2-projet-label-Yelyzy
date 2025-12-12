const crewCards = document.querySelectorAll(".crew-card");
const crewDots = document.querySelectorAll(".crew-dot");

let crewIndex = 0;
let crewAnimating = false;

function updateCrewCarousel(newIndex) {
  if (crewAnimating) return;
  crewAnimating = true;

  crewIndex = (newIndex + crewCards.length) % crewCards.length;

  crewCards.forEach((card, i) => {
    const offset = (i - crewIndex + crewCards.length) % crewCards.length;
    card.classList.remove(
      "center",
      "left-1",
      "left-2",
      "right-1",
      "right-2",
      "hidden"
    );

    if (offset === 0) card.classList.add("center");
    else if (offset === 1) card.classList.add("right-1");
    else if (offset === 2) card.classList.add("right-2");
    else if (offset === crewCards.length - 1) card.classList.add("left-1");
    else if (offset === crewCards.length - 2) card.classList.add("left-2");
    else card.classList.add("hidden");
  });

  crewDots.forEach((dot, i) => {
    dot.classList.toggle("active", i === crewIndex);
  });

  setTimeout(() => {
    crewAnimating = false;
  }, 800);
}

crewDots.forEach((dot, i) =>
  dot.addEventListener("click", () => updateCrewCarousel(i))
);
crewCards.forEach((card, i) =>
  card.addEventListener("click", () => updateCrewCarousel(i))
);

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") updateCrewCarousel(crewIndex - 1);
  else if (e.key === "ArrowRight") updateCrewCarousel(crewIndex + 1);
});

let touchStart = 0;
let touchEnd = 0;

document.addEventListener("touchstart", (e) => {
  touchStart = e.changedTouches[0].screenX;
});
document.addEventListener("touchend", (e) => {
  touchEnd = e.changedTouches[0].screenX;
  const diff = touchStart - touchEnd;
  if (Math.abs(diff) > 50) {
    if (diff > 0) updateCrewCarousel(crewIndex + 1);
    else updateCrewCarousel(crewIndex - 1);
  }
});

updateCrewCarousel(0);

document.addEventListener("DOMContentLoaded", () => {
  const seeAllBtn = document.getElementById("seeAllDatesBtn");
  const secondaryDates = document.getElementById("secondaryDates");

  seeAllBtn.addEventListener("click", () => {
    if (
      secondaryDates.style.display === "none" ||
      secondaryDates.style.display === ""
    ) {
      secondaryDates.style.display = "flex"; // показываем вторую колонку
      secondaryDates.style.flexDirection = "column"; // чтобы она шла снизу
      seeAllBtn.textContent = "Hide dates"; // меняем текст кнопки
    } else {
      secondaryDates.style.display = "none"; // скрываем обратно
      seeAllBtn.textContent = "See all dates";
    }
  });
});

(function () {
  const menu = document.querySelector(".menu");
  if (!menu) return;

  // ensure placeholder exists and matches menu height
  let ph = document.querySelector(".menu-placeholder");
  if (!ph) {
    ph = document.createElement("div");
    ph.className = "menu-placeholder";
    menu.after(ph);
  }
  const syncPh = () =>
    (ph.style.height = `${menu.getBoundingClientRect().height}px`);
  syncPh();
  window.addEventListener("resize", syncPh);

  // scrolled shadow
  const TH = 10;
  const onScroll = () => menu.classList.toggle("scrolled", window.scrollY > TH);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // observe sections with data-menu-bg or data-menu-theme
  const secs = document.querySelectorAll("[data-menu-bg], [data-menu-theme]");
  if (secs.length === 0) return;
  const io = new IntersectionObserver(
    (entries) => {
      const vis = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!vis) return;
      const el = vis.target;
      // apply inline bg if provided
      if (el.dataset.menuBg) menu.style.background = el.dataset.menuBg;
      else menu.style.background = "";
      // theme class
      menu.classList.remove("theme-light", "theme-dark");
      if (el.dataset.menuTheme)
        menu.classList.add(`theme-${el.dataset.menuTheme}`);
    },
    {
      root: null,
      rootMargin: "0px 0px -60% 0px",
      threshold: [0, 0.2, 0.5, 0.8, 1],
    }
  );

  secs.forEach((s, i) => {
    if (!s.dataset.menuId) s.dataset.menuId = `m-${i}`;
    io.observe(s);
  });
})();
