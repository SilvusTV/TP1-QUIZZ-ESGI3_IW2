import Pages from "./pages.js";

document.addEventListener("start", () => {
  const welcomeScreen = document.getElementById("welcome");
  welcomeScreen.remove();
})
document.addEventListener("resume", () => {
  const resumeScreen = document.getElementById("resume");
  resumeScreen.remove();
})
document.addEventListener("restart", () => {
  localStorage.removeItem("quizState");
  const resumeScreen = document.getElementById("resume");
  resumeScreen.remove();
  initWelcomePage();
})

document.addEventListener("DOMContentLoaded", () => {
  const section = document.createElement("section");
  const saved = localStorage.getItem("quizState");
  if (saved) {
    section.id = "resume";
    section.innerHTML = Pages.Resume();
    document.body.appendChild(section)
    document.getElementById("resume-continue").addEventListener("click", function () {
      document.dispatchEvent(new Event("resume"));
    });
    document.getElementById("resume-start").addEventListener("click", function () {
      document.dispatchEvent(new Event("restart"));
    });
  } else {
    initWelcomePage();
  }
});

function initWelcomePage() {
  const welcomeSection = document.createElement("section");
  welcomeSection.id = "welcome";
  welcomeSection.innerHTML = Pages.Welcome();
  document.body.appendChild(welcomeSection)
  document.getElementById("start-button").addEventListener("click", function () {
    document.dispatchEvent(new Event("start"));
  });
}