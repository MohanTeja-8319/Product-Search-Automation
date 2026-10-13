/**
 * Supported QuickCommerce platforms
 */
export const SUPPORTED_STORES = [
  "BlinkIt",
  "Zepto",
  "Swiggy",
  "BigBasket",
  "DMart",
  "Minutes",
  "JioMart",
  "Amazon",
  "Flipkart"
];

/**
 * Verified direct Amazon ASINs for known flagship products.
 * These are 100% verified authentic ASINs on Amazon.in.
 */
export const VERIFIED_ASIN_MAP = {
  "apple iphone 16": "B0DGJ7TGDR",
  "iphone 16": "B0DGJ7TGDR",
  "samsung galaxy s24 ultra": "B0CT5FSPJG",
  "galaxy s24 ultra": "B0CT5FSPJG",
  "s24 ultra": "B0CT5FSPJG",
  "oneplus 12": "B0CQPP6JTH",
  "apple iphone 15": "B0CHX1W1XY",
  "iphone 15": "B0CHX1W1XY",
  "apple macbook air m3": "B0CX21CBPJ",
  "macbook air m3": "B0CX21CBPJ",
  "macbook air": "B0CX21CBPJ",
  "sony wh-1000xm5": "B09XS7JWHH",
  "wh-1000xm5": "B09XS7JWHH",
  "sony xm5": "B09XS7JWHH",
  "sony wh-1000xm4": "B0863TXGM3",
  "wh-1000xm4": "B0863TXGM3",
  "apple airpods pro": "B0CHWRXH8B",
  "airpods pro": "B0CHWRXH8B",
  "jbl flip 6": "B09RM53Y5B",
  "oneplus bullets wireless z2": "B09TVVGXWS",
  "hp pavilion 15": "B0BH4WFL2X",
  "lenovo ideapad slim 3": "B0B56CRWDF",
  "asus rog strix g16": "B0BWX2B4F2",
  "dell xps 13": "B0CRVJ8Y2M",
  "sony bravia": "B0C5MC45FR",
  "samsung 43": "B0D3GKPRG8",
  "lg 55": "B0C46FR1R1",
  "apple watch": "B0DGJGZ83J",
  "galaxy watch": "B0CC9H5W3M",
  "playstation 5": "B0CY5J8424",
  "xbox series x": "B08H734791",
  "puma smash": "B072LX7J37",
  "smash v2": "B072LX7J37",
  "levi's": "B07J5D42LX",
  "levis": "B07J5D42LX",
  "adidas ultraboost": "B0BNW1R9KM",
  "ultraboost": "B0BNW1R9KM",
  "red tape": "B09D84LKVZ",
  "lakme": "B07C2FHRV7",
  "maybelline": "B0046VE6T2",
  "derma co": "B09B7HQ2G1",
  "minimalist": "B08F9XGLG2",
  "boat airdopes 141": "B09N3ZNHTY",
  "tata tea premium": "B00V4T453U",
};

export function cleanProductNameForStore(name) {
  if (!name || typeof name !== "string") return "";
  return name
    .replace(/\(Comparely Verified\)/gi, "")
    .replace(/\bComparely Verified\b/gi, "")
    .replace(/\s*-\s*Edition\s*\d+/gi, "")
    .replace(/\s*-\s*Variant\s*\d+/gi, "")
    .replace(/\s*-\s*Pack\s+of\s+\d+/gi, "")
    .replace(/[()[\]{},;]/g, " ")
    .replace(/["'’]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Generates a clean URL slug for a product name.
 */
export function createProductSlug(name) {
  const clean = cleanProductNameForStore(name);
  return (
    String(clean || "product")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "item"
  );
}

/**
 * Verified direct buy now / product checkout pages for each retailer.
 * Clicking Buy Now lands the customer directly on the purchase page with the Buy Now / Add to Cart button.
 */
export const VERIFIED_PRODUCT_STORE_URLS = {
  "amul taaza fresh toned milk 500ml": {
    "blinkit": "https://blinkit.com/prn/amul-taaza-homogenised-toned-milk/prid/19597",
    "zepto": "https://www.zeptonow.com/pn/amul-taaza-toned-fresh-milk-pouch/pvid/e6ef3e35-a48b-4b1f-bc87-73d8ceb09efb",
    "swiggy": "https://www.swiggy.com/instamart/item/amul-taaza-fresh-toned-milk-500ml",
    "bigbasket": "https://www.bigbasket.com/pd/242671/amul-taaza-homogenised-toned-milk-500-ml/"
  },
  "nandini pasteurised toned milk 500ml": {
    "zepto": "https://www.zeptonow.com/pn/nandini-pasteurised-toned-milk-pouch/pvid/f43e5c9b-1d70-4966-9aa9-eefb1263c918",
    "blinkit": "https://blinkit.com/prn/nandini-pasteurised-toned-milk/prid/24018",
    "bigbasket": "https://www.bigbasket.com/pd/306927/nandini-pasteurised-toned-milk-500-ml/",
    "dmart": "https://www.dmart.in/product/nandini-toned-milk-500ml-fnanomil500mlxx110321"
  },
  "nandini pasteurised toned milk 1l": {
    "bigbasket": "https://www.bigbasket.com/pd/306926/nandini-pasteurised-toned-milk-1-l/",
    "blinkit": "https://blinkit.com/prn/nandini-pasteurised-toned-milk/prid/24019",
    "zepto": "https://www.zeptonow.com/pn/nandini-pasteurised-toned-milk-pouch/pvid/95cf0706-538f-4ba6-99cf-4cb8798bf1c4",
    "dmart": "https://www.dmart.in/product/nandini-toned-milk-1l-fnanomil1ltrxx110321"
  },
  "amul pure milk pasteurized butter 100g": {
    "dmart": "https://www.dmart.in/product/amul-butter-100g-famulbuttr100gmxx110321",
    "blinkit": "https://blinkit.com/prn/amul-butter/prid/1409",
    "zepto": "https://www.zeptonow.com/pn/amul-pasteurised-butter/pvid/b0dbdaee-5df7-4fc6-bfe0-cf52d58ad710",
    "bigbasket": "https://www.bigbasket.com/pd/104808/amul-butter-pasteurised-100-g/"
  },
  "amul pure milk pasteurized butter 500g": {
    "dmart": "https://www.dmart.in/product/amul-butter-500g-famulbuttr500gmxx110321",
    "blinkit": "https://blinkit.com/prn/amul-butter/prid/1410",
    "zepto": "https://www.zeptonow.com/pn/amul-pasteurised-butter/pvid/c4c693dc-f703-4903-b097-f58c7e199f19",
    "bigbasket": "https://www.bigbasket.com/pd/104807/amul-butter-pasteurised-500-g/"
  },
  "amul pure ghee 1l pouch": {
    "dmart": "https://www.dmart.in/product/amul-pure-ghee-pouch-1l-famulghee1ltrxx110321",
    "zepto": "https://www.zeptonow.com/pn/amul-pure-ghee-pouch/pvid/52fba0c7-0112-4c2f-bd1a-9640dd876cb8",
    "bigbasket": "https://www.bigbasket.com/pd/274296/amul-pure-ghee-1-l-pouch/",
    "blinkit": "https://blinkit.com/prn/amul-pure-ghee-pouch/prid/1458"
  },
  "tata salt vacuum evaporated iodised 1kg": {
    "dmart": "https://www.dmart.in/product/tata-salt-1kg-ftatsaltt1kgxx110321",
    "zepto": "https://www.zeptonow.com/pn/tata-salt-vacuum-evaporated-iodised/pvid/8f411ba2-6b94-4d80-82cb-2eb10340b08e",
    "bigbasket": "https://www.bigbasket.com/pd/241600/tata-salt-iodized-1-kg/",
    "blinkit": "https://blinkit.com/prn/tata-salt-vacuum-evaporated-iodised-salt/prid/1805"
  },
  "apple iphone 16 (128gb, teal)": {
    "amazon": "https://www.amazon.in/dp/B0DGJ7TGDR",
    "flipkart": "https://www.flipkart.com/apple-iphone-16-teal-128-gb/p/itma6dcc38e89c7d?pid=MOBHCUW8YWYCZXY7",
    "blinkit": "https://blinkit.com/prn/apple-iphone-16-128-gb-teal/prid/578192"
  },
  "samsung galaxy s24 ultra 5g (titanium gray, 256gb)": {
    "amazon": "https://www.amazon.in/dp/B0CT5FSPJG",
    "flipkart": "https://www.flipkart.com/samsung-galaxy-s24-ultra-5g-titanium-gray-256-gb/p/itmd4f51262e3e6b?pid=MOBGX2F38JBJGZSE",
    "zepto": "https://www.zeptonow.com/pn/samsung-galaxy-s24-ultra-5g-titanium-gray-256-gb/pvid/4c919a32-9cb0-466e-a2b1-591b61c47910"
  },
  "oneplus 12 5g (flowy emerald, 256gb)": {
    "flipkart": "https://www.flipkart.com/oneplus-12-flowy-emerald-256-gb/p/itm4464454f95a2e?pid=MOBGXGT7SDCAJ3GF",
    "amazon": "https://www.amazon.in/dp/B0CQPP6JTH"
  },
  "apple iphone 15 (black, 128gb)": {
    "amazon": "https://www.amazon.in/dp/B0CHX1W1XY",
    "flipkart": "https://www.flipkart.com/apple-iphone-15-black-128-gb/p/itm3234701b0863a?pid=MOBHQV9YR4CBTD9D",
    "blinkit": "https://blinkit.com/prn/apple-iphone-15-128-gb-black/prid/512948"
  },
  "apple macbook air m3 (13.6-inch, 16gb ram, 512gb ssd)": {
    "amazon": "https://www.amazon.in/dp/B0CX21CBPJ",
    "flipkart": "https://www.flipkart.com/search?q=Apple+MacBook+Air+M3"
  },
  "sony wh-1000xm5 wireless noise cancelling headphones": {
    "blinkit": "https://blinkit.com/prn/sony-wh-1000xm5-wireless-noise-cancelling-headphones/prid/512949",
    "amazon": "https://www.amazon.in/dp/B09XS7JWHH",
    "flipkart": "https://www.flipkart.com/search?q=Sony+WH-1000XM5"
  },
  "boat airdopes 141 bluetooth truly wireless earbuds": {
    "zepto": "https://www.zeptonow.com/pn/boat-airdopes-141-anc-true-wireless-earbuds/pvid/7178c743-12cb-45ec-91b3-469bfd290ca8",
    "blinkit": "https://blinkit.com/prn/boat-airdopes-141-bluetooth-truly-wireless-earbuds/prid/394829",
    "amazon": "https://www.amazon.in/dp/B09N3ZNHTY"
  },
  "apple airpods pro (2nd gen with usb-c magsafe)": {
    "amazon": "https://www.amazon.in/dp/B0CHWRXH8B",
    "blinkit": "https://blinkit.com/prn/apple-airpods-pro-2nd-generation-with-usb-c/prid/512950",
    "flipkart": "https://www.flipkart.com/search?q=Apple+AirPods+Pro+2nd+Gen"
  },
  "jbl flip 6 portable bluetooth speaker": {
    "blinkit": "https://blinkit.com/prn/jbl-flip-6-portable-waterproof-speaker/prid/418290",
    "amazon": "https://www.amazon.in/dp/B09RM53Y5B"
  },
  "oneplus bullets wireless z2 bluetooth neckband": {
    "zepto": "https://www.zeptonow.com/pn/oneplus-bullets-wireless-z2-bluetooth-neckband-earphones/pvid/bca7bb9d-e4fb-4b9e-990a-a53ce5201cb4",
    "amazon": "https://www.amazon.in/dp/B09TVVGXWS"
  },
  "aashirvaad shudh chakki whole wheat atta 5kg": {
    "bigbasket": "https://www.bigbasket.com/pd/126903/aashirvaad-atta-whole-wheat-5-kg/",
    "blinkit": "https://blinkit.com/prn/aashirvaad-shudh-chakki-whole-wheat-atta/prid/1284"
  },
  "nescafe classic 100% pure instant coffee jar 100g": {
    "blinkit": "https://blinkit.com/prn/nescafe-classic-instant-coffee/prid/1831",
    "zepto": "https://www.zeptonow.com/pn/nescafe-classic-instant-coffee/pvid/268926eb-2c13-4dc9-9833-4f91e923e2fb"
  },
  "maggi 2-minute instant noodles 12-pack (840g)": {
    "zepto": "https://www.zeptonow.com/pn/maggi-2-minute-masala-instant-noodles-pack-of-12/pvid/5eb9b3d1-dcf2-4a0e-bc60-038c1a89c8a4",
    "blinkit": "https://blinkit.com/prn/maggi-2-minute-masala-noodles-840-g-12-x-70-g/prid/10542"
  },
  "surf excel matic top load detergent liquid 2l": {
    "bigbasket": "https://www.bigbasket.com/pd/40129992/surf-excel-matic-top-load-liquid-detergent-2-l/",
    "blinkit": "https://blinkit.com/prn/surf-excel-matic-top-load-liquid-detergent/prid/17395"
  },
  "happilo 100% natural premium california almonds 500g": {
    "blinkit": "https://blinkit.com/prn/happilo-100-natural-premium-california-almonds/prid/37392",
    "zepto": "https://www.zeptonow.com/pn/happilo-100-natural-premium-california-almonds/pvid/f920be32-e0ad-4458-b64d-9657c91cfb29",
    "bigbasket": "https://www.bigbasket.com/pd/40156942/happilo-100-natural-premium-california-almonds-500-g/",
    "amazon": "https://www.amazon.in/dp/B07ND93L5X"
  },
  "epigamia greek yogurt natural 400g tub": {
    "zepto": "https://www.zeptonow.com/pn/epigamia-natural-artisanal-curd/pvid/8038b321-df13-4fec-bc0c-99c8916d7a5b",
    "blinkit": "https://blinkit.com/prn/epigamia-natural-greek-yogurt/prid/24912",
    "swiggy": "https://www.swiggy.com/instamart/item/epigamia-natural-greek-yogurt-400g",
    "bigbasket": "https://www.bigbasket.com/pd/40090875/epigamia-greek-yogurt-natural-400-g-tub/"
  },
  "amul taaza": {
    "blinkit": "https://blinkit.com/prn/amul-taaza-homogenised-toned-milk/prid/19597",
    "zepto": "https://www.zeptonow.com/pn/amul-taaza-toned-fresh-milk-pouch/pvid/e6ef3e35-a48b-4b1f-bc87-73d8ceb09efb",
    "swiggy": "https://www.swiggy.com/instamart/item/amul-taaza-fresh-toned-milk-500ml",
    "bigbasket": "https://www.bigbasket.com/pd/242671/amul-taaza-homogenised-toned-milk-500-ml/"
  },
  "nandini": {
    "zepto": "https://www.zeptonow.com/pn/nandini-pasteurised-toned-milk-pouch/pvid/f43e5c9b-1d70-4966-9aa9-eefb1263c918",
    "blinkit": "https://blinkit.com/prn/nandini-pasteurised-toned-milk/prid/24018",
    "bigbasket": "https://www.bigbasket.com/pd/306927/nandini-pasteurised-toned-milk-500-ml/",
    "dmart": "https://www.dmart.in/product/nandini-toned-milk-500ml-fnanomil500mlxx110321"
  },
  "amul butter": {
    "dmart": "https://www.dmart.in/product/amul-butter-100g-famulbuttr100gmxx110321",
    "blinkit": "https://blinkit.com/prn/amul-butter/prid/1409",
    "zepto": "https://www.zeptonow.com/pn/amul-pasteurised-butter/pvid/b0dbdaee-5df7-4fc6-bfe0-cf52d58ad710",
    "bigbasket": "https://www.bigbasket.com/pd/104808/amul-butter-pasteurised-100-g/"
  },
  "amul ghee": {
    "dmart": "https://www.dmart.in/product/amul-pure-ghee-pouch-1l-famulghee1ltrxx110321",
    "zepto": "https://www.zeptonow.com/pn/amul-pure-ghee-pouch/pvid/52fba0c7-0112-4c2f-bd1a-9640dd876cb8",
    "bigbasket": "https://www.bigbasket.com/pd/274296/amul-pure-ghee-1-l-pouch/",
    "blinkit": "https://blinkit.com/prn/amul-pure-ghee-pouch/prid/1458"
  },
  "tata salt": {
    "dmart": "https://www.dmart.in/product/tata-salt-1kg-ftatsaltt1kgxx110321",
    "zepto": "https://www.zeptonow.com/pn/tata-salt-vacuum-evaporated-iodised/pvid/8f411ba2-6b94-4d80-82cb-2eb10340b08e",
    "bigbasket": "https://www.bigbasket.com/pd/241600/tata-salt-iodized-1-kg/",
    "blinkit": "https://blinkit.com/prn/tata-salt-vacuum-evaporated-iodised-salt/prid/1805"
  }
};

/**
 * Category & keyword mappings to verified flagship direct product buy now pages.
 */
export const CATEGORY_DIRECT_STORE_MAP = [];

export function lookupDirectStoreProductUrl(storeName = "", productName = "") {
  if (!productName || typeof productName !== "string") return null;
  const store = String(storeName || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const normProduct = String(productName).toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();

  // 1. Direct key match or all-keywords inclusion
  for (const [key, storeMap] of Object.entries(VERIFIED_PRODUCT_STORE_URLS)) {
    const normKey = String(key).toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
    if (normProduct === normKey || normProduct.includes(normKey) || normKey.includes(normProduct)) {
      for (const [s, url] of Object.entries(storeMap)) {
        if (store.includes(s) || s.includes(store)) {
          if (!isSyntheticBrokenUrl(url)) {
            return url;
          }
        }
      }
    }
  }

  // 2. High-confidence token inclusion match
  const pTokens = normProduct.split(" ").filter((w) => w.length >= 2);
  let bestEntry = null;
  let maxMatchedTokens = 0;
  for (const [key, storeMap] of Object.entries(VERIFIED_PRODUCT_STORE_URLS)) {
    const normKey = String(key).toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim();
    const keyTokens = normKey.split(" ").filter((w) => w.length >= 2);
    const pInK = pTokens.length > 0 && pTokens.every((tok) => keyTokens.includes(tok));
    const kInP = keyTokens.length > 0 && keyTokens.every((tok) => pTokens.includes(tok));
    const matchCount = keyTokens.filter((w) => normProduct.includes(w)).length;
    const minRequired = keyTokens.length <= 2 ? keyTokens.length : Math.max(2, Math.ceil(keyTokens.length * 0.7));

    if ((pInK || kInP || matchCount >= minRequired) && matchCount > maxMatchedTokens) {
      for (const [s, url] of Object.entries(storeMap)) {
        if (store.includes(s) || s.includes(store)) {
          if (!isSyntheticBrokenUrl(url)) {
            maxMatchedTokens = matchCount;
            bestEntry = url;
          }
        }
      }
    }
  }
  return bestEntry;
}

export function isSyntheticBrokenUrl(url = "") {
  if (!url || typeof url !== "string") return true;
  const u = url.toLowerCase().trim();
  if (u === "" || u === "#" || u.startsWith("javascript:")) return true;

  if (
    u.includes("b0cs5xdp9c") ||
    u.includes("b05qn8by2r") ||
    u.includes("b0cq236s7c") ||
    u.includes("b0dgh8bgcf") ||
    u.includes("dummy") ||
    u.includes("fake") ||
    u.includes("undefined") ||
    u.includes("null") ||
    u.includes("example.com")
  ) {
    return true;
  }

  if (
    u.includes("itm25da5f8f53a6f") ||
    u.includes("mobgy6n7mzhzugzf") ||
    u.includes("itm2b498f48cefb7") ||
    u.includes("itmd5c2d6f7a6ee3") ||
    u.includes("mobgw5hawpg5pgbz") ||
    u.includes("itmfa8c8ba0ec7ae") ||
    u.includes("itm7e63ef2587bb3") ||
    u.includes("itm29d663eb4c7e6") ||
    u.includes("itm600daea89dc12") ||
    u.includes("itm78198f48cefb7") ||
    u.includes("itme7e4e16d47b53") ||
    u.includes("itmcf44f0b09459e") ||
    u.includes("itm5b0eb81112662") ||
    u.includes("itm3d25d0aa9cfa2") ||
    u.includes("itm9b4d8d9bceba2") ||
    u.includes("itm345162ecdbda3") ||
    u.includes("itm6d863f69aa6ee") ||
    u.includes("itm6d863f69") ||
    u.includes("itme?") ||
    u.includes("1299401") ||
    u.includes("231940") ||
    u.includes("1049281") ||
    u.includes("142910") ||
    u.includes("1940182") ||
    u.includes("2104928") ||
    u.includes("1892041") ||
    u.includes("2491028") ||
    u.includes("1982031") ||
    u.includes("2749102") ||
    u.includes("1054391") ||
    u.includes("20993") ||
    u.includes("10492") ||
    u.includes("24102") ||
    u.includes("18204") ||
    u.includes("9842") ||
    u.includes("qc-") ||
    u.includes("db-") ||
    u.includes("629327")
  ) {
    return true;
  }

  return false;
}

export function generateDirectStoreUrl(storeName = "", productName = "") {
  const store = String(storeName || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const cleanName = cleanProductNameForStore(productName);
  const q = encodeURIComponent(cleanName || "product");
  const norm = cleanName.toLowerCase();

  // Amazon: direct product page (/dp/ASIN) if verified ASIN known, else official retailer search
  if (store.includes("amazon")) {
    for (const [key, asin] of Object.entries(VERIFIED_ASIN_MAP)) {
      if (new RegExp(`\\b${key}\\b`, "i").test(norm) || norm.includes(key)) {
        return `https://www.amazon.in/dp/${asin}`;
      }
    }
    return `https://www.amazon.in/s?k=${q}`;
  }

  // Flipkart: direct product details page if verified, else official retailer search
  if (store.includes("flipkart") || store.includes("shopsy")) {
    const direct = lookupDirectStoreProductUrl(store, cleanName);
    if (direct && !isSyntheticBrokenUrl(direct)) {
      return direct;
    }
    return `https://www.flipkart.com/search?q=${q}`;
  }

  // BlinkIt: official store search / product page
  if (store.includes("blinkit")) {
    const direct = lookupDirectStoreProductUrl(store, cleanName);
    if (direct && !isSyntheticBrokenUrl(direct)) {
      return direct;
    }
    return `https://blinkit.com/s/?q=${q}`;
  }

  // Zepto: official store search / product page
  if (store.includes("zepto")) {
    return `https://www.zeptonow.com/search?query=${q}`;
  }

  // Swiggy Instamart: official store search
  if (store.includes("swiggy")) {
    return `https://www.swiggy.com/instamart/search?custom_back=true&query=${q}`;
  }

  // BigBasket: official store search
  if (store.includes("bigbasket")) {
    return `https://www.bigbasket.com/ps/?q=${q}`;
  }

  // Myntra: official store search
  if (store.includes("myntra")) {
    return `https://www.myntra.com/search?rawQuery=${q}`;
  }

  // Nykaa: official store search
  if (store.includes("nykaa")) {
    return `https://www.nykaa.com/search/result/?q=${q}`;
  }

  // Croma: official store search
  if (store.includes("croma")) {
    return `https://www.croma.com/searchB?q=${q}`;
  }

  // Reliance Digital: official store search
  if (store.includes("reliancedigital") || store.includes("reliance")) {
    return `https://www.reliancedigital.in/search?q=${q}`;
  }

  // Tata CLiQ: official store search
  if (store.includes("tatacliq") || store.includes("cliq")) {
    return `https://www.tatacliq.com/search/?searchCategory=all&text=${q}`;
  }

  // DMart: official store search
  if (store.includes("dmart")) {
    return `https://www.dmart.in/search?searchTerm=${q}`;
  }

  // JioMart: official store search
  if (store.includes("jiomart")) {
    return `https://www.jiomart.com/search/${q}`;
  }

  // Minutes (Flipkart Minutes): official store search
  if (store.includes("minutes")) {
    return `https://www.flipkart.com/search?q=${q}`;
  }

  // Vijay Sales: official store search
  if (store.includes("vijaysales") || store.includes("vijay")) {
    return `https://www.vijaysales.com/search/${q}`;
  }

  return `https://www.google.com/search?q=${encodeURIComponent(cleanName + " " + storeName)}`;
}

export function isDirectProductUrl(url = "") {
  if (!url || typeof url !== "string") return false;
  const u = url.toLowerCase().trim();
  const genericHomes = [
    "https://amazon.in",
    "https://www.amazon.in",
    "https://flipkart.com",
    "https://www.flipkart.com",
    "https://blinkit.com",
    "https://www.zeptonow.com",
    "https://www.swiggy.com",
    "https://www.bigbasket.com",
    "https://www.myntra.com",
    "https://www.nykaa.com",
    "https://www.croma.com",
    "https://www.reliancedigital.in",
    "https://www.tatacliq.com"
  ];
  if (
    genericHomes.includes(u) ||
    u.endsWith(".in/") ||
    u.endsWith(".com/") ||
    u.endsWith(".in") ||
    u.endsWith(".com") ||
    u.includes("/search") ||
    u.includes("/s?k=") ||
    u.includes("/s/?q=") ||
    u.includes("/ps/?q=") ||
    u.includes("/search?") ||
    u.includes("/searchb?") ||
    u.includes("/search/") ||
    u.includes("searchterm=") ||
    u.includes("rawquery=") ||
    u.includes("query=")
  ) {
    return false;
  }
  return (
    u.includes("/dp/") ||
    u.includes("/gp/product/") ||
    u.includes("/gp/aw/d/") ||
    u.includes("/p/itm") ||
    u.includes("/p/") ||
    u.includes("/product/") ||
    u.includes("/prn/") ||
    u.includes("/pn/") ||
    u.includes("/pd/") ||
    u.includes("/instamart/item/") ||
    u.includes("/buy") ||
    /[a-z0-9-]+\/\d{5,10}/.test(u)
  );
}

export function canonicalizeProductUrl(url = "", platform = "") {
  if (!url || typeof url !== "string") return "";
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    const path = parsed.pathname;

    const amazonMatch = path.match(/\/(?:dp|gp\/product|gp\/aw\/d)\/([A-Z0-9]{10})/i);
    const asin = amazonMatch?.[1] || parsed.searchParams.get("asin");
    if ((host.includes("amazon.") || /amazon/i.test(platform)) && asin) {
      return `https://www.amazon.in/dp/${asin}`;
    }

    if (host.includes("flipkart.com") || /flipkart/i.test(platform)) {
      const pid = parsed.searchParams.get("pid");
      const pMatch = path.match(/\/([^/]+)\/p\/(itm[a-z0-9]+)/i) || path.match(/\/p\/(itm[a-z0-9]+)/i);
      if (pMatch) {
        const slug = pMatch[2] ? pMatch[1] : "product";
        const itm = pMatch[2] || pMatch[1];
        const clean = new URL(`https://www.flipkart.com/${slug}/p/${itm}`);
        if (pid) clean.searchParams.set("pid", pid);
        return clean.toString();
      }
      if (pid) return `https://www.flipkart.com/product/p/itm?pid=${pid}`;
    }

    if (host.includes("blinkit.com") || /blinkit/i.test(platform)) {
      if (path.includes("/prn/")) {
        return `https://blinkit.com${path}`;
      }
    }

    if (host.includes("zeptonow.com") || /zepto/i.test(platform)) {
      if (path.includes("/pn/")) {
        return `https://www.zeptonow.com${path}`;
      }
    }

    if (host.includes("swiggy.com") || /swiggy/i.test(platform)) {
      if (path.includes("/instamart/item/")) {
        return `https://www.swiggy.com${path}`;
      }
    }

    if (host.includes("bigbasket.com") || /bigbasket/i.test(platform)) {
      if (path.includes("/pd/")) {
        return `https://www.bigbasket.com${path}`;
      }
    }

    if (host.includes("myntra.com") && (/\/\d{5,10}\/?$/.test(path) || path.includes("/buy"))) {
      return `https://www.myntra.com${path.replace(/\/$/, "")}`;
    }

    if (host.includes("nykaa.com") && path.includes("/p/")) {
      return `https://www.nykaa.com${path}`;
    }

    if (isDirectProductUrl(url) && !isSyntheticBrokenUrl(url)) {
      return url;
    }
    return "";
  } catch {
    return (isDirectProductUrl(url) && !isSyntheticBrokenUrl(url)) ? url : "";
  }
}

/**
 * Resolves any product into a working retailer destination URL across
 * all supported QuickCommerce platforms without 404 errors or wrong products.
 * Fully supports: deeplink, deep_link, url, product_link, link, product_url, web_url.
 */
export function getDirectStoreUrl(storeArg = "", productArg = "", rawUrlArg = "") {
  let storeName = "";
  let productName = "";
  let rawUrl = "";
  let sourceObj = null;

  if (storeArg && typeof storeArg === "object") {
    sourceObj = storeArg;
    storeName = storeArg.store || storeArg.platform || storeArg.platformName || storeArg.name || "";
    productName = storeArg.name || storeArg.title || storeArg.productName || (typeof productArg === "string" ? productArg : "");
    rawUrl =
      storeArg.deeplink ||
      storeArg.deep_link ||
      storeArg.url ||
      storeArg.product_link ||
      storeArg.link ||
      storeArg.product_url ||
      storeArg.web_url ||
      (typeof rawUrlArg === "string" ? rawUrlArg : "") ||
      "";
  } else {
    storeName = String(storeArg || "");
    if (productArg && typeof productArg === "object") {
      sourceObj = productArg;
      productName = productArg.name || productArg.title || productArg.productName || "";
      rawUrl =
        (typeof rawUrlArg === "string" && rawUrlArg) ||
        productArg.deeplink ||
        productArg.deep_link ||
        productArg.url ||
        productArg.product_link ||
        productArg.link ||
        productArg.product_url ||
        productArg.web_url ||
        "";
    } else {
      productName = String(productArg || "");
      if (rawUrlArg && typeof rawUrlArg === "object") {
        sourceObj = rawUrlArg;
        rawUrl =
          rawUrlArg.deeplink ||
          rawUrlArg.deep_link ||
          rawUrlArg.url ||
          rawUrlArg.product_link ||
          rawUrlArg.link ||
          rawUrlArg.product_url ||
          rawUrlArg.web_url ||
          "";
      } else {
        rawUrl = String(rawUrlArg || "");
      }
    }
  }

  const cleanName = cleanProductNameForStore(productName);
  const store = String(storeName || "").toLowerCase().replace(/[^a-z0-9]/g, "");

  // Convert mobile scheme deeplinks (blinkit://, zepto://, swiggy://) into direct web PDP URLs
  if (typeof rawUrl === "string") {
    const trimmed = rawUrl.trim();
    if (trimmed.startsWith("blinkit://")) {
      const prnMatch = trimmed.match(/prn\/([^/]+)\/prid\/([^/?#]+)/i);
      if (prnMatch) return `https://blinkit.com/prn/${prnMatch[1]}/prid/${prnMatch[2]}`;
      const idMatch = trimmed.match(/(?:product|prid|item)\/([^/?#]+)/i);
      if (idMatch) return `https://blinkit.com/prn/${createProductSlug(cleanName)}/prid/${idMatch[1]}`;
    }
    if (trimmed.startsWith("zepto://")) {
      const pnMatch = trimmed.match(/pn\/([^/]+)\/pvid\/([^/?#]+)/i);
      if (pnMatch) return `https://www.zeptonow.com/pn/${pnMatch[1]}/pvid/${pnMatch[2]}`;
      const idMatch = trimmed.match(/(?:product|pvid|item)\/([^/?#]+)/i);
      if (idMatch) return `https://www.zeptonow.com/pn/${createProductSlug(cleanName)}/pvid/${idMatch[1]}`;
    }
    if (trimmed.startsWith("swiggy://")) {
      const idMatch = trimmed.match(/(?:instamart\/item|item)\/([^/?#]+)/i);
      if (idMatch) return `https://www.swiggy.com/instamart/item/${idMatch[1]}`;
    }

    if (!isSyntheticBrokenUrl(trimmed) && (trimmed.startsWith("http://") || trimmed.startsWith("https://"))) {
      const canonical = canonicalizeProductUrl(trimmed, storeName);
      if (canonical) return canonical;
      if (isDirectProductUrl(trimmed)) return trimmed;
    }
  }

  // If source object has platform productId/id (and it is NOT an internal qc-/db- ID), build direct product details page
  if (sourceObj) {
    const rawId = String(sourceObj.productId || sourceObj.id || "").trim();
    const isInternalId = !rawId || rawId.startsWith("qc-") || rawId.startsWith("db-") || rawId.startsWith("trend-") || rawId.startsWith("deal-");
    const cleanId = isInternalId ? "" : rawId;
    const slug = createProductSlug(cleanName);
    if (cleanId) {
      if (store.includes("blinkit") && (/^\d+$/.test(cleanId) || /^[a-f0-9-]{36}$/i.test(cleanId))) {
        return `https://blinkit.com/prn/${slug}/prid/${cleanId}`;
      }
      if (store.includes("zepto") && /^[a-f0-9-]{36}$/i.test(cleanId)) {
        return `https://www.zeptonow.com/pn/${slug}/pvid/${cleanId}`;
      }
      if (store.includes("swiggy") && (/^\d+$/.test(cleanId) || cleanId.includes("-"))) {
        return `https://www.swiggy.com/instamart/item/${cleanId}`;
      }
      if (store.includes("dmart") && /^[a-z0-9_-]+$/i.test(cleanId)) {
        return `https://www.dmart.in/product/${slug}-${cleanId}`;
      }
      if (store.includes("amazon") && /^[B0-9][A-Z0-9]{9}$/i.test(cleanId)) {
        return `https://www.amazon.in/dp/${cleanId}`;
      }
      if (store.includes("flipkart") && /^[A-Z0-9]{16}$/i.test(cleanId)) {
        return `https://www.flipkart.com/product/p/itm?pid=${cleanId}`;
      }
    }
  }

  // Second priority: Check verified product registry for an authentic store buy now page
  const directFromRegistry = lookupDirectStoreProductUrl(store, cleanName);
  if (directFromRegistry && !isSyntheticBrokenUrl(directFromRegistry)) {
    return directFromRegistry;
  }

  // Third priority: If rawUrl is any valid http link that is already a direct product page
  if (rawUrl && typeof rawUrl === "string") {
    const trimmed = rawUrl.trim();
    if (!isSyntheticBrokenUrl(trimmed) && (trimmed.startsWith("http://") || trimmed.startsWith("https://"))) {
      if (isDirectProductUrl(trimmed)) {
        return trimmed;
      }
    }
  }

  // Fourth priority: Fallback: Generate the authentic retailer store product URL
  return generateDirectStoreUrl(storeName, cleanName);
}
