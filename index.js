/* let rules = document.getElementsByClassName("rules")[0]
let hideRules = document.getElementsByClassName("hide-rules")[0];
let startGame = document.getElementsByClassName("begin-game")[0];
button.addEventListener( "click" , function() {
    rules.style.display = "block"
});

hideRules.addEventListener( "click" , function() {
    rules.style.display = "none" ;
})

    // random number generator
    function number(){
        return Math.floor(Math.random() * 1000) + 1;
    }

    // game starter button
    startGame.addEventListener ( "click" , function(){
         rules.style.display = "none"
         initializeGame();
    }) */

    //---------------------------------------------------------------------------------

    // --- cached DOM elements ---
const rules = document.getElementsByClassName("rules")[0];
const hideRules = document.getElementsByClassName("hide-rules")[0];
const startGame = document.getElementsByClassName("begin-game")[0];
const ruleButton = document.getElementById("button");
const display = document.querySelector(".display");
const choiceContainer = document.querySelector("main");
const choiceElements = document.querySelectorAll(".choices");

// --- constants ---
const INTERVAL_MS = 10000; // 10 seconds per round

// --- state ---
let currentNumber = null;
let score = 0;
let timeoutId = null;
let countdownInterval = null;
let roundStart = null;
let gameActive = false; // to guard clicks after game over

// --- helpers ---
function getCorrectType(n) {
  const div3 = n % 3 === 0;
  const div5 = n % 5 === 0;
  if (div3 && div5) return "fizzbuzz";
  if (div3) return "fizz";
  if (div5) return "buzz";
  return "normal";
}

function deriveSelectedType(el) {
  // prefer explicit data-type; fallback to text content normalized
  const dt = el.getAttribute("data-type");
  if (dt) return dt.toLowerCase();
  return el.textContent.trim().toLowerCase().replace(/\s+/g, "");
}

function updateDisplay(remainingMs = INTERVAL_MS) {
  const remainingSec = Math.ceil(remainingMs / 1000);
  display.textContent = `Number: ${currentNumber} | Score: ${score} | ${remainingSec}s left`;
}

function clearTimers() {
  clearTimeout(timeoutId);
  clearInterval(countdownInterval);
  timeoutId = null;
  countdownInterval = null;
}

function flashFeedback(el, type) {
  // type: "correct" or "wrong"
  el.classList.add(type);
  setTimeout(() => el.classList.remove(type), 300);
}

function showTemporaryMessage(text) {
  const msg = document.createElement("div");
  msg.textContent = text;
  msg.style.position = "fixed";
  msg.style.top = "10px";
  msg.style.right = "10px";
  msg.style.padding = "8px 12px";
  msg.style.background = "#222";
  msg.style.color = "#fff";
  msg.style.borderRadius = "6px";
  msg.style.zIndex = 1000;
  msg.style.boxShadow = "0 0 10px rgba(0,0,0,0.4)";
  document.body.appendChild(msg);
  setTimeout(() => document.body.removeChild(msg), 1000);
}

// --- round/watchdog control ---
function resetWatchdog() {
  clearTimers();
  roundStart = Date.now();

  timeoutId = setTimeout(() => {
    const correct = getCorrectType(currentNumber);
    console.error(
      `timeup, too slow! Number was ${currentNumber}, expected "${correct.toUpperCase()}". Reload to try again.`
    );
    endGame("timeup");
  }, INTERVAL_MS);

  countdownInterval = setInterval(() => {
    const elapsed = Date.now() - roundStart;
    const remaining = Math.max(0, INTERVAL_MS - elapsed);
    updateDisplay(remaining);
    if (remaining <= 0) {
      clearInterval(countdownInterval);
    }
  }, 200);
}

function startRound() {
  currentNumber = Math.floor(Math.random() * 100) + 1; // 1..200
  updateDisplay(INTERVAL_MS);
  resetWatchdog();
}

function handleCorrect(el) {
  score += 1;
  flashFeedback(el, "correct");
  showTemporaryMessage("Correct!");
  startRound();
}

function endGame(reason, info = {}) {
  clearTimers();
  gameActive = false;
  choiceElements.forEach((el) => el.classList.add("disabled"));
  if (reason === "wrong") {
    // logged in handler already
  } else if (reason === "timeup") {
    // logged already
  }
  display.textContent += " — Game Over";
}

// --- event hookups ---
ruleButton.addEventListener("click", function () {
  rules.style.display = "block";
});

hideRules.addEventListener("click", function () {
  rules.style.display = "none";
});

startGame.addEventListener("click", function () {
  rules.style.display = "none";
  initializeGame();
});

// delegation for choice clicks
choiceContainer.addEventListener("click", (e) => {
  if (!gameActive) return;
  const el = e.target.closest(".choices");
  if (!el) return;
  if (el.classList.contains("disabled")) return;

  const selected = deriveSelectedType(el);
  const correct = getCorrectType(currentNumber);
  const elapsed = Date.now() - roundStart;
  const remainingMs = Math.max(0, INTERVAL_MS - elapsed);
  const remainingSec = Math.ceil(remainingMs / 1000);

  if (selected === correct) {
    console.log(`Correct! "${selected.toUpperCase()}" for ${currentNumber}.`); 
    handleCorrect(el);
  } else {
    flashFeedback(el, "wrong");
    console.error(
      `Wrong: you picked "${selected.toUpperCase()}", correct was "${correct.toUpperCase()}". Number: ${currentNumber}. Time left: ${remainingSec}s. Reload to try again.`
    );
    showTemporaryMessage("Wrong! Game Over.");
    endGame("wrong");
  }
});

function initializeGame() {
  score = 0;
  gameActive = true;
  choiceElements.forEach((el) => el.classList.remove("disabled"));
  startRound();
}
