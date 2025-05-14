export default class Pages {


  static Quizz() {
    return (`
      <div class="progress" id="progress" data-progress="0">
        <p>Question <span id="question-number">1</span>/<span id="total-question"></span></p>
      </div>
    <div class="container">
      <h2 id="question"></h2>
      <ul id="answers"></ul>
      <div class="button-group">
        <button id="prev-button">< Précédent</button>
        <button id="next-button">Suivant ></button>
      </div>
    </div>`);
  }

  static End() {
    return (`
      <section id="end">
        <h2>Quiz terminé !</h2>
        <p>Votre score est de <span id="score"></span>/<span id="total-question"></span></p>
        <div class="summary-container">
        </div>
        <button id="restart-button">Recommencer</button>
      </section>`);
  }

  static Resume() {
    return `
    <section id="resume" class="container">
      <h1>Quiz en cours détecté</h1>
      <p>Vous aviez commencé un quiz précédemment. Voulez-vous :</p>
      <div class="button-group">
        <button id="resume-continue">Continuer</button>
        <button id="resume-start">Recommencer</button>
      </div>
    </section>
  `;
  }
  static Welcome(){
    return (`
      <section id="welcome">
        <div class="container">
            <h1>Bienvenue dans le quizz interactif !</h1>
            <p>Testez vos connaissances sur divers sujets en répondant à des questions à choix multiples.</p>
            <button id="start-button">Démarrer le quizz</button>
        </div>
      </section>
    `);
  }

}