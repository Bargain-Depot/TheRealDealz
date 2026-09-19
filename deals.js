(()=>{
  const data=window.TRD_DATA;
  if(!data) return;
  const {products,offers={}}=data;
  const curated=["airpods5Base","airpods5Wireless","airtag","blink","ring","kindle","dewalt","lodge","iphone18SpigenCase"].map(id=>products[id]).filter(Boolean);
  const feed=document.getElementById("dealSwipeFeed");
  const search=document.getElementById("dealCompareSearch");
  const results=document.getElementById("dealCompareResults");
  const quick=document.getElementById("compareQuick");
  const statusEl=document.getElementById("priceSourceStatus");
  if(!feed||!search||!results||!quick) return;

  const esc=v=>String(v??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[ch]));
  const signalFor=id=>({airpods5Base:"NEW RELEASE",airpods5Wireless:"NEW RELEASE",airtag:"PRICE WATCH",blink:"EVENT WATCH",ring:"EVENT WATCH",kindle:"EVENT WATCH",dewalt:"DEAL RADAR",lodge:"DEAL RADAR",iphone18SpigenCase:"ACCESSORY WATCH"}[id]||"DEAL RADAR");
  const saved=()=>new Set(JSON.parse(localStorage.getItem("trd-saved-v2")||"[]"));
  const watched=()=>new Set(JSON.parse(localStorage.getItem("trd-price-watches-v1")||"[]"));
  const saveKey=id=>`product:${id}`;
  let livePrices={generatedAt:null,sources:{},products:{}};
  let amazonEnhanced={};

  function toast(message){
    const el=document.getElementById("toast");if(!el)return;
    el.textContent=message;el.classList.add("show");
    clearTimeout(window.__trdDealToast);window.__trdDealToast=setTimeout(()=>el.classList.remove("show"),1900);
  }
  function staticOffers(p){return (offers[p.id]||[]).filter(o=>o?.link)}
  function mergedOffers(p){
    const byKey=new Map(staticOffers(p).map(o=>[`${o.retailer}|${o.link}`,{...o}]));
    const dynamic=livePrices.products?.[p.id]?.offers||[];
    dynamic.forEach(o=>{
      const key=`${o.retailer}|${o.link}`;
      const existing=byKey.get(key)||{};
      byKey.set(key,{...existing,...o});
    });
    return [...byKey.values()].filter(o=>o?.link);
  }
  function offerRel(o){return o.affiliate===false?"noopener":"sponsored noopener"}
  function priceText(o){return Number.isFinite(o.price)?new Intl.NumberFormat("en-US",{style:"currency",currency:o.currency||"USD"}).format(o.price):(o?.retailer==="Amazon"?"See Amazon price":"Check live price")}
  function sortedOffers(p){
    const list=mergedOffers(p).slice();
    list.sort((a,b)=>{
      const ap=Number.isFinite(a.price),bp=Number.isFinite(b.price);
      if(ap&&bp)return a.price-b.price;if(ap)return-1;if(bp)return 1;
      return Number(b.affiliate!==false)-Number(a.affiliate!==false);
    });
    return list;
  }
  function stamp(o){
    if(!o?.verifiedAt)return "";
    try{return new Date(o.verifiedAt).toLocaleString([],{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"});}catch(_){return o.verifiedAt}
  }
  function priceBlock(o){
    if(!o||!Number.isFinite(o.price))return "";
    const reg=Number.isFinite(o.regularPrice)&&o.regularPrice>o.price?`<span class="deal-regular">${esc(new Intl.NumberFormat("en-US",{style:"currency",currency:o.currency||"USD"}).format(o.regularPrice))}</span>`:"";
    const save=Number.isFinite(o.savingsPercent)&&o.savingsPercent>0?`<span class="deal-savings">-${Math.round(o.savingsPercent)}%</span>`:"";
    return `<div class="deal-price-line"><span class="deal-price">${esc(priceText(o))}</span>${reg}${save}</div>`;
  }
  function amazonEnhancedConfig(p){return amazonEnhanced?.[p.id] || null}
  function amazonEnhancedFrame(p){
    const cfg=amazonEnhancedConfig(p);
    if(!cfg?.src) return "";
    const width=Math.max(120,Math.min(Number(cfg.width)||120,600));
    const height=Math.max(240,Math.min(Number(cfg.height)||240,600));
    return `<div class="amazon-enhanced-wrap"><div class="amazon-enhanced-label">Live Amazon product link · served by Amazon</div><iframe class="amazon-enhanced-frame" title="Amazon live product link for ${esc(p.name)}" src="${esc(cfg.src)}" width="${width}" height="${height}" scrolling="no" frameborder="0" loading="lazy"></iframe></div>`;
  }
  function sourceStatus(){
    if(!statusEl)return;
    const entries=Object.entries(livePrices.sources||{});
    statusEl.innerHTML=entries.length?entries.map(([name,s])=>{
      const live=s.status==="ok";
      return `<span class="source-chip ${live?"live":""}"><span class="source-dot"></span>${esc(name)} · ${esc(live?"price feed connected":s.label||s.status||"not connected")}</span>`;
    }).join(""):`<span class="source-chip"><span class="source-dot"></span>Live price feeds awaiting retailer API connections</span>`;
  }

  function card(p){
    const list=sortedOffers(p),primary=list[0];
    const isSaved=saved().has(saveKey(p.id)),isWatched=watched().has(p.id);
    return `<article class="deal-swipe-card" data-deal-id="${esc(p.id)}">
      <div class="deal-visual">
        <div class="deal-top-pills"><span class="deal-pill signal">${esc(primary?.dealBadge||signalFor(p.id))}</span><span class="deal-pill">${list.filter(o=>o.affiliate!==false).length} monetized offer${list.filter(o=>o.affiliate!==false).length===1?"":"s"}</span></div>
        <img loading="lazy" src="${esc(p.image)}" alt="${esc(p.name)}">
      </div>
      <div class="deal-copy">
        <div class="deal-label">${esc(p.category)}</div><h3>${esc(p.name)}</h3><p>${esc(p.note)}</p>
        ${priceBlock(primary)}
        <div class="deal-offer-strip"><span>${primary?.verifiedAt?"Verified retailer price":"Verified shopping destination"}</span><strong>${primary?esc(primary.retailer):"No offer connected yet"}</strong></div>
        ${primary?.verifiedAt?`<p class="deal-timestamp">Price checked ${esc(stamp(primary))}. Price and availability can change at checkout.</p>`:""}
        ${primary?.retailer==="Amazon"?amazonEnhancedFrame(p):""}
        <div class="deal-bottom-actions"><button class="deal-compare-button" data-compare-id="${esc(p.id)}">Compare stores</button>${primary?`<a class="deal-buy" href="${esc(primary.link)}" target="_blank" rel="${offerRel(primary)}">Buy / check price →</a>`:""}</div>
      </div>
      <div class="deal-action-rail">
        <button class="deal-rail-button ${isSaved?"active":""}" data-deal-save="${esc(p.id)}" aria-label="Save ${esc(p.name)}"><svg viewBox="0 0 24 24"><path d="M20.8 4.7a5.6 5.6 0 0 0-7.9 0L12 5.6l-.9-.9a5.6 5.6 0 1 0-7.9 7.9L12 21l8.8-8.4a5.6 5.6 0 0 0 0-7.9Z"></path></svg></button><span class="deal-rail-label">Save</span>
        <button class="deal-rail-button ${isWatched?"active":""}" data-deal-watch="${esc(p.id)}" aria-label="Watch ${esc(p.name)}"><svg viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path><path d="M10 21h4"></path></svg></button><span class="deal-rail-label">Watch</span>
        <button class="deal-rail-button" data-deal-share="${esc(p.id)}" aria-label="Share ${esc(p.name)}"><svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="2"></circle><circle cx="6" cy="12" r="2"></circle><circle cx="18" cy="19" r="2"></circle><path d="m8 11 8-5"></path><path d="m8 13 8 5"></path></svg></button><span class="deal-rail-label">Share</span>
      </div>
    </article>`;
  }
  function renderFeed(){feed.innerHTML=curated.map(card).join("")}

  function compareCard(p){
    const list=sortedOffers(p);
    const priced=list.filter(o=>Number.isFinite(o.price));
    const comparable=priced.length>1;
    const lowest=comparable?Math.min(...priced.map(o=>o.price)):null;
    return `<article class="compare-product-card">
      <div class="compare-product-image"><img loading="lazy" src="${esc(p.image)}" alt="${esc(p.name)}"></div>
      <div class="compare-product-main"><div class="deal-label">${esc(p.category)}</div><h3>${esc(p.name)}</h3>
        <div class="offer-list">${list.length?list.map(o=>`<div class="offer-row ${lowest!==null&&o.price===lowest?"best":""}">
          <div class="offer-retailer"><strong>${esc(o.retailer)}${lowest!==null&&o.price===lowest?" · Lowest verified":""}</strong><span>${o.affiliate===false?"Non-affiliate reference":"Affiliate link"}${o.verifiedAt?" · checked "+esc(stamp(o)):""}</span></div>
          <div class="offer-price">${esc(priceText(o))}</div><a href="${esc(o.link)}" target="_blank" rel="${offerRel(o)}">Open →</a>
        </div>${o.retailer==="Amazon"?amazonEnhancedFrame(p):""}`).join(""):`<div class="empty-state"><p>No verified retailer offers connected yet.</p></div>`}</div>
        <div class="compare-product-actions"><button class="compare-watch ${watched().has(p.id)?"active":""}" data-deal-watch="${esc(p.id)}">${watched().has(p.id)?"Watching price":"Watch price"}</button></div>
      </div>
    </article>`;
  }
  function renderCompare(query=""){
    const q=query.trim().toLowerCase(),pool=Object.values(products);
    const matches=(q?pool.filter(p=>[p.name,p.category,...(p.tags||[])].join(" ").toLowerCase().includes(q)):curated.slice(0,4)).slice(0,8);
    results.innerHTML=matches.length?matches.map(compareCard).join(""):`<div class="empty-state"><h3>No verified match yet.</h3><p>Try a broader product name. The comparison engine only shows exact products already verified in TheReal_Dealz catalog.</p></div>`;
  }
  function checkWatchedDrops(){
    const w=watched(),last=JSON.parse(localStorage.getItem("trd-last-prices-v1")||"{}"),next={...last};
    w.forEach(id=>{
      const p=products[id];if(!p)return;
      const priced=sortedOffers(p).filter(o=>Number.isFinite(o.price) && o.retailer!=="Amazon");
      if(!priced.length)return;
      const current=Math.min(...priced.map(o=>o.price)),previous=Number(last[id]);
      if(Number.isFinite(previous)&&current<previous){
        const message=`${p.name} dropped from $${previous.toFixed(2)} to $${current.toFixed(2)}.`;
        toast(message);
        if("Notification" in window&&Notification.permission==="granted")new Notification("TheReal_Dealz price drop",{body:message});
      }
      next[id]=current;
    });
    localStorage.setItem("trd-last-prices-v1",JSON.stringify(next));
  }
  async function loadAmazonEnhanced(){
    try{
      const res=await fetch(`data/amazon-enhanced.json?v=${Date.now()}`,{cache:"no-store"});
      if(res.ok)amazonEnhanced=await res.json();
    }catch(_){}
  }
  async function loadPrices(){
    try{
      const res=await fetch(`data/prices.json?v=${Date.now()}`,{cache:"no-store"});
      if(res.ok)livePrices=await res.json();
    }catch(_){}
    sourceStatus();renderFeed();renderCompare(search.value);checkWatchedDrops();
  }

  quick.innerHTML=["AirPods 5","AirTag","Ring","Kindle","iPhone 18"].map(q=>`<button data-compare-query="${esc(q)}">${esc(q)}</button>`).join("");
  renderFeed();renderCompare();sourceStatus();Promise.all([loadAmazonEnhanced(),loadPrices()]).then(()=>{renderFeed();renderCompare(search.value);sourceStatus();});
  search.addEventListener("input",()=>renderCompare(search.value));

  document.addEventListener("click",async e=>{
    const anchor=e.target.closest("[data-deal-anchor]");
    if(anchor){
      const panel=document.querySelector('[data-view-panel="home"]');
      if(panel&&!panel.classList.contains("active"))document.querySelector('[data-view="home"]')?.click();
      setTimeout(()=>document.getElementById(anchor.dataset.dealAnchor)?.scrollIntoView({behavior:"smooth",block:"start"}),50);return;
    }
    const q=e.target.closest("[data-compare-query]");if(q){search.value=q.dataset.compareQuery;renderCompare(search.value);return}
    const cmp=e.target.closest("[data-compare-id]");if(cmp){const p=products[cmp.dataset.compareId];if(!p)return;search.value=p.name;renderCompare(p.name);document.getElementById("dealCompare")?.scrollIntoView({behavior:"smooth",block:"start"});return}
    const saveBtn=e.target.closest("[data-deal-save]");if(saveBtn){
      const id=saveBtn.dataset.dealSave,set=saved(),key=saveKey(id);set.has(key)?set.delete(key):set.add(key);
      localStorage.setItem("trd-saved-v2",JSON.stringify([...set]));window.dispatchEvent(new Event("trd:saved-changed"));renderFeed();toast(set.has(key)?"Saved to your Dealz":"Removed from Saved");return;
    }
    const watchBtn=e.target.closest("[data-deal-watch]");if(watchBtn){
      const id=watchBtn.dataset.dealWatch,set=watched();set.has(id)?set.delete(id):set.add(id);localStorage.setItem("trd-price-watches-v1",JSON.stringify([...set]));
      if(set.has(id)&&"Notification" in window&&Notification.permission==="default"){try{await Notification.requestPermission()}catch(_){}}
      renderFeed();renderCompare(search.value);
      toast(set.has(id)?"Watch saved — Amazon price alerts are excluded; other connected retailer prices can trigger drops":"Price watch removed");return;
    }
    const shareBtn=e.target.closest("[data-deal-share]");if(shareBtn){
      const p=products[shareBtn.dataset.dealShare];if(!p)return;const url=location.origin+location.pathname+`#dealCompare`;
      try{if(navigator.share)await navigator.share({title:p.name,text:`Check this on TheReal_Dealz: ${p.name}`,url});else{await navigator.clipboard.writeText(url);toast("Deal link copied");}}catch(_){}return;
    }
  });
})();