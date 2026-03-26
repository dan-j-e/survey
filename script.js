// ------------------- Survey Data -------------------
const imageLibrary = [
    {player:"Christian Braun",   img:"images_v2/Christian.png", text:"Name: Christian. Height: 6'6''. Heritage: North America. Body Mods: N"},
    {player:"Bobi Klintman",     img:"images_v2/Bobi.png",      text:"Name: Bobi. Height: 6'9''. Heritage: Europe. Body Mods: Y"},
    {player:"Corey Kispert",     img:"images_v2/Corey.png",     text:"Name: Corey. Height: 6'6''. Heritage: North America. Body Mods: N"},
    {player:"Yuki Kawamura",     img:"images_v2/Yuki.png",      text:"Name: Yuki. Height: 5'7''. Heritage: Asia. Body Mods: N"},
    {player:"Dante Exum",        img:"images_v2/Dante.png",     text:"Name: Dante. Height: 6'5''. Heritage: Oceania. Body Mods: Y"},
    {player:"Domantas Sabonis",  img:"images_v2/Domas.png",     text:"Name: Domantas. Height: 6'10''. Heritage: Europe. Body Mods: N"},
    {player:"Dyson Daniels",     img:"images_v2/Dyson.png",     text:"Name: Dyson. Height: 6'7''. Heritage: Oceania. Body Mods: N"},
    {player:"Franz Wagner",      img:"images_v2/Franz.png",     text:"Name: Franz. Height: 6'10''. Heritage: Europe. Body Mods: N"},
    {player:"Jalen Brunson",     img:"images_v2/Jalen.png",     text:"Name: Jalen. Height: 6'2''. Heritage: North America. Body Mods: N"},
    {player:"Rui Hachimura",     img:"images_v2/Rui.png",       text:"Name: Rui. Height: 6'7''. Heritage: Asia. Body Mods: Y"}
];

const surveyQuestions = [
    "Please rate your level of attraction to his smile.",
    "Please rate your level of attraction to his hairstyle/grooming.",
    "Please rate your level of attraction to his eyes.",
    "Please rate your level of attraction to his listed height.",
    "Please rate your overall level of attraction."
];

const surveyItems = imageLibrary.slice(0, 10);

// ------------------- State -------------------
let page = Number(localStorage.getItem("surveyPage")) || -1;
let responses = JSON.parse(localStorage.getItem("surveyResponses")) || [];
let participantName = localStorage.getItem("surveyName") || "";

// ------------------- Duplicate Check with Token -------------------
const RESET_TOKEN = "DanielIsHandsomeToken";

function showDuplicateCheck() {
    document.body.innerHTML = `
        <div style="text-align:center;margin-top:100px;max-width:600px;margin:auto;">
            <h2>This survey has already been completed.</h2>
            <p>If you need to redo it, please contact Daniel and get a reset token.</p>
            <p><b>Enter reset token here:</b></p>
            <input id="resetTokenInput" type="text" placeholder="Enter token"
                style="padding:10px;width:70%;border-radius:6px;border:1px solid #ccc;">
            <div id="resetTokenError" style="color:red;margin-top:8px;"></div>
            <br><br>
            <button id="resetTokenBtn"
                style="padding:10px 20px;border-radius:6px;border:none;background:#F8B259;cursor:pointer;font-weight:bold;">
                Submit Token
            </button>
        </div>
    `;

    document.getElementById("resetTokenBtn").onclick = () => {
        const token = document.getElementById("resetTokenInput").value.trim();
        const errorEl = document.getElementById("resetTokenError");
        if (token === RESET_TOKEN) {
            alert("Token accepted. You will now be redirected to the survey start.");
            ["surveyTaken","surveyResponses","surveyPage","surveyName"].forEach(k => localStorage.removeItem(k));
            location.reload();
        } else {
            errorEl.innerText = "Invalid token. Please contact Daniel for a valid token.";
        }
    };
}

// ------------------- Load Page -------------------
function loadPage() {
    const nextBtn = document.getElementById("nextBtn");
    const backBtn = document.getElementById("backBtn");

    nextBtn.innerText = "Next";
    backBtn.style.display = page <= -1 ? "none" : "inline-block";

    // ---------- Welcome Page ----------
    if (page === -1) {
        document.getElementById("surveyImage").style.display = "none";
        document.getElementById("player-name").innerText = "";
        document.getElementById("info-bubbles").innerHTML = "";

        document.getElementById("questions").innerHTML = `
            <div style="text-align:center;max-width:500px;margin:auto;">
                <h2>Welcome.</h2>
                <h3>I'm Daniel, somehow you know me.<br>Here is my survey.</h3>
                <p>The following questions relate to a presentation that will be held later in April.
                Please answer honestly and only once. Some questions may not fit on your screen,
                if so, please scroll.</p>
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
    if (page === surveyItems.length) {
        document.getElementById("surveyImage").style.display = "none";
        document.getElementById("player-name").innerText = "";
        document.getElementById("info-bubbles").innerHTML = "";

        document.getElementById("questions").innerHTML = `
            <div style="text-align:center;max-width:500px;margin:auto;">
                <h2>Thank you for your time!</h2>
                <p>It would greatly help our research if you could provide a few features you find attractive.
                The more you can offer, the more we can all learn!<br>This response will be recorded anonymously.</p>
                <textarea id="featureInput"
                    placeholder="Sample responses:
1. I like dudes with no hair and lots of piercings...
2. I think income is an important feature...
3. Daniel, can I get a reward?..."
                    style="width:100%;height:100px;padding:10px;border-radius:8px;border:1px solid #ccc;"></textarea>
                <br><br>
                <button id="resetBtn"
                    style="padding:10px 20px;border-radius:8px;border:none;background:#ccc;cursor:pointer;font-weight:bold;">
                    Back to start?
                </button>
            </div>
        `;

        updateProgress();

        document.getElementById("resetBtn").onclick = () => {
            if (confirm("This will erase all your answers and restart the survey. Continue?")) {
                ["surveyResponses","surveyPage","surveyName","surveyTaken"].forEach(k => localStorage.removeItem(k));
                responses = [];
                participantName = "";
                page = -1;
                updateProgress();
                loadPage();
            }
        };

        nextBtn.innerText = "Submit";
        return;
    }

    // ---------- Survey Page ----------
    document.getElementById("surveyImage").style.display = "block";

    updateProgress();

    const item = surveyItems[page];
    const imgEl = document.getElementById("surveyImage");

    imgEl.style.opacity = 0;
    imgEl.onload = () => { imgEl.style.opacity = 1; };
    imgEl.src = item.img;

    // Preload next image
    const nextItem = surveyItems[page + 1];
    if (nextItem) {
        const preload = new Image();
        preload.src = nextItem.img;
    }

    // Parse text fields
    const matchName     = item.text.match(/Name: (\w+)/);
    const matchHeight   = item.text.match(/Height: ([^.]+)/);
    const matchHeritage = item.text.match(/Heritage: ([^.]+)/);
    const matchMods     = item.text.match(/Body Mods: ([YN])/);

    document.getElementById("player-name").innerText = matchName ? matchName[1] : "";
    document.getElementById("info-bubbles").innerHTML = `
        <span>Height: ${matchHeight   ? matchHeight[1].trim()   : ""}</span>
        <span>From: ${matchHeritage  ? matchHeritage[1].trim() : ""}</span>
        <span>Body Mods: ${matchMods ? matchMods[1]            : ""}</span>
    `;

    // Questions
    let html = "";
    surveyQuestions.forEach((q, index) => {
        const i = index + 1;
        const saved = responses[page]?.scores?.[index];
        html += `
            <div class="question">
                <p>${q}</p>
                <div class="bubble-row">
                    ${[0,1,2,3,4,5].map(v => `
                        <label>
                            <input type="radio" name="q${i}" value="${v}" ${saved == v ? "checked" : ""}>
                            <span>${v}</span>
                        </label>
                    `).join("")}
                </div>
            </div>
        `;
    });
    document.getElementById("questions").innerHTML = html;

    document.querySelectorAll("input[type=radio]").forEach(r => {
        r.addEventListener("change", checkAllAnswered);
    });

    checkAllAnswered();

    setTimeout(() => {
        const firstBubble = document.querySelector('input[name="q1"]');
        if (firstBubble) firstBubble.focus();
    }, 50);
}

// ------------------- Progress -------------------
function updateProgress() {
    const total = surveyItems.length;
    const fillEl = document.getElementById("progress-fill");
    const textEl = document.getElementById("progress-text");
    if (!fillEl || !textEl) return;

    let currentPageText, fill;
    if (page < 0) {
        currentPageText = 0;
        fill = 0;
    } else if (page >= total) {
        currentPageText = total;
        fill = 100;
    } else {
        currentPageText = page + 1;
        fill = (page / total) * 100;
    }

    fillEl.style.width = fill + "%";
    textEl.innerText = `${currentPageText} / ${total}`;
}

// ------------------- Check Answers -------------------
function checkAllAnswered() {
    const complete = surveyQuestions.every((_, i) =>
        document.querySelector(`input[name="q${i + 1}"]:checked`)
    );
    document.getElementById("nextBtn").disabled = !complete;
}

// ------------------- Navigation -------------------
function nextPage() {
    if (page >= 0 && page < surveyItems.length) {
        const answers = surveyQuestions.map((_, i) =>
            document.querySelector(`input[name="q${i + 1}"]:checked`).value
        );
        responses[page] = {player: surveyItems[page].player, scores: answers};
        localStorage.setItem("surveyResponses", JSON.stringify(responses));
    }
    page++;
    localStorage.setItem("surveyPage", page);
    loadPage();
}

function prevPage() {
    page--;
    localStorage.setItem("surveyPage", page);
    loadPage();
}

// ------------------- Submit -------------------
function submitSurvey() {
    const featureText = document.getElementById("featureInput")?.value || "";
    const payload = {
        name: participantName,
        features: featureText,
        responses: responses
    };
    fetch("https://script.google.com/macros/s/AKfycbzFaLXQI70utF-tR1tiuxN8Rh-XfWGtxYYaPiPVm2RnJ7E-88xqFcwi_vMbmy-GzH1F/exec", {
        method: "POST",
        body: JSON.stringify(payload)
    });
    localStorage.setItem("surveyTaken", "true");
    document.body.innerHTML = "<h2 style='text-align:center'>Survey submitted. Thank you!</h2>";
}

// ------------------- Start -------------------
window.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("surveyTaken") === "true") {
        showDuplicateCheck();
    } else {
        document.getElementById("nextBtn").onclick = () => {
            if (page === surveyItems.length) submitSurvey();
            else nextPage();
        };
        document.getElementById("backBtn").onclick = prevPage;
        loadPage();
    }
});