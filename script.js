const container = document.querySelector(".card-container");
const cards = document.querySelectorAll(".card");
const resetBtn = document.getElementById("resetBtn");

let isShuffled = false;

function setStack() {
  isShuffled = false;

  cards.forEach((card, index) => {
    card.classList.add("flipped"); // back view
    card.classList.remove("revealed");

    card.style.transform = `translateY(${index * 5}px)`;
    card.style.zIndex = 4 - index;
  });
}

setStack();

function dealCards() {
  if (isShuffled) return;
  isShuffled = true;

  cards.forEach((card, i) => {
    setTimeout(() => {
      // random slide
      const randX = (Math.random() - 0.5) * 150;
      const randY = (Math.random() - 0.5) * 150;
      const randR = (Math.random() - 0.5) * 20;

      card.style.transform = `translate(${randX}px, ${randY}px) rotate(${randR}deg)`;
      card.style.zIndex = 10 - i;

    }, i * 150); // 150ms delay per card for sequential deal
  });

  // after all cards are dealt, move to grid
  setTimeout(() => {
    // shuffle array
    let arr = Array.from(cards);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    arr.forEach(card => container.appendChild(card));

    const positions = [
      { x: -80, y: -80 },
      { x: 80, y: -80 },
      { x: -80, y: 80 },
      { x: 80, y: 80 }
    ];

    arr.forEach((card, i) => {
      card.style.transform = `translate(${positions[i].x}px, ${positions[i].y}px) rotate(0deg)`;
      card.style.zIndex = 1;
    });

  }, cards.length * 150 + 500); // after all cards are dealt + extra buffer
}

// CLICK stack to trigger deal
container.addEventListener("click", dealCards);

container.addEventListener("click", () => {
  if (isShuffled) return;

  isShuffled = true;

  let arr = Array.from(cards);

  // STEP 1: Scatter effect
  arr.forEach((card, i) => {
    const randX = (Math.random() - 0.5) * 200; // random X offset
    const randY = (Math.random() - 0.5) * 200; // random Y offset
    const randR = (Math.random() - 0.5) * 60; // random rotation deg
    card.style.transform = `translate(${randX}px, ${randY}px) rotate(${randR}deg)`;
    card.style.zIndex = 5 - i;
  });

  // STEP 2: Shuffle + grid after scatter (delay)
  setTimeout(() => {
    // Shuffle array
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    arr.forEach(card => container.appendChild(card));

    // Grid layout
    const positions = [
      { x: -70, y: -70 },
      { x: 70, y: -70 },
      { x: -70, y: 70 },
      { x: 70, y: 70 }
    ];

    arr.forEach((card, i) => {
      card.style.transform = `translate(${positions[i].x}px, ${positions[i].y}px) rotate(0deg)`;
      card.style.zIndex = 1;
    });

  }, 600); // same as transition duration
});

cards.forEach(card => {
  card.addEventListener("click", (e) => {
    if (!isShuffled) return;

    e.stopPropagation();

    if (card.classList.contains("revealed")) return;

    // 👉 RESET muna lahat ng z-index
    cards.forEach(c => c.style.zIndex = 1);

    // 👉 Iangat yung clicked card
    card.style.zIndex = 10;

    // 👉 Reveal
    card.classList.remove("flipped");
    card.classList.add("revealed");
  });
});

resetBtn.addEventListener("click", () => {
  setStack();
});
