const yarnCounts = [6,10,17,26,32,40,60,84,100];

const reedMap = {
  6:28, 10:36, 17:48, 26:52,
  32:56, 40:64, 60:72,
  84:84, 100:96
};

// populate dropdowns
yarnCounts.forEach(c => {
  warpCount.innerHTML += `<option value="${c}">${c}s</option>`;
  weftCount.innerHTML += `<option value="${c}">${c}s</option>`;
});

// autofill from warp yarn count
warpCount.onchange = () => {
  const c = Number(warpCount.value);
  reed.value = reedMap[c] || "";
  weftCount.value = c;
  pick.value = reedMap[c] || "";
};

// warp ply → weft ply
warpPly.oninput = () => {
  weftPly.value = warpPly.value;
};

// warp length → weft length (−2)
warpLength.oninput = () => {
  weftLength.value = warpLength.value
    ? Number(warpLength.value) - 2
    : "";
};

// apply defaults on load
window.onload = () => {
  weftLength.value = Number(warpLength.value) - 2;
};

// ---------------- CALCULATION (LOCKED) ----------------
function calculate() {

  const warpPata =
    (warpWidth.value * reed.value * warpLength.value * warpPly.value) /
    warpYarnLength.value +
    Number(warpWaste.value || 0);

  warpResult.innerText = warpPata.toFixed(3);

  const weftPata =
    (weftWidth.value * pick.value * weftLength.value * weftPly.value) /
    weftYarnLength.value;

  weftResult.innerText = weftPata.toFixed(3);

  // yarn cost (bundle ÷ count ÷ 5)
  const warpYarnCost =
    warpPata * (warpPrice.value / warpCount.value / 5);

  const weftYarnCost =
    weftPata * (weftPrice.value / weftCount.value / 5);

  document.getElementById("warpYarnCost").innerText =
    warpYarnCost.toFixed(2);
  document.getElementById("weftYarnCost").innerText =
    weftYarnCost.toFixed(2);

  // dyeing cost (weight based)
  const warpGram =
    (4600 / warpCount.value / 5) * warpPata;
  const weftGram =
    (4600 / weftCount.value / 5) * weftPata;

  const dyeCost =
    ((warpGram + weftGram) / 1000) *
    (dyePercent.value / 100) *
    dyeCharge.value;

  document.getElementById("dyeCost").innerText =
    dyeCost.toFixed(2);

  const total =
    (warpYarnCost +
     weftYarnCost +
     dyeCost +
     Number(wage.value || 0) +
     Number(wash.value || 0) +
     Number(other.value || 0)) / 12;

  costResult.innerText = total.toFixed(2);
}
