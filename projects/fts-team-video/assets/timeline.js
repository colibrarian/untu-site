// Footer = a video editor timeline: every slide is one clip on the track,
// played clips are ink, the current clip is violet, the red line is the playhead.
window.FTSTimeline = function (foot, i, N, hrefOf, onPick) {
  const tc = (n) => "00:" + String(n).padStart(2, "0") + ":00";
  let segs = "";
  for (let n = 0; n < N; n++) {
    const cls = n < i ? "done" : n === i ? "cur" : "";
    segs += `<a href="${hrefOf(n)}" class="${cls}" aria-label="Slide ${n + 1}"${n === i ? ' aria-current="true"' : ""}><i></i><i></i><i></i></a>`;
  }
  foot.innerHTML =
    `<a href="${i > 0 ? hrefOf(i - 1) : "#"}" aria-disabled="${i <= 0}">← Back</a>` +
    `<div class="tl">${segs}<span class="head" style="left:${((i + 0.5) / N) * 100}%"></span></div>` +
    `<span class="tc">${tc(i + 1)}</span>` +
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
