import Pages from "./pages.js";

document.addEventListener("start", () => {
  initQuizzPage()
  prepareQuestions()
})
document.addEventListener("resume", async () => {
  const saved = localStorage.getItem("quizState");
  initQuizzPage();
  if (saved) {
    const quizState = JSON.parse(saved);
    const questions = JSON.parse(localStorage.getItem("questions"));
    await fetch('./app/questions.json')
      .then(response => response.json())
      .then(data => {
        quizzApp(data, quizState)
        document.dispatchEvent(new CustomEvent("progress", {
          detail: {
            current: quizState.filter(entry => entry !== null).length,
            total: data.length
          }
        }));
      })
      .catch(error => console.log(error))
  }
})
document.addEventListener("questions", (event) => {
  const questions = event.detail;
  quizzApp(questions);
})
document.addEventListener("end", () => {
  localStorage.removeItem("quizState")
  const quizzSection = document.getElementById("quizz");
  quizzSection.remove();
})
document.addEventListener("progress", (event) => {
  const progress = document.getElementById("progress");
  const questionNumber = document.getElementById("question-number");
  const totalQuestion = document.getElementById("total-question");
  const prevBtn = document.getElementById("prev-button");
  const nextBtn = document.getElementById("next-button");

  questionNumber.textContent = event.detail.current;
  totalQuestion.textContent = event.detail.total;
  progress.style.setProperty('--progress', (event.detail.current / event.detail.total * 100).toString() + "%");

  if (event.detail.current > 1) prevBtn.classList.remove("hidden");
  else prevBtn.classList.add("hidden");

  if (event.detail.current === event.detail.total) nextBtn.textContent = "Terminer";
  else nextBtn.textContent = "Suivant";
})

function initQuizzPage() {
  const quizzSection = document.createElement("section");
  quizzSection.id = "quizz";
  quizzSection.innerHTML = Pages.Quizz();
  document.body.appendChild(quizzSection);
}

function prepareQuestions() {
  fetch('./app/questions.json')
    .then(response => response.json())
    .then(data => {
      document.dispatchEvent(new CustomEvent("questions", {detail: data}))
      document.dispatchEvent(new CustomEvent("progress", {detail: {current: 1, total: data.length}}));
    })
    .catch(error => console.log(error));
}

function quizzApp(questions, quizState = []) {
  let questionNumber = quizState.length > 0 ? quizState.filter(entry => entry !== null).length : 1;
  const userResponses = quizState.length > 0 ? quizState : Array(questions.length).fill(null);
  displayQuestion(questions[questionNumber-1]);
  document.getElementById("next-button").addEventListener("click", () => {
    const currentQuestion = questions[questionNumber - 1];
    let selected;

    if (currentQuestion.type === "text") {
      const input = document.getElementById("answer-input");
      selected = input.value.trim();
    } else if (currentQuestion.type === "radio") {
      const sel = document.querySelector('input[name="answer"]:checked');
      selected = sel ? sel.value : null;
    } else {
      selected = Array.from(
        document.querySelectorAll('input[name="answer"]:checked')
      ).map(i => i.value).sort();
    }

    if (!selected || (Array.isArray(selected) && selected.length === 0)) {
      return alert("Veuillez sélectionner une réponse.");
    }

    userResponses[questionNumber - 1] = {type: currentQuestion.type, answer: selected};

    if (questionNumber < questions.length) {
      questionNumber++;
      displayQuestion(questions[questionNumber - 1]);
      document.dispatchEvent(new CustomEvent("progress", {
        detail: {current: questionNumber, total: questions.length}
      }));
    } else {
      let finalScore = 0;
      questions.forEach((question, index) => {
        const resp = userResponses[index];
        if (!resp) return;

        if (question.type === "text") {
          if (resp.answer.toLowerCase() === question.answer.toLowerCase()) finalScore++;
        } else if (question.type === "radio") {
          const correct = question.options.find(q => q.isCorrect).value;
          if (resp.answer === correct) finalScore++;
        } else if (question.type === "checkbox") {
          const correctArr = question.options.filter(q => q.isCorrect).map(q => q.value).sort();
          if (JSON.stringify(resp.answer) === JSON.stringify(correctArr)) finalScore++;
        }
      });
      document.dispatchEvent(new CustomEvent("end", {
        detail: {
          score: finalScore,
          totalQuestions: questions.length,
          userResponses: userResponses,
          questions: questions
        }
      }));
    }
    localStorage.setItem("quizState", JSON.stringify(userResponses));
  });
  document.getElementById("prev-button").addEventListener("click", () => {
    if (questionNumber > 1) {
      questionNumber--;
      displayQuestion(questions[questionNumber - 1], userResponses[questionNumber - 1]);
      document.dispatchEvent(new CustomEvent("progress", {
        detail: {current: questionNumber, total: questions.length}
      }));
    }
  });
}

function displayQuestion(question, prevResponse = null) {
  const questionElement = document.getElementById("question");
  const answersElement = document.getElementById("answers");

  questionElement.textContent = question.question;

  if (question.type === "text") {
    answersElement.innerHTML = `
      <input type="text" id="answer-input" placeholder="Votre réponse">
    `;
  } else if (question.type === "radio") {
    answersElement.innerHTML = question.options.map((answer, index) => `
      <li>
        <input type="radio" name="answer" id="answer-${index}" value="${answer.value}">
        <label for="answer-${index}">${answer.label}</label>
      </li>
    `).join("");
  } else if (question.type === "checkbox") {
    answersElement.innerHTML = question.options.map((answer, index) => `
      <li>
        <input type="checkbox" name="answer" id="answer-${index}" value="${answer.value}">
        <label for="answer-${index}">${answer.label}</label>
      </li>
    `).join("");
  }
  if (prevResponse) {
    if (question.type === "text") {
      document.getElementById("answer-input").value = prevResponse.answer;
    } else if (question.type === "radio") {
      document
        .querySelector(`input[value="${prevResponse.answer}"]`)
        .checked = true;
    } else if (question.type === "checkbox") {
      prevResponse.answer.forEach(value => {
        document.querySelector(`input[value="${value}"]`).checked = true;
      });
    }
  }
}