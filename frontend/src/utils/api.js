const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data = null;

  try {
    data = await res.json();
  } catch {
    // No JSON body
  }

  if (!res.ok) {
    throw new Error(
      data?.message ||
        "Something went wrong. Please try again."
    );
  }

  return data;
}


/* =========================
   AUTH
========================= */

export function registerUser({
  fullName,
  email,
  password,
  confirmPassword,
}) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      fullName,
      email,
      password,
      confirmPassword,
    }),
  });
}


export function loginUser({
  email,
  password,
}) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
}


export function saveAuth({
  token,
  user,
}) {
  const payload = {
    name: user.fullName,
    email: user.email,

    avatar:
      `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
        user.fullName
      )}`,

    provider: "email",

    loggedInAt:
      new Date().toISOString(),
  };

  localStorage.setItem(
    "token",
    token
  );

  localStorage.setItem(
    "user",
    JSON.stringify(payload)
  );
}


export function requestPasswordReset(
  email
) {
  return request(
    "/auth/forgot-password",
    {
      method: "POST",
      body: JSON.stringify({ email }),
    }
  );
}


export function verifyResetOtp({
  email,
  otp,
}) {
  return request(
    "/auth/verify-otp",
    {
      method: "POST",
      body: JSON.stringify({
        email,
        otp,
      }),
    }
  );
}


export function resetPassword({
  resetToken,
  newPassword,
  confirmPassword,
}) {
  return request(
    "/auth/reset-password",
    {
      method: "POST",
      body: JSON.stringify({
        resetToken,
        newPassword,
        confirmPassword,
      }),
    }
  );
}


/* =========================
   LIVE SEARCH CACHE
========================= */

const LIVE_SEARCH_CACHE_PREFIX =
  "psa-live-search:";


function normalizeCacheQuery(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}


function readLiveSearchCache(query) {
  try {
    const raw =
      sessionStorage.getItem(
        `${LIVE_SEARCH_CACHE_PREFIX}${normalizeCacheQuery(
          query
        )}`
      );

    return raw
      ? JSON.parse(raw)
      : null;
  } catch {
    return null;
  }
}


function writeLiveSearchCache(
  query,
  data
) {
  try {
    sessionStorage.setItem(
      `${LIVE_SEARCH_CACHE_PREFIX}${normalizeCacheQuery(
        query
      )}`,
      JSON.stringify({
        savedAt: Date.now(),
        data,
      })
    );
  } catch {
    // Cache failure should never break search.
  }
}


/* =========================
   LIVE SEARCH
========================= */

/*
  SearchPage uses this function.

  IMPORTANT:
  We call /products/search,
  NOT /products/specific.

  /search returns multiple products.
*/
export async function searchLiveProducts(
  query,
  { lat, lon, pincode } = {}
) {
  const cleanQuery =
    String(query || "").trim();

  if (!cleanQuery) {
    return {
      status: "success",
      products: [],
    };
  }


  /* Browser cache */
  const cached =
    readLiveSearchCache(cleanQuery);

  if (cached?.data) {
    return {
      ...cached.data,
      fromBrowserCache: true,
    };
  }


  /* Query parameters */
  const params =
    new URLSearchParams();

  params.set("q", cleanQuery);

  if (lat != null) {
    params.set("lat", lat);
  }

  if (lon != null) {
    params.set("lon", lon);
  }

  if (pincode) {
    params.set(
      "pincode",
      pincode
    );
  }


  /* Correct endpoint */
  const data = await request(
    `/products/search?${params.toString()}`
  );


  /* Save result */
  writeLiveSearchCache(
    cleanQuery,
    data
  );


  return data;
}


/* =========================
   SPECIFIC PRODUCT
========================= */

/*
  Used when we need ONE exact product
  across Amazon + Flipkart + Myntra.
*/
export async function searchSpecificLiveProduct(
  productName,
  { lat, lon, pincode } = {}
) {
  const cleanName =
    String(productName || "").trim();

  if (!cleanName) {
    return {
      status: "success",
      product: null,
      products: [],
    };
  }


  const cached =
    readLiveSearchCache(
      cleanName
    );

  if (cached?.data) {
    return {
      ...cached.data,
      fromBrowserCache: true,
    };
  }


  const params =
    new URLSearchParams();

  params.set(
    "name",
    cleanName
  );

  if (lat != null) {
    params.set("lat", lat);
  }

  if (lon != null) {
    params.set("lon", lon);
  }

  if (pincode) {
    params.set(
      "pincode",
      pincode
    );
  }


  const data = await request(
    `/products/specific?${params.toString()}`
  );


  writeLiveSearchCache(
    cleanName,
    data
  );


  return data;
}


/* =========================
   LIVE COMPARISON
========================= */

export async function getLiveComparison(
  productName,
  { lat, lon, pincode } = {}
) {
  /*
    Use the same specific-product
    cache so clicking Compare does
    not make another API request.
  */

  return searchSpecificLiveProduct(
    productName,
    {
      lat,
      lon,
      pincode,
    }
  );
}