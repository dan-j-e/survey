// ------------------- Survey Data -------------------
const imageLibrary = [
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
  {player:"Deni Avdija", img:"images/p1.png", text:"Name: Deni. Height: 6'9''. Visible Tattoos: N. Heritage: Israel"},
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

const surveyItems = imageLibrary.slice(0,15);

// ------------------- State -------------------
let page = Number(localStorage.getItem("surveyPage")) || -1;
let responses = JSON.parse(localStorage.getItem("surveyResponses")) || [];
let participantName = localStorage.getItem("surveyName") || "";

// ------------------- Duplicate Check with Token -------------------
const RESET_TOKEN = "DanielIsHandsomeToken"; // <-- your secret token

function showDuplicateCheck() {
    document.body.innerHTML = `
        <div style="text-align:center;margin-top:100px; max-width:600px; margin:auto;">
            <h2>This survey has already been completed.</h2>
            <p>If you need to redo it, please contact Daniel and get a reset token.</p>
            <p><b>Enter reset token here:</b></p>
            <input id="resetTokenInput" type="text" placeholder="Enter token" style="padding:10px;width:70%;border-radius:6px;border:1px solid #ccc;">
            <div id="resetTokenError" style="color:red;margin-top:8px;"></div>
            <br><br>
            <button id="resetTokenBtn" style="padding:10px 20px;border-radius:6px;border:none;background:#F8B259;cursor:pointer;font-weight:bold;">Submit Token</button>
        </div>
    `;

    document.getElementById("resetTokenBtn").onclick = () => {
        const token = document.getElementById("resetTokenInput").value.trim();
        const errorEl = document.getElementById("resetTokenError");

        if(token === RESET_TOKEN){
            alert("Token accepted. You will now be redirected to the survey start.");
            localStorage.removeItem("surveyTaken");
            localStorage.removeItem("surveyResponses");
            localStorage.removeItem("surveyPage");
            localStorage.removeItem("surveyName");
            location.reload();
        } else {
            errorEl.innerText = "Invalid token. Please contact Daniel for a valid token.";
        }
    }
}

// ------------------- Load Page -------------------
function loadPage(){

    const nextBtn = document.getElementById("nextBtn");
    const backBtn = document.getElementById("backBtn");

    nextBtn.innerText = "Next"; // reset text every page
    backBtn.style.display = page <= -1 ? "none" : "inline-block";

    // ---------- Welcome Page ----------
    if(page===-1){
        document.getElementById("surveyImage").style.display="none";
        document.getElementById("player-name").innerText="";
        document.getElementById("info-bubbles").innerHTML="";

        document.getElementById("questions").innerHTML=`
        <div style="text-align:center;max-width:500px;margin:auto;">
            <h2>Welcome.</h2>
            <h3>I'm Daniel, somehow you know me.<br>Here is my survey.</h3>
            <p>The following questions relate to a presentation that will be held later in April.
            Please answer honestly and only once.</p>
            <p>This survey should take about <b>5 minutes</b>.</p>
            <p><b>Enter your first name and last initial to begin:</b></p>
            <input id="nameInput" type="text" placeholder="Example: Daniel E"
            value="${participantName}"
            style="padding:10px;font-size:16px;width:70%;border-radius:8px;border:1px solid #ccc;text-align:center;">
        </div>
        `;

        nextBtn.disabled = participantName.length < 2;

        document.getElementById("nameInput").addEventListener("input", e => {
            participantName = e.target.value.trim();
            localStorage.setItem("surveyName", participantName);
            nextBtn.disabled = participantName.length < 2;
        });

        updateProgress();
        return;
    }

    // ---------- End Page ----------
    if(page===surveyItems.length){
        document.getElementById("surveyImage").style.display="none";
        document.getElementById("player-name").innerText="";
        document.getElementById("info-bubbles").innerHTML="";

        document.getElementById("questions").innerHTML=`
        <div style="text-align:center;max-width:500px;margin:auto;">
            <h2>Thank you for your time!</h2>
            <p>It would greatly help our research if you could provide a few features you find attractive.
            The more you can offer, the more we can all learn!<br>This response will be recorded anonymously.</p>
            <textarea id="featureInput"
              placeholder="Sample responses:
1. I like dudes with no hair and lots of piercings...
2. I think eyes are an important feature...
3. Daniel, can I get a reward?..."
                style="width:100%;height:100px;padding:10px;border-radius:8px;border:1px solid #ccc;"></textarea>
            <br><br>
            <button id="resetBtn" style="padding:10px 20px;border-radius:8px;border:none;background:#ccc;cursor:pointer;font-weight:bold;">
            Back to start?
            </button>
        </div>
        `;

            // update progress now that elements exist
        updateProgress();

        document.getElementById("resetBtn").onclick = () => {
            if(confirm("This will erase all your answers and restart the survey. Continue?")){
                localStorage.removeItem("surveyResponses");
                localStorage.removeItem("surveyPage");
                localStorage.removeItem("surveyName");
                localStorage.removeItem("surveyTaken");

                responses = [];
                participantName = "";
                page = -1;

                // progress bar reset
                updateProgress();

                loadPage();
            }
        };

        nextBtn.innerText = "Submit";
        return;
    }

    // ---------- Survey Page ----------
    document.getElementById("surveyImage").style.display="block";

    updateProgress();

    const item = surveyItems[page];

    // document.getElementById("surveyImage").src = item.img;
    const imgEl = document.getElementById("surveyImage");

    // fade out before loading
    imgEl.style.opacity = 0;

    // load image
    imgEl.onload = () => {
        imgEl.style.opacity = 1;
    };

    imgEl.src = item.img;

    // 🔥 Preload NEXT image
    const nextItem = surveyItems[page + 1];
    if (nextItem) {
        const img = new Image();
        img.src = nextItem.img;
    }



    const matchName = item.text.match(/Name: (\w+)/);
    const matchHeight = item.text.match(/Height: ([^\.]+)/);
    const matchTats = item.text.match(/Visible Tattoos: ([YN])/);
    const matchHeritage = item.text.match(/Heritage: (\w+)/);

    document.getElementById("player-name").innerText = matchName ? matchName[1] : "";
    document.getElementById("info-bubbles").innerHTML = `
        <span>Height: ${matchHeight?matchHeight[1]:""}</span>
        <span>Tattoos: ${matchTats?matchTats[1]:""}</span>
        <span>From: ${matchHeritage?matchHeritage[1]:""}</span>
    `;

    // Questions & bubbles
    let html = "";
    surveyQuestions.forEach((q,index)=>{
        const i=index+1;
        const saved=responses[page]?.scores?.[index];
        html+=`
        <div class="question">
            <p>${q}</p>
            <div class="bubble-row">
                ${[0,1,2,3,4,5].map(v=>`
                    <label>
                        <input type="radio" name="q${i}" value="${v}" ${saved==v?"checked":""}>
                        <span>${v}</span>
                    </label>
                `).join("")}
            </div>
        </div>
        `;
    });
    document.getElementById("questions").innerHTML = html;

    const radios = document.querySelectorAll("input[type=radio]");
    radios.forEach(r=>{
        r.addEventListener("change",checkAllAnswered);
    });

    checkAllAnswered();

    // focus first bubble for tab navigation
    setTimeout(()=>{
        const firstBubble = document.querySelector('input[name="q1"]');
        if(firstBubble){ firstBubble.focus(); }
    },50);
}

// ------------------- Progress -------------------
function updateProgress(){
    const total = surveyItems.length;

    // Make sure elements exist
    const fillEl = document.getElementById("progress-fill");
    const textEl = document.getElementById("progress-text");
    if(!fillEl || !textEl) return;

    let currentPageText, fill;

    if(page < 0){
        currentPageText = 0;
        fill = 0;
    } else if(page >= total){ // end page
        currentPageText = total;  // show 15/15
        fill = 100;
    } else { 
        currentPageText = page + 1;
        fill = (page / total) * 100;
    }

    fillEl.style.width = fill + "%";
    textEl.innerText = `${currentPageText} / ${total}`;
}

// ------------------- Check Answers -------------------
function checkAllAnswered(){
    let complete=true;
    for(let i=1;i<=surveyQuestions.length;i++){
        if(!document.querySelector(`input[name="q${i}"]:checked`)){
            complete=false;
            break;
        }
    }
    document.getElementById("nextBtn").disabled = !complete;
}

// ------------------- Navigation -------------------
function nextPage(){
    if(page>=0 && page<surveyItems.length){
        let answers=[];
        for(let i=1;i<=surveyQuestions.length;i++){
            const checked=document.querySelector(`input[name="q${i}"]:checked`);
            answers.push(checked.value);
        }
        responses[page]={player:surveyItems[page].player,scores:answers};
        localStorage.setItem("surveyResponses",JSON.stringify(responses));
    }
    page++;
    localStorage.setItem("surveyPage",page);
    loadPage();
}

function prevPage(){
    page--;
    localStorage.setItem("surveyPage",page);
    loadPage();
}

// ------------------- Submit -------------------
function submitSurvey(){
    const featureText=document.getElementById("featureInput")?.value || "";
    const payload={
        name:participantName,
        features:featureText,
        responses:responses
    };
    fetch("https://script.google.com/macros/s/AKfycbzFaLXQI70utF-tR1tiuxN8Rh-XfWGtxYYaPiPVm2RnJ7E-88xqFcwi_vMbmy-GzH1F/exec",{
        method:"POST",
        body:JSON.stringify(payload)
    });
    localStorage.setItem("surveyTaken","true");
    document.body.innerHTML="<h2 style='text-align:center'>Survey submitted. Thank you!</h2>";
}

// ------------------- Start -------------------
window.addEventListener("DOMContentLoaded", ()=>{
    if(localStorage.getItem("surveyTaken")==="true"){
        showDuplicateCheck();
    } else {
        document.getElementById("nextBtn").onclick = ()=>{
            if(page===surveyItems.length){ submitSurvey(); }
            else{ nextPage(); }
        };
        document.getElementById("backBtn").onclick = prevPage;
        loadPage();
    }
});