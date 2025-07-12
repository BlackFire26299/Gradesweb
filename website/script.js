document.getElementById("add-subject").addEventListener("click", () => {
  addSubject();
});

function addSubject(name = "New Subject", assessments = []) {
  const container = document.getElementById("subjects-container");
  const subjectIndex = subjectsData.length;
  subjectsData.push({ name, assessments: [] });

  const subjectDiv = document.createElement("div");
  subjectDiv.classList.add("subject");
  subjectDiv.dataset.index = subjectIndex;

  subjectDiv.innerHTML = `
    <input type="text" class="subject-name" value="${name}">
    <button class="delete-subject">Remove Subject</button>
    <div class="assessments"></div>
    <button class="add-assessment">+ Add Assessment</button>
    <p>Final Score: <span class="final-score">0.00</span></p>
  `;

  container.appendChild(subjectDiv);

  const nameInput = subjectDiv.querySelector(".subject-name");
  nameInput.addEventListener("input", () => {
    subjectsData[subjectIndex].name = nameInput.value;
    saveToLocalStorage();
  });

  const assessmentsContainer = subjectDiv.querySelector(".assessments");

  assessments.forEach(a => addAssessment(assessmentsContainer, a.name, a.score, a.weight, subjectIndex));
  subjectDiv.querySelector(".add-assessment").addEventListener("click", () =>
    addAssessment(assessmentsContainer, "", "", "", subjectIndex)
  );

  subjectDiv.querySelector(".delete-subject").addEventListener("click", () => {
    subjectsData.splice(subjectIndex, 1);
    saveToLocalStorage();
    subjectDiv.remove();
  });

  updateFinalScore(subjectDiv, subjectIndex);
}

function addAssessment(container, name = "", score = "", weight = "", subjectIndex) {
  const row = document.createElement("div");
  row.classList.add("assessment");

  row.innerHTML = `
    <input type="text" class="assessment-name" placeholder="Task name" value="${name}">
    <input type="number" class="score" placeholder="Score (%)" value="${score}">
    <input type="number" class="weight" placeholder="Weight (0–1)" value="${weight}">
    <button class="delete-assessment">×</button>
  `;

  container.appendChild(row);

  // Store into data model and update on input
  const updateModel = () => {
    const assessments = [];
    container.querySelectorAll(".assessment").forEach(row => {
      assessments.push({
        name: row.querySelector(".assessment-name").value,
        score: parseFloat(row.querySelector(".score").value) || 0,
        weight: parseFloat(row.querySelector(".weight").value) || 0
      });
    });
    subjectsData[subjectIndex].assessments = assessments;
    saveToLocalStorage();
    updateFinalScore(container.parentElement, subjectIndex);
  };

  row.querySelectorAll("input").forEach(input =>
    input.addEventListener("input", updateModel)
  );

  row.querySelector(".delete-assessment").addEventListener("click", () => {
    row.remove();
    updateModel();
  });

  updateModel();
}

function updateFinalScore(subjectDiv) {
  const rows = subjectDiv.querySelectorAll(".assessment");
  let total = 0;
  rows.forEach(row => {
    const score = parseFloat(row.querySelector(".score").value) || 0;
    const weight = parseFloat(row.querySelector(".weight").value) || 0;
    total += score * weight;
  });
  subjectDiv.querySelector(".final-score").textContent = total.toFixed(2);
}

let subjectsData = [];

function saveToLocalStorage() {
  localStorage.setItem("studentResults", JSON.stringify(subjectsData));
}

function loadFromLocalStorage() {
  const data = localStorage.getItem("studentResults");
  if (data) {
    subjectsData = JSON.parse(data);
    renderSubjectsFromData(subjectsData);
  }
}
function renderSubjectsFromData(data) {
  document.getElementById("subjects-container").innerHTML = "";
  data.forEach(subject => addSubject(subject.name, subject.assessments));
}

 loadFromLocalStorage();