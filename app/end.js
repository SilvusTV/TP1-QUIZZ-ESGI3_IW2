import pages from "./pages.js";

document.addEventListener("start", () => {
  const endSection = document.getElementById("end");
  endSection.remove();
})

document.addEventListener("end", (event) => {
  initEndPage(event.detail.score, event.detail.totalQuestions, event.detail.userResponses, event.detail.questions);
})

function initEndPage(score, totalQuestions, userResponses, questions) {
  const endSection = document.createElement("section");
  endSection.id = "end";
  endSection.innerHTML = pages.End();
  document.body.appendChild(endSection)
  document.getElementById("score").textContent = score ;
  document.getElementById("total-question").textContent = totalQuestions;
  document.getElementById("restart-button").addEventListener("click", ()=> {
    document.dispatchEvent(new Event("start"));
  });

  const summary = userResponses.map((response, index) => {
    const question = questions[index];
    let detailHtml = '';

    if (question.type === 'text') {
      const expected = question.answer.trim();
      const given    = (response.answer || '').trim();
      const isCorrect = expected.toLowerCase() === given.toLowerCase();
      detailHtml = `
        <p><strong>Réponse attendue :</strong> ${expected}</p>
        <p><strong>Votre réponse :</strong> ${given || '<i>aucune</i>'}</p>
        <p class="text-${isCorrect ? 'correct' : 'incorrect'}">
          ${isCorrect ? '✓ Correct' : '✗ Incorrect'}
        </p>
      `;
    }
    else {
      const choices = question.options.map(option => {
        const choseIt =
          question.type === 'radio'
            ? response.answer === option.value
            : (response.answer || []).includes(option.value);
        const isGood  = !!option.isCorrect;
        const classes = [
          isGood  ? 'option-good'  : '',
          choseIt ? 'option-chosen': ''
        ].join(' ');
        const mark = choseIt ? '✔' : '';
        return `<li class="${classes}">${option.label} ${mark}</li>`;
      }).join('');
      detailHtml = `<ul class="option-list">${choices}</ul>`;
    }

    return `
      <div class="question-summary">
        <h3 class="question-title">${index + 1}. ${question.question}</h3>
        ${detailHtml}
      </div>
    `;
  }).join('');

    const summaryContainer = document.querySelector(".summary-container");
  summaryContainer.innerHTML = summary;
}
