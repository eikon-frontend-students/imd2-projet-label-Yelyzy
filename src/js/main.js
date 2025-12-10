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
