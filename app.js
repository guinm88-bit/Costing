const yarnCounts = [6,10,17,26,32,40,60,84,100];
const reedMap = {6:28,10:36,17:48,26:52,32:56,40:64,60:72,84:84,100:96};

yarnCounts.forEach(c=>{
  warpCount.innerHTML += `<option value="${c}">${c}s</option>`;
  weftCount.innerHTML += `<option value="${c}">${c}s</option>`;
});

// ---------- AUTO FILLS ----------
warpCount.onchange = () => {
  const c = Number(warpCount.value);
  reed.value = reedMap[c] || "";
  weftCount.value = c;
  pick.value = reedMap[c] || "";
  autofillPrices();
};

warpPly.oninput = () => weftPly.value = warpPly.value;

warpWidth.oninput = () => weftWidth.value = Number(warpWidth.value) - 2;
warpLength.oninput = () => weftLength.value = Number(warpLength.value) - 2;

// ---------- COST HELPERS ----------
function effCount(c){ return (c===84||c===100)?c/2:c; }
function pataDiv(c){ return (c===84||c===100)?10:5; }

// ---------- CALCULATION ----------
function calculate(){
  const warpPata =
    (warpWidth.value*reed.value*warpLength.value*warpPly.value)/warpYarnLength.value
    + Number(warpWaste.value||0);

  const weftPata =
    (weftWidth.value*pick.value*weftLength.value*weftPly.value)/weftYarnLength.value;

  warpResult.textContent = warpPata.toFixed(3);
  weftResult.textContent = weftPata.toFixed(3);

  const wc = effCount(+warpCount.value);
  const wd = pataDiv(+warpCount.value);
  const wfc = effCount(+weftCount.value);
  const wfd = pataDiv(+weftCount.value);

  const warpCost = warpPata*(warpPrice.value/wc/wd);
  const weftCost = weftPata*(weftPrice.value/wfc/wfd);

  warpYarnCost.textContent = warpCost.toFixed(2);
  weftYarnCost.textContent = weftCost.toFixed(2);

  const dye =
    ((4600/wc/wd*warpPata + 4600/wfc/wfd*weftPata)/1000) *
    (dyePercent.value/100) * dyeCharge.value;

  dyeCost.textContent = dye.toFixed(2);

  costResult.textContent =
    ((warpCost+weftCost+dye+Number(wage.value||0)+Number(wash.value||0)+Number(other.value||0))/12)
    .toFixed(2);
}

// ---------- PRICE MASTER ----------
const defaults={6:0,10:0,17:0,26:0,32:0,40:0,60:0,84:0,100:0};
let yarnPrices = JSON.parse(localStorage.getItem("yarnPrices")) || {...defaults};
let edit=false;

function renderPrices(){
  priceList.innerHTML="";
  yarnCounts.forEach(c=>{
    priceList.innerHTML += `
      <div class="price-row">
        <label>${c}s</label>
        <input type="number" inputmode="numeric"
          value="${yarnPrices[c]}"
          ${edit?"":"readonly"}
          oninput="yarnPrices[${c}] = Number(this.value)||0">
      </div>`;
  });
}

function togglePriceEdit(){
  edit=!edit;
  editPriceBtn.textContent = edit?"Save Prices":"Edit Prices";
  if(!edit) localStorage.setItem("yarnPrices",JSON.stringify(yarnPrices));
  renderPrices();
}

function autofillPrices(){
  warpPrice.value = yarnPrices[warpCount.value] || 0;
  weftPrice.value = yarnPrices[weftCount.value] || 0;
}

window.onload = ()=>{
  weftWidth.value = Number(warpWidth.value)-2;
  weftLength.value = Number(warpLength.value)-2;
  autofillPrices();
  renderPrices();
};
