// ==================== CONSTANTS ====================
const yarnCounts = [6, 10, 17, 26, 32, 40, 60, 84, 100];

const reedMap = {
  6: 28,
  10: 36,
  17: 48,
  26: 52,
  32: 56,
  40: 64,
  60: 72,
  84: 84,
  100: 96
};

// ==================== INIT DROPDOWNS ====================
yarnCounts.forEach(c => {
  warpCount.insertAdjacentHTML("beforeend", `<option value="${c}">${c}s</option>`);
  weftCount.insertAdjacentHTML("beforeend", `<option value="${c}">${c}s</option>`);
});

// ==================== AUTO FILLS ====================
warpCount.onchange = () => {
  const c = Number(warpCount.value);
  reed.value = reedMap[c] || "";
  weftCount.value = c;
  pick.value = reedMap[c] || "";
};

warpPly.oninput = () => {
  weftPly.value = warpPly.value;
};

warpLength.oninput = () => {
  weftLength.value = warpLength.value ? Number(warpLength.value) - 2 : "";
};

warpWidth.oninput = () => {
  weftWidth.value = warpWidth.value ? Number(warpWidth.value) - 2 : "";
};

window.onload = () => {
  weftLength.value = Number(warpLength.value) - 2;
  weftWidth.value = Number(warpWidth.value) - 2;
};

// ==================== COSTING HELPERS (LOCKED) ====================
function effectiveCountForCost(count) {
  const c = Number(count);
  if (c === 84 || c === 100) return c / 2;
  return c;
}

function pataPerBundle(count) {
  const c = Number(count);
  if (c === 84 || c === 100) return 10;
  return 5;
}

// ==================== MAIN CALCULATION ====================
function calculate() {

  // ---------- WARP PATA (UNCHANGED) ----------
  const warpPata =
    (Number(warpWidth.value) *
     Number(reed.value) *
     Number(warpLength.value) *
     Number(warpPly.value)) /
    Number(warpYarnLength.value) +
    Number(warpWaste.value || 0);

  warpResult.textContent = warpPata.toFixed(3);

  // ---------- WEFT PATA (UNCHANGED) ----------
  const weftPata =
    (Number(weftWidth.value) *
     Number(pick.value) *
     Number(weftLength.value) *
     Number(weftPly.value)) /
    Number(weftYarnLength.value);

  weftResult.textContent = weftPata.toFixed(3);

  // ---------- EFFECTIVE COSTING VALUES ----------
  const warpEffCount = effectiveCountForCost(warpCount.value);
  const weftEffCount = effectiveCountForCost(weftCount.value);

  const warpPataDiv = pataPerBundle(warpCount.value);
  const weftPataDiv = pataPerBundle(weftCount.value);

  // ---------- YARN COST ----------
  const warpYarnCost =
    warpPata * (Number(warpPrice.value) / warpEffCount / warpPataDiv);

  const weftYarnCost =
    weftPata * (Number(weftPrice.value) / weftEffCount / weftPataDiv);

  document.getElementById("warpYarnCost").textContent =
    warpYarnCost.toFixed(2);

  document.getElementById("weftYarnCost").textContent =
    weftYarnCost.toFixed(2);

  // ---------- DYEING COST (WEIGHT BASED) ----------
  const warpGram =
    (4600 / warpEffCount / warpPataDiv) * warpPata;

  const weftGram =
    (4600 / weftEffCount / weftPataDiv) * weftPata;

  const dyeCost =
    ((warpGram + weftGram) / 1000) *
    (Number(dyePercent.value) / 100) *
    Number(dyeCharge.value);

  document.getElementById("dyeCost").textContent =
    dyeCost.toFixed(2);

  // ---------- FINAL COST / METER ----------
  const total =
    (warpYarnCost +
     weftYarnCost +
     dyeCost +
     Number(wage.value || 0) +
     Number(wash.value || 0) +
     Number(other.value || 0)) / 12;

  costResult.textContent = total.toFixed(2);
}
