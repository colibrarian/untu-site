// Footer timeline: the whole deck drawn as one audio track. Each slide is a short segment of
// waveform bars; played slides are ink, the current one is blue, the red line is the playhead.
// Used by nav.js (one file per slide) and by build-preview.py (one-page bundle).
window.FTSTimeline = function (foot, i, N, hrefOf, onPick) {
  const pad = (n) => String(n).padStart(2, "0");
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const segs = [];
  for (let n = 0; n < N; n++) {
    let bars = "";
    for (let b = 0; b < 9; b++) {
      const env = Math.sin(Math.PI * (b + 0.5) / 9);
      const h = Math.round(18 + 78 * env * (0.45 + 0.55 * rnd()));
      bars += `<i style="height:${h}%"></i>`;
    }
    const cls = n < i ? "done" : n === i ? "cur" : "";
    segs.push(`<a href="${hrefOf(n)}" class="${cls}" aria-label="Slide ${n + 1}"${n === i ? ' aria-current="true"' : ""}>${bars}</a>`);
  }
  foot.innerHTML =
    `<a href="${i > 0 ? hrefOf(i - 1) : "#"}" aria-disabled="${i <= 0}">← Back</a>` +
    `<div class="tl">${segs.join("")}<span class="head" style="left:${((i + 0.5) / N) * 100}%"></span></div>` +
    `<span class="tc">${pad(i + 1)} / ${pad(N)}</span>` +
    `<a href="${i < N - 1 ? hrefOf(i + 1) : "#"}" aria-disabled="${i >= N - 1}">Next →</a>`;
  if (onPick) {
    foot.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      e.preventDefault(); e.stopPropagation();
      if (a.getAttribute("aria-disabled") === "true") return;
      const list = Array.from(foot.querySelectorAll("a"));
      const k = list.indexOf(a);
      if (k === 0) onPick(i - 1, true);
      else if (k === list.length - 1) onPick(i + 1, false);
      else onPick(k - 1, false);
    });
  }
};
