import fs from "node:fs/promises";

const tag=process.env.AMAZON_PARTNER_TAG || "therealdea0cb-20";
const config=JSON.parse(await fs.readFile("data/price-products.json","utf8"));
let state=JSON.parse(await fs.readFile("data/prices.json","utf8"));
const now=new Date().toISOString();
let active=false;

state.schemaVersion=1;
state.refreshTargetMinutes=60;
state.sources=state.sources||{};
state.products=state.products||{};

function upsert(productId,offer){
  const entry=state.products[productId]||{offers:[]};
  const key=o=>`${o.retailer}|${o.link}`;
  const map=new Map((entry.offers||[]).map(o=>[key(o),o]));
  map.set(key(offer),{...(map.get(key(offer))||{}),...offer});
  entry.offers=[...map.values()];
  state.products[productId]=entry;
}
function chunks(arr,n){const out=[];for(let i=0;i<arr.length;i+=n)out.push(arr.slice(i,i+n));return out}
function num(v){const n=Number(v);return Number.isFinite(n)?n:null}

async function refreshAmazon(){
  const clientId=process.env.AMAZON_CREATORS_CLIENT_ID,secret=process.env.AMAZON_CREATORS_CLIENT_SECRET;
  if(!clientId||!secret){state.sources.Amazon={status:"awaiting_api_access",label:"Creators API credentials not configured"};return}
  active=true;
  try{
    const tokenRes=await fetch("https://api.amazon.com/auth/o2/token",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({grant_type:"client_credentials",client_id:clientId,client_secret:secret,scope:"creatorsapi::default"})});
    if(!tokenRes.ok)throw new Error(`token ${tokenRes.status}`);
    const token=(await tokenRes.json()).access_token;
    const mapped=config.filter(x=>x.amazonAsin);
    for(const batch of chunks(mapped,10)){
      const res=await fetch("https://creatorsapi.amazon/catalog/v1/getItems",{method:"POST",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json","x-marketplace":"www.amazon.com"},body:JSON.stringify({itemIds:batch.map(x=>x.amazonAsin),itemIdType:"ASIN",marketplace:"www.amazon.com",partnerTag:tag,resources:["itemInfo.title","offersV2.listings.price","offersV2.listings.availability","offersV2.listings.dealDetails"]})});
      if(!res.ok)throw new Error(`getItems ${res.status}`);
      const json=await res.json();
      const items=json.itemsResult?.items||json.ItemsResult?.Items||json.items||[];
      for(const item of items){
        const asin=item.asin||item.ASIN;
        const cfg=batch.find(x=>x.amazonAsin===asin);if(!cfg)continue;
        const listings=item.offersV2?.listings||item.OffersV2?.Listings||[];
        const listing=listings[0];if(!listing)continue;
        const p=listing.price||listing.Price||{},money=p.money||p.Money||{};
        const saving=p.savingBasis?.money||p.SavingBasis?.Money||{};
        const savings=p.savings||p.Savings||{};
        const price=num(money.amount??money.Amount);
        const regular=num(saving.amount??saving.Amount);
        const percent=num(savings.percentage??savings.Percentage);
        const availability=listing.availability?.type||listing.Availability?.Type||null;
        const deal=listing.dealDetails?.badge||listing.DealDetails?.Badge||null;
        upsert(cfg.id,{retailer:"Amazon",link:`https://www.amazon.com/dp/${asin}/ref=nosim?tag=${tag}`,affiliate:true,price,regularPrice:regular,savingsPercent:percent,currency:money.currency||money.Currency||"USD",availability,dealBadge:deal,verifiedAt:now,source:"Amazon Creators API"});
      }
    }
    state.sources.Amazon={status:"ok",label:"Creators API connected",verifiedAt:now};
  }catch(err){state.sources.Amazon={status:"error",label:String(err.message||err),verifiedAt:now}}
}

async function refreshBestBuy(){
  const key=process.env.BESTBUY_API_KEY;
  const mapped=config.filter(x=>x.bestBuySku);
  if(!key){state.sources["Best Buy"]={status:"credentials_missing",label:"developer API key not configured"};return}
  if(!mapped.length){state.sources["Best Buy"]={status:"ready",label:"API connected; exact SKUs still need mapping"};return}
  active=true;
  try{
    for(const cfg of mapped){
      const fields="sku,name,salePrice,regularPrice,onSale,url";
      const res=await fetch(`https://api.bestbuy.com/v1/products(sku=${encodeURIComponent(cfg.bestBuySku)})?apiKey=${encodeURIComponent(key)}&format=json&show=${fields}`);
      if(!res.ok)throw new Error(`Best Buy ${res.status}`);
      const item=(await res.json()).products?.[0];if(!item)continue;
      const price=num(item.salePrice),regular=num(item.regularPrice);
      upsert(cfg.id,{retailer:"Best Buy",link:cfg.bestBuyAffiliateLink||item.url,affiliate:Boolean(cfg.bestBuyAffiliateLink),price,regularPrice:regular,savingsPercent:price&&regular&&regular>price?((regular-price)/regular*100):null,currency:"USD",availability:null,verifiedAt:now,source:"Best Buy Products API"});
    }
    state.sources["Best Buy"]={status:"ok",label:"Products API connected",verifiedAt:now};
  }catch(err){state.sources["Best Buy"]={status:"error",label:String(err.message||err),verifiedAt:now}}
}

await refreshAmazon();
await refreshBestBuy();
state.sources.eBay=state.sources.eBay||{status:"credentials_missing",label:"production Browse API not connected"};

if(!active){
  console.log("No live retailer API credentials configured; leaving prices.json unchanged.");
  process.exit(0);
}
state.generatedAt=now;
await fs.writeFile("data/prices.json",JSON.stringify(state,null,2)+"\n");
console.log("Updated price snapshot",now);
