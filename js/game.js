/* ==============================
   SETUP LEVEL
============================== */
const params = new URLSearchParams(location.search);
const id = Number(params.get("level"));

const lvl = LEVELS.find(l => l.id === id);
if (!lvl) {
  alert("Level tidak ditemukan");
  location.href = "index.html";
}

/* ==============================
   STATE
============================== */
let life = 3;
let found = 0;
let usedHint = false;
let hit = new Set();

/* ==============================
   ELEMENT
============================== */
const imgA = document.getElementById("imgA");
const imgB = document.getElementById("imgB");
const lifeEl = document.getElementById("life");
const foundEl = document.getElementById("found");

imgA.src = lvl.imageA;
imgB.src = lvl.imageB;

/* ==============================
   SOUND (ANDROID SAFE)
============================== */
const correctSound = new Audio("assets/sounds/correct.mp3");
const wrongSound   = new Audio("assets/sounds/wrong.mp3");

correctSound.preload = "auto";
wrongSound.preload   = "auto";

/* unlock audio on first interaction */
document.body.addEventListener("click", () => {
  correctSound.play().then(() => correctSound.pause()).catch(()=>{});
  wrongSound.play().then(() => wrongSound.pause()).catch(()=>{});
}, { once: true });

function playCorrect() {
  correctSound.currentTime = 0;
  correctSound.play();
}

function playWrong() {
  wrongSound.currentTime = 0;
  wrongSound.play();
}

/* ==============================
   EFFECT
============================== */
function effectCorrect(img) {
  img.classList.add("correct");
  setTimeout(() => img.classList.remove("correct"), 300);
}

function effectWrong(img) {
  img.classList.add("wrong");
  setTimeout(() => img.classList.remove("wrong"), 300);
  if (navigator.vibrate) navigator.vibrate(150);
}

/* ==============================
   HINT
============================== */
function showHint() {
  if (usedHint) return;
  usedHint = true;

  const idx = lvl.differences.findIndex((_, i) => !hit.has(i));
  if (idx === -1) return;

  const d = lvl.differences[idx];

  [imgA, imgB].forEach(img => {
    const rect = img.getBoundingClientRect();
    const scaleX = rect.width / img.naturalWidth;
    const scaleY = rect.height / img.naturalHeight;

    const circle = document.createElement("div");
    circle.style.position = "absolute";
    circle.style.left = img.offsetLeft + d.x * scaleX - 15 + "px";
    circle.style.top  = img.offsetTop  + d.y * scaleY - 15 + "px";
    circle.style.width = "30px";
    circle.style.height = "30px";
    circle.style.border = "3px solid yellow";
    circle.style.borderRadius = "50%";
    circle.style.pointerEvents = "none";
    circle.style.animation = "pulse 0.6s ease-out";

    document.body.appendChild(circle);
    setTimeout(() => circle.remove(), 800);
  });
}

/* ==============================
   CLICK LOGIC
============================== */
function onImageClick(img, e) {
  const rect = img.getBoundingClientRect();

  // KONVERSI KE NATURAL SIZE (FIX UTAMA)
  const scaleX = img.naturalWidth / img.clientWidth;
  const scaleY = img.naturalHeight / img.clientHeight;

  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;

  let ok = false;

  lvl.differences.forEach((d, i) => {
    if (hit.has(i)) return;

    if (Math.hypot(x - d.x, y - d.y) < d.r) {
      hit.add(i);
      found++;
      ok = true;

      playCorrect();
      effectCorrect(img);

      foundEl.textContent = found;
    }
  });

  if (!ok) {
    life--;
    playWrong();
    effectWrong(img);
    lifeEl.textContent = life;
  }

  if (life <= 0) {
    alert("Game Over");
    location.href = "index.html";
  }

  if (found === 5) {
    const current = Number(localStorage.getItem("unlockedLevel")) || 1;
    if (id >= current) {
      localStorage.setItem("unlockedLevel", id + 1);
    }
    alert("Level Selesai!");
    location.href = "index.html";
  }
}

/* ==============================
   EVENT
============================== */
imgA.addEventListener("click", e => onImageClick(imgA, e));
imgB.addEventListener("click", e => onImageClick(imgB, e));
