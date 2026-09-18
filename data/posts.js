(() => {
  const TAG = "therealdea0cb-20";
  const amazonLink = asin => `https://www.amazon.com/dp/${asin}/ref=nosim?tag=${TAG}`;
  const amazonImage = asin => `https://images-na.ssl-images-amazon.com/images/P/${asin}.01.LZZZZZZZ.jpg`;

  const products = {
    blink: {
      id:"blink", asin:"B0FMLHFWDV", name:"Blink Outdoor 2K+ + Video Doorbell Bundle",
      category:"Smart Home", tags:["home","tech","smart home","security","gift"],
      note:"A practical smart-home bundle currently on our event watchlist.",
      link:amazonLink("B0FMLHFWDV"), image:amazonImage("B0FMLHFWDV")
    },
    ring: {
      id:"ring", asin:"B0DSCFGCSX", name:"Ring Battery Doorbell Plus + Extra Quick Release Battery",
      category:"Smart Home", tags:["home","tech","smart home","security","gift"],
      note:"A doorbell-and-battery bundle we’re monitoring as an early-event device offer.",
      link:amazonLink("B0DSCFGCSX"), image:amazonImage("B0DSCFGCSX")
    },
    kindle: {
      id:"kindle", asin:"B0DB6FK1H5", name:"Kindle Colorsoft Essentials Bundle",
      category:"Tech", tags:["tech","reading","gift","travel"],
      note:"A Colorsoft bundle with the reader, cover, and power adapter.",
      link:amazonLink("B0DB6FK1H5"), image:amazonImage("B0DB6FK1H5")
    },
    airtag: {
      id:"airtag", asin:"B0D54JZTHY", name:"Apple AirTag 4-Pack",
      category:"Tech / Travel", tags:["tech","travel","gift","tracker"],
      note:"A broadly useful travel-and-everyday tracker pack on our current watchlist.",
      link:amazonLink("B0D54JZTHY"), image:amazonImage("B0D54JZTHY")
    },
    dewalt: {
      id:"dewalt", asin:"B09YXZ4L8T", name:"DEWALT 20V Handheld Vacuum",
      category:"Home / Tools", tags:["home","tools","cleaning","car"],
      note:"A cordless HEPA handheld vacuum with a clear problem-to-product use case.",
      link:amazonLink("B09YXZ4L8T"), image:amazonImage("B09YXZ4L8T")
    },
    lodge: {
      id:"lodge", asin:"B000N501BK", name:"Lodge 6-Quart Enameled Cast Iron Dutch Oven",
      category:"Kitchen", tags:["kitchen","home","gift","cooking"],
      note:"A versatile 6-quart enameled Dutch oven we’re watching for kitchen shoppers.",
      link:amazonLink("B000N501BK"), image:amazonImage("B000N501BK")
    },
    iphone18SpigenCase: {
      id:"iphone18SpigenCase", asin:"B0FD1RNHHL", name:"Spigen Ultra Hybrid MagFit Case for iPhone 18 Pro / 17 Pro",
      category:"iPhone 18 Pro", tags:["iphone 18 pro","tech","case","magsafe","spigen","protection"],
      note:"A MagSafe-compatible hybrid case sized for iPhone 18 Pro / 17 Pro.",
      link:amazonLink("B0FD1RNHHL"), image:amazonImage("B0FD1RNHHL")
    },
    iphone18SpigenGlass: {
      id:"iphone18SpigenGlass", asin:"B0D84YX465", name:"Spigen GlasTR EZ FIT Screen Protector for iPhone 18 Pro",
      category:"iPhone 18 Pro", tags:["iphone 18 pro","tech","screen protector","spigen","protection"],
      note:"A tempered-glass screen protector with an alignment tray for easier installation.",
      link:amazonLink("B0D84YX465"), image:amazonImage("B0D84YX465")
    },
    iphone18TechWoven: {
      id:"iphone18TechWoven", asin:"B0HJ9VSRBN", name:"Apple iPhone 18 Pro TechWoven Case with MagSafe – Mulberry",
      category:"iPhone 18 Pro", tags:["iphone 18 pro","tech","case","magsafe","apple","techwoven"],
      note:"Apple's TechWoven MagSafe case for iPhone 18 Pro in Mulberry.",
      link:amazonLink("B0HJ9VSRBN"), image:amazonImage("B0HJ9VSRBN")
    },
    iphone18Silicone: {
      id:"iphone18Silicone", asin:"B0HJ9SJF63", name:"Apple iPhone 18 Pro Silicone Case with MagSafe – Burgundy",
      category:"iPhone 18 Pro", tags:["iphone 18 pro","tech","case","magsafe","apple","silicone"],
      note:"Apple's silicone MagSafe case for iPhone 18 Pro in Burgundy.",
      link:amazonLink("B0HJ9SJF63"), image:amazonImage("B0HJ9SJF63")
    }
  };

  const posts = [
    {
      id:"iphone-18-pro-accessories",
      type:"roundup",
      badge:"New iPhone 18 Pro",
      title:"Just got an iPhone 18 Pro? Start with these accessories",
      excerpt:"Protect the phone first, then add the extras. We pulled together verified case and screen-protection picks without turning the list into a cart full of gimmicks.",
      category:"Tech",
      categories:["tech","trending","guides"],
      tags:["iphone 18 pro","apple","magsafe","case","screen protector","accessories","new iphone"],
      published:"2026-09-18T18:30:00-04:00",
      updated:"Updated today",
      priority:97,
      productIds:["iphone18SpigenCase","iphone18SpigenGlass","iphone18TechWoven","iphone18Silicone"],
      href:"articles/iphone-18-pro-accessories.html",
      body:[
        "The iPhone 18 Pro is new, which means accessory searches are moving fast. Our first-pass rule is simple: protect the phone before buying novelty accessories. A well-fitting case and screen protector are the most practical starting point.",
        "Apple's own iPhone 18 Pro accessory catalog confirms a broad MagSafe ecosystem including cases, wallets, chargers, power banks, docks, and mounts. We’ll expand this guide as more exact-fit accessories are verified instead of filling it with products that only say they are 'universal.'"
      ],
      related:["prime-big-deal-days-2026","airtag-quick-find","how-we-pick"]
    },
    {
      id:"prime-big-deal-days-2026",
      type:"campaign",
      badge:"Featured campaign",
      title:"Prime Big Deal Days: the products we’re already watching",
      excerpt:"Early deal coverage is live. We’re tracking specific tech, smart-home, travel, and kitchen products without hard-coding prices that can go stale.",
      category:"Trending",
      categories:["trending","seasonal","tech","home","kitchen"],
      tags:["prime","amazon","deal days","gift","shopping event","october"],
      published:"2026-09-18T17:30:00-04:00",
      updated:"Updated today",
      featured:true,
      priority:100,
      trendingRank:1,
      productIds:["blink","ring","kindle"],
      href:"articles/prime-big-deal-days-2026.html",
      body:[
        "Prime Big Deal Days is the first major campaign in the new TheReal_Dealz feed. Instead of dumping dozens of links onto a page, we’re building a smaller watchlist of specific products and keeping the buying context separate from changing price and stock information.",
        "Use the campaign page to see the full six-product watchlist, why each item made the cut, and direct Amazon links using our Associates tag."
      ],
      related:["smart-home-two-picks","airtag-quick-find","lodge-kitchen-staple"]
    },
    {
      id:"smart-home-two-picks",
      type:"roundup",
      badge:"Two-product roundup",
      title:"Two smart-home bundles on our radar",
      excerpt:"Blink and Ring are both on the current device watchlist. Here’s the simple way to think about which kind of setup fits your home.",
      category:"Home",
      categories:["home","tech","trending"],
      tags:["blink","ring","doorbell","camera","security","smart home"],
      published:"2026-09-18T17:20:00-04:00",
      updated:"Updated today",
      priority:92,
      trendingRank:2,
      productIds:["blink","ring"],
      body:[
        "These are not identical products: one is centered on a broader camera-plus-doorbell setup, while the other is a doorbell bundle with an extra battery. That makes the choice more about the setup you want than which logo is more popular.",
        "We keep live price and availability information on Amazon. The role of this post is to make the use-case difference easier to understand before you click."
      ],
      related:["prime-big-deal-days-2026","how-we-pick"]
    },
    {
      id:"airtag-quick-find",
      type:"quick",
      badge:"Quick find",
      title:"A practical 4-pack for keys, bags, and travel",
      excerpt:"The AirTag 4-Pack is the kind of product that works across everyday carry, luggage, gifting, and shared households.",
      category:"Tech / Travel",
      categories:["tech","travel","trending"],
      tags:["airtag","apple","tracker","keys","luggage","travel","gift"],
      published:"2026-09-18T17:05:00-04:00",
      updated:"Updated today",
      priority:88,
      trendingRank:3,
      productIds:["airtag"],
      body:[
        "This one makes the feed because the use case is easy to understand: small trackers for items you already worry about losing. A four-pack also gives it a natural household and gifting angle.",
        "We’re not publishing a fixed deal price here. Tap through to Amazon to see the current offer before deciding."
      ],
      related:["prime-big-deal-days-2026","kindle-colorsoft-bundle"]
    },
    {
      id:"dewalt-cleanup",
      type:"spotlight",
      badge:"Problem → product",
      title:"For quick cleanup without dragging out the full vacuum",
      excerpt:"DEWALT’s 20V handheld vacuum caught our attention because the use case is obvious: cars, stairs, workshops, and smaller messes.",
      category:"Home / Tools",
      categories:["home","trending"],
      tags:["dewalt","vacuum","cleaning","car","workshop","tools"],
      published:"2026-09-18T16:45:00-04:00",
      updated:"Updated today",
      priority:82,
      trendingRank:4,
      productIds:["dewalt"],
      body:[
        "The best affiliate finds usually solve a recognizable annoyance. This one is less about novelty and more about avoiding a full-size vacuum when the job is small.",
        "Before buying, check whether the tool/battery setup works with what you already own. We keep the current product destination linked directly to Amazon."
      ],
      related:["how-we-pick","lodge-kitchen-staple"]
    },
    {
      id:"kindle-colorsoft-bundle",
      type:"spotlight",
      badge:"Giftable tech",
      title:"A reading-tech bundle worth keeping on the gift radar",
      excerpt:"The Kindle Colorsoft Essentials Bundle packages the reader with a cover and power adapter, which makes it easy to evaluate as a complete gift.",
      category:"Tech",
      categories:["tech","trending"],
      tags:["kindle","reader","reading","gift","colorsoft","travel"],
      published:"2026-09-18T16:30:00-04:00",
      updated:"Updated today",
      priority:79,
      trendingRank:5,
      productIds:["kindle"],
      body:[
        "Bundles can be easier to compare when you care about the full setup rather than the device alone. This linked version combines the Colorsoft reader, cover, and power adapter.",
        "We’re keeping the card focused on what the bundle is, while current pricing stays on Amazon."
      ],
      related:["airtag-quick-find","prime-big-deal-days-2026"]
    },
    {
      id:"lodge-kitchen-staple",
      type:"spotlight",
      badge:"Kitchen staple",
      title:"One pot, a lot of jobs",
      excerpt:"A 6-quart enameled Dutch oven is less of a viral gadget and more of a versatile kitchen workhorse — which is exactly why it made our watchlist.",
      category:"Kitchen",
      categories:["kitchen","home"],
      tags:["lodge","dutch oven","cooking","kitchen","pot","gift"],
      published:"2026-09-18T16:05:00-04:00",
      updated:"Updated today",
      priority:72,
      trendingRank:6,
      productIds:["lodge"],
      body:[
        "The appeal here is versatility: braises, soups, bread, one-pot meals, and oven-to-table cooking. That makes it easier to justify than a gadget with one narrow use.",
        "The linked product is the 6-quart Lodge enameled cast iron Dutch oven. Check the Amazon page for the current color options, price, and availability."
      ],
      related:["prime-big-deal-days-2026","matcha-home-guide"]
    },
    {
      id:"blink-vs-ring",
      type:"comparison",
      badge:"Comparison",
      title:"Blink bundle vs. Ring doorbell bundle: start with the job you need done",
      excerpt:"One gives you a wider camera setup; the other is centered on the front-door experience. The better fit depends on the coverage you actually want.",
      category:"Guide",
      categories:["guides","home","tech"],
      tags:["comparison","blink","ring","smart home","doorbell","camera"],
      published:"2026-09-18T15:40:00-04:00",
      updated:"Updated today",
      priority:68,
      productIds:["blink","ring"],
      body:[
        "Start with scope. If you want more than the front door, the Blink camera-plus-doorbell bundle is built around a broader setup. If your priority is the doorbell itself and battery convenience, the Ring bundle is the more focused product on this watchlist.",
        "This is a use-case comparison, not a claim that one brand is universally better. Check the linked product pages for current specifications before buying."
      ],
      related:["smart-home-two-picks","how-we-pick"]
    },
    {
      id:"matcha-home-guide",
      type:"guide",
      badge:"Buying guide",
      title:"The at-home matcha setup: what you actually need",
      excerpt:"A practical starter checklist for recreating the café routine without buying a counter full of gimmicks.",
      category:"Guide",
      categories:["guides","kitchen"],
      tags:["matcha","kitchen","guide","whisk","frother"],
      published:"2026-09-18T15:10:00-04:00",
      updated:"Updated today",
      priority:61,
      productIds:[],
      body:[
        "The essentials are simple: matcha, a fine sifter, a wide bowl or mug, and either a bamboo whisk or a frother. A dedicated whisk holder, special glassware, and flavored syrups can be nice, but they are convenience extras rather than requirements.",
        "This guide stays product-light until specific tools are verified. That keeps the advice useful even when individual listings change."
      ],
      related:["lodge-kitchen-staple","how-we-pick"]
    },
    {
      id:"how-we-pick",
      type:"editorial",
      badge:"Behind the feed",
      title:"How a product earns a spot on TheReal_Dealz",
      excerpt:"We separate “people are talking about it” from “this deserves a recommendation.” Here’s the filter.",
      category:"Guide",
      categories:["guides"],
      tags:["about","method","affiliate","curation","trust"],
      published:"2026-09-18T14:45:00-04:00",
      updated:"Updated today",
      priority:55,
      productIds:[],
      body:[
        "Trend signals are only the first step. We look for a clear use case, buyer intent, understandable specifications, timing, and whether the product adds something useful instead of just being viral.",
        "We also avoid hard-coding Amazon prices, ratings, and availability without an authorized live data source. Affiliate relationships are disclosed, and a tagged link does not turn an unverified product into a recommendation.",
        "The goal is a feed that feels fast like social media but keeps the context people need before they shop."
      ],
      related:["prime-big-deal-days-2026","matcha-home-guide"]
    }
  ];

  const categories = [
    {id:"all", label:"All", description:"Everything in the feed"},
    {id:"trending", label:"Trending", description:"What we’re watching now"},
    {id:"under-25", label:"Under $25", description:"Only after a current price is verified"},
    {id:"tech", label:"Tech", description:"Devices, accessories & useful tech"},
    {id:"home", label:"Home", description:"Smart home, cleaning & practical upgrades"},
    {id:"kitchen", label:"Kitchen", description:"Cooking, prep & café-at-home"},
    {id:"travel", label:"Travel", description:"Useful carry and trip essentials"},
    {id:"guides", label:"Guides", description:"Comparisons and buying explainers"},
    {id:"seasonal", label:"Seasonal", description:"Time-sensitive shopping moments"}
  ];

  window.TRD_DATA = {TAG, products, posts, categories};
})();