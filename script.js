const questions = [
  {
    type: "single",
    question: "Which language is used for web development?",
    options: ["Python", "HTML", "C", "Java"],
    answer: "HTML"
  },
  {
    type: "multi",
    question: "Which of the following are programming languages?",
    options: ["HTML", "CSS", "JavaScript", "Python"],
    answer: ["JavaScript", "Python"]
  },
  {
    type: "text",
    question: "Fill in the blank: The capital of France is _____.",
    answer: "Paris"
  }
];

let currentQuestion = 0;
let userAnswers = [];
let timerInterval;
let timeLeft = 60; // in seconds

const questionContainer = document.getElementById("question-container");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const resultContainer = document.getElementById("result");
const timerDisplay = document.getElementById("timer");

function loadQuestion(index) {
  const q = questions[index];
  questionContainer.innerHTML = `
    <div class="question">${index + 1}. ${q.question}</div>
    <div class="options">${generateOptions(q)}</div>
  `;
}

function generateOptions(q) {
  if (q.type === "single") {
    return q.options.map(
      opt =>
        `<label><input type="radio" name="option" value="${opt}"> ${opt}</label>`
    ).join("");
  } else if (q.type === "multi") {
    return q.options.map(
      opt =>
        `<label><input type="checkbox" name="option" value="${opt}"> ${opt}</label>`
    ).join("");
  } else if (q.type === "text") {
    return `<input type="text" id="textAnswer" placeholder="Type your answer here..." />`;
  }
}

function getAnswer() {
  const q = questions[currentQuestion];

  if (q.type === "single") {
    const selected = document.querySelector('input[name="option"]:checked');
    return selected ? selected.value : null;
  }

  if (q.type === "multi") {
    const selected = Array.from(document.querySelectorAll('input[name="option"]:checked'));
    return selected.map(input => input.value);
  }

  if (q.type === "text") {
    const input = document.getElementById("textAnswer");
    return input.value.trim();
  }
}

nextBtn.addEventListener("click", () => {
  const answer = getAnswer();
  if (answer === null || answer.length === 0) {
    alert("Please answer the question before proceeding.");
    return;
  }

  userAnswers.push(answer);
  currentQuestion++;

  if (currentQuestion < questions.length) {
    loadQuestion(currentQuestion);
  }

  if (currentQuestion === questions.length - 1) {
    nextBtn.style.display = "none";
    submitBtn.style.display = "inline-block";
  }
});

submitBtn.addEventListener("click", () => {
  const answer = getAnswer();
  if (answer === null || answer.length === 0) {
    alert("Please answer the question before submitting.");
    return;
  }

  userAnswers.push(answer);
  stopTimer();
  calculateScore();
});

function calculateScore() {
  let score = 0;

  questions.forEach((q, index) => {
    const userAns = userAnswers[index];

    if (q.type === "single" || q.type === "text") {
      if (
        userAns.toString().toLowerCase().trim() ===
        q.answer.toString().toLowerCase().trim()
      ) {
        score++;
      }
    } else if (q.type === "multi") {
      const correct = q.answer.sort().join();
      const given = userAns.sort().join();
      if (correct === given) score++;
    }
  });

  questionContainer.style.display = "none";
  nextBtn.style.display = "none";
  submitBtn.style.display = "none";
  resultContainer.innerHTML = `You scored ${score} out of ${questions.length}!`;
  timerDisplay.style.display = "none";
}

// Timer Logic
function startTimer() {
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      alert("Time is up!");
      autoSubmit();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const min = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const sec = String(timeLeft % 60).padStart(2, '0');
  timerDisplay.textContent = `Time Left: ${min}:${sec}`;
}

function stopTimer() {
  clearInterval(timerInterval);
}

function autoSubmit() {
  const answer = getAnswer();
  if (answer !== null && answer.length !== 0) {
    userAnswers.push(answer);
  }
  calculateScore();
}

// Load first question & start timer
loadQuestion(currentQuestion);
startTimer();
