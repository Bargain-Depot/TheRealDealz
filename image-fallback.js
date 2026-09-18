(() => {
  const TAG="therealdea0cb-20";

  function asinFrom(img){
    if(img.dataset.asin) return img.dataset.asin;
    const src=img.currentSrc || img.src || "";
    const query=src.match(/[?&]ASIN=([A-Z0-9]{10})/i);
    if(query) return query[1].toUpperCase();
    const path=src.match(/\/([A-Z0-9]{10})(?:\.|\/|\?|$)/i);
    return path ? path[1].toUpperCase() : "";
  }

  function placeholder(name){
    const label=(name || "Product image").replace(/[&<>]/g,"").slice(0,58);
    const svg=
      '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="620" viewBox="0 0 800 620">'+
      '<rect width="800" height="620" rx="36" fill="#f1ede5"/>'+
      '<circle cx="400" cy="245" r="105" fill="#dfe5dc"/>'+
      '<path d="M354 245h92M400 199v92" stroke="#748071" stroke-width="16" stroke-linecap="round"/>'+
      '<text x="400" y="405" text-anchor="middle" fill="#3d493f" font-family="Arial,sans-serif" font-size="26" font-weight="700">'+escapeXml(label)+'</text>'+
      '<text x="400" y="450" text-anchor="middle" fill="#7c8079" font-family="Arial,sans-serif" font-size="18">Product photo temporarily unavailable</text>'+
      '<text x="400" y="487" text-anchor="middle" fill="#7c8079" font-family="Arial,sans-serif" font-size="16">Tap to view the current listing on Amazon</text>'+
      '</svg>';
    return "data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(svg);
  }

  function escapeXml(s){
    return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }

  function candidates(asin){
    return [
      `https://images.amazon.com/images/P/${asin}.01.LZZZZZZZ.jpg`,
      `https://m.media-amazon.com/images/P/${asin}.jpg`,
      `https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=${asin}&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=_SL500_&tag=${TAG}`
    ];
  }

  document.addEventListener("error", e=>{
    const img=e.target;
    if(!(img instanceof HTMLImageElement)) return;
    const asin=asinFrom(img);
    if(!asin) return;

    const step=Number(img.dataset.fallbackStep || "0");
    const next=candidates(asin)[step];
    if(next){
      img.dataset.fallbackStep=String(step+1);
      img.src=next;
      return;
    }

    img.dataset.fallbackStep="done";
    img.src=placeholder(img.alt);
    img.classList.add("image-fallback-placeholder");
  }, true);
})();