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

// Warp yarn count → reed, weft yarn count, pick, price
warpCount.onchange = () => {
  const c = Number(warpCount.value);
  reed.value = reedMap[c] || "";
  weftCount.value = c;
  pick.value = reedMap[c] || "";
  autofillYarnPrice();
};

// Warp ply → weft ply
warpPly.addEventListener("input", () => {
  weftPly.value = warpPly.value;
});

// Warp width → weft width (−2)
warpWidth.addEventListener("input", () => {
  if (warpWidth.value !== "") {
    weftWidth.value = Number(warpWidth.value) - 2;
  }
});

// Warp thaan length → weft thaan length (−2)
warpLength.addEventListener("input", () => {
  if (warpLength.value !== "") {
    weftLength.value = Number(warpLength.value) - 2;
  }
});

// ==================== COSTING HELPERS (LOCKED) ====================
function effectiveCountForCost(count) {
  const c = Number(count);
  return (c === 84 || c === 100) ? c / 2 : c;
}

function pataPerBundle(count) {
  const c = Number(count);
  return (c === 84 || c === 100) ? 10 : 5;
}

// ==================== MAIN CALCULATION ====================
function calculate() {

  // ---------- WARP PATA ----------
  const warpPata =
    (Number(warpWidth.value) *
     Number(reed.value) *
     Number(warpLength.value) *
     Number(warpPly.value)) /
    Number(warpYarnLength.value) +
    Number(warpWaste.value || 0);

  warpResult.textContent = warpPata.toFixed(3);

  // ---------- WEFT PATA ----------
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

  warpYarnCost.textContent = warpYarnCost.toFixed(2);
  weftYarnCost.textContent = weftYarnCost.toFixed(2);

  // ---------- DYEING COST ----------
  const warpGram =
    (4600 / warpEffCount / warpPataDiv) * warpPata;

  const weftGram =
    (4600 / weftEffCount / weftPataDiv) * weftPata;

  const dye =
    ((warpGram + weftGram) / 1000) *
    (Number(dyePercent.value) / 100) *
    Number(dyeCharge.value);

  dyeCost.textContent = dye.toFixed(2);

  // ---------- FINAL COST / METER ----------
  costResult.textContent =
    (
      warpYarnCost +
      weftYarnCost +
      dye +
      Number(wage.value || 0) +
      Number(wash.value || 0) +
      Number(other.value || 0)
    / 12).toFixed(2);
}

// ==================== PRICE MASTER ====================
const defaultPrices = {6:0,10:0,17:0,26:0,32:0,40:0,60:0,84:0,100:0};
let yarnPrices = JSON.parse(localStorage.getItem("yarnPrices")) || {...defaultPrices};
let editPrices = false;

function renderPrices() {
  priceList.innerHTML = "";
  yarnCounts.forEach(c => {
    priceList.innerHTML += `
      <div class="price-row">
        <label>${c}s</label>
        <input type="number" inputmode="numeric"
          value="${yarnPrices[c]}"
          ${editPrices ? "" : "readonly"}
          oninput="yarnPrices[${c}] = Number(this.value)||0">
      </div>`;
  });
}

function togglePriceEdit() {
  editPrices = !editPrices;
  editPriceBtn.textContent = editPrices ? "Save Prices" : "Edit Prices";
  if (!editPrices) {
    localStorage.setItem("yarnPrices", JSON.stringify(yarnPrices));
  }
  renderPrices();
}

function autofillYarnPrice() {
  warpPrice.value = yarnPrices[warpCount.value] || 0;
  weftPrice.value = yarnPrices[weftCount.value] || 0;
}

// ==================== INIT ON LOAD ====================
window.addEventListener("load", () => {
  // ensure defaults apply
  weftWidth.value = Number(warpWidth.value) - 2;
  weftLength.value = Number(warpLength.value) - 2;
  autofillYarnPrice();
  renderPrices();
});
