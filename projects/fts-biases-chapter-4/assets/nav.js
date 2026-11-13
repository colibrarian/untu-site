// Slide order. Add new slide files here; navigation, counter and keys follow automatically.
const SLIDES = [
  "index.html",
  "c4-01-question.html",
  "c4-02-speech.html",
  "c4-02s-speech.html",
  "c4-02t-tricks.html",
  "c4-03-bias-vs-fallacy.html",
  "f5-c4-04-emotion.html",
  "c4-05-authority.html",
  "c4-06-experience.html",
  "c4-07-hunt-1.html",
  "c4-07-hunt-2.html",
  "c4-09-auction.html",
  "c4-09-half-a.html",
  "c4-09-half-b.html",
  "f5-c4-10-new-old.html",
  "c4-11-teleology.html",
  "c4-12-quiz.html",
  "c4-13-catch.html",
  "c4-15-end.html"
];

// Slide titles for the overview (O). Keep in sync when adding slides.
const TITLES = {
 "index.html": "Cover",
 "c4-01-question.html": "Who is pushing me",
 "c4-02-speech.html": "Count the tricks",
 "c4-02s-speech.html": "The speech",
 "c4-02t-tricks.html": "The tricks",
 "c4-03-bias-vs-fallacy.html": "Bias vs fallacy",
 "f5-c4-04-emotion.html": "Appeal to emotion",
 "c4-05-authority.html": "Appeal to authority",
 "c4-06-experience.html": "Appeal to personal experience",
 "c4-07-hunt-1.html": "Hunt for tricks 1",
 "c4-07-hunt-2.html": "Hunt for tricks 2",
 "c4-09-auction.html": "Method auction",
 "c4-09-half-a.html": "Auction: half A",
 "c4-09-half-b.html": "Auction: half B",
 "f5-c4-10-new-old.html": "Novelty and tradition",
 "c4-11-teleology.html": "Teleology",
 "c4-12-quiz.html": "Quiz: name the trick",
 "c4-13-catch.html": "Catch it in yourself",
 "c4-15-end.html": "End"
};

const CHAPTER_COLOURS = ["var(--c0)", "var(--c1)", "var(--c2)", "var(--c3)", "var(--c4)"];

// First slide of each chapter: map cards and the chapters page link here.
const CHAPTER_START = ["../fts-biases-chapter-0/", "../fts-biases-chapter-1/", "../fts-biases-chapter-2/", "../fts-biases-chapter-3/", "../fts-biases-chapter-4/"];

(function () {
  let file = location.pathname.split("/").pop() || "index.html";
  // Cloudflare Pages serves slides without .html (pretty URLs): add it back
  if (!file.endsWith(".html")) file += ".html";
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
  const here = 4;
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
