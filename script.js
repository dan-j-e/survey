// --- 15 fixed players ---
const surveyItems = [
  {player:"Player1", img:"images/player1.png", text:"Description 1"},
  {player:"Player2", img:"images/player2.png", text:"Description 2"},
  {player:"Player3", img:"images/player3.jpg", text:"Description 3"},
  {player:"Player4", img:"images/player4.jpg", text:"Description 4"},
  {player:"Player5", img:"images/player5.jpg", text:"Description 5"},
  {player:"Player6", img:"images/player6.jpg", text:"Description 6"},
  {player:"Player7", img:"images/player7.jpg", text:"Description 7"},
  {player:"Player8", img:"images/player8.jpg", text:"Description 8"},
  {player:"Player9", img:"images/player9.jpg", text:"Description 9"},
  {player:"Player10", img:"images/player10.jpg", text:"Description 10"},
  {player:"Player11", img:"images/player11.jpg", text:"Description 11"},
  {player:"Player12", img:"images/player12.jpg", text:"Description 12"},
  {player:"Player13", img:"images/player13.jpg", text:"Description 13"},
  {player:"Player14", img:"images/player14.jpg", text:"Description 14"},
  {player:"Player15", img:"images/player15.jpg", text:"Description 15"},
];

let page = 0;
let responses = [];

// --- preload images ---
surveyItems.forEach(item => {
  const img = new Image();
  img.src = item.img;
});

function loadPage(){
  const item = surveyItems[page];

  document.getElementById("surveyImage").src = item.img;
  document.getElementById("description").innerText = item.text;
  document.getElementById("progressText").innerText =
    `Page ${page+1} / ${surveyItems.length}`;

  let percent = ((page)/surveyItems.length)*100;
  document.getElementById("progressBar").style.width = percent + "%";

  let html = "";
  for(let i=1;i<=5;i++){
    html += `
    <div class="question">
      <p>Q${i}</p>
      ${[0,1,2,3,4,5].map(n => `<label>
        <input type="radio" name="q${i}" value="${n}">
        <span>${n}</span>
      </label>`).join("")}
    </div>
    `;
  }

  document.getElementById("questions").innerHTML = html;

  // ✅ Reset tab focus to first bubble
  const firstInput = document.querySelector('input[name="q1"]');
  if (firstInput) firstInput.focus();
}

function nextPage(){
  let answers = [];
  for(let i=1;i<=5;i++){
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    if(!selected){
      alert("Please answer all questions");
      return;
    }
    answers.push(selected.value);
  }

  const currentPlayer = surveyItems[page].player;
  responses.push({player: currentPlayer, scores: answers});

  page++;
  if(page >= surveyItems.length){
    submitSurvey();
  } else {
    loadPage();
  }
}

// --- send to Google Sheets ---
function submitSurvey(){
  fetch("YOUR_WEB_APP_URL", {
    method:"POST",
    body: JSON.stringify(responses)
  });
  document.body.innerHTML="<h2>Thank you for completing the survey!</h2>";
}

document.getElementById("nextBtn").onclick = nextPage;

loadPage();
