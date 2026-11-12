// Slide order. Add new slide files here; navigation, counter and keys follow automatically.
const SLIDES = [
  "index.html",
  "c1-00-map.html",
  "c1-01-question.html",
  "c1-02a-station-1.html",
  "c1-02b-station-2.html",
  "c1-02b-half-a.html",
  "c1-02b-half-b.html",
  "c1-02c-station-3.html",
  "c1-02c-half-a.html",
  "c1-02c-half-b.html",
  "c1-03-pause.html",
  "c1-04-confirmation.html",
  "c1-05-anchoring.html",
  "c1-06-framing.html",
  "c1-07-availability.html",
  "c1-08-priming.html",
  "c1-12-evidence.html",
  "c1-09-groups.html",
  "c1-10-catch.html"
];

// Slide titles for the overview (O). Keep in sync when adding slides.
const TITLES = {
 "index.html": "Cover",
 "c1-00-map.html": "Map: chapter 1",
 "c1-01-question.html": "What do I notice",
 "c1-02a-station-1.html": "Station 1: guess the rule",
 "c1-02b-station-2.html": "Station 2: estimate",
 "c1-02b-half-a.html": "Station 2: half A",
 "c1-02b-half-b.html": "Station 2: half B",
 "c1-02c-station-3.html": "Station 3: choose",
 "c1-02c-half-a.html": "Station 3: half A",
 "c1-02c-half-b.html": "Station 3: half B",
 "c1-03-pause.html": "Pause: compare",
 "c1-04-confirmation.html": "Confirmation bias",
 "c1-05-anchoring.html": "Anchoring",
 "c1-06-framing.html": "Framing",
 "c1-07-availability.html": "Availability heuristic",
 "c1-08-priming.html": "Priming",
 "c1-12-evidence.html": "Not every bias holds up",
 "c1-09-groups.html": "Quiz: find the filter",
 "c1-10-catch.html": "Catch it in yourself"
};

const CHAPTER_COLOURS = ["var(--c0)", "var(--c1)", "var(--c2)", "var(--c3)", "var(--c4)"];

// First slide of each chapter: map cards and the chapters page link here.
const CHAPTER_START = ["../fts-biases-chapter-0/", "../fts-biases-chapter-1/", null, null, null];

(function () {
  const file = location.pathname.split("/").pop() || "index.html";
  const i = SLIDES.indexOf(file);
  const ch = document.body.dataset.chapter;
  if (ch !== undefined && CHAPTER_COLOURS[ch]) {
    document.documentElement.style.setProperty("--chap", CHAPTER_COLOURS[ch]);
  }

  // footer: prev · counter · next
  const foot = document.querySelector(".foot");
  if (foot) {
    const prev = i > 0 ? SLIDES[i - 1] : null;
    const next = i >= 0 && i < SLIDES.length - 1 ? SLIDES[i + 1] : null;
    foot.innerHTML =
      `<a href="${prev || "#"}" aria-disabled="${!prev}">← Back</a>` +
      `<span><a href="../fts-library#critical-thinking" class="home">FTS Library</a> ${i + 1} / ${SLIDES.length}</span>` +
      `<a href="${next || "#"}" aria-disabled="${!next}">Next →</a>`;
  }

  // step-by-step reveals before moving on
  const steps = Array.from(document.querySelectorAll(".reveal"));
  let shown = 0;
  function forward() {
    if (shown < steps.length) { steps[shown++].classList.add("on"); return; }
    if (i >= 0 && i < SLIDES.length - 1) location.href = SLIDES[i + 1];
  }
  function back() {
    if (shown > 0) { steps[--shown].classList.remove("on"); return; }
    if (i > 0) location.href = SLIDES[i - 1];
  }
  // N: trainer note (the first HTML comment in <body>)
  const noteText = Array.from(document.body.childNodes).find((n) => n.nodeType === 8)?.textContent.trim();
  const note = document.createElement("aside");
  note.className = "note";
  note.textContent = noteText || "";
  document.body.appendChild(note);

  // O: overview of the current chapter, with links to the other chapters
  const chapterOf = (f) => (/^c(\d)-/.exec(f) || [0, 0])[1] * 1;
  const here = 1;
  const ov = document.createElement("div");
  ov.className = "overview";
  ov.hidden = true;
  ov.innerHTML =
    `<div class="ov-panel"><div class="ov-chapters">` +
    CHAPTER_START.filter(Boolean).map((f, n) => `<a href="${f}"${n === here ? ' aria-current="true"' : ""}>${n}</a>`).join("") +
    `<a href="../fts-library#critical-thinking">FTS Library</a></div><ol class="ov-list">` +
    SLIDES.map((f, n) => [f, n])
      .map(([f, n]) => `<li><a href="${f}"${f === file ? ' aria-current="true"' : ""}><b>${n + 1}</b> ${TITLES[f] || f}</a></li>`).join("") +
    `</ol><p class="ov-keys">← → move · F fullscreen · O close</p></div>`;
  document.body.appendChild(ov);
  ov.addEventListener("click", (e) => { if (e.target === ov) ov.hidden = true; });

  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (k === "o" || (k === "escape" && !ov.hidden)) { ov.hidden = !ov.hidden || k === "escape"; return; }
    if (!ov.hidden) return;
    
    if (k === "f") {
      if (document.fullscreenElement) document.exitFullscreen?.();
      else document.documentElement.requestFullscreen?.().catch(() => {});
      return;
    }
    if (["ArrowRight", "PageDown", " ", "Enter"].includes(e.key)) { e.preventDefault(); forward(); }
    if (["ArrowLeft", "PageUp", "Backspace"].includes(e.key)) { e.preventDefault(); back(); }
  });
  document.querySelector(".content")?.addEventListener("click", forward);

  // map slides: each chapter card opens that chapter
  document.querySelectorAll(".map .card").forEach((card, n) => {
    if (!CHAPTER_START[n]) return;
    card.style.cursor = "pointer";
    card.addEventListener("click", (e) => { e.stopPropagation(); location.href = CHAPTER_START[n]; });
  });
})();
