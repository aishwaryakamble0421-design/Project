/* ================================
   QUIZ DATA (3 sets)
================================= */
const sets = [
  {
    id: 'interests',
    title: 'Set 1 — Interests',
    description: 'Which activities attract you the most? Pick what feels natural.',
    questions: [
      {q: 'Which activity makes you lose track of time?', opts: ['Creating or designing','Solving technical/logical problems','Talking/helping people','Learning about business/money']},
      {q: 'What content do you enjoy watching the most?', opts: ['Art/editing/design videos','Tech / coding / science','Motivation / psychology','Business / startup journeys']},
      {q: 'What school/college subject feels the most interesting?', opts: ['Art / English / Media','Math / Computers / Physics','Psychology / Sociology','Business / Economics']},
      {q: 'Which activity would you choose on a boring day?', opts: ['Draw, edit, write','Play logic games / fix tech','Talk to a friend / help someone','Think of ideas / make plans']},
      {q: 'If you could try a job for one week, what would it be?', opts: ['Designer/creator','Software developer','Counselor/teacher','Entrepreneur']}
    ],
    labels: ['Creative Interest','Technical Interest','People/Communication Interest','Business/Strategic Interest'],
    descriptions: [
      'You enjoy expression, design and making. Careers: designer, content creator, UX/UI, artist.',
      'You enjoy systems, logic and tech. Careers: developer, data analyst, engineer.',
      'You enjoy people, communication and helping. Careers: counselor, HR, teacher, customer success.',
      'You enjoy strategy and business. Careers: entrepreneur, product manager, business analyst.'
    ]
  },

  {
    id: 'skills',
    title: 'Set 2 — Skills',
    description: 'What are you naturally good at? Choose honestly.',
    questions: [
      {q: 'What do people usually come to you for?', opts: ['Creative ideas','Technical help','Advice / emotional support','Organizing or planning']},
      {q: 'What task feels easy to you?', opts: ['Designing / editing / imagining','Solving tech problems','Explaining concepts','Managing tasks / leading team']},
      {q: 'Which role do you naturally take in groups?', opts: ['Creator','Problem-solver','Communicator','Leader']},
      {q: 'What describes your learning style?', opts: ['Visual','Logical','Social','Practical / hands-on']},
      {q: 'What is your strongest strength?', opts: ['Creativity','Analysis','Empathy','Management']}
    ],
    labels: ['Creative Skills','Technical Skills','People/Communication Skills','Management/Leadership Skills'],
    descriptions: [
      'You bring original ideas and visual sense. Roles: designer, content maker, creative lead.',
      'You solve problems with logic. Roles: developer, analyst, engineer.',
      'You connect with people and explain well. Roles: trainer, counselor, customer-facing roles.',
      'You coordinate and lead teams. Roles: manager, project lead, operations.'
    ]
  },

  {
    id: 'goals',
    title: 'Set 3 — Goals',
    description: 'What do you want your work / life to look like?',
    questions: [
      {q: 'What future lifestyle attracts you?', opts: ['Artistic + Free','High-tech + Innovative','Social + Impactful','Business + Growth']},
      {q: 'What motivates you the most?', opts: ['Expression','Achievement','Helping others','Earning and growth']},
      {q: 'Which long-term goal fits you best?', opts: ['Build a creative portfolio','Master a technical skill','Improve communication & confidence','Start a business']},
      {q: 'What scares you most?', opts: ['Losing creativity','Not being skilled','Choosing wrong path','Not earning well']},
      {q: 'What kind of impact do you want your future job to have?', opts: ['Make world more creative','Solve technical problems','Improve people’s lives','Build or grow businesses']}
    ],
    labels: ['Creative Life Goal','Tech/Innovation Goal','Social/People Goal','Business/Wealth Goal'],
    descriptions: [
      'You want a creative, expressive life. Aim for design or media careers.',
      'You want to innovate. Aim for engineering or tech.',
      'You want to help and connect. Aim for education or community roles.',
      'You want to grow and build value. Aim for business or startups.'
    ]
  }
];

/* ================================
   APP STATE
================================= */
let curSetIndex = 0;
let curQuestionIndex = 0;

const answers = {
  interests: Array(5).fill(null),
  skills: Array(5).fill(null),
  goals: Array(5).fill(null)
};

/* ================================
   ELEMENTS
================================= */
const questionArea = document.getElementById('questionArea');
const resultArea = document.getElementById('resultArea');
const stageLabel = document.getElementById('stageLabel');
const prog = document.getElementById('prog');
const qCount = document.getElementById('qCount');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const skipBtn = document.getElementById('skipBtn');

/* ================================
   RENDER QUESTION
================================= */
function showButtons() {
  nextBtn.style.display = "inline-block";
  skipBtn.style.display = "inline-block";
  prevBtn.style.display = "inline-block";
}

function hideButtons() {
  nextBtn.style.display = "none";
  skipBtn.style.display = "none";
  prevBtn.style.display = "none";
}

function renderQuestion() {
  showButtons();

  const set = sets[curSetIndex];
  const qObj = set.questions[curQuestionIndex];

  stageLabel.textContent = set.title;
  qCount.textContent = `${curQuestionIndex + 1}/${set.questions.length}`;

  const totalQuestions = sets.reduce((a, s) => a + s.questions.length, 0);
  let passed = 0;
  for (let i = 0; i < curSetIndex; i++) passed += sets[i].questions.length;
  passed += curQuestionIndex;
  prog.style.width = Math.round((passed / totalQuestions) * 100) + "%";

  resultArea.classList.add("hidden");
  questionArea.classList.remove("hidden");

  questionArea.innerHTML = `
    <div class="question">
      <div class="q-title">Q${curQuestionIndex + 1}. ${qObj.q}</div>
      <div class="options">
        ${qObj.opts.map((o, i) => {
          const letter = String.fromCharCode(65 + i);
          const selected = answers[set.id][curQuestionIndex] === letter ? "selected" : "";
          return `
            <button class="opt ${selected}" data-letter="${letter}">
              ${letter}. <strong>${o}</strong>
            </button>
          `;
        }).join("")}
      </div>
    </div>
  `;

  document.querySelectorAll(".opt").forEach(btn => {
    btn.onclick = () => {
      answers[set.id][curQuestionIndex] = btn.dataset.letter;
      document.querySelectorAll(".opt").forEach(x => x.classList.remove("selected"));
      btn.classList.add("selected");
    };
  });

  prevBtn.style.visibility =
    (curSetIndex === 0 && curQuestionIndex === 0) ? "hidden" : "visible";
}

/* ================================
   RESULT FOR A SET
================================= */
function showResultForSet(setIndex) {
  hideButtons();  // IMPORTANT FIX

  const set = sets[setIndex];
  const setAnswers = answers[set.id];

  const tally = { A: 0, B: 0, C: 0, D: 0 };
  setAnswers.forEach(a => { if (a) tally[a]++; });

  let winner = "A", max = -1;
  for (const l of ["A", "B", "C", "D"]) {
    if (tally[l] > max) { max = tally[l]; winner = l; }
  }

  if (max === 0) {
    resultArea.innerHTML = `
      <div class="result">
        <h3>No answers yet</h3>
        <p class="subtitle">Try again or skip.</p>
      </div>
    `;
    resultArea.classList.remove("hidden");
    return;
  }

  const idx = { A: 0, B: 1, C: 2, D: 3 }[winner];

  resultArea.innerHTML = `
    <div class="result">
      <h3>Result — ${set.labels[idx]}</h3>
      <div style="margin-bottom:8px;color:var(--muted)">
        ${set.descriptions[idx]}
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn" id="nextSetBtn">Continue</button>
        <button class="btn ghost" id="retakeSetBtn">Retake</button>
      </div>
    </div>
  `;

  resultArea.classList.remove("hidden");

  document.getElementById("nextSetBtn").onclick = () => {
    resultArea.classList.add("hidden");
    if (setIndex < sets.length - 1) {
      curSetIndex++;
      curQuestionIndex = 0;
      renderQuestion();
    } else {
      showFinalSummary();
    }
  };

  document.getElementById("retakeSetBtn").onclick = () => {
    answers[set.id] = Array(set.questions.length).fill(null);
    curQuestionIndex = 0;
    resultArea.classList.add("hidden");
    renderQuestion();
  };
}

/* ================================
   FINAL SUMMARY
================================= */
function showFinalSummary() {
  confetti({
  particleCount: 120,
  spread: 70,
  origin: { y: 0.6 }
});
  hideButtons();

  const results = sets.map(s => {
    const tally = { A: 0, B: 0, C: 0, D: 0 };
    answers[s.id].forEach(a => { if (a) tally[a]++; });

    let winner = "A", max = -1;
    for (const l of ["A", "B", "C", "D"]) {
      if (tally[l] > max) { max = tally[l]; winner = l; }
    }

    const idx = { A: 0, B: 1, C: 2, D: 3 }[winner];
    return { label: s.labels[idx], desc: s.descriptions[idx] };
  });

  questionArea.innerHTML = `
    <div style="padding:10px">
      <h2>Your 3-set Summary</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px">
        ${results.map(r => `
          <div class="card" style="padding:12px;border-radius:8px;background:rgba(255,255,255,0.02)">
            <strong>${r.label}</strong>
            <div style="margin-top:6px;color:var(--muted);font-size:14px">${r.desc}</div>
          </div>
        `).join("")}
      </div>

      <div style="margin-top:12px;display:flex;gap:8px">
        <button class="btn" id="downloadBtn">Download summary</button>
        <button class="btn ghost" id="restartBtn">Restart quiz</button>
      </div>
    </div>
  `;

  stageLabel.textContent = "Done — Summary";
  prog.style.width = "100%";
  qCount.textContent = "";

  document.getElementById("downloadBtn").onclick = () => {
    const text = results.map(r => `${r.label}: ${r.desc}`).join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "career-quiz-summary.txt";
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  document.getElementById("restartBtn").onclick = () => {
    curSetIndex = 0;
    curQuestionIndex = 0;
    answers.interests.fill(null);
    answers.skills.fill(null);
    answers.goals.fill(null);
    prog.style.width = "0%";
    renderQuestion();
  };
}

/* ================================
   BUTTONS
================================= */
nextBtn.onclick = () => {
  const set = sets[curSetIndex];

  if (curQuestionIndex === set.questions.length - 1) {
    showResultForSet(curSetIndex);
    return;
  }

  if (answers[set.id][curQuestionIndex] === null) {
    if (!confirm("You did not choose an answer. Continue?")) return;
  }

  curQuestionIndex++;
  renderQuestion();
};

prevBtn.onclick = () => {
  if (curQuestionIndex > 0) {
    curQuestionIndex--;
    renderQuestion();
    return;
  }

  if (curSetIndex > 0) {
    curSetIndex--;
    curQuestionIndex = sets[curSetIndex].questions.length - 1;
    renderQuestion();
  }
};

skipBtn.onclick = () => {
  if (confirm("Skip this set?")) {
    showResultForSet(curSetIndex);
  }
};

/* ================================
   START QUIZ
================================= */
renderQuestion();