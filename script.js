// Survey Data
const imageLibrary = [
  {player:"Deni Avdija", img:"images/p1.png", text:"Name: Deni. Height: 6'9''. Visible Tattoos: N. Heritage: Israel"},
  {player:"Jabari Smith Jr.", img:"images/p2.png", text:"Name: Jabari. Height: 6'11''. Visible Tattoos: Y. Heritage: USA"},
  {player:"Jayson Tatum", img:"images/p3.png", text:"Name: Jayson. Height: 6'8''. Visible Tattoos: Y. Heritage: USA"},
  {player:"Nic Claxton", img:"images/p4.png", text:"Name: Nic. Height: 6'11''. Visible Tattoos: Y. Heritage: USA"},
  {player:"Kelly Oubre Jr.", img:"images/p5.png", text:"Name: Kelly. Height: 6'8''. Visible Tattoos: Y. Heritage: USA"},
  {player:"Blake Griffin", img:"images/p6.png", text:"Name: Blake. Height: 6'9''. Visible Tattoos: N. Heritage: USA"},
  {player:"Chandler Parsons", img:"images/p7.png", text:"Name: Chandler. Height: 6'9''. Visible Tattoos: N. Heritage: USA"},
  {player:"Lauri Markkanen", img:"images/p8.png", text:"Name: Lauri. Height: 7'1''. Visible Tattoos: N. Heritage: Finland"},
  {player:"Kyle Korver", img:"images/p9.png", text:"Name: Kyle. Height: 6'7''. Visible Tattoos: N. Heritage: USA"},
  {player:"Max Strus", img:"images/p10.png", text:"Name: Max. Height: 6'5''. Visible Tattoos: N. Heritage: USA"},
  {player:"Moe Wagner", img:"images/p11.png", text:"Name: Moe. Height: 6'11''. Visible Tattoos: N. Heritage: Germany"},
  {player:"Dwight Howard", img:"images/p12.png", text:"Name: Dwight. Height: 6'10''. Visible Tattoos: Y. Heritage: USA"},
  {player:"Chris Goulding", img:"images/p13.png", text:"Name: Chris. Height: 6'5''. Visible Tattoos: N. Heritage: Australia"},
  {player:"Lucas Noguiera", img:"images/p14.png", text:"Name: Lucas. Height: 7'0''. Visible Tattoos: Y. Heritage: Brazil"},
  {player:"Chris Anderson", img:"images/p15.png", text:"Name: Chris. Height: 6'9''. Visible Tattoos: Y. Heritage: USA"},
];

const surveyQuestions = [
  "Please rate your level of attraction to his smile.",
  "Please rate your level of attraction to his hairstyle/grooming.",
  "Please rate your level of attraction to his level of tattoos/body mods.",
  "Please rate your level of attraction to his listed height.",
  "Please rate your overall level of attraction."
];

const surveyItems = imageLibrary.slice(0, 15);
let page = 0;
let responses = [];

function loadPage() {
  updateProgress();

  const item = surveyItems[page];
  document.getElementById("surveyImage").src = item.img;

  // Extract info from item.text
  // Example format: "Name: Deni. Height: 6'9''. Visible Tattoos: N. Heritage: Israel"
  const matchName = item.text.match(/Name: (\w+)/);
  const matchHeight = item.text.match(/Height: ([^\.]+)/);
  const matchTats = item.text.match(/Visible Tattoos: ([YN])/);
  const matchHeritage = item.text.match(/Heritage: (\w+)/);

  document.getElementById("player-name").innerText = matchName ? matchName[1] : '';
  
  document.getElementById("info-bubbles").innerHTML = `
    <span>Height: ${matchHeight ? matchHeight[1] : ''}</span>
    <span>Visible Tattoos: ${matchTats ? matchTats[1] : ''}</span>
    <span>From: ${matchHeritage ? matchHeritage[1] : ''}</span>
  `;

  let html = "";
  surveyQuestions.forEach((qText, index) => {
  const i = index + 1;
  html += `
    <div class="question">
      <p>${qText}</p>
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
});

  document.getElementById("questions").innerHTML = html;

  const nextBtn = document.getElementById("nextBtn");
  nextBtn.disabled = true;

  const radios = document.querySelectorAll("#questions input[type=radio]");
  radios.forEach(r => r.addEventListener("change", checkAllAnswered));
}

function updateProgress() {
  const fillPercent = (page / surveyItems.length) * 100;
  document.getElementById('progress-fill').style.width = fillPercent + '%';
  document.getElementById('progress-text').innerText = `${page + 1} / ${surveyItems.length}`;
}

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

function submitSurvey() {
  fetch("https://script.google.com/macros/s/AKfycbzFaLXQI70utF-tR1tiuxN8Rh-XfWGtxYYaPiPVm2RnJ7E-88xqFcwi_vMbmy-GzH1F/exec", {
    method: "POST",
    body: JSON.stringify(responses)
  });
  document.body.innerHTML = "<h2>Thank you for completing the survey!</h2>";
}

document.getElementById("nextBtn").onclick = nextPage;

loadPage();