// Mock Dataset for Product Search Automation Admin Panel

export const initialAdminStats = {
  totalUsers: { value: "12,480", numeric: 12480, change: "+14.2% from last month", isPositive: true },
  activeUsers: { value: "9,840", numeric: 9840, change: "78.8% engagement rate", isPositive: true },
  totalProducts: { value: "145,920", numeric: 145920, change: "+2,430 indexed today", isPositive: true },
  totalSearches: { value: "89,450", numeric: 89450, change: "+18.6% search volume", isPositive: true },
  successfulSearches: { value: "86,120", numeric: 86120, change: "96.3% success rate", isPositive: true },
  activeScrapers: { value: "6", numeric: 6, change: "100% Uptime", isPositive: true },
  failedSearches: { value: "3,330", numeric: 3330, change: "3.7% failure rate", isPositive: false }
};

export const initialSearchesPerDay = [
  { date: "Aug 07", searches: 4820, successful: 4650, failed: 170 },
  { date: "Aug 08", searches: 5190, successful: 4980, failed: 210 },
  { date: "Aug 09", searches: 5640, successful: 5460, failed: 180 },
  { date: "Aug 10", searches: 6100, successful: 5880, failed: 220 },
  { date: "Aug 11", searches: 5890, successful: 5690, failed: 200 },
  { date: "Aug 12", searches: 6420, successful: 6210, failed: 210 },
  { date: "Aug 13", searches: 6890, successful: 6640, failed: 250 },
  { date: "Aug 14", searches: 7150, successful: 6890, failed: 260 },
  { date: "Aug 15", searches: 7920, successful: 7630, failed: 290 },
  { date: "Aug 16", searches: 7450, successful: 7190, failed: 260 },
  { date: "Aug 17", searches: 8120, successful: 7850, failed: 270 },
  { date: "Aug 18", searches: 8650, successful: 8340, failed: 310 },
  { date: "Aug 19", searches: 9240, successful: 8910, failed: 330 },
  { date: "Aug 20", searches: 9970, successful: 9600, failed: 370 },
];

export const initialSearchStatusBreakdown = {
  successful: 86120,
  failed: 3330,
  total: 89450,
  successPercentage: 96.3,
  failedPercentage: 3.7
};

export const initialSystemHealth = {
  backendApi: {
    name: "Backend API",
    status: "Online",
    badgeType: "success",
    latency: "24ms",
    uptime: "99.98%",
    details: "Cluster: us-east-1 (3 instances load balanced)"
  },
  database: {
    name: "Database",
    status: "Connected",
    badgeType: "success",
    latency: "4ms",
    uptime: "99.99%",
    details: "PostgreSQL 16 (Primary) + Redis Cache Pool"
  },
  automationService: {
    name: "Automation Service",
    status: "Running",
    badgeType: "success",
    latency: "12 active workers",
    uptime: "100%",
    details: "Scraper concurrency: 40 tasks/sec"
  },
  sourceWebsites: {
    name: "Source Websites",
    status: "Healthy",
    badgeType: "success",
    latency: "6/6 Operational",
    uptime: "98.7% avg sync",
    details: "Amazon, Flipkart, Croma, Reliance, Myntra, AJIO"
  }
};

export const initialUsers = [
  {
    id: "USR-10482",
    name: "Mohan Teja",
    email: "mohan.teja@gmail.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    registrationDate: "2026-01-15",
    status: "Active",
    totalSearches: 142,
    successfulSearches: 138,
    failedSearches: 4,
    lastActive: "2026-08-20 14:15",
    phone: "+91 98492 10834",
    location: "Bengaluru, Karnataka, India",
    searches: [
      { id: "SCH-8821", query: "Apple iPhone 16 Pro 256GB", date: "2026-08-20 14:15", status: "Successful", resultsCount: 24 },
      { id: "SCH-8790", query: "Sony WH-1000XM5 Wireless", date: "2026-08-19 18:22", status: "Successful", resultsCount: 18 },
      { id: "SCH-8742", query: "MacBook Air M3 15-inch", date: "2026-08-18 11:05", status: "Successful", resultsCount: 16 },
      { id: "SCH-8699", query: "LG OLED 55-inch C4 Series", date: "2026-08-16 20:40", status: "Failed", resultsCount: 0 },
      { id: "SCH-8610", query: "Samsung Galaxy Watch 7 Ultra", date: "2026-08-14 09:30", status: "Successful", resultsCount: 20 }
    ]
  },
  {
    id: "USR-10483",
    name: "Aarav Sharma",
    email: "aarav.sharma@outlook.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    registrationDate: "2026-01-22",
    status: "Active",
    totalSearches: 98,
    successfulSearches: 94,
    failedSearches: 4,
    lastActive: "2026-08-20 13:40",
    phone: "+91 98201 55432",
    location: "Mumbai, Maharashtra, India",
    searches: [
      { id: "SCH-8819", query: "Dell XPS 14 Core Ultra 7", date: "2026-08-20 13:40", status: "Successful", resultsCount: 14 },
      { id: "SCH-8785", query: "Bose QuietComfort Ultra", date: "2026-08-19 15:10", status: "Successful", resultsCount: 12 }
    ]
  },
  {
    id: "USR-10484",
    name: "Priya Patel",
    email: "priya.patel@yahoo.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    registrationDate: "2026-02-04",
    status: "Active",
    totalSearches: 184,
    successfulSearches: 180,
    failedSearches: 4,
    lastActive: "2026-08-20 12:18",
    phone: "+91 97123 44091",
    location: "Ahmedabad, Gujarat, India",
    searches: [
      { id: "SCH-8812", query: "Dyson V15 Detect Vacuum", date: "2026-08-20 12:18", status: "Successful", resultsCount: 19 },
      { id: "SCH-8760", query: "Instant Pot Duo 7-in-1", date: "2026-08-18 19:45", status: "Successful", resultsCount: 22 }
    ]
  },
  {
    id: "USR-10485",
    name: "Rohan Verma",
    email: "rohan.verma@techcorp.in",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    registrationDate: "2026-02-18",
    status: "Inactive",
    totalSearches: 42,
    successfulSearches: 39,
    failedSearches: 3,
    lastActive: "2026-08-10 09:12",
    phone: "+91 98110 33498",
    location: "New Delhi, Delhi, India",
    searches: [
      { id: "SCH-8420", query: "Logitech MX Master 3S Mouse", date: "2026-08-10 09:12", status: "Successful", resultsCount: 15 }
    ]
  },
  {
    id: "USR-10486",
    name: "Sneha Reddy",
    email: "sneha.reddy@gmail.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
    registrationDate: "2026-03-01",
    status: "Active",
    totalSearches: 215,
    successfulSearches: 209,
    failedSearches: 6,
    lastActive: "2026-08-20 14:02",
    phone: "+91 99480 77123",
    location: "Hyderabad, Telangana, India",
    searches: [
      { id: "SCH-8820", query: "Canon EOS R6 Mark II Mirrorless", date: "2026-08-20 14:02", status: "Successful", resultsCount: 16 },
      { id: "SCH-8801", query: "Godox V1 Flash Trigger", date: "2026-08-19 22:11", status: "Successful", resultsCount: 8 }
    ]
  },
  {
    id: "USR-10487",
    name: "Vikram Malhotra",
    email: "vikram.malhotra@rediffmail.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80",
    registrationDate: "2026-03-14",
    status: "Active",
    totalSearches: 67,
    successfulSearches: 62,
    failedSearches: 5,
    lastActive: "2026-08-19 16:50",
    phone: "+91 98722 88190",
    location: "Chandigarh, India",
    searches: [
      { id: "SCH-8777", query: "Kindle Paperwhite 16GB", date: "2026-08-19 16:50", status: "Successful", resultsCount: 10 }
    ]
  },
  {
    id: "USR-10488",
    name: "Ananya Iyer",
    email: "ananya.iyer@gmail.com",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
    registrationDate: "2026-04-02",
    status: "Active",
    totalSearches: 130,
    successfulSearches: 126,
    failedSearches: 4,
    lastActive: "2026-08-20 11:30",
    phone: "+91 94440 12890",
    location: "Chennai, Tamil Nadu, India",
    searches: [
      { id: "SCH-8809", query: "Apple iPad Air M2 11-inch", date: "2026-08-20 11:30", status: "Successful", resultsCount: 20 }
    ]
  },
  {
    id: "USR-10489",
    name: "Karthik Nair",
    email: "karthik.nair@icloud.com",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80",
    registrationDate: "2026-04-18",
    status: "Inactive",
    totalSearches: 31,
    successfulSearches: 28,
    failedSearches: 3,
    lastActive: "2026-08-05 14:20",
    phone: "+91 98470 99231",
    location: "Kochi, Kerala, India",
    searches: [
      { id: "SCH-8210", query: "GoPro Hero 12 Black", date: "2026-08-05 14:20", status: "Successful", resultsCount: 14 }
    ]
  }
];

export const initialProducts = [
  {
    id: "PRD-9021",
    name: "Apple iPhone 16 Pro (256GB, Desert Titanium)",
    category: "Smartphones",
    price: 119999,
    originalPrice: 129900,
    discount: "8% OFF",
    rating: 4.8,
    reviews: 3420,
    sourceWebsite: "Amazon",
    availability: "In Stock",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&auto=format&fit=crop&q=80",
    productUrl: "https://www.amazon.in/dp/B0DGHN6P45",
    lastUpdated: "2026-08-20 14:15",
    description: "Experience the next leap in titanium design with the A18 Pro Bionic processor, 48MP Fusion camera system with 5x telephoto optical zoom, Camera Control button, and advanced 4K 120 fps Dolby Vision recording.",
    specifications: {
      "Brand": "Apple",
      "Model": "iPhone 16 Pro",
      "Display": "6.3-inch Super Retina XDR OLED (120Hz ProMotion)",
      "Processor": "Apple A18 Pro Hexa-Core (3nm)",
      "Storage": "256 GB NVMe",
      "RAM": "8 GB Unified Memory",
      "Rear Camera": "48MP Fusion + 48MP Ultra Wide + 12MP 5x Telephoto",
      "Front Camera": "12MP TrueDepth with Autofocus",
      "Battery": "3,582 mAh with 30W Fast Charging & MagSafe",
      "OS": "iOS 18",
      "Warranty": "1 Year Official Apple Warranty"
    }
  },
  {
    id: "PRD-9022",
    name: "Samsung Galaxy S24 Ultra (512GB, Titanium Gray)",
    category: "Smartphones",
    price: 129999,
    originalPrice: 139999,
    discount: "7% OFF",
    rating: 4.7,
    reviews: 2890,
    sourceWebsite: "Flipkart",
    availability: "In Stock",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&auto=format&fit=crop&q=80",
    productUrl: "https://www.flipkart.com/samsung-galaxy-s24-ultra/p/itm9384",
    lastUpdated: "2026-08-20 14:10",
    description: "Unleash Galaxy AI capabilities with built-in S-Pen, 200MP Quad Telephoto optical camera, Snapdragon 8 Gen 3 for Galaxy, and flat 6.8-inch Dynamic AMOLED 2X 2600 nits display.",
    specifications: {
      "Brand": "Samsung",
      "Model": "Galaxy S24 Ultra",
      "Display": "6.8-inch Dynamic AMOLED 2X QHD+ (1-120Hz)",
      "Processor": "Snapdragon 8 Gen 3 for Galaxy (4nm)",
      "Storage": "512 GB UFS 4.0",
      "RAM": "12 GB LPDDR5X",
      "Rear Camera": "200MP + 50MP 5x + 10MP 3x + 12MP UW",
      "Front Camera": "12MP Dual Pixel",
      "Battery": "5,000 mAh with 45W Fast Charging",
      "OS": "One UI 6.1 (Android 14)",
      "Warranty": "1 Year Brand Warranty"
    }
  },
  {
    id: "PRD-9023",
    name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    category: "Audio",
    price: 26990,
    originalPrice: 34990,
    discount: "23% OFF",
    rating: 4.8,
    reviews: 7600,
    sourceWebsite: "Amazon",
    availability: "In Stock",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80",
    productUrl: "https://www.amazon.in/dp/B09XS7JWHH",
    lastUpdated: "2026-08-20 13:55",
    description: "Industry leading noise cancellation with two processors and 8 microphones. Hi-Res Audio wireless with LDAC, crystal clear hands-free calling with 4 beamforming mics, and 30-hour battery life.",
    specifications: {
      "Brand": "Sony",
      "Type": "Over-Ear Wireless",
      "Noise Cancellation": "Auto NC Optimizer with V1 & QN1 processors",
      "Battery Life": "30 hours (ANC On), 40 hours (ANC Off)",
      "Charging": "USB-C Quick Charge (3 min for 3 hrs)",
      "Bluetooth": "Bluetooth 5.2 with Multipoint Connection",
      "Weight": "250 grams",
      "Warranty": "1 Year Standard Warranty"
    }
  },
  {
    id: "PRD-9024",
    name: "Apple MacBook Air 15-inch M3 (16GB RAM, 512GB SSD)",
    category: "Laptops",
    price: 144900,
    originalPrice: 154900,
    discount: "6% OFF",
    rating: 4.9,
    reviews: 1420,
    sourceWebsite: "Croma",
    availability: "In Stock",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&auto=format&fit=crop&q=80",
    productUrl: "https://www.croma.com/apple-macbook-air-15-m3/p/305829",
    lastUpdated: "2026-08-20 13:30",
    description: "Supercharged by the M3 chip with an 8-core CPU and 10-core GPU. Liquid Retina display, MagSafe 3 charging, 1080p FaceTime HD camera, six-speaker sound system with Spatial Audio, and up to 18 hours of battery.",
    specifications: {
      "Brand": "Apple",
      "Model": "MacBook Air 15-inch (M3)",
      "Display": "15.3-inch Liquid Retina Display (2880 x 1864, 500 nits)",
      "Processor": "Apple M3 chip (8-core CPU, 10-core GPU)",
      "RAM": "16 GB Unified Memory",
      "Storage": "512 GB SSD",
      "Battery Life": "Up to 18 hours Apple TV app movie playback",
      "Weight": "1.51 kg",
      "OS": "macOS Sonoma",
      "Warranty": "1 Year Limited Warranty"
    }
  },
  {
    id: "PRD-9025",
    name: "Dell XPS 14 OLED Laptop (Intel Core Ultra 7, 32GB, 1TB)",
    category: "Laptops",
    price: 189990,
    originalPrice: 209990,
    discount: "10% OFF",
    rating: 4.6,
    reviews: 640,
    sourceWebsite: "Reliance Digital",
    availability: "In Stock",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&auto=format&fit=crop&q=80",
    productUrl: "https://www.reliancedigital.in/dell-xps-14-laptop/p/494351",
    lastUpdated: "2026-08-20 12:45",
    description: "Futuristic CNC machined aluminum chassis with zero-lattice keyboard, seamless glass haptic touchpad, 3.2K InfinityEdge OLED Touchscreen, Intel Core Ultra 7 155H with AI NPU, and RTX 4050 graphics.",
    specifications: {
      "Brand": "Dell",
      "Series": "XPS 14 (9440)",
      "Display": "14.5-inch 3.2K (3200 x 2000) 120Hz OLED Touch",
      "Processor": "Intel Core Ultra 7 155H (16 Cores, up to 4.8 GHz)",
      "Graphics": "NVIDIA GeForce RTX 4050 6GB GDDR6",
      "RAM": "32 GB LPDDR5x 7467MHz",
      "Storage": "1 TB PCIe 4.0 NVMe SSD",
      "Battery": "69.5 Whr with 100W USB-C Charger",
      "Weight": "1.68 kg",
      "OS": "Windows 11 Home"
    }
  },
  {
    id: "PRD-9026",
    name: "Apple Watch Series 10 GPS 46mm (Jet Black Aluminum)",
    category: "Smartwatches",
    price: 49900,
    originalPrice: 49900,
    discount: "0% OFF",
    rating: 4.7,
    reviews: 1980,
    sourceWebsite: "Amazon",
    availability: "In Stock",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80",
    productUrl: "https://www.amazon.in/dp/B0DGJ9B82K",
    lastUpdated: "2026-08-20 12:10",
    description: "Thinnest Apple Watch ever with our largest display. Wide-angle OLED display, sleep apnea notifications, faster charging (80% in ~30 min), depth gauge and water temperature sensor.",
    specifications: {
      "Brand": "Apple",
      "Model": "Watch Series 10 GPS",
      "Case Size": "46mm Jet Black Aluminum",
      "Display": "Always-On Retina LTPO3 OLED (up to 2000 nits)",
      "Chip": "S10 SiP with 64-bit dual-core processor",
      "Sensors": "ECG, Blood Oxygen, Temp, Depth gauge to 6m",
      "Battery Life": "Up to 18 hours (36 hours in Low Power)",
      "Water Resistance": "50m swimproof"
    }
  },
  {
    id: "PRD-9027",
    name: "Canon EOS R6 Mark II Mirrorless Camera Body",
    category: "Cameras",
    price: 214999,
    originalPrice: 243995,
    discount: "12% OFF",
    rating: 4.9,
    reviews: 480,
    sourceWebsite: "Flipkart",
    availability: "In Stock",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&auto=format&fit=crop&q=80",
    productUrl: "https://www.flipkart.com/canon-eos-r6-mark-ii/p/itm58291",
    lastUpdated: "2026-08-20 11:20",
    description: "24.2 Megapixel Full-Frame CMOS sensor with DIGIC X processor. Up to 40 fps electronic shutter burst, Dual Pixel CMOS AF II with AI deep-learning subject detection, and uncropped 4K 60p oversampled video.",
    specifications: {
      "Brand": "Canon",
      "Sensor": "24.2 MP Full-Frame CMOS Sensor",
      "Image Stabilization": "5-axis In-Body IS (up to 8 stops with RF lens)",
      "ISO Range": "100-102400 (Expandable to 204800)",
      "Video Recording": "4K 60p 10-bit 4:2:2 (6K oversampled), Canon Log 3",
      "Viewfinder": "0.5-inch 3.69M-dot OLED EVF 120fps",
      "Card Slots": "Dual SD/SDHC/SDXC (UHS-II)",
      "Mount": "Canon RF Mount"
    }
  },
  {
    id: "PRD-9028",
    name: "Dyson V15 Detect Extra Cordless Vacuum Cleaner",
    category: "Appliances",
    price: 59900,
    originalPrice: 69900,
    discount: "14% OFF",
    rating: 4.8,
    reviews: 2150,
    sourceWebsite: "Myntra",
    availability: "In Stock",
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&auto=format&fit=crop&q=80",
    productUrl: "https://www.myntra.com/vacuum-cleaners/dyson/dyson-v15-detect/294819",
    lastUpdated: "2026-08-20 10:45",
    description: "Most powerful, intelligent cordless vacuum. Laser reveals invisible microscopic dust on hard floors. Acoustic piezo sensor counts and measures particles in real-time on the LCD screen.",
    specifications: {
      "Brand": "Dyson",
      "Suction Power": "240 Air Watts",
      "Bin Volume": "0.77 Liters",
      "Run Time": "Up to 60 minutes on Eco mode",
      "Filtration": "Whole-machine HEPA filtration (99.99% to 0.1 microns)",
      "Weight": "3.1 kg",
      "Warranty": "2 Year Manufacturer Warranty"
    }
  }
];

export const initialSearches = [
  {
    id: "SCH-8821",
    userId: "USR-10482",
    userName: "Mohan Teja",
    userEmail: "mohan.teja@gmail.com",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    query: "Sony WH-1000XM5 Wireless Headphones",
    dateTime: "2026-08-20 14:32:10",
    startedTime: "2026-08-20 14:32:08",
    completedTime: "2026-08-20 14:32:10",
    duration: "1.8s",
    status: "Successful",
    resultsCount: 18,
    comparisonSummary: {
      cheapest: {
        name: "Sony WH-1000XM5 Black ANC",
        price: 26990,
        originalPrice: 34990,
        discount: "23% OFF",
        website: "Amazon",
        url: "https://www.amazon.in/dp/B09XS7JWHH",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80",
        rating: 4.8,
        reviews: 7600
      },
      highestRated: {
        name: "Sony WH-1000XM5 Silver Studio Edition",
        price: 28490,
        originalPrice: 34990,
        discount: "19% OFF",
        website: "Croma",
        url: "https://www.croma.com/p/30291",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80",
        rating: 4.9,
        reviews: 8920
      },
      bestOverall: {
        name: "Sony WH-1000XM5 Wireless Noise Cancelling",
        price: 26990,
        originalPrice: 34990,
        discount: "23% OFF",
        website: "Amazon",
        url: "https://www.amazon.in/dp/B09XS7JWHH",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80",
        rating: 4.8,
        reviews: 7600,
        highlight: "Lowest Price + Fastest Delivery"
      }
    },
    results: [
      {
        id: "RES-1",
        name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones (Black)",
        price: 26990,
        originalPrice: 34990,
        discount: "23% OFF",
        rating: 4.8,
        reviews: 7600,
        website: "Amazon",
        productUrl: "https://www.amazon.in/dp/B09XS7JWHH",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80"
      },
      {
        id: "RES-2",
        name: "Sony WH-1000XM5 Over Ear Bluetooth Headphone (Silver)",
        price: 27990,
        originalPrice: 34990,
        discount: "20% OFF",
        rating: 4.7,
        reviews: 4320,
        website: "Flipkart",
        productUrl: "https://www.flipkart.com/sony-wh-1000xm5/p/itm58291",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80"
      },
      {
        id: "RES-3",
        name: "Sony WH-1000XM5 Active Noise Cancellation Headset",
        price: 28490,
        originalPrice: 34990,
        discount: "19% OFF",
        rating: 4.9,
        reviews: 8920,
        website: "Croma",
        productUrl: "https://www.croma.com/sony-headphones/p/49821",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80"
      },
      {
        id: "RES-4",
        name: "Sony WH-1000XM5 Wireless Headphone (Midnight Blue)",
        price: 28990,
        originalPrice: 34990,
        discount: "17% OFF",
        rating: 4.8,
        reviews: 1840,
        website: "Reliance Digital",
        productUrl: "https://www.reliancedigital.in/sony-xm5/p/92841",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80"
      }
    ]
  },
  {
    id: "SCH-8820",
    userId: "USR-10486",
    userName: "Sneha Reddy",
    userEmail: "sneha.reddy@gmail.com",
    userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
    query: "Canon EOS R6 Mark II Mirrorless",
    dateTime: "2026-08-20 14:02:18",
    startedTime: "2026-08-20 14:02:15",
    completedTime: "2026-08-20 14:02:18",
    duration: "2.4s",
    status: "Successful",
    resultsCount: 16,
    comparisonSummary: {
      cheapest: {
        name: "Canon EOS R6 Mark II Body Only",
        price: 214999,
        originalPrice: 243995,
        discount: "12% OFF",
        website: "Flipkart",
        url: "https://www.flipkart.com",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&auto=format&fit=crop&q=80",
        rating: 4.9,
        reviews: 480
      },
      highestRated: {
        name: "Canon EOS R6 Mark II + RF 24-105mm F4 L IS USM Lens",
        price: 289999,
        originalPrice: 319999,
        discount: "9% OFF",
        website: "Amazon",
        url: "https://www.amazon.in",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&auto=format&fit=crop&q=80",
        rating: 5.0,
        reviews: 310
      },
      bestOverall: {
        name: "Canon EOS R6 Mark II Body (Direct Brand Pack)",
        price: 214999,
        originalPrice: 243995,
        discount: "12% OFF",
        website: "Flipkart",
        url: "https://www.flipkart.com",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&auto=format&fit=crop&q=80",
        rating: 4.9,
        reviews: 480,
        highlight: "Lowest Price with Bank Discount"
      }
    },
    results: [
      {
        id: "RES-201",
        name: "Canon EOS R6 Mark II Mirrorless Camera Body",
        price: 214999,
        originalPrice: 243995,
        discount: "12% OFF",
        rating: 4.9,
        reviews: 480,
        website: "Flipkart",
        productUrl: "https://www.flipkart.com",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&auto=format&fit=crop&q=80"
      },
      {
        id: "RES-202",
        name: "Canon EOS R6 Mark II Full Frame Camera (Body)",
        price: 219990,
        originalPrice: 243995,
        discount: "10% OFF",
        rating: 4.8,
        reviews: 620,
        website: "Amazon",
        productUrl: "https://www.amazon.in",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&auto=format&fit=crop&q=80"
      }
    ]
  },
  {
    id: "SCH-8819",
    userId: "USR-10483",
    userName: "Aarav Sharma",
    userEmail: "aarav.sharma@outlook.com",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    query: "Dell XPS 14 Core Ultra 7",
    dateTime: "2026-08-20 13:40:45",
    startedTime: "2026-08-20 13:40:43",
    completedTime: "2026-08-20 13:40:45",
    duration: "2.1s",
    status: "Successful",
    resultsCount: 14,
    comparisonSummary: {
      cheapest: {
        name: "Dell XPS 14 (Core Ultra 7 / 16GB / 512GB)",
        price: 169990,
        originalPrice: 189990,
        discount: "11% OFF",
        website: "Amazon",
        url: "https://www.amazon.in",
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300&auto=format&fit=crop&q=80",
        rating: 4.5,
        reviews: 320
      },
      highestRated: {
        name: "Dell XPS 14 OLED (Core Ultra 7 / 32GB / 1TB)",
        price: 189990,
        originalPrice: 209990,
        discount: "10% OFF",
        website: "Reliance Digital",
        url: "https://www.reliancedigital.in",
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300&auto=format&fit=crop&q=80",
        rating: 4.7,
        reviews: 640
      },
      bestOverall: {
        name: "Dell XPS 14 OLED Touch 3.2K Display",
        price: 189990,
        originalPrice: 209990,
        discount: "10% OFF",
        website: "Reliance Digital",
        url: "https://www.reliancedigital.in",
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300&auto=format&fit=crop&q=80",
        rating: 4.7,
        reviews: 640,
        highlight: "Best OLED Screen & Peak Specs"
      }
    },
    results: [
      {
        id: "RES-301",
        name: "Dell XPS 14 OLED Laptop (Intel Core Ultra 7, 32GB, 1TB)",
        price: 189990,
        originalPrice: 209990,
        discount: "10% OFF",
        rating: 4.6,
        reviews: 640,
        website: "Reliance Digital",
        productUrl: "https://www.reliancedigital.in",
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300&auto=format&fit=crop&q=80"
      }
    ]
  },
  {
    id: "SCH-8818",
    userId: "USR-10484",
    userName: "Priya Patel",
    userEmail: "priya.patel@yahoo.com",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    query: "Nvidia RTX 5080 Founder Edition",
    dateTime: "2026-08-20 13:12:05",
    startedTime: "2026-08-20 13:12:00",
    completedTime: "2026-08-20 13:12:05",
    duration: "5.0s",
    status: "Failed",
    resultsCount: 0,
    comparisonSummary: null,
    results: []
  },
  {
    id: "SCH-8817",
    userId: "USR-10487",
    userName: "Vikram Malhotra",
    userEmail: "vikram.malhotra@rediffmail.com",
    userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
    query: "MacBook Pro 16 M3 Max 64GB",
    dateTime: "2026-08-20 12:48:20",
    startedTime: "2026-08-20 12:48:18",
    completedTime: null,
    duration: "In Progress",
    status: "Running",
    resultsCount: 6,
    comparisonSummary: null,
    results: []
  },
  {
    id: "SCH-8816",
    userId: "USR-10488",
    userName: "Ananya Iyer",
    userEmail: "ananya.iyer@gmail.com",
    userAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
    query: "Apple iPad Air M2 11-inch",
    dateTime: "2026-08-20 11:30:12",
    startedTime: "2026-08-20 11:30:10",
    completedTime: "2026-08-20 11:30:12",
    duration: "1.9s",
    status: "Successful",
    resultsCount: 20,
    comparisonSummary: {
      cheapest: {
        name: "Apple iPad Air M2 11-inch (128GB Wi-Fi Space Grey)",
        price: 57900,
        originalPrice: 59900,
        discount: "3% OFF",
        website: "Amazon",
        url: "https://www.amazon.in",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&auto=format&fit=crop&q=80",
        rating: 4.8,
        reviews: 2100
      },
      highestRated: {
        name: "Apple iPad Air M2 11-inch (256GB Starlight)",
        price: 67900,
        originalPrice: 69900,
        discount: "3% OFF",
        website: "Croma",
        url: "https://www.croma.com",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&auto=format&fit=crop&q=80",
        rating: 4.9,
        reviews: 1450
      },
      bestOverall: {
        name: "Apple iPad Air M2 11-inch 128GB",
        price: 57900,
        originalPrice: 59900,
        discount: "3% OFF",
        website: "Amazon",
        url: "https://www.amazon.in",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&auto=format&fit=crop&q=80",
        rating: 4.8,
        reviews: 2100,
        highlight: "Official Warranty + Prime Delivery"
      }
    },
    results: [
      {
        id: "RES-401",
        name: "Apple iPad Air M2 11-inch (128GB Wi-Fi Space Grey)",
        price: 57900,
        originalPrice: 59900,
        discount: "3% OFF",
        rating: 4.8,
        reviews: 2100,
        website: "Amazon",
        productUrl: "https://www.amazon.in",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&auto=format&fit=crop&q=80"
      }
    ]
  },
  {
    id: "SCH-8815",
    userId: "USR-10482",
    userName: "Mohan Teja",
    userEmail: "mohan.teja@gmail.com",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    query: "Asus ROG Zephyrus G16 OLED",
    dateTime: "2026-08-20 10:15:00",
    startedTime: null,
    completedTime: null,
    duration: "Pending",
    status: "Pending",
    resultsCount: 0,
    comparisonSummary: null,
    results: []
  }
];

export const initialAutomationJobs = [
  {
    jobId: "JOB-4401",
    searchId: "SCH-8821",
    sourceWebsite: "Amazon",
    startTime: "2026-08-20 14:32:08",
    endTime: "2026-08-20 14:32:09",
    duration: "1.1s",
    progress: 100,
    status: "Completed",
    resultsCollected: 8,
    errorMessage: null,
    workerNode: "Worker-US-East-01"
  },
  {
    jobId: "JOB-4402",
    searchId: "SCH-8821",
    sourceWebsite: "Flipkart",
    startTime: "2026-08-20 14:32:08",
    endTime: "2026-08-20 14:32:10",
    duration: "1.8s",
    progress: 100,
    status: "Completed",
    resultsCollected: 5,
    errorMessage: null,
    workerNode: "Worker-AP-South-02"
  },
  {
    jobId: "JOB-4403",
    searchId: "SCH-8821",
    sourceWebsite: "Croma",
    startTime: "2026-08-20 14:32:08",
    endTime: "2026-08-20 14:32:09",
    duration: "1.3s",
    progress: 100,
    status: "Completed",
    resultsCollected: 3,
    errorMessage: null,
    workerNode: "Worker-AP-South-03"
  },
  {
    jobId: "JOB-4404",
    searchId: "SCH-8821",
    sourceWebsite: "Reliance Digital",
    startTime: "2026-08-20 14:32:08",
    endTime: "2026-08-20 14:32:10",
    duration: "1.6s",
    progress: 100,
    status: "Completed",
    resultsCollected: 2,
    errorMessage: null,
    workerNode: "Worker-EU-Central-01"
  },
  {
    jobId: "JOB-4405",
    searchId: "SCH-8818",
    sourceWebsite: "Flipkart",
    startTime: "2026-08-20 13:12:00",
    endTime: "2026-08-20 13:12:05",
    duration: "5.0s",
    progress: 40,
    status: "Failed",
    resultsCollected: 0,
    errorMessage: "HTTP 429: Rate limit exceeded on search endpoint. Anti-bot challenge failed during DOM extraction.",
    workerNode: "Worker-AP-South-01"
  },
  {
    jobId: "JOB-4406",
    searchId: "SCH-8818",
    sourceWebsite: "Amazon",
    startTime: "2026-08-20 13:12:00",
    endTime: "2026-08-20 13:12:04",
    duration: "4.2s",
    progress: 15,
    status: "Failed",
    resultsCollected: 0,
    errorMessage: "Connection Timeout: No response from endpoint after 4000ms. Rotating proxy connection dropped.",
    workerNode: "Worker-US-West-02"
  },
  {
    jobId: "JOB-4407",
    searchId: "SCH-8817",
    sourceWebsite: "Amazon",
    startTime: "2026-08-20 12:48:18",
    endTime: null,
    duration: "Running",
    progress: 68,
    status: "Running",
    resultsCollected: 4,
    errorMessage: null,
    workerNode: "Worker-US-East-03"
  },
  {
    jobId: "JOB-4408",
    searchId: "SCH-8817",
    sourceWebsite: "Croma",
    startTime: "2026-08-20 12:48:18",
    endTime: null,
    duration: "Running",
    progress: 52,
    status: "Running",
    resultsCollected: 2,
    errorMessage: null,
    workerNode: "Worker-AP-South-04"
  }
];

export const initialSources = [
  {
    id: "SRC-1",
    name: "Amazon",
    websiteUrl: "https://www.amazon.in",
    status: "Enabled",
    lastSuccessfulRun: "1 min ago",
    productsCollected: 58420,
    avgLatency: "1.1s",
    healthRate: "99.4%",
    connectorVersion: "v3.2.0"
  },
  {
    id: "SRC-2",
    name: "Flipkart",
    websiteUrl: "https://www.flipkart.com",
    status: "Enabled",
    lastSuccessfulRun: "3 mins ago",
    productsCollected: 46210,
    avgLatency: "1.4s",
    healthRate: "98.2%",
    connectorVersion: "v3.1.8"
  },
  {
    id: "SRC-3",
    name: "Myntra",
    websiteUrl: "https://www.myntra.com",
    status: "Enabled",
    lastSuccessfulRun: "8 mins ago",
    productsCollected: 18940,
    avgLatency: "1.6s",
    healthRate: "99.1%",
    connectorVersion: "v2.9.4"
  },
  {
    id: "SRC-4",
    name: "Croma",
    websiteUrl: "https://www.croma.com",
    status: "Enabled",
    lastSuccessfulRun: "5 mins ago",
    productsCollected: 12830,
    avgLatency: "1.3s",
    healthRate: "97.8%",
    connectorVersion: "v2.8.2"
  },
  {
    id: "SRC-5",
    name: "Reliance Digital",
    websiteUrl: "https://www.reliancedigital.in",
    status: "Enabled",
    lastSuccessfulRun: "12 mins ago",
    productsCollected: 9520,
    avgLatency: "1.8s",
    healthRate: "96.9%",
    connectorVersion: "v2.7.0"
  },
  {
    id: "SRC-6",
    name: "AJIO",
    websiteUrl: "https://www.ajio.com",
    status: "Disabled",
    lastSuccessfulRun: "4 hours ago",
    productsCollected: 7420,
    avgLatency: "2.1s",
    healthRate: "92.4%",
    connectorVersion: "v2.5.1"
  },
  {
    id: "SRC-7",
    name: "Tata CLiQ",
    websiteUrl: "https://www.tatacliq.com",
    status: "Error",
    lastSuccessfulRun: "2 days ago",
    productsCollected: 3890,
    avgLatency: "3.4s",
    healthRate: "64.1%",
    connectorVersion: "v1.9.0",
    errorDetail: "DOM structure updated by vendor. Selector engine requires re-indexing."
  }
];

export const initialSystemLogs = [
  {
    logId: "LOG-7102",
    type: "Automation Error",
    message: "HTTP 429 Rate Limited: Anti-bot challenge triggered while scraping Flipkart search results",
    source: "Worker-AP-South-01",
    dateTime: "2026-08-20 13:12:05",
    severity: "Critical",
    status: "Unresolved",
    ip: "10.0.4.19",
    stackTrace: `ScraperException: RateLimitExceeded (HTTP 429)
  at FlipkartConnector.fetchDOM (/scrapers/connectors/flipkart.ts:182:14)
  at ScraperWorker.processSearch (/workers/scraperWorker.ts:89:22)
  at async JobRunner.execute (/engine/jobRunner.ts:45:9)`
  },
  {
    logId: "LOG-7101",
    type: "Scraping Error",
    message: "Connection Timeout: Socket hangup on Amazon Product Details scraper worker",
    source: "Worker-US-West-02",
    dateTime: "2026-08-20 13:12:04",
    severity: "Error",
    status: "Investigating",
    ip: "10.0.4.24",
    stackTrace: `TimeoutError: Scraper worker did not receive response headers in 4000ms
  at ProxyTunnel.connect (/network/proxyPool.ts:114:18)
  at AmazonParser.parseSpecs (/scrapers/amazonParser.ts:67:12)`
  },
  {
    logId: "LOG-7100",
    type: "Failed Search",
    message: "Zero products matched query 'Nvidia RTX 5080 Founder Edition' across all 6 active sources",
    source: "Search-Engine-Pool",
    dateTime: "2026-08-20 13:12:05",
    severity: "Warning",
    status: "Resolved",
    ip: "10.0.2.11",
    stackTrace: `SearchEmptyException: No in-stock listings parsed for high-demand SKU
  at AggregatorService.aggregateResults (/services/aggregator.ts:154:19)`
  },
  {
    logId: "LOG-7099",
    type: "API Error",
    message: "Redis cache memory utilization reached 84% watermark (Auto-eviction triggered)",
    source: "Redis-Cache-Cluster",
    dateTime: "2026-08-20 12:30:18",
    severity: "Warning",
    status: "Resolved",
    ip: "10.0.1.5",
    stackTrace: `CacheWarning: LRU eviction purged 14,200 stale product price keys
  at RedisPool.monitorThreshold (/cache/redisMonitor.ts:44:11)`
  },
  {
    logId: "LOG-7098",
    type: "System Error",
    message: "Tata CLiQ connector failed HTML DOM validation check for price container selector",
    source: "Connector-TataCLiQ",
    dateTime: "2026-08-20 11:15:40",
    severity: "Error",
    status: "Unresolved",
    ip: "10.0.4.55",
    stackTrace: `DOMParsingException: Selector '.product-price-wrapper' not found in response
  at TataCliqConnector.extractPrice (/scrapers/connectors/tatacliq.ts:98:21)`
  },
  {
    logId: "LOG-7097",
    type: "Automation Error",
    message: "Scraper worker node auto-scaled: added 4 new nodes to handle peak 14:00 volume",
    source: "Kubernetes-Cluster-Autoscaler",
    dateTime: "2026-08-20 10:00:00",
    severity: "Info",
    status: "Resolved",
    ip: "10.0.0.1",
    stackTrace: `ClusterEvent: HPA scaled deployment 'scraper-workers' from 8 to 12 replicas
  at ClusterController.handleScaleUp (/infra/k8sController.ts:28:10)`
  }
];

export const initialAdminNotifications = [
  {
    id: "NOTIF-1",
    title: "Critical Scraper Rate Limit",
    message: "Flipkart connector hit HTTP 429 during high volume batch search.",
    time: "15m ago",
    type: "error",
    read: false,
    link: "/admin/automation"
  },
  {
    id: "NOTIF-2",
    title: "Connector Disabled",
    message: "Tata CLiQ source flagged with DOM parsing errors.",
    time: "1h ago",
    type: "warning",
    read: false,
    link: "/admin/sources"
  },
  {
    id: "NOTIF-3",
    title: "Daily Product Index High",
    message: "+2,430 new products discovered and indexed across stores.",
    time: "3h ago",
    type: "success",
    read: true,
    link: "/admin/products"
  },
  {
    id: "NOTIF-4",
    title: "Cluster Scale Up",
    message: "4 worker nodes provisioned successfully for peak traffic.",
    time: "5h ago",
    type: "info",
    read: true,
    link: "/admin/dashboard"
  }
];
