# Product Search Automation — Live Multi-Store Search

This version connects the existing React frontend to the Node/Express backend for live product search.

## Live sources

The supplied QuickCommerce API currently supports search on:
- Amazon
- Flipkart
- Myntra

The API documentation does **not** list Reliance Digital as a supported search platform. The application therefore shows this limitation instead of inventing Reliance Digital results.

## Architecture

```text
React SearchBar
      |
      v
GET /api/products/search?q=iphone+16
      |
      v
Node/Express backend
      |
      v
QuickCommerce API /v1/groupsearch
      |
      +---- Amazon
      +---- Flipkart
      +---- Myntra
      |
      v
Product normalization + matching
      |
      +---- single-store result
      +---- 2-store comparison
      +---- 3-store comparison
      |
      v
Existing SearchPage UI
      |
      v
/comparison/:productName
      |
      v
Live detailed comparison page
```

## Setup

### 1. Backend

```bash
cd Product-Search-Automation/backend
cp .env.example .env
```

Open `.env` and set:

```env
QUICKCOMMERCE_API_KEY=YOUR_API_KEY
SEARCH_LAT=12.9021
SEARCH_LON=77.6639
SEARCH_PINCODE=
```

Keep `QUICKCOMMERCE_API_KEY` on the backend. Do not put it in `frontend/.env` or React source code.

Then:

```bash
npm install
npm start
```

Backend:
`http://localhost:5000`

Health check:
`http://localhost:5000/api/health`

### 2. Frontend

Open another terminal:

```bash
cd Product-Search-Automation/frontend
npm install
npm run dev
```

Frontend:
`http://localhost:5173`

The existing frontend `.env` already points to:

```env
VITE_API_URL=http://localhost:5000/api
```

## How search works

When the user searches from the existing SearchBar:

```text
/search?q=iphone+16
```

the SearchPage calls:

```text
GET http://localhost:5000/api/products/search?q=iphone%2016
```

The backend calls QuickCommerce API's multi-platform endpoint once for:

```text
Amazon,Flipkart,Myntra
```

The backend then:
1. Normalizes product names.
2. Normalizes pack/storage quantities such as `128 GB` and `128GB`.
3. Matches close product names across stores.
4. Removes duplicate offers from the same store.
5. Sorts matched offers by price.
6. Returns the best offer plus all matching store offers.
7. Marks products with 2 or 3 stores as multi-store comparisons.

For example, if the same product is returned by all three stores:

```text
Product X
 ├── Amazon       ₹79,999
 ├── Flipkart     ₹78,999
 └── Myntra       ₹80,499

Best price: Flipkart ₹78,999
```

Clicking **Compare** opens the existing comparison page and loads the live comparison when the product is not in the old dummy comparison dataset.

## API key safety

The original project archive contained sensitive backend credentials. This clean archive intentionally does not include the old `backend/.env` file or Git history.

Add your own QuickCommerce API key to:

```text
backend/.env
```

Do not commit `.env`.

## Reliance Digital

Reliance Digital is displayed as an unsupported source because the supplied QuickCommerce API documentation lists Amazon, Myntra and Flipkart, but not Reliance Digital.

To add Reliance Digital live results, an authorized Reliance Digital API/data source or another permitted provider is needed. The backend has been structured so another provider can be added without changing the React search UI.
