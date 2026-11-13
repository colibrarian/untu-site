// Slide order. Add new slide files here; navigation and the footer timeline follow automatically.
const SLIDES = [
  "index.html",
  "02-roles.html",
  "03-script.html",
  "04-format.html",
  "05-settings.html",
  "06-sound.html",
  "07-editing.html",
  "08-language.html",
  "09-caption.html",
  "10-tags.html",
  "11-checklist.html"
];

(function () {
  // works with and without ".html" in the address (clean URLs on untu.ngo)
  let file = location.pathname.split("/").pop() || "index.html";
  if (!file.endsWith(".html")) file += ".html";
  const i = Math.max(0, SLIDES.indexOf(file));
  const N = SLIDES.length;

  const foot = document.querySelector(".foot");
  if (foot) window.FTSTimeline(foot, i, N, (n) => SLIDES[n]);

  const steps = Array.from(document.querySelectorAll(".reveal"));
  let shown = 0;
  function forward() {
    if (shown < steps.length) { steps[shown++].classList.add("on"); return; }
    if (i < N - 1) location.href = SLIDES[i + 1];
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

  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (k === "n") { document.body.classList.toggle("notes"); return; }
    if (k === "f") {
      if (document.fullscreenElement) document.exitFullscreen?.();
      else document.documentElement.requestFullscreen?.().catch(() => {});
      return;
    }
    if (e.key === "Home") location.href = SLIDES[0];
    if (e.key === "End") location.href = SLIDES[N - 1];
    if (["ArrowRight", "PageDown", " ", "Enter"].includes(e.key)) { e.preventDefault(); forward(); }
    if (["ArrowLeft", "PageUp", "Backspace"].includes(e.key)) { e.preventDefault(); back(); }
  });
  document.querySelector(".content")?.addEventListener("click", forward);
})();
