const SPRUCE_EMAIL = "office@readywellpsych.com";
const SCALE = {
  1: "Never or rarely",
  2: "Occasionally",
  3: "Sometimes",
  4: "Often",
  5: "Very often"
};
const ITEMS = [
  "I started projects, hobbies, or games with excitement but lost interest quickly.",
  "Teachers or parents said I was \"smart but inconsistent\" or \"not applying myself.\"",
  "I made careless mistakes on schoolwork even when I knew the material.",
  "I needed last-minute pressure to finish assignments or chores.",
  "My room, desk, or backpack were usually messy or disorganized.",
  "I had trouble sitting still or staying in one place for long.",
  "I talked a lot, even when it was not my turn.",
  "I blurted things out or interrupted others frequently.",
  "I acted impulsively and sometimes got in trouble for it.",
  "I had difficulty waiting my turn in games or group activities.",
  "I became upset or frustrated easily when plans changed.",
  "Small setbacks - losing a game or an item - hit me harder than other kids.",
  "I often felt mentally overloaded, like my brain had too many tabs open.",
  "I craved stimulation - games, arguments, excitement - over quiet activities.",
  "Adults often told me I overreacted or was too sensitive.",
  "My grades were inconsistent - great in some subjects, poor in others.",
  "I relied on intelligence or charm more than organization or study habits.",
  "I had trouble following multi-step directions or projects.",
  "I paid attention to teachers I liked but tuned out with others.",
  "I forgot to turn in assignments I had already completed.",
  "I felt different - more distracted, intense, or bored than other kids.",
  "Adults misunderstood me as lazy, defiant, or careless.",
  "I realized early that my brain did not work like everyone else's.",
  "I coped by using humor, perfectionism, avoidance, or rebellion.",
  "I wish someone had recognized ADHD earlier and helped me understand it."
];

const partA = document.getElementById("partA");
ITEMS.forEach((text, i) => {
  const n = i + 1;
  const code = String(n).padStart(2, "0");
  partA.insertAdjacentHTML("beforeend", `
    <div class="item">
      <p><span class="code">${code}.</span> ${text}</p>
      <div class="scale">
        ${[1,2,3,4,5].map(v => `<label><input type="radio" name="I${n}" value="${v}" required> ${v}<small>${SCALE[v]}</small></label>`).join("")}
      </div>
    </div>`);
});

document.getElementById("date").valueAsDate = new Date();

function val(name) {
  const el = document.querySelector(`[name="${name}"]:checked`);
  return el ? el.value : null;
}
function num(name) {
  const v = val(name);
  return v === null ? null : Number(v);
}
function bandFor(total) {
  if (total >= 80) return "80+. Suggests clinically significant ADHD traits in childhood.";
  if (total >= 60) return "60 to 79. Probable pattern. Worth a fuller diagnostic interview.";
  return "Under 60. Minor traits. Consider other explanations for the presenting concern.";
}

function score() {
  const initialsCheck = document.getElementById("name").value.trim();
  if (!initialsCheck) {
    alert("Please enter initials.");
    document.getElementById("name").focus();
    return;
  }
  const ratings = ITEMS.map((_, i) => num("I" + (i + 1)));
  if (ratings.some(v => v === null)) {
    alert("Please answer every item (1–5).");
    return;
  }
  const total = ratings.reduce((s, n) => s + n, 0);
  const name = document.getElementById("name").value.trim();
  const date = document.getElementById("date").value || "";
  const visit = document.getElementById("visit").value || "not given";
  const age = document.getElementById("age").value || "n/a";
  const band = bandFor(total);
  let html = `
    <div class="score-row"><span>Initials</span><strong>${name}</strong></div>
    <div class="score-row"><span>Completed</span><strong>${date || "not dated"}</strong></div>
    <div class="score-row"><span>Age</span><strong>${age}</strong></div>
    <div class="score-row"><span>Next visit</span><strong>${visit}</strong></div>
    <div class="score-row"><span>Total (25–125)</span><strong>${total} / 125</strong></div>
    <div class="score-row"><span>Band</span><strong>${band}</strong></div>
  `;
  document.getElementById("resultBody").innerHTML = html;
  document.getElementById("results").classList.add("show");
  const lines = [
    "ADHD-CA",
    "Initials: " + name,
    "Completed: " + (date || "n/a"),
    "Age: " + age,
    "Next visit: " + visit,
    "Score: " + total + " / 125",
    "Band: " + band,
    "",
    "Item, rating, label"
  ];
  ITEMS.forEach((stem, i) => {
    const n = ratings[i];
    lines.push("");
    lines.push((i + 1) + ". " + stem);
    lines.push("Answer: " + n + "  " + SCALE[n]);
  });
  window._ocsSummary = lines.join("\n");
  const box = document.getElementById("summaryBox");
  if (box) box.value = window._ocsSummary;
  document.getElementById("results").scrollIntoView({ behavior: "smooth" });
  return true;
}

function copySummary() {
  const box = document.getElementById("summaryBox");
  const status = document.getElementById("copyStatus");
  if (!window._ocsSummary) {
    if (!score()) return false;
  }
  box.value = window._ocsSummary;
  box.focus();
  box.select();
  box.setSelectionRange(0, box.value.length);
  let ok = false;
  try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
  if (!ok && navigator.clipboard) {
    navigator.clipboard.writeText(window._ocsSummary).then(() => {
      status.textContent = "Summary copied.";
    }).catch(() => {
      status.textContent = "Select the box and copy (Ctrl+C or Cmd+C).";
    });
    return true;
  }
  status.textContent = ok ? "Summary copied." : "Select the box and copy (Ctrl+C or Cmd+C).";
  return ok;
}

function openGmail() {
  if (!score()) return;
  copySummary();
  const subject = "FOR REVIEW : ADHD-CA screener";
  let body = window._ocsSummary;
  if (body.length > 1500) {
    body = body.slice(0, 1500) + "\n\n[Gmail cut the rest. Paste the copied summary.]";
  }
  const gmail = "https://mail.google.com/mail/?view=cm&fs=1&tf=1"
    + "&to=" + encodeURIComponent(SPRUCE_EMAIL)
    + "&su=" + encodeURIComponent(subject)
    + "&body=" + encodeURIComponent(body);
  const a = document.createElement("a");
  a.href = gmail;
  a.target = "_blank";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  document.getElementById("copyStatus").textContent =
    "Gmail draft should open in a new tab. If it did not, paste the box into Gmail.";
}

document.getElementById("scoreBtn").onclick = score;
document.getElementById("gmailBtn").onclick = openGmail;
document.getElementById("copyBtn").onclick = copySummary;
document.getElementById("printBtn").onclick = () => {
  if (!window._ocsSummary) score();
  window.print();
};
