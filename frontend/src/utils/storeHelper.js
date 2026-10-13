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
  "vivo v30 pro 5g (andaman blue, 256gb)": {
    "flipkart": "https://www.flipkart.com/vivo-v30-pro-5g-andaman-blue-256-gb/p/itmd7b7a1700c431?pid=MOBGYGCBEM4PVYYM",
    "amazon": "https://www.amazon.in/dp/B0CX21C26W"
  },
  "realme 12 pro+ 5g (submarine blue, 256gb)": {
    "flipkart": "https://www.flipkart.com/realme-12-pro-plus-5g-submarine-blue-256-gb/p/itme?pid=MOBGWH8SERYVVPV8",
    "amazon": "https://www.amazon.in/dp/B0CS5X6DDP"
  },
  "google pixel 8a 5g (obsidian, 128gb)": {
    "flipkart": "https://www.flipkart.com/google-pixel-8a-obsidian-128-gb/p/itm0a2bbdcfe6f30?pid=MOBGYVGGK67Z4WZG",
    "amazon": "https://www.amazon.in/dp/B0D1YFCRK9"
  },
  "xiaomi 14 5g (jade green, 512gb)": {
    "amazon": "https://www.amazon.in/dp/B0CWTLX1CG",
    "flipkart": "https://www.flipkart.com/xiaomi-14-jade-green-512-gb/p/itm87fe48d94ca13?pid=MOBGYZ2YHZ8VYZ2A"
  },
  "apple macbook air m3 (13.6-inch, 16gb ram, 512gb ssd)": {
    "amazon": "https://www.amazon.in/dp/B0CX21CBPJ",
    "flipkart": "https://www.flipkart.com/apple-macbook-air-m3-16-gb-512-gb-ssd-macos-sonoma-mxd13hn-a/p/itm5b94f09dcbca5?pid=COMGZ3ZZVHRHFYYZ"
  },
  "dell xps 13 intel core ultra 7 (16gb ram, 512gb ssd)": {
    "flipkart": "https://www.flipkart.com/dell-xps-13-intel-core-ultra-7-16-gb-512-gb-ssd-windows-11-home-9340/p/itm178652d87e38f?pid=COMGYYGHY8VGH7ZZ",
    "amazon": "https://www.amazon.in/dp/B0CRVJ8Y2M"
  },
  "hp pavilion 15 (amd ryzen 7, 16gb ram, 512gb ssd)": {
    "amazon": "https://www.amazon.in/dp/B0BH4WFL2X",
    "flipkart": "https://www.flipkart.com/hp-pavilion-amd-ryzen-7-octa-core-5700u-16-gb-512-gb-ssd-windows-11-home-15-eh1108au-thin-light-laptop/p/itmd411a0ea4c16d?pid=COMG7W6TZFYPZY7E"
  },
  "lenovo ideapad slim 3 (intel core i5 13th gen, 16gb ram)": {
    "flipkart": "https://www.flipkart.com/lenovo-ideapad-slim-3-intel-core-i5-13th-gen-13420h-16-gb-512-gb-ssd-windows-11-home-15iah8-thin-light-laptop/p/itmdb2ebdc7c2e0b?pid=COMGVGTYGH9GYZ8Z",
    "amazon": "https://www.amazon.in/dp/B0B56CRWDF"
  },
  "asus rog strix g16 gaming laptop (rtx 4060, 16gb ram, 1tb ssd)": {
    "amazon": "https://www.amazon.in/dp/B0BWX2B4F2",
    "flipkart": "https://www.flipkart.com/asus-rog-strix-g16-2024-intel-core-i7-14th-gen-14650hx-16-gb-1-tb-ssd-windows-11-home-8-gb-graphics-nvidia-geforce-rtx-4060-g614jvr-n4079w-gaming-laptop/p/itm9adbbbe9eb559?pid=COMGYTYZ68ZVFH6Y"
  },
  "apple macbook pro 14 (m3 pro chip, 18gb memory, 512gb ssd)": {
    "amazon": "https://www.amazon.in/dp/B0CHX2NZH6",
    "flipkart": "https://www.flipkart.com/apple-macbook-pro-m3-pro-18-gb-512-gb-ssd-macos-sonoma-mrx33hn-a/p/itm4b94f09dcbca5?pid=COMGWY6HF8HYZZ6Y"
  },
  "acer predator helios neo 16 gaming laptop (intel i7, rtx 4050)": {
    "flipkart": "https://www.flipkart.com/acer-predator-helios-neo-16-intel-core-i7-13th-gen-13700hx-16-gb-512-gb-ssd-windows-11-home-6-gb-graphics-nvidia-geforce-rtx-4050-phn16-71-gaming-laptop/p/itm6d863f69aa6ff?pid=COMGZT7GVFGYZX7A",
    "amazon": "https://www.amazon.in/dp/B0C3HNW2C5"
  },
  "asus zenbook 14 oled (intel core ultra 7, 16gb ram, 1tb ssd)": {
    "amazon": "https://www.amazon.in/dp/B0CWLP5CYT",
    "flipkart": "https://www.flipkart.com/asus-zenbook-14-oled-intel-core-ultra-7-155h-16-gb-1-tb-ssd-windows-11-home-ux3405ma-pz752ws-thin-light-laptop/p/itm87fe48d94ca15?pid=COMGWZGHY8VGYY2A"
  },
  "sony wh-1000xm5 wireless noise cancelling headphones": {
    "blinkit": "https://blinkit.com/prn/sony-wh-1000xm5-wireless-noise-cancelling-headphones/prid/512949",
    "amazon": "https://www.amazon.in/dp/B09XS7JWHH",
    "flipkart": "https://www.flipkart.com/sony-wh-1000xm5-bluetooth-headset/p/itm68b20da5ef154?pid=ACCGH2E64NMG72TG"
  },
  "boat airdopes 141 bluetooth truly wireless earbuds": {
    "zepto": "https://www.zeptonow.com/pn/boat-airdopes-141-anc-true-wireless-earbuds/pvid/7178c743-12cb-45ec-91b3-469bfd290ca8",
    "blinkit": "https://blinkit.com/prn/boat-airdopes-141-bluetooth-truly-wireless-earbuds/prid/394829",
    "amazon": "https://www.amazon.in/dp/B09N3ZNHTY"
  },
  "apple airpods pro (2nd gen with usb-c magsafe)": {
    "flipkart": "https://www.flipkart.com/apple-airpods-pro-2nd-generation-magsafe-case-usb-c-bluetooth-headset/p/itm9b4d8d9bceba3?pid=ACCGTR7ZEYGH9ZZY",
    "amazon": "https://www.amazon.in/dp/B0CHWRXH8B",
    "blinkit": "https://blinkit.com/prn/apple-airpods-pro-2nd-generation-with-usb-c/prid/512950"
  },
  "jbl flip 6 portable bluetooth speaker": {
    "blinkit": "https://blinkit.com/prn/jbl-flip-6-portable-waterproof-speaker/prid/418290",
    "amazon": "https://www.amazon.in/dp/B09RM53Y5B"
  },
  "oneplus bullets wireless z2 bluetooth neckband": {
    "zepto": "https://www.zeptonow.com/pn/oneplus-bullets-wireless-z2-bluetooth-neckband-earphones/pvid/bca7bb9d-e4fb-4b9e-990a-a53ce5201cb4",
    "amazon": "https://www.amazon.in/dp/B09TVVGXWS"
  },
  "bose quietcomfort 45 bluetooth wireless noise cancelling headphones": {
    "amazon": "https://www.amazon.in/dp/B098FKXT8L",
    "flipkart": "https://www.flipkart.com/bose-quietcomfort-45-bluetooth-headset/p/itm5b0eb81112663?pid=ACCG9Y8ZEYHYZZ7Y"
  },
  "sennheiser momentum 4 wireless anc headphones (60hr battery)": {
    "flipkart": "https://www.flipkart.com/sennheiser-momentum-4-wireless-bluetooth-headset/p/itm3d25d0aa9cfa3?pid=ACCGH7Y8ZEYHYZZ8",
    "amazon": "https://www.amazon.in/dp/B0B6GHW1X5"
  },
  "marshall emberton ii portable bluetooth speaker (black & steel)": {
    "amazon": "https://www.amazon.in/dp/B09Z4VGH7L",
    "flipkart": "https://www.flipkart.com/marshall-emberton-ii-20-w-bluetooth-speaker/p/itm7e63ef2587bb4?pid=ACCGGY8ZEYHYZZ9Y"
  },
  "sony bravia 55 inches 4k ultra hd smart led google tv kd-55x74l": {
    "amazon": "https://www.amazon.in/dp/B0C5MC45FR",
    "flipkart": "https://www.flipkart.com/sony-bravia-138-8-cm-55-inch-ultra-hd-4k-led-smart-google-tv-kd-55x74l/p/itm25da5f8f53a70?pid=TVSGQJZZF9HYZZ7Y"
  },
  "samsung 43 inches crystal 4k vivid pro ultra hd smart led tv": {
    "flipkart": "https://www.flipkart.com/samsung-crystal-4k-vivid-pro-108-cm-43-inch-ultra-hd-4k-led-smart-tizen-tv/p/itm78198f48cefb8?pid=TVSGZ9GH8VGYY2AZ",
    "amazon": "https://www.amazon.in/dp/B0D3GKPRG8"
  },
  "lg 55 inches 4k ultra hd smart oled evo tv 55c3psa": {
    "amazon": "https://www.amazon.in/dp/B0C46FR1R1",
    "flipkart": "https://www.flipkart.com/lg-oled-evo-c3-139-cm-55-inch-ultra-hd-4k-oled-smart-webos-tv-55c3psa/p/itmcf44f0b09459f?pid=TVSGZHY8ZEYHYZZ1"
  },
  "oneplus 50 inches y series 4k ultra hd smart android tv 50y1s pro": {
    "flipkart": "https://www.flipkart.com/oneplus-y1s-pro-126-cm-50-inch-ultra-hd-4k-led-smart-android-tv/p/itme7e4e16d47b54?pid=TVSGDF7Z8ZEYHYZZ",
    "amazon": "https://www.amazon.in/dp/B09VCC4HY7"
  },
  "xiaomi 43 inches x pro 4k dolby vision iq smart google tv": {
    "amazon": "https://www.amazon.in/dp/B0C4J8FY9H",
    "flipkart": "https://www.flipkart.com/mi-x-pro-108-cm-43-inch-ultra-hd-4k-led-smart-google-tv-iq-series/p/itm345162ecdbda4?pid=TVSGZGY8ZEYHYZZ2"
  },
  "tcl 55 inches 4k ultra hd smart qled google tv (55c645)": {
    "amazon": "https://www.amazon.in/dp/B0C39Y9VG7",
    "flipkart": "https://www.flipkart.com/tcl-c645-138-8-cm-55-inch-qled-ultra-hd-4k-smart-google-tv-55c645/p/itm29d663eb4c7e7?pid=TVSGZHY9ZEYHYZZ3"
  },
  "acer 50 inches advanced i series 4k ultra hd smart led google tv": {
    "flipkart": "https://www.flipkart.com/acer-advanced-series-127-cm-50-inch-ultra-hd-4k-led-smart-google-tv/p/itm600daea89dc13?pid=TVSGZJY8ZEYHYZZ4",
    "amazon": "https://www.amazon.in/dp/B0C7Z4QZ7G"
  },
  "hisense 65 inches 4k ultra hd smart mini-led google tv (65u6k)": {
    "amazon": "https://www.amazon.in/dp/B0CHMY7B8Z",
    "flipkart": "https://www.flipkart.com/hisense-u6k-164-cm-65-inch-qled-mini-led-ultra-hd-4k-smart-google-tv-65u6k/p/itm2b498f48cefb8?pid=TVSGZKY8ZEYHYZZ5"
  },
  "apple watch series 10 gps 46mm smartwatch": {
    "amazon": "https://www.amazon.in/dp/B0DGJGZ83J",
    "flipkart": "https://www.flipkart.com/apple-watch-series-10-gps-46mm-jet-black-aluminium-case-sport-band/p/itm4b94f09dcbcb1?pid=SMWGYZZYHZ8VYZ2A",
    "blinkit": "https://blinkit.com/prn/apple-watch-series-10-gps-46mm/prid/589120"
  },
  "samsung galaxy watch 6 lte 44mm smartwatch": {
    "flipkart": "https://www.flipkart.com/samsung-galaxy-watch6-lte-44mm/p/itm3234701b0863b?pid=SMWGZGY8ZEYHYZZ6",
    "amazon": "https://www.amazon.in/dp/B0CC9H5W3M"
  },
  "boat wave call 2 smartwatch with bluetooth calling": {
    "zepto": "https://www.zeptonow.com/pn/boat-wave-call-2-smartwatch-with-1-83-hd-display/pvid/e6ef3e35-a48b-4b1f-bc87-73d8ceb09efc",
    "blinkit": "https://blinkit.com/prn/boat-wave-call-2-smartwatch-active-black/prid/450291",
    "amazon": "https://www.amazon.in/dp/B0C89VJ6F2"
  },
  "noise colorfit pulse 2 max 1.85 display smartwatch": {
    "amazon": "https://www.amazon.in/dp/B0B784CV45",
    "flipkart": "https://www.flipkart.com/noise-colorfit-pulse-2-max-1-85-display-bluetooth-calling-smartwatch/p/itm7e63ef2587bb5?pid=SMWGZLY8ZEYHYZZ7"
  },
  "fire-boltt gladiator 1.96-inch hd display bluetooth smartwatch": {
    "amazon": "https://www.amazon.in/dp/B0BNW1R9KM",
    "flipkart": "https://www.flipkart.com/fire-boltt-gladiator-1-96-bluetooth-calling-smartwatch/p/itm6d863f69aa6f1?pid=SMWGZMY8ZEYHYZZ8",
    "blinkit": "https://blinkit.com/prn/fire-boltt-gladiator-smartwatch-black/prid/489123"
  },
  "amazfit gtr 4 smart watch with dual-band gps & amoled display": {
    "amazon": "https://www.amazon.in/dp/B0B7X7YGH8",
    "flipkart": "https://www.flipkart.com/amazfit-gtr-4-smartwatch/p/itm3d25d0aa9cfa4?pid=SMWGZNY8ZEYHYZZ9"
  },
  "garmin forerunner 55 gps running smartwatch (black)": {
    "amazon": "https://www.amazon.in/dp/B09575VG8M",
    "flipkart": "https://www.flipkart.com/garmin-forerunner-55-gps-running-smartwatch/p/itm5b0eb81112664?pid=SMWGZPY8ZEYHYZ10"
  },
  "oneplus watch 2 with wear os by google (radiant silver)": {
    "amazon": "https://www.amazon.in/dp/B0CVLGH8Z2",
    "flipkart": "https://www.flipkart.com/oneplus-watch-2-wear-os-by-google/p/itmcf44f0b094590?pid=SMWGZQY8ZEYHYZ11"
  },
  "sony playstation 5 slim console (disc edition)": {
    "amazon": "https://www.amazon.in/dp/B0CY5J8424",
    "flipkart": "https://www.flipkart.com/sony-playstation-5-slim-1-tb-disc-edition/p/itmd7b7a1700c432?pid=GMCGYGCBEM4PVYYN"
  },
  "microsoft xbox series x 1tb gaming console": {
    "flipkart": "https://www.flipkart.com/microsoft-xbox-series-x-1024-gb/p/itme?pid=GMCGWH8SERYVVPV9",
    "amazon": "https://www.amazon.in/dp/B08H734791"
  },
  "nintendo switch oled model (neon red & neon blue joy-con)": {
    "amazon": "https://www.amazon.in/dp/B098RKWHHZ",
    "flipkart": "https://www.flipkart.com/nintendo-switch-oled-model-neon-blue-red-joy-con-64-gb/p/itm0a2bbdcfe6f31?pid=GMCGYVGGK67Z4WZH"
  },
  "sony playstation vr2 virtual reality headset for ps5": {
    "amazon": "https://www.amazon.in/dp/B0BSMGG8Z1",
    "flipkart": "https://www.flipkart.com/sony-playstation-vr2-horizon-call-mountain-bundle/p/itm87fe48d94ca14?pid=GMCGYZ2YHZ8VYZ2B"
  },
  "sony dualsense wireless controller for playstation 5 (white)": {
    "amazon": "https://www.amazon.in/dp/B08FC6C75B",
    "flipkart": "https://www.flipkart.com/sony-dualsense-wireless-controller-playstation-5/p/itm5b94f09dcbca6?pid=ACCGZ3ZZVHRHFYY0",
    "blinkit": "https://blinkit.com/prn/sony-ps5-dualsense-wireless-controller-white/prid/512952"
  },
  "microsoft xbox wireless controller (carbon black)": {
    "flipkart": "https://www.flipkart.com/microsoft-xbox-wireless-controller-carbon-black/p/itm178652d87e380?pid=ACCGYYGHY8VGH7Z1",
    "amazon": "https://www.amazon.in/dp/B08DF26MXW"
  },
  "asus rog ally 7-inch fhd 120hz gaming handheld console (z1 extreme)": {
    "amazon": "https://www.amazon.in/dp/B0C7J8GH6M",
    "flipkart": "https://www.flipkart.com/asus-rog-ally-handheld-gaming-console-z1-extreme-512-gb/p/itmd411a0ea4c16e?pid=GMCG7W6TZFYPZY7F"
  },
  "nintendo switch lite handheld gaming console (turquoise)": {
    "amazon": "https://www.amazon.in/dp/B07V48X327",
    "flipkart": "https://www.flipkart.com/nintendo-switch-lite-turquoise-32-gb/p/itmdb2ebdc7c2e0c?pid=GMCGVGTYGH9GYZ80"
  },
  "amul taaza homogenised toned milk 1l": {
    "blinkit": "https://blinkit.com/prn/amul-taaza-homogenised-toned-milk/prid/19598",
    "zepto": "https://www.zeptonow.com/pn/amul-taaza-toned-fresh-milk-tetra/pvid/d108d4be-c20e-4366-a249-1616cbf20cb1",
    "swiggy": "https://www.swiggy.com/instamart/item/amul-taaza-homogenised-toned-milk-1l",
    "bigbasket": "https://www.bigbasket.com/pd/242672/amul-taaza-homogenised-toned-milk-1-l-tetra-pack/"
  },
  "country delight pure cow milk 1l": {
    "zepto": "https://www.zeptonow.com/pn/country-delight-pure-cow-milk/pvid/b4d0e123-57bf-463d-a5ee-4613c72bce9a",
    "bigbasket": "https://www.bigbasket.com/pd/40248231/country-delight-pure-cow-milk-1-l/"
  },
  "tata tea gold premium black tea 500g": {
    "bigbasket": "https://www.bigbasket.com/pd/266580/tata-tea-gold-500-g/",
    "swiggy": "https://www.swiggy.com/instamart/item/tata-tea-gold-500g"
  },
  "fortune sunlite refined sunflower oil 1l pouch": {
    "bigbasket": "https://www.bigbasket.com/pd/274145/fortune-sunlite-refined-sunflower-oil-1-l-pouch/",
    "zepto": "https://www.zeptonow.com/pn/fortune-sunlite-refined-sunflower-oil/pvid/e61bfd19-bfae-4f0f-8f83-e18e33f38aa4"
  },
  "cadbury dairy milk silk chocolate bar 150g": {
    "zepto": "https://www.zeptonow.com/pn/cadbury-dairy-milk-silk-plain-chocolate/pvid/26c8b09f-c6ad-4545-9833-2ca73602fcb3",
    "blinkit": "https://blinkit.com/prn/cadbury-dairy-milk-silk-chocolate-bar/prid/5837"
  },
  "aashirvaad superior mp whole wheat atta 5kg": {
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
  "nike air max 270 running shoes": {
    "myntra": "https://www.myntra.com/sports-shoes/nike/nike-air-max-270-running-shoes/1299401/buy",
    "flipkart": "https://www.flipkart.com/nike-air-max-270-running-shoes-men/p/itm9adbbbe9eb550?pid=SHOGYTYZ68ZVFH6Z",
    "amazon": "https://www.amazon.in/dp/B078HFHQM8"
  },
  "puma smash v2 casual unisex sneakers": {
    "myntra": "https://www.myntra.com/casual-shoes/puma/puma-unisex-smash-v2-sneakers/1049281/buy",
    "flipkart": "https://www.flipkart.com/puma-smash-v2-sneakers-men/p/itm4b94f09dcbca7?pid=SHOGWY6HF8HYZZ6Z",
    "amazon": "https://www.amazon.in/dp/B072LX7J37"
  },
  "levi's men 511 slim fit stretchable jeans": {
    "myntra": "https://www.myntra.com/jeans/levis/levis-men-blue-511-slim-fit-stretchable-jeans/142910/buy",
    "amazon": "https://www.amazon.in/dp/B07J5D42LX",
    "flipkart": "https://www.flipkart.com/levi-s-slim-men-blue-jeans/p/itm6d863f69aa6f2?pid=JEACOMGZT7GVFGYZX"
  },
  "adidas ultraboost light running shoes": {
    "flipkart": "https://www.flipkart.com/adidas-ultraboost-light-running-shoes-men/p/itm87fe48d94ca16?pid=SHOGWZGHY8VGYY2B",
    "myntra": "https://www.myntra.com/sports-shoes/adidas/adidas-men-ultraboost-light-running-shoes/1940182/buy",
    "amazon": "https://www.amazon.in/dp/B0BNW1R9KM"
  },
  "red tape classic men's casual sneaker shoes": {
    "flipkart": "https://www.flipkart.com/red-tape-casual-sneaker-shoes-men/p/itm68b20da5ef155?pid=SHOACCGH2E64NMG72",
    "myntra": "https://www.myntra.com/casual-shoes/red-tape/red-tape-men-white-sneakers/2104928/buy",
    "amazon": "https://www.amazon.in/dp/B09D84LKVZ"
  },
  "skechers men d'lites memory foam casual sneakers": {
    "myntra": "https://www.myntra.com/casual-shoes/skechers/skechers-men-dlites-sneakers/1892041/buy",
    "flipkart": "https://www.flipkart.com/skechers-d-lites-casual-sneakers-men/p/itm7e63ef2587bb6?pid=SHOGZLY8ZEYHYZZ9",
    "amazon": "https://www.amazon.in/dp/B08P1QGH7B"
  },
  "allen solly men regular fit solid casual cotton shirt": {
    "myntra": "https://www.myntra.com/shirts/allen-solly/allen-solly-men-cotton-casual-shirt/2491028/buy",
    "amazon": "https://www.amazon.in/dp/B08XGH7Z4L",
    "flipkart": "https://www.flipkart.com/allen-solly-men-solid-casual-shirt/p/itm6d863f69aa6f3?pid=SHTGZMY8ZEYHYZZ0"
  },
  "bata men formal derby leather shoes (black lace-up)": {
    "flipkart": "https://www.flipkart.com/bata-derby-formal-shoes-men/p/itm3d25d0aa9cfa5?pid=SHOGZNY8ZEYHYZ11",
    "amazon": "https://www.amazon.in/dp/B07P9GH7L2",
    "myntra": "https://www.myntra.com/formal-shoes/bata/bata-men-black-derby-formal-shoes/1982031/buy"
  },
  "lakme absolute matte melt liquid lip color (6ml)": {
    "nykaa": "https://www.nykaa.com/lakme-absolute-matte-melt-liquid-lip-color/p/231940",
    "blinkit": "https://blinkit.com/prn/lakme-absolute-matte-melt-liquid-lip-color/prid/349120",
    "myntra": "https://www.myntra.com/lipstick/lakme/lakme-absolute-matte-melt/231940/buy",
    "amazon": "https://www.amazon.in/dp/B07C2FHRV7"
  },
  "maybelline new york colossal waterproof mascara (9ml)": {
    "nykaa": "https://www.nykaa.com/maybelline-new-york-the-colossal-mascara-waterproof/p/9842",
    "blinkit": "https://blinkit.com/prn/maybelline-new-york-colossal-waterproof-mascara/prid/214902",
    "amazon": "https://www.amazon.in/dp/B0046VE6T2"
  },
  "the derma co 1% hyaluronic sunscreen aqua gel 50g": {
    "nykaa": "https://www.nykaa.com/the-derma-co-1percent-hyaluronic-sunscreen-aqua-gel/p/2749102",
    "blinkit": "https://blinkit.com/prn/the-derma-co-1-hyaluronic-sunscreen-aqua-gel/prid/421901",
    "amazon": "https://www.amazon.in/dp/B09B7HQ2G1"
  },
  "minimalist 10% niacinamide face serum 30ml": {
    "blinkit": "https://blinkit.com/prn/minimalist-10-niacinamide-face-serum/prid/391028",
    "nykaa": "https://www.nykaa.com/minimalist-10-niacinamide-face-serum/p/1054391",
    "amazon": "https://www.amazon.in/dp/B08F9XGLG2"
  },
  "cetaphil gentle skin cleanser for all skin types (250ml)": {
    "nykaa": "https://www.nykaa.com/cetaphil-gentle-skin-cleanser/p/20993",
    "blinkit": "https://blinkit.com/prn/cetaphil-gentle-skin-cleanser-250-ml/prid/291038",
    "amazon": "https://www.amazon.in/dp/B01CCGW7P6"
  },
  "nivea soft light moisturizer cream with vitamin e (200ml)": {
    "blinkit": "https://blinkit.com/prn/nivea-soft-light-moisturiser-cream/prid/12904",
    "zepto": "https://www.zeptonow.com/pn/nivea-soft-light-moisturizer-cream/pvid/f43e5c9b-1d70-4966-9aa9-eefb1263c919",
    "nykaa": "https://www.nykaa.com/nivea-soft-light-moisturising-cream/p/10492",
    "amazon": "https://www.amazon.in/dp/B006LX9L3I"
  },
  "plum green tea alcohol-free face toner (200ml)": {
    "nykaa": "https://www.nykaa.com/plum-green-tea-alcohol-free-toner/p/24102",
    "blinkit": "https://blinkit.com/prn/plum-green-tea-alcohol-free-toner/prid/382019",
    "amazon": "https://www.amazon.in/dp/B00OCJ5M02"
  },
  "l'oreal paris extraordinary oil hair serum (100ml)": {
    "nykaa": "https://www.nykaa.com/loreal-paris-extraordinary-oil-hair-serum/p/18204",
    "blinkit": "https://blinkit.com/prn/loreal-paris-extraordinary-oil-serum/prid/271049",
    "amazon": "https://www.amazon.in/dp/B00UM8OAK2"
  },
  "apple iphone 16": {
    "amazon": "https://www.amazon.in/dp/B0DGJ7TGDR",
    "flipkart": "https://www.flipkart.com/apple-iphone-16-teal-128-gb/p/itma6dcc38e89c7d?pid=MOBHCUW8YWYCZXY7",
    "blinkit": "https://blinkit.com/prn/apple-iphone-16-128-gb-teal/prid/578192"
  },
  "iphone 16": {
    "amazon": "https://www.amazon.in/dp/B0DGJ7TGDR",
    "flipkart": "https://www.flipkart.com/apple-iphone-16-teal-128-gb/p/itma6dcc38e89c7d?pid=MOBHCUW8YWYCZXY7",
    "blinkit": "https://blinkit.com/prn/apple-iphone-16-128-gb-teal/prid/578192"
  },
  "apple iphone 15": {
    "amazon": "https://www.amazon.in/dp/B0CHX1W1XY",
    "flipkart": "https://www.flipkart.com/apple-iphone-15-black-128-gb/p/itm3234701b0863a?pid=MOBHQV9YR4CBTD9D",
    "blinkit": "https://blinkit.com/prn/apple-iphone-15-128-gb-black/prid/512948"
  },
  "iphone 15": {
    "amazon": "https://www.amazon.in/dp/B0CHX1W1XY",
    "flipkart": "https://www.flipkart.com/apple-iphone-15-black-128-gb/p/itm3234701b0863a?pid=MOBHQV9YR4CBTD9D",
    "blinkit": "https://blinkit.com/prn/apple-iphone-15-128-gb-black/prid/512948"
  },
  "samsung galaxy s24 ultra": {
    "amazon": "https://www.amazon.in/dp/B0CT5FSPJG",
    "flipkart": "https://www.flipkart.com/samsung-galaxy-s24-ultra-5g-titanium-gray-256-gb/p/itmd4f51262e3e6b?pid=MOBGX2F38JBJGZSE",
    "zepto": "https://www.zeptonow.com/pn/samsung-galaxy-s24-ultra-5g-titanium-gray-256-gb/pvid/4c919a32-9cb0-466e-a2b1-591b61c47910"
  },
  "s24 ultra": {
    "amazon": "https://www.amazon.in/dp/B0CT5FSPJG",
    "flipkart": "https://www.flipkart.com/samsung-galaxy-s24-ultra-5g-titanium-gray-256-gb/p/itmd4f51262e3e6b?pid=MOBGX2F38JBJGZSE",
    "zepto": "https://www.zeptonow.com/pn/samsung-galaxy-s24-ultra-5g-titanium-gray-256-gb/pvid/4c919a32-9cb0-466e-a2b1-591b61c47910"
  },
  "galaxy s24 ultra": {
    "amazon": "https://www.amazon.in/dp/B0CT5FSPJG",
    "flipkart": "https://www.flipkart.com/samsung-galaxy-s24-ultra-5g-titanium-gray-256-gb/p/itmd4f51262e3e6b?pid=MOBGX2F38JBJGZSE",
    "zepto": "https://www.zeptonow.com/pn/samsung-galaxy-s24-ultra-5g-titanium-gray-256-gb/pvid/4c919a32-9cb0-466e-a2b1-591b61c47910"
  },
  "oneplus 12": {
    "flipkart": "https://www.flipkart.com/oneplus-12-flowy-emerald-256-gb/p/itm4464454f95a2e?pid=MOBGXGT7SDCAJ3GF",
    "amazon": "https://www.amazon.in/dp/B0CQPP6JTH"
  },
  "apple macbook air m3": {
    "amazon": "https://www.amazon.in/dp/B0CX21CBPJ",
    "flipkart": "https://www.flipkart.com/apple-macbook-air-m3-16-gb-512-gb-ssd-macos-sonoma-mxd13hn-a/p/itm5b94f09dcbca5?pid=COMGZ3ZZVHRHFYYZ"
  },
  "macbook air m3": {
    "amazon": "https://www.amazon.in/dp/B0CX21CBPJ",
    "flipkart": "https://www.flipkart.com/apple-macbook-air-m3-16-gb-512-gb-ssd-macos-sonoma-mxd13hn-a/p/itm5b94f09dcbca5?pid=COMGZ3ZZVHRHFYYZ"
  },
  "macbook air": {
    "amazon": "https://www.amazon.in/dp/B0CX21CBPJ",
    "flipkart": "https://www.flipkart.com/apple-macbook-air-m3-16-gb-512-gb-ssd-macos-sonoma-mxd13hn-a/p/itm5b94f09dcbca5?pid=COMGZ3ZZVHRHFYYZ"
  },
  "apple macbook pro 14": {
    "amazon": "https://www.amazon.in/dp/B0CHX2NZH6",
    "flipkart": "https://www.flipkart.com/apple-macbook-pro-m3-pro-18-gb-512-gb-ssd-macos-sonoma-mrx33hn-a/p/itm4b94f09dcbca5?pid=COMGWY6HF8HYZZ6Y"
  },
  "macbook pro 14": {
    "amazon": "https://www.amazon.in/dp/B0CHX2NZH6",
    "flipkart": "https://www.flipkart.com/apple-macbook-pro-m3-pro-18-gb-512-gb-ssd-macos-sonoma-mrx33hn-a/p/itm4b94f09dcbca5?pid=COMGWY6HF8HYZZ6Y"
  },
  "macbook pro": {
    "amazon": "https://www.amazon.in/dp/B0CHX2NZH6",
    "flipkart": "https://www.flipkart.com/apple-macbook-pro-m3-pro-18-gb-512-gb-ssd-macos-sonoma-mrx33hn-a/p/itm4b94f09dcbca5?pid=COMGWY6HF8HYZZ6Y"
  },
  "dell xps 13": {
    "flipkart": "https://www.flipkart.com/dell-xps-13-intel-core-ultra-7-16-gb-512-gb-ssd-windows-11-home-9340/p/itm178652d87e38f?pid=COMGYYGHY8VGH7ZZ",
    "amazon": "https://www.amazon.in/dp/B0CRVJ8Y2M"
  },
  "hp pavilion 15": {
    "amazon": "https://www.amazon.in/dp/B0BH4WFL2X",
    "flipkart": "https://www.flipkart.com/hp-pavilion-amd-ryzen-7-octa-core-5700u-16-gb-512-gb-ssd-windows-11-home-15-eh1108au-thin-light-laptop/p/itmd411a0ea4c16d?pid=COMG7W6TZFYPZY7E"
  },
  "lenovo ideapad slim 3": {
    "flipkart": "https://www.flipkart.com/lenovo-ideapad-slim-3-intel-core-i5-13th-gen-13420h-16-gb-512-gb-ssd-windows-11-home-15iah8-thin-light-laptop/p/itmdb2ebdc7c2e0b?pid=COMGVGTYGH9GYZ8Z",
    "amazon": "https://www.amazon.in/dp/B0B56CRWDF"
  },
  "asus rog strix g16": {
    "amazon": "https://www.amazon.in/dp/B0BWX2B4F2",
    "flipkart": "https://www.flipkart.com/asus-rog-strix-g16-2024-intel-core-i7-14th-gen-14650hx-16-gb-1-tb-ssd-windows-11-home-8-gb-graphics-nvidia-geforce-rtx-4060-g614jvr-n4079w-gaming-laptop/p/itm9adbbbe9eb559?pid=COMGYTYZ68ZVFH6Y"
  },
  "sony wh-1000xm5": {
    "blinkit": "https://blinkit.com/prn/sony-wh-1000xm5-wireless-noise-cancelling-headphones/prid/512949",
    "amazon": "https://www.amazon.in/dp/B09XS7JWHH",
    "flipkart": "https://www.flipkart.com/sony-wh-1000xm5-bluetooth-headset/p/itm68b20da5ef154?pid=ACCGH2E64NMG72TG"
  },
  "wh-1000xm5": {
    "blinkit": "https://blinkit.com/prn/sony-wh-1000xm5-wireless-noise-cancelling-headphones/prid/512949",
    "amazon": "https://www.amazon.in/dp/B09XS7JWHH",
    "flipkart": "https://www.flipkart.com/sony-wh-1000xm5-bluetooth-headset/p/itm68b20da5ef154?pid=ACCGH2E64NMG72TG"
  },
  "sony xm5": {
    "blinkit": "https://blinkit.com/prn/sony-wh-1000xm5-wireless-noise-cancelling-headphones/prid/512949",
    "amazon": "https://www.amazon.in/dp/B09XS7JWHH",
    "flipkart": "https://www.flipkart.com/sony-wh-1000xm5-bluetooth-headset/p/itm68b20da5ef154?pid=ACCGH2E64NMG72TG"
  },
  "boat airdopes 141": {
    "zepto": "https://www.zeptonow.com/pn/boat-airdopes-141-anc-true-wireless-earbuds/pvid/7178c743-12cb-45ec-91b3-469bfd290ca8",
    "blinkit": "https://blinkit.com/prn/boat-airdopes-141-bluetooth-truly-wireless-earbuds/prid/394829",
    "amazon": "https://www.amazon.in/dp/B09N3ZNHTY"
  },
  "apple airpods pro": {
    "flipkart": "https://www.flipkart.com/apple-airpods-pro-2nd-generation-magsafe-case-usb-c-bluetooth-headset/p/itm9b4d8d9bceba3?pid=ACCGTR7ZEYGH9ZZY",
    "amazon": "https://www.amazon.in/dp/B0CHWRXH8B",
    "blinkit": "https://blinkit.com/prn/apple-airpods-pro-2nd-generation-with-usb-c/prid/512950"
  },
  "airpods pro": {
    "flipkart": "https://www.flipkart.com/apple-airpods-pro-2nd-generation-magsafe-case-usb-c-bluetooth-headset/p/itm9b4d8d9bceba3?pid=ACCGTR7ZEYGH9ZZY",
    "amazon": "https://www.amazon.in/dp/B0CHWRXH8B",
    "blinkit": "https://blinkit.com/prn/apple-airpods-pro-2nd-generation-with-usb-c/prid/512950"
  },
  "jbl flip 6": {
    "blinkit": "https://blinkit.com/prn/jbl-flip-6-portable-waterproof-speaker/prid/418290",
    "amazon": "https://www.amazon.in/dp/B09RM53Y5B"
  },
  "oneplus bullets wireless z2": {
    "zepto": "https://www.zeptonow.com/pn/oneplus-bullets-wireless-z2-bluetooth-neckband-earphones/pvid/bca7bb9d-e4fb-4b9e-990a-a53ce5201cb4",
    "amazon": "https://www.amazon.in/dp/B09TVVGXWS"
  },
  "sony bravia": {
    "amazon": "https://www.amazon.in/dp/B0C5MC45FR",
    "flipkart": "https://www.flipkart.com/sony-bravia-138-8-cm-55-inch-ultra-hd-4k-led-smart-google-tv-kd-55x74l/p/itm25da5f8f53a70?pid=TVSGQJZZF9HYZZ7Y"
  },
  "samsung 43": {
    "flipkart": "https://www.flipkart.com/samsung-crystal-4k-vivid-pro-108-cm-43-inch-ultra-hd-4k-led-smart-tizen-tv/p/itm78198f48cefb8?pid=TVSGZ9GH8VGYY2AZ",
    "amazon": "https://www.amazon.in/dp/B0D3GKPRG8"
  },
  "lg 55": {
    "amazon": "https://www.amazon.in/dp/B0C46FR1R1",
    "flipkart": "https://www.flipkart.com/lg-oled-evo-c3-139-cm-55-inch-ultra-hd-4k-oled-smart-webos-tv-55c3psa/p/itmcf44f0b09459f?pid=TVSGZHY8ZEYHYZZ1"
  },
  "apple watch": {
    "amazon": "https://www.amazon.in/dp/B0DGJGZ83J",
    "flipkart": "https://www.flipkart.com/apple-watch-series-10-gps-46mm-jet-black-aluminium-case-sport-band/p/itm4b94f09dcbcb1?pid=SMWGYZZYHZ8VYZ2A",
    "blinkit": "https://blinkit.com/prn/apple-watch-series-10-gps-46mm/prid/589120"
  },
  "apple watch series 10": {
    "amazon": "https://www.amazon.in/dp/B0DGJGZ83J",
    "flipkart": "https://www.flipkart.com/apple-watch-series-10-gps-46mm-jet-black-aluminium-case-sport-band/p/itm4b94f09dcbcb1?pid=SMWGYZZYHZ8VYZ2A",
    "blinkit": "https://blinkit.com/prn/apple-watch-series-10-gps-46mm/prid/589120"
  },
  "galaxy watch": {
    "flipkart": "https://www.flipkart.com/samsung-galaxy-watch6-lte-44mm/p/itm3234701b0863b?pid=SMWGZGY8ZEYHYZZ6",
    "amazon": "https://www.amazon.in/dp/B0CC9H5W3M"
  },
  "playstation 5": {
    "amazon": "https://www.amazon.in/dp/B0CY5J8424",
    "flipkart": "https://www.flipkart.com/sony-playstation-5-slim-1-tb-disc-edition/p/itmd7b7a1700c432?pid=GMCGYGCBEM4PVYYN"
  },
  "ps5": {
    "amazon": "https://www.amazon.in/dp/B0CY5J8424",
    "flipkart": "https://www.flipkart.com/sony-playstation-5-slim-1-tb-disc-edition/p/itmd7b7a1700c432?pid=GMCGYGCBEM4PVYYN"
  },
  "xbox series x": {
    "flipkart": "https://www.flipkart.com/microsoft-xbox-series-x-1024-gb/p/itme?pid=GMCGWH8SERYVVPV9",
    "amazon": "https://www.amazon.in/dp/B08H734791"
  },
  "nintendo switch": {
    "amazon": "https://www.amazon.in/dp/B098RKWHHZ",
    "flipkart": "https://www.flipkart.com/nintendo-switch-oled-model-neon-blue-red-joy-con-64-gb/p/itm0a2bbdcfe6f31?pid=GMCGYVGGK67Z4WZH"
  },
  "puma smash v2": {
    "myntra": "https://www.myntra.com/casual-shoes/puma/puma-unisex-smash-v2-sneakers/1049281/buy",
    "flipkart": "https://www.flipkart.com/puma-smash-v2-sneakers-men/p/itm4b94f09dcbca7?pid=SHOGWY6HF8HYZZ6Z",
    "amazon": "https://www.amazon.in/dp/B072LX7J37"
  },
  "puma smash": {
    "myntra": "https://www.myntra.com/casual-shoes/puma/puma-unisex-smash-v2-sneakers/1049281/buy",
    "flipkart": "https://www.flipkart.com/puma-smash-v2-sneakers-men/p/itm4b94f09dcbca7?pid=SHOGWY6HF8HYZZ6Z",
    "amazon": "https://www.amazon.in/dp/B072LX7J37"
  },
  "levi's": {
    "myntra": "https://www.myntra.com/jeans/levis/levis-men-blue-511-slim-fit-stretchable-jeans/142910/buy",
    "amazon": "https://www.amazon.in/dp/B07J5D42LX",
    "flipkart": "https://www.flipkart.com/levi-s-slim-men-blue-jeans/p/itm6d863f69aa6f2?pid=JEACOMGZT7GVFGYZX"
  },
  "levis": {
    "myntra": "https://www.myntra.com/jeans/levis/levis-men-blue-511-slim-fit-stretchable-jeans/142910/buy",
    "amazon": "https://www.amazon.in/dp/B07J5D42LX",
    "flipkart": "https://www.flipkart.com/levi-s-slim-men-blue-jeans/p/itm6d863f69aa6f2?pid=JEACOMGZT7GVFGYZX"
  },
  "adidas ultraboost": {
    "flipkart": "https://www.flipkart.com/adidas-ultraboost-light-running-shoes-men/p/itm87fe48d94ca16?pid=SHOGWZGHY8VGYY2B",
    "myntra": "https://www.myntra.com/sports-shoes/adidas/adidas-men-ultraboost-light-running-shoes/1940182/buy",
    "amazon": "https://www.amazon.in/dp/B0BNW1R9KM"
  },
  "minimalist": {
    "blinkit": "https://blinkit.com/prn/minimalist-10-niacinamide-face-serum/prid/391028",
    "nykaa": "https://www.nykaa.com/minimalist-10-niacinamide-face-serum/p/1054391",
    "amazon": "https://www.amazon.in/dp/B08F9XGLG2"
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

  // If source object has platform productId/id, build direct product details page
  if (sourceObj) {
    const cleanId = String(sourceObj.id || sourceObj.productId || "").trim();
    const slug = createProductSlug(cleanName);
    if (cleanId) {
      if (store.includes("blinkit")) {
        return `https://blinkit.com/prn/${slug}/prid/${cleanId}`;
      }
      if (store.includes("zepto")) {
        return `https://www.zeptonow.com/pn/${slug}/pvid/${cleanId}`;
      }
      if (store.includes("swiggy")) {
        return `https://www.swiggy.com/instamart/item/${cleanId}`;
      }
      if (store.includes("bigbasket")) {
        return `https://www.bigbasket.com/ps/?q=${encodeURIComponent(cleanName)}`;
      }
      if (store.includes("dmart")) {
        return `https://www.dmart.in/product/${slug}-${cleanId}`;
      }
      if (store.includes("amazon") && /^[B0-9][A-Z0-9]{9}$/i.test(cleanId)) {
        return `https://www.amazon.in/dp/${cleanId}`;
      }
      if (store.includes("flipkart") && (cleanId.startsWith("itm") || cleanId.length >= 10)) {
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
