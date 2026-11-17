// Footer = a row of cinema seats: one seat per slide. Taken seats are ink, yours is red.
window.FTSTimeline = function (foot, i, N, hrefOf, onPick) {
  const rows = "ABCDEFGH";
  let seats = "";
  for (let n = 0; n < N; n++) {
    const cls = n < i ? "done" : n === i ? "cur" : "";
    seats += `<a href="${hrefOf(n)}" class="${cls}" aria-label="Slide ${n + 1}"${n === i ? ' aria-current="true"' : ""}></a>`;
  }
  foot.innerHTML =
    `<a href="${i > 0 ? hrefOf(i - 1) : "#"}" aria-disabled="${i <= 0}">← Back</a>` +
    `<div class="seats">${seats}</div>` +
    `<span class="row">Seat ${i + 1} / ${N}</span>` +
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
