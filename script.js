// ------------------- Survey Data -------------------
const imageLibrary = [
  {player:"Player1", img:"images/p1.png", text:"Name: Deni. Height: 6'8''"},
  {player:"Player2", img:"images/p2.png", text:"Player 2 description"},
  {player:"Player3", img:"images/p3.jpg", text:"Player 3 description"},
  {player:"Player4", img:"images/p4.jpg", text:"Player 4 description"},
  {player:"Player5", img:"images/p5.jpg", text:"Player 5 description"},
  {player:"Player6", img:"images/p6.jpg", text:"Player 6 description"},
  {player:"Player7", img:"images/p7.jpg", text:"Player 7 description"},
  {player:"Player8", img:"images/p8.jpg", text:"Player 8 description"},
  {player:"Player9", img:"images/p9.jpg", text:"Player 9 description"},
  {player:"Player10", img:"images/p10.jpg", text:"Player 10 description"},
  {player:"Player11", img:"images/p11.jpg", text:"Player 11 description"},
  {player:"Player12", img:"images/p12.jpg", text:"Player 12 description"},
  {player:"Player13", img:"images/p13.jpg", text:"Player 13 description"},
  {player:"Player14", img:"images/p14.jpg", text:"Player 14 description"},
  {player:"Player15", img:"images/p15.jpg", text:"Player 15 description"},
];

// ------------------- Variables -------------------
const surveyItems = imageLibrary.slice(0, 15);
let page = 0;
let responses = [];

// ------------------- Load Page -------------------
function loadPage() {
  updateProgress();

  const item = surveyItems[page];
  document.getElementById("surveyImage").src = item.img;
  document.getElementById("description").innerText = item.text;

  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += `
      <div class="question">
        <p>Q${i}:</p>
        <div class="bubble-row">
          ${[0,1,2,3,4,5].map(v => `
            <label>
              <input type="radio" name="q${i}" value="${v}">
              <span>${v}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;
  }

  document.getElementById("questions").innerHTML = html;

  const nextBtn = document.getElementById("nextBtn");
  nextBtn.disabled = true;

  const radios = document.querySelectorAll("#questions input[type=radio]");
  radios.forEach(r => {
    r.addEventListener("change", checkAllAnswered);
  });
}

// ------------------- Progress -------------------
function updateProgress() {
  const fillPercent = (page / surveyItems.length) * 100;
  document.getElementById('progress-fill').style.width = fillPercent + '%';
  document.getElementById('progress-text').innerText = `${page + 1} / ${surveyItems.length}`;
}

// ------------------- Enable Next Button -------------------
function checkAllAnswered() {
  let allAnswered = true;
  for (let i = 1; i <= 5; i++) {
    if (!document.querySelector(`input[name="q${i}"]:checked`)) {
      allAnswered = false;
      break;
    }
  }
  document.getElementById("nextBtn").disabled = !allAnswered;
}

// ------------------- Next Page -------------------
function nextPage() {
  const nextBtn = document.getElementById("nextBtn");
  nextBtn.disabled = true;

  let answers = [];
  for (let i = 1; i <= 5; i++) {
    const checked = document.querySelector(`input[name="q${i}"]:checked`);
    if (!checked) {
      alert("Please answer all questions");
      nextBtn.disabled = false;
      return;
    }
    answers.push(checked.value);
  }

  responses.push({
    player: surveyItems[page].player,
    scores: answers
  });

  page++;
  if (page >= surveyItems.length) {
    submitSurvey();
  } else {
    loadPage();
  }
}

// ------------------- Submit Survey -------------------
function submitSurvey() {
  fetch("YOUR_GOOGLE_SCRIPT_URL_HERE", {
    method: "POST",
    body: JSON.stringify(responses)
  });
  document.body.innerHTML = "<h2>Thank you for completing the survey!</h2>";
}

// ------------------- Event Listeners -------------------
document.getElementById("nextBtn").onclick = nextPage;

// ------------------- Initialize -------------------
loadPage();