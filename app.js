(() => {
  const {products, posts, categories} = window.TRD_DATA;
  const state = {
    view:"home",
    feedMode:"for-you",
    category:"all",
    visibleCount:4,
    saved:new Set(JSON.parse(localStorage.getItem("trd-saved-v2") || "[]"))
  };

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
  const productList = Object.values(products);

  const icons = {
    heart:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.7a5.6 5.6 0 0 0-7.9 0L12 5.6l-.9-.9a5.6 5.6 0 1 0-7.9 7.9L12 21l8.8-8.4a5.6 5.6 0 0 0 0-7.9Z"></path></svg>`,
    arrow:`<span aria-hidden="true">→</span>`
  };

  const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[ch]));
  const postToken = id => `post:${id}`;
  const productToken = id => `product:${id}`;
  const isSaved = token => state.saved.has(token);
  function retailerName(p){ return p?.retailer || "Amazon"; }
  function productRel(p){ return p?.affiliate === false ? "noopener" : "sponsored noopener"; }
  function productCta(p){ return `Check ${retailerName(p)} →`; }

  function persistSaved(){
    localStorage.setItem("trd-saved-v2", JSON.stringify([...state.saved]));
    updateSavedCount();
  }

  function updateSavedCount(){
    $("#savedCount").textContent = state.saved.size;
  }

  function toggleSaved(token, label="Item"){
    if(state.saved.has(token)){
      state.saved.delete(token);
      toast(`${label} removed from Saved`);
    }else{
      state.saved.add(token);
      toast(`${label} saved`);
    }
    persistSaved();
    renderAllSaveStates();
    if(state.view === "saved") renderSaved();
  }

  function renderAllSaveStates(){
    $$("[data-save-token]").forEach(btn=>{
      const on=isSaved(btn.dataset.saveToken);
      btn.classList.toggle("saved",on);
      btn.setAttribute("aria-pressed",String(on));
      btn.setAttribute("aria-label",on ? "Remove from saved" : "Save for later");
    });
  }

  let toastTimer;
  function toast(message){
    const el=$("#toast");
    el.textContent=message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>el.classList.remove("show"),1700);
  }

  function dateValue(p){ return new Date(p.published).getTime(); }

  function filteredPosts(){
    let list=posts.slice();
    if(state.category !== "all"){
      list=list.filter(p=>p.categories.includes(state.category));
    }
    if(state.feedMode === "latest"){
      list.sort((a,b)=>dateValue(b)-dateValue(a));
    }else{
      list.sort((a,b)=>(b.priority||0)-(a.priority||0));
    }
    return list;
  }

  function productHeart(product, extraClass=""){
    const token=productToken(product.id);
    return `<button class="heart-button ${extraClass} ${isSaved(token)?"saved":""}" data-save-token="${token}" aria-label="${isSaved(token)?"Remove from saved":"Save for later"}" aria-pressed="${isSaved(token)}">${icons.heart}</button>`;
  }

  function postHeart(post){
    const token=postToken(post.id);
    return `<button class="heart-button ${isSaved(token)?"saved":""}" data-save-token="${token}" aria-label="${isSaved(token)?"Remove from saved":"Save for later"}" aria-pressed="${isSaved(token)}">${icons.heart}</button>`;
  }

  function productRail(productIds){
    if(!productIds?.length) return "";
    return `<div class="product-rail">${productIds.map(id=>{
      const p=products[id];
      return `<article class="mini-product">
        <a class="mini-product-image" href="${p.link}" target="_blank" rel="${productRel(p)}" aria-label="View ${esc(p.name)} at ${esc(retailerName(p))}"><img loading="lazy" src="${p.image}" alt="${esc(p.name)}"></a>
        <div class="mini-product-copy">
          <strong>${esc(p.name)}</strong>
          <div class="mini-product-actions">
            <a href="${p.link}" target="_blank" rel="sponsored noopener">${esc(productCta(p))}</a>
            ${productHeart(p)}
          </div>
        </div>
      </article>`;
    }).join("")}</div>`;
  }

  function mediaFor(post, size="medium"){
    if(post.type === "guide"){
      return `<div class="guide-art post-media"><span class="post-badge">${esc(post.badge)}</span><div class="matcha-cup" aria-hidden="true"></div></div>`;
    }
    if(post.type === "editorial"){
      return "";
    }
    const ids=post.productIds || [];
    if(post.type === "campaign" && ids.length >= 3){
      const a=products[ids[0]], b=products[ids[1]], c=products[ids[2]];
      return `<div class="post-media media-collage">
        <span class="post-badge">${esc(post.badge)}</span>
        <div class="collage-main"><img loading="lazy" src="${a.image}" alt="${esc(a.name)}"></div>
        <div><img loading="lazy" src="${b.image}" alt="${esc(b.name)}"></div>
        <div><img loading="lazy" src="${c.image}" alt="${esc(c.name)}"></div>
      </div>`;
    }
    const product=products[ids[0]];
    if(!product) return "";
    return `<a class="post-media media-${size}" href="${product.link}" target="_blank" rel="sponsored noopener">
      <span class="post-badge">${esc(post.badge)}</span>
      <img loading="lazy" src="${product.image}" alt="${esc(product.name)}">
    </a>`;
  }

  function actionButtons(post){
    const first=post.productIds?.length ? products[post.productIds[0]] : null;
    if(post.href){
      return `<a class="primary-link" href="${post.href}">${post.type==="campaign"?"Open campaign":"Open guide"} ${icons.arrow}</a>
              <button class="secondary-link open-post" data-post="${post.id}">Why we're watching it</button>`;
    }
    if(post.type === "quick" && first){
      return `<a class="amazon-button" href="${first.link}" target="_blank" rel="${productRel(first)}">Check current ${esc(retailerName(first))} listing ${icons.arrow}</a>
              <button class="secondary-link open-post" data-post="${post.id}">Why it's here</button>`;
    }
    return `<button class="primary-link open-post" data-post="${post.id}">View post ${icons.arrow}</button>`;
  }

  function comparison(post){
    const [aId,bId]=post.productIds || [];
    const a=products[aId], b=products[bId];
    if(!a || !b) return "";
    return `<div class="comparison-row">
      <a class="compare-product" href="${a.link}" target="_blank" rel="${productRel(a)}"><img loading="lazy" src="${a.image}" alt="${esc(a.name)}"><strong>${esc(a.name)}</strong></a>
      <span class="versus">VS</span>
      <a class="compare-product" href="${b.link}" target="_blank" rel="${productRel(b)}"><img loading="lazy" src="${b.image}" alt="${esc(b.name)}"><strong>${esc(b.name)}</strong></a>
    </div>`;
  }

  function postCard(post, featured=false){
    const compact=post.type === "quick";
    const media=mediaFor(post, featured ? "wide" : (compact ? "small" : "medium"));
    const extra=compact ? "quick-card" : "";
    const rail=post.type === "roundup" ? productRail(post.productIds) : "";
    const compare=post.type === "comparison" ? comparison(post) : "";
    return `<article class="post-card reveal ${extra}" data-post-card="${post.id}">
      ${media}
      <div class="post-body">
        <div class="post-topline">
          <div class="post-meta"><b>${esc(post.category)}</b><span>·</span><span>${esc(post.updated)}</span></div>
          ${postHeart(post)}
        </div>
        ${featured?`<h2>${esc(post.title)}</h2>`:`<h3>${esc(post.title)}</h3>`}
        <p>${esc(post.excerpt)}</p>
        ${rail}${compare}
        <div class="post-actions">${actionButtons(post)}</div>
      </div>
    </article>`;
  }

  function renderCategories(){
    $("#categoryScroller").innerHTML=categories.map(c=>`<button class="category-chip ${state.category===c.id?"active":""}" data-category="${c.id}">${esc(c.label)}</button>`).join("");
    $("#categoryGrid").innerHTML=categories.filter(c=>c.id!=="all").map((c,i)=>`<button class="category-card" data-category-jump="${c.id}">
      <span>${String(i+1).padStart(2,"0")}</span>
      <strong>${esc(c.label)}</strong>
      <small>${esc(c.description)}</small>
    </button>`).join("");
  }

  function renderHome(){
    renderCategories();
    const list=filteredPosts();
    const featured=list.find(p=>p.featured) || (state.category==="all" ? posts.find(p=>p.featured) : null);
    $("#featuredPost").innerHTML=featured && (state.category==="all" || featured.categories.includes(state.category)) ? `<div class="featured-post">${postCard(featured,true)}</div>` : "";

    const rest=list.filter(p=>!featured || p.id!==featured.id);
    const visible=rest.slice(0,state.visibleCount);
    $("#feed").innerHTML=visible.length ? visible.map(p=>postCard(p,false)).join("") : `<div class="empty-state"><h3>Nothing verified here yet.</h3><p>${state.category==="under-25" ? "We’ll only put a product in Under $25 after its current price is verified through an authorized source." : "Try another category — this feed only shows items that have earned a real post."}</p></div>`;
    $("#feedEnd").classList.toggle("hidden", rest.length===0 || state.visibleCount<rest.length);
    observeCards();
    renderSidebarTrending();
    renderAllSaveStates();
  }

  function renderSidebarTrending(){
    const ranked=posts.filter(p=>p.trendingRank).sort((a,b)=>a.trendingRank-b.trendingRank).slice(0,4);
    $("#sidebarTrending").innerHTML=ranked.map(p=>{
      const pr=p.productIds?.length?products[p.productIds[0]]:null;
      return `<div class="side-rank">
        <span class="number">${String(p.trendingRank).padStart(2,"0")}</span>
        ${pr?`<img loading="lazy" src="${pr.image}" alt="">`:`<div></div>`}
        <button class="open-post" data-post="${p.id}"><strong>${esc(p.title)}</strong><span>${esc(p.category)}</span></button>
      </div>`;
    }).join("");
  }

  function renderTrending(){
    const ranked=posts.filter(p=>p.trendingRank).sort((a,b)=>a.trendingRank-b.trendingRank);
    $("#trendingList").innerHTML=ranked.map(p=>{
      const pr=p.productIds?.length?products[p.productIds[0]]:null;
      return `<article class="rank-card">
        <span class="rank-number">${String(p.trendingRank).padStart(2,"0")}</span>
        ${pr?`<img loading="lazy" src="${pr.image}" alt="${esc(pr.name)}">`:`<div></div>`}
        <div class="rank-copy"><strong>${esc(p.title)}</strong><span>${esc(p.category)} · ${esc(p.updated)}</span></div>
        <button class="primary-link open-post" data-post="${p.id}">View post →</button>
      </article>`;
    }).join("");
  }

  function productCard(p){
    return `<article class="product-card">
      <a class="product-card-image" href="${p.link}" target="_blank" rel="${productRel(p)}"><img loading="lazy" src="${p.image}" alt="${esc(p.name)}"></a>
      <div class="product-card-copy">
        <span class="product-card-label">${esc(p.category)} · ${p.asin?`ASIN ${esc(p.asin)}`:`${esc(retailerName(p))} direct`}</span>
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.note)}</p>
        <div class="product-card-actions">
          <a class="amazon-button" href="${p.link}" target="_blank" rel="${productRel(p)}">${esc(productCta(p))}</a>
          ${productHeart(p)}
        </div>
      </div>
    </article>`;
  }

  function renderWatchlist(){
    $("#watchlistGrid").innerHTML=productList.map(productCard).join("");
    renderAllSaveStates();
  }

  function renderGuides(){
    const guides=posts.filter(p=>p.categories.includes("guides")).sort((a,b)=>dateValue(b)-dateValue(a));
    $("#guidesFeed").innerHTML=guides.map(p=>postCard(p,false)).join("");
    observeCards();
    renderAllSaveStates();
  }

  function search(query){
    const q=query.trim().toLowerCase();
    if(!q){
      $("#searchResults").innerHTML=`<div class="empty-state"><h3>Search posts and products</h3><p>Try AirTag, Kitchen, Travel, Smart Home, or a product name.</p></div>`;
      return;
    }
    const matchedPosts=posts.filter(p=>[p.title,p.excerpt,p.category,...p.tags].join(" ").toLowerCase().includes(q));
    const matchedProducts=productList.filter(p=>[p.name,p.category,p.note,...p.tags].join(" ").toLowerCase().includes(q));
    const results=[
      ...matchedPosts.map(p=>({kind:"post",id:p.id,title:p.title,meta:`Post · ${p.category}`,image:p.productIds?.length?products[p.productIds[0]].image:""})),
      ...matchedProducts.map(p=>({kind:"product",id:p.id,title:p.name,meta:`Product · ${p.category}`,image:p.image,link:p.link,retailer:retailerName(p),rel:productRel(p)}))
    ];
    $("#searchResults").innerHTML=results.length?results.map(r=>`<div class="search-result">
      ${r.image?`<img loading="lazy" src="${r.image}" alt="">`:`<div></div>`}
      <div><strong>${esc(r.title)}</strong><span>${esc(r.meta)}</span></div>
      ${r.kind==="post"?`<button class="open-post" data-post="${r.id}">Open →</button>`:`<a href="${r.link}" target="_blank" rel="${r.rel||"noopener"}">${esc(r.retailer||"Retailer")} →</a>`}
    </div>`).join(""):`<div class="empty-state"><h3>No verified matches yet.</h3><p>We’d rather show nothing than invent a result. Try a broader search or another category.</p></div>`;
  }

  function renderSaved(){
    const savedPosts=posts.filter(p=>state.saved.has(postToken(p.id)));
    const savedProducts=productList.filter(p=>state.saved.has(productToken(p.id)));
    if(!savedPosts.length && !savedProducts.length){
      $("#savedContent").innerHTML=`<div class="empty-state"><h3>Your saved list is empty.</h3><p>Tap the heart on any post or product and it will appear here on this device.</p></div>`;
      return;
    }
    $("#savedContent").innerHTML=`
      ${savedPosts.length?`<section class="saved-section"><h3>Posts</h3><div class="feed-stack narrow">${savedPosts.map(p=>postCard(p,false)).join("")}</div></section>`:""}
      ${savedProducts.length?`<section class="saved-section"><h3>Products</h3><div class="saved-grid">${savedProducts.map(productCard).join("")}</div></section>`:""}`;
    observeCards();
    renderAllSaveStates();
  }

  function modalCover(post){
    if(post.type==="guide") return `<div class="guide-art modal-cover"><div class="matcha-cup" aria-hidden="true"></div></div>`;
    const first=post.productIds?.length?products[post.productIds[0]]:null;
    return first?`<div class="modal-cover"><img src="${first.image}" alt="${esc(first.name)}"></div>`:"";
  }

  function openPost(id){
    const post=posts.find(p=>p.id===id);
    if(!post) return;
    const related=(post.related||[]).map(rid=>posts.find(p=>p.id===rid)).filter(Boolean).slice(0,4);
    $("#modalContent").innerHTML=`
      ${modalCover(post)}
      <div class="modal-copy">
        <p class="kicker">${esc(post.badge)} · ${esc(post.category)}</p>
        <h2 id="modalTitle">${esc(post.title)}</h2>
        <p class="lede">${esc(post.excerpt)}</p>
        <div class="post-actions">${postHeart(post)} ${actionButtons(post)}</div>
        ${post.productIds?.length?productRail(post.productIds):""}
        <div class="modal-body">
          ${post.body.map((p,i)=>`${i===0?"":"<h3>"+(i===1?"What to know":"Why it matters")+"</h3>"}<p>${esc(p)}</p>`).join("")}
          <p><strong>Disclosure:</strong> As an Amazon Associate I earn from qualifying purchases. Product details, prices, and availability can change; check the linked retailer for the current offer.</p>
        </div>
        ${related.length?`<div class="related-block"><strong>More like this</strong><div class="related-links">${related.map(r=>`<button class="related-link open-post" data-post="${r.id}"><small>${esc(r.category)}</small><strong>${esc(r.title)}</strong></button>`).join("")}</div></div>`:""}
      </div>`;
    const modal=$("#postModal");
    modal.classList.add("open");
    modal.setAttribute("aria-hidden","false");
    document.body.style.overflow="hidden";
    renderAllSaveStates();
  }

  function closeModal(){
    const modal=$("#postModal");
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden","true");
    document.body.style.overflow="";
  }

  function showView(view, updateHash=true){
    if(!$(`[data-view-panel="${view}"]`)) view="home";
    state.view=view;
    $$(".view").forEach(v=>v.classList.toggle("active",v.dataset.viewPanel===view));
    $$(".nav-link,.mobile-nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
    if(updateHash) history.replaceState(null,"",view==="home"?"#home":`#${view}`);
    if(view==="home") renderHome();
    if(view==="trending") renderTrending();
    if(view==="watchlist") renderWatchlist();
    if(view==="guides") renderGuides();
    if(view==="categories") renderCategories();
    if(view==="search"){ setTimeout(()=>$("#siteSearch")?.focus(),80); search($("#siteSearch")?.value||""); }
    if(view==="saved") renderSaved();
    window.scrollTo({top:0,behavior:"smooth"});
  }

  let observer;
  function observeCards(){
    if(observer) observer.disconnect();
    observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}});
    },{threshold:.08});
    $$(".post-card.reveal").forEach(card=>observer.observe(card));
  }

  const feedObserver=new IntersectionObserver(entries=>{
    if(!entries[0].isIntersecting || state.view!=="home") return;
    const list=filteredPosts();
    const featured=list.find(p=>p.featured);
    const rest=list.filter(p=>!featured || p.id!==featured.id);
    if(state.visibleCount<rest.length){
      state.visibleCount+=3;
      renderHome();
    }
  },{rootMargin:"240px"});
  feedObserver.observe($("#feedSentinel"));

  document.addEventListener("click",e=>{
    const nav=e.target.closest("[data-view]");
    if(nav){ showView(nav.dataset.view); return; }

    const chip=e.target.closest("[data-category]");
    if(chip){
      state.category=chip.dataset.category;
      state.visibleCount=4;
      renderHome();
      return;
    }

    const jump=e.target.closest("[data-category-jump]");
    if(jump){
      state.category=jump.dataset.categoryJump;
      state.visibleCount=4;
      showView("home");
      return;
    }

    const tab=e.target.closest("[data-feed-mode]");
    if(tab){
      state.feedMode=tab.dataset.feedMode;
      state.visibleCount=4;
      $$(".feed-tab").forEach(b=>b.classList.toggle("active",b===tab));
      renderHome();
      return;
    }

    const saver=e.target.closest("[data-save-token]");
    if(saver){
      e.preventDefault();
      e.stopPropagation();
      const token=saver.dataset.saveToken;
      const id=token.split(":")[1];
      const item=token.startsWith("post:")?posts.find(p=>p.id===id):products[id];
      toggleSaved(token,item?.title||item?.name||"Item");
      return;
    }

    const opener=e.target.closest(".open-post");
    if(opener){ openPost(opener.dataset.post); return; }

    const closer=e.target.closest("[data-close-modal]");
    if(closer){ closeModal(); return; }

    const suggestion=e.target.closest("[data-query]");
    if(suggestion){
      $("#siteSearch").value=suggestion.dataset.query;
      search(suggestion.dataset.query);
      return;
    }
  });

  $("#siteSearch").addEventListener("input",e=>search(e.target.value));
  document.addEventListener("keydown",e=>{if(e.key==="Escape") closeModal();});

  function initFromHash(){
    const h=location.hash.replace("#","");
    if(h.startsWith("category-")){
      state.category=h.replace("category-","");
      showView("home",false);
    }else if(["home","trending","watchlist","guides","categories","search","saved","more"].includes(h)){
      showView(h,false);
    }else{
      showView("home",false);
    }
  }

  updateSavedCount();
  renderCategories();
  initFromHash();
})();