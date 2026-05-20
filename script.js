const intro = document.querySelector("[data-intro]");
const introName = document.querySelector("[data-intro-name]");
const skipIntroButton = document.querySelector("[data-skip-intro]");
const cardButton = document.querySelector("[data-open-card]");
const cardPanel = document.querySelector("[data-card-panel]");
const cardCloseButton = document.querySelector("[data-close-card]");
const lanterns = document.querySelectorAll("[data-wish]");
const wishOutput = document.querySelector("[data-wish-output]");
const choices = document.querySelectorAll("[data-choice]");
const keepsake = document.querySelector("[data-keepsake] p");
const toast = document.querySelector("[data-toast]");
const lanternStage = document.querySelector("[data-lantern-stage]");
const stageWish = document.querySelector("[data-stage-wish]");
const closeStageButtons = document.querySelectorAll("[data-close-stage]");

const wishes = {
  barakah: "네가 걷는 길마다 좋은 축복이 조용히 따라오기를.",
  joy: "오늘 네 미소가 쉽게 피어나고, 오래 마음에 남기를.",
  peace: "알라께서 너의 마음과 집, 그리고 내일의 길에 평안을 주시기를."
};

const keepsakes = {
  calm:
    "오늘만큼은 마음이 서두르지 않았으면 해. 세상이 잠깐 너의 평안을 위해 자리를 비켜주는 것처럼.",
  smiles:
    "너를 웃게 하는 이유가 많이 찾아오기를. 익숙한 목소리, 맛있는 음식, 부드러운 빛, 그리고 반가운 메시지까지.",
  duas:
    "네가 조용히 품은 두아들이 네가 상상한 것보다 더 아름다운 방식으로 응답되기를."
};

let toastTimer;
let stageTimers = [];
let introTimer;
let lanternOpenTimer;
let cardTimer;

if (intro) {
  const displayName = intro.dataset.name?.trim() || "사랑하는 너";

  introName.textContent = displayName;
  document.body.classList.add("intro-open");

  introTimer = window.setTimeout(closeIntro, 3900);
  skipIntroButton.addEventListener("click", closeIntro);
}

cardButton.addEventListener("click", () => {
  openLetterCard();
});

cardCloseButton.addEventListener("click", closeLetterCard);

lanterns.forEach((lantern) => {
  buildLanternSparks(lantern);

  lantern.addEventListener("click", () => {
    window.clearTimeout(lanternOpenTimer);
    lanterns.forEach((item) => item.classList.remove("is-lit", "is-kindling"));
    lantern.classList.add("is-lit");
    triggerLanternKindle(lantern);
    wishOutput.textContent = wishes[lantern.dataset.wish];

    lanternOpenTimer = window.setTimeout(() => {
      openLanternStage(lantern.dataset.wish);
    }, 680);
  });
});

choices.forEach((choice) => {
  choice.addEventListener("click", () => {
    choices.forEach((item) => item.classList.remove("is-active"));
    choice.classList.add("is-active");
    keepsake.textContent = keepsakes[choice.dataset.choice];
  });
});

closeStageButtons.forEach((button) => {
  button.addEventListener("click", closeLanternStage);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && intro && !intro.hidden) {
    closeIntro();
    return;
  }

  if (event.key === "Escape" && !cardPanel.hidden) {
    closeLetterCard();
    return;
  }

  if (event.key === "Escape" && !lanternStage.hidden) {
    closeLanternStage();
  }
});

function closeIntro() {
  if (!intro || intro.hidden) {
    return;
  }

  window.clearTimeout(introTimer);
  intro.classList.add("is-leaving");
  document.body.classList.remove("intro-open");

  window.setTimeout(() => {
    intro.hidden = true;
  }, 700);
}

function buildLanternSparks(lantern) {
  const sparkWrap = document.createElement("span");
  sparkWrap.className = "lantern__sparks";
  sparkWrap.setAttribute("aria-hidden", "true");

  for (let index = 0; index < 7; index += 1) {
    sparkWrap.append(document.createElement("span"));
  }

  lantern.append(sparkWrap);
}

function triggerLanternKindle(lantern) {
  lantern.classList.remove("is-kindling");

  requestAnimationFrame(() => {
    lantern.classList.add("is-kindling");
  });

  window.setTimeout(() => {
    lantern.classList.remove("is-kindling");
  }, 1300);
}

function openLetterCard() {
  window.clearTimeout(cardTimer);

  const buttonRect = cardButton.getBoundingClientRect();
  const startX = buttonRect.left + buttonRect.width / 2 - window.innerWidth / 2;
  const startY = buttonRect.top + buttonRect.height / 2 - window.innerHeight / 2;

  cardPanel.style.setProperty("--start-x", `${startX}px`);
  cardPanel.style.setProperty("--start-y", `${startY}px`);
  cardPanel.hidden = false;
  cardPanel.classList.remove("is-closing", "is-visible");
  document.body.classList.add("letter-open");
  cardButton.setAttribute("disabled", "true");
  cardButton.querySelector("span:last-child").textContent = "편지가 열렸어";

  requestAnimationFrame(() => {
    cardPanel.classList.add("is-visible");
  });

  showToast("편지가 조용히 열렸어.");
}

function closeLetterCard() {
  if (cardPanel.hidden || cardPanel.classList.contains("is-closing")) {
    return;
  }

  window.clearTimeout(cardTimer);
  cardPanel.classList.remove("is-visible");
  cardPanel.classList.add("is-closing");
  document.body.classList.remove("letter-open");

  cardTimer = window.setTimeout(() => {
    cardPanel.hidden = true;
    cardPanel.classList.remove("is-closing");
    cardButton.removeAttribute("disabled");
    cardButton.querySelector("span:last-child").textContent = "작은 편지 열기";
  }, 1450);
}

function openLanternStage(wishKey) {
  clearStageTimers();
  stageWish.textContent = wishes[wishKey];
  lanternStage.hidden = false;
  document.body.classList.add("stage-open");
  lanternStage.classList.remove("is-lighting", "is-blooming", "is-paper");

  requestAnimationFrame(() => {
    lanternStage.classList.add("is-lighting");
  });

  stageTimers = [
    window.setTimeout(() => {
      lanternStage.classList.add("is-blooming");
    }, 1050),
    window.setTimeout(() => {
      lanternStage.classList.add("is-paper");
    }, 2200)
  ];
}

function closeLanternStage() {
  clearStageTimers();
  lanternStage.classList.remove("is-lighting", "is-blooming", "is-paper");
  lanternStage.hidden = true;
  document.body.classList.remove("stage-open");
}

function clearStageTimers() {
  stageTimers.forEach((timer) => window.clearTimeout(timer));
  stageTimers = [];
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}
