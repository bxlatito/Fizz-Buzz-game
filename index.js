/* let button = document.getElementById("button");
let rules = document.getElementsByClassName("rules")[0]
let hideRules = document.getElementsByClassName("hide-rules")[0];
let startGame = document.getElementsByClassName("begin-game")[0];
button.addEventListener( "click" , function() {
    rules.style.display = "block"
});

hideRules.addEventListener( "click" , function() {
    rules.style.display = "none" ;
})

startGame.addEventListener( "click" , function() {
    rules.style.display = "none" ;
})
 */


//AI CODED THIS PART

// Elements
const button = document.getElementById("button");
const rules = document.querySelector(".rules");
const hideRules = document.querySelector(".hide-rules");
const startGameBtn = document.querySelector(".begin-game");
const display = document.querySelector(".display");
const choices = document.querySelectorAll(".choices");

// Game state
let currentNumber = 1;
let score = 0;
let roundActive = false;
let roundTimeout = null; // per-round timer

// Helpers
function getFizzBuzzValue(num) {
    if (num % 3 === 0 && num % 5 === 0) return "FIZZ BUZZ";
    if (num % 3 === 0) return "FIZZ";
    if (num % 5 === 0) return "BUZZ";
    return "NORMAL";
}

function updateDisplay() {
    display.textContent = `${currentNumber} | Score: ${score}`;
}

function clearRoundTimer() {
    if (roundTimeout !== null) {
        clearTimeout(roundTimeout);
        roundTimeout = null;
    }
}

function startGame() {
    // Initialize
    score = 0;
    currentNumber = 1;
    roundActive = true;
    updateDisplay();

    // Begin first round
    scheduleTimeoutForRound();
}

function scheduleTimeoutForRound() {
    clearRoundTimer();
    roundActive = true;
    roundTimeout = setTimeout(() => {
        if (roundActive) {
            alert("Too slow! Game Over.");
            endGame();
        }
    }, 5000);
}

function nextRound() {
    updateDisplay();
    scheduleTimeoutForRound();
}

function handleChoice(choiceText) {
    if (!roundActive) return;

    roundActive = false;
    clearRoundTimer();

    const correct = getFizzBuzzValue(currentNumber);
    // Normalize both for comparison
    if (choiceText.trim().toUpperCase() === correct) {
        score++;
        currentNumber++;
        nextRound();
    } else {
        alert(`Wrong! The correct answer was "${correct}". Game Over.`);
        endGame();
    }
}

function endGame() {
    clearRoundTimer();
    roundActive = false;
    display.textContent = `Game Over! Final Score: ${score}`;
}

// UI event bindings
button.addEventListener("click", () => {
    rules.style.display = "block";
});

hideRules.addEventListener("click", () => {
    rules.style.display = "none";
});

startGameBtn.addEventListener("click", () => {
    rules.style.display = "none"
    startGame();
});

choices.forEach(choice => {
    choice.addEventListener("click", () => {
        const selected = choice.textContent.trim().toUpperCase();
        handleChoice(selected);
    });
});
