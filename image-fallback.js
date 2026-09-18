(() => {
  const TAG = "therealdea0cb-20";

  function asinFrom(img){
    if(img.dataset.asin) return img.dataset.asin;
    const src = img.currentSrc || img.src || "";
    const q = src.match(/[?&]ASIN=([A-Z0-9]{10})/i);
    if(q) return q[1].toUpperCase();
    const p = src.match(/\/([A-Z0-9]{10})(?:\.|\/|\?|$)/i);
    return p ? p[1].toUpperCase() : "";
  }

  function candidates(asin){
    return [
      `https://images.amazon.com/images/P/${asin}.01.LZZZZZZZ.jpg`,
      `https://m.media-amazon.com/images/P/${asin}.jpg`,
      `https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=${asin}&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL500_&tag=${TAG}`
    ];
  }

  function installStyles(){
    if(document.getElementById("trd-image-fallback-styles")) return;
    const style=document.createElement("style");
    style.id="trd-image-fallback-styles";
    style.textContent=`
      .trd-fallback-host{position:relative!important;overflow:hidden!important;background:#f1ede5!important}
      .trd-img-fallback{width:100%;height:100%;min-height:150px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px;padding:22px;text-align:center;background:linear-gradient(145deg,#efeae1,#f8f5ef);color:#3d493f}
      .trd-img-fallback-mark{width:64px;height:64px;border-radius:20px;display:grid;place-items:center;background:#dfe5dc;border:1px solid #cbd4c7;font:800 25px/1 Manrope,Inter,Arial,sans-serif;letter-spacing:-1px}
      .trd-img-fallback strong{max-width:320px;font:800 14px/1.3 Manrope,Inter,Arial,sans-serif}
      .trd-img-fallback small{max-width:300px;color:#777b74;font:600 10px/1.45 Inter,Arial,sans-serif}
      .trd-img-fallback .trd-fallback-action{margin-top:2px;font-size:9px;font-weight:800;letter-spacing:.04em;color:#3d493f}
    `;
    document.head.appendChild(style);
  }

  function makeInitials(name){
    const words=String(name||"Product").replace(/[^A-Za-z0-9 ]+/g," ").trim().split(/\s+/).filter(Boolean);
    return (words.slice(0,2).map(w=>w[0]).join("") || "P").toUpperCase();
  }

  function showFallback(img){
    if(img.dataset.fallbackRendered==="true") return;
    img.dataset.fallbackRendered="true";
    const host=img.parentElement || img;
    host.classList.add("trd-fallback-host");
    img.style.display="none";

    const box=document.createElement("div");
    box.className="trd-img-fallback";
    box.setAttribute("role","img");
    const name=(img.alt || "Product").trim();
    box.setAttribute("aria-label",`Product photo unavailable for ${name}`);
    box.innerHTML=
      '<div class="trd-img-fallback-mark" aria-hidden="true">'+makeInitials(name)+'</div>'+
      '<strong>'+escapeHtml(name)+'</strong>'+
      '<small>Product photo temporarily unavailable.</small>'+
      '<span class="trd-fallback-action">Tap to view the current listing →</span>';
    host.appendChild(box);
  }

  function escapeHtml(value){
    return String(value).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  }

  function tryNext(img){
    const asin=asinFrom(img);
    if(!asin){ showFallback(img); return; }

    const step=Number(img.dataset.fallbackStep || "0");
    const list=candidates(asin);
    if(step < list.length){
      img.dataset.fallbackStep=String(step+1);
      img.src=list[step];
      return;
    }
    showFallback(img);
  }

  installStyles();

  document.addEventListener("error", e=>{
    const img=e.target;
    if(img instanceof HTMLImageElement) tryNext(img);
  }, true);

  document.addEventListener("load", e=>{
    const img=e.target;
    if(!(img instanceof HTMLImageElement)) return;
    if((img.naturalWidth && img.naturalWidth <= 2) || (img.naturalHeight && img.naturalHeight <= 2)){
      tryNext(img);
    }
  }, true);

  window.addEventListener("DOMContentLoaded", ()=>{
    document.querySelectorAll("img").forEach(img=>{
      if(img.complete && (!img.naturalWidth || !img.naturalHeight)) tryNext(img);
    });
  });
})();