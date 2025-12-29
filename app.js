const yarnCounts = [
  "6s","10s","17s","26s","32s","40s","60s","84s","100s",
  "2/17s","2/40s","2/60s","2/80s",
  "33s","56K","100K"
];

const reedPickMap = {
  "6s":28,"10s":36,"17s":48,"26s":52,"32s":56,"40s":64,"60s":72,"84s":84,"100s":96,
  "2/17s":32,"2/40s":48,"2/60s":52,"2/80s":64,
  "33s":48,"56K":56,"100K":72
};

yarnCounts.forEach(c=>{
  warpCount.innerHTML+=`<option value="${c}">${c}</option>`;
  weftCount.innerHTML+=`<option value="${c}">${c}</option>`;
});

function baseCount(l){
  if(l==="100K")return 50;
  if(l==="56K")return 28;
  if(l==="33s")return 16.5;
  return Number(l.replace("2/","").replace("s",""));
}

warpCount.onchange=()=>{
  reed.value=reedPickMap[warpCount.value]||"";
  pick.value=reedPickMap[warpCount.value]||"";
  weftCount.value=warpCount.value;
  autofillPrices();
};

weftCount.onchange=()=>autofillPrices();

warpPly.oninput=()=>weftPly.value=warpPly.value;
warpWidth.oninput=()=>weftWidth.value=warpWidth.value-2;
warpLength.oninput=()=>weftLength.value=warpLength.value-2;

fabricColour.onchange=()=>{
  if(fabricColour.value==="white"){
    dyePercent.value=0;
    dyeCharge.value=0;
  }else{
    dyePercent.value=100;
    dyeCharge.value=300;
  }
};

function effectiveCount(l){
  if(l.startsWith("2/")) return baseCount(l)/2;
  const c=baseCount(l);
  if(c===84||c===100) return c/2;
  return c;
}
function pataPerBundle(l){
  const c=baseCount(l);
  if(c===84||c===100) return 10;
  return 5;
}

function calculate(){
  const wp=(warpWidth.value*reed.value*warpLength.value*warpPly.value)/warpYarnLength.value+Number(warpWaste.value||0);
  const wf=(weftWidth.value*pick.value*weftLength.value*weftPly.value)/weftYarnLength.value;

  warpResult.textContent=wp.toFixed(3);
  weftResult.textContent=wf.toFixed(3);

  const wc=effectiveCount(warpCount.value),wd=pataPerBundle(warpCount.value);
  const wfc=effectiveCount(weftCount.value),wfd=pataPerBundle(weftCount.value);

  const wCost=wp*(warpPrice.value/wc/wd);
  const fCost=wf*(weftPrice.value/wfc/wfd);

  warpYarnCost.textContent=wCost.toFixed(2);
  weftYarnCost.textContent=fCost.toFixed(2);

  const dye=((4600/wc/wd*wp+4600/wfc/wfd*wf)/1000)*(dyePercent.value/100)*dyeCharge.value;
  dyeCost.textContent=dye.toFixed(2);

  costResult.textContent=((wCost+fCost+dye+Number(wage.value||0)+Number(other.value||0))/12).toFixed(2);
}

let yarnPrices=JSON.parse(localStorage.getItem("yarnPrices"))||{};
let editPrices=false;

function renderPrices(){
  priceList.innerHTML="";
  yarnCounts.forEach(c=>{
    priceList.innerHTML+=`
      <div class="price-row">
        <label>${c}</label>
        <input type="number" value="${yarnPrices[c]||0}"
          ${editPrices?"":"readonly"}
          oninput="yarnPrices['${c}']=Number(this.value)||0">
      </div>`;
  });
}

function togglePriceEdit(){
  editPrices=!editPrices;
  priceWrapper.classList.toggle("hidden",!editPrices);
  editPriceBtn.textContent=editPrices?"Save Prices":"Set / Edit Prices";
  if(!editPrices) localStorage.setItem("yarnPrices",JSON.stringify(yarnPrices));
  renderPrices();
}

function autofillPrices(){
  warpPrice.value=yarnPrices[warpCount.value]||0;
  weftPrice.value=yarnPrices[weftCount.value]||0;
}

window.onload=()=>{
  weftWidth.value=warpWidth.value-2;
  weftLength.value=warpLength.value-2;
  autofillPrices();
  renderPrices();
};
