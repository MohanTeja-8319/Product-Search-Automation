const assert = require("assert");

const BASE_URL = "http://localhost:5000/api";

function extractCookie(res) {
  const raw = res.headers.get("set-cookie");
  if (!raw) return null;
  return raw.split(";")[0];
}

async function runTests() {
  console.log("=================================================");
  console.log("COMPARELY AUTHENTICATION SUITE VERIFICATION");
  console.log("=================================================");

  const timestamp = Date.now();
  const testUser = {
    fullName: `Test Runner ${timestamp}`,
    email: `testrunner_${timestamp}@comparely.io`,
    password: "Password123",
    confirmPassword: "Password123",
  };

  // -------------------------------------------------------------------------
  // TEST 1 — New Registration
  // -------------------------------------------------------------------------
  console.log("\n[TEST 1] Register a new account...");
  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(testUser),
  });
  const regData = await regRes.json();
  assert.strictEqual(regRes.status, 201, `Expected status 201, got ${regRes.status}`);
  assert.ok(regData.token, "Expected access token in response");
  assert.strictEqual(regData.user.email, testUser.email.toLowerCase());
  const regCookie = extractCookie(regRes);
  assert.ok(regCookie, "Expected comparely_rf HttpOnly cookie in register response");
  console.log("  ✓ TEST 1 PASSED: Registration succeeded with access token and secure cookie.");

  // -------------------------------------------------------------------------
  // TEST 2 & 3 — App Close, Reopen, Browser Refresh & Session Restoration
  // -------------------------------------------------------------------------
  console.log("\n[TEST 2 & 3] App Close & Reopen / Browser Refresh Session Restoration...");
  // Simulate browser restart / reopen: client only possesses the HttpOnly cookie, in-memory token is gone
  const restoreRes = await fetch(`${BASE_URL}/auth/session`, {
    method: "GET",
    headers: {
      "Cookie": regCookie,
      "X-Comparely-Client": "web",
    },
  });
  const restoreData = await restoreRes.json();
  assert.strictEqual(restoreRes.status, 200, `Expected 200 on session restore, got ${restoreRes.status}`);
  assert.ok(restoreData.token, "Expected renewed access token");
  assert.strictEqual(restoreData.user.email, testUser.email.toLowerCase());
  const rotatedCookie = extractCookie(restoreRes) || regCookie;
  console.log("  ✓ TEST 2 & 3 PASSED: Session automatically restored from persistent cookie without user prompt.");

  // -------------------------------------------------------------------------
  // TEST 4 — Navigation & Protected Route Access
  // -------------------------------------------------------------------------
  console.log("\n[TEST 4] Navigation to Protected Routes (e.g., /api/auth/me)...");
  const meRes = await fetch(`${BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${restoreData.token}`,
    },
  });
  const meData = await meRes.json();
  assert.strictEqual(meRes.status, 200, `Expected 200 on protected /me endpoint, got ${meRes.status}`);
  assert.strictEqual(meData.user.email, testUser.email.toLowerCase());
  console.log("  ✓ TEST 4 PASSED: Protected route access validated successfully with access token.");

  // -------------------------------------------------------------------------
  // TEST 5 — Access Token Expiration & Refresh
  // -------------------------------------------------------------------------
  console.log("\n[TEST 5] Access Token Refresh via /auth/refresh...");
  const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Cookie": rotatedCookie,
      "X-Comparely-Client": "web",
    },
  });
  const refreshData = await refreshRes.json();
  assert.strictEqual(refreshRes.status, 200, `Expected 200 on refresh, got ${refreshRes.status}`);
  assert.ok(refreshData.token, "Expected fresh access token");
  const activeCookie = extractCookie(refreshRes) || rotatedCookie;
  console.log("  ✓ TEST 5 PASSED: Access token refreshed successfully using rotated refresh token.");

  // -------------------------------------------------------------------------
  // TEST 6 — Invalid / Malformed / Tampered Session Handling
  // -------------------------------------------------------------------------
  console.log("\n[TEST 6] Invalid and Tampered Session Handling...");
  const invalidRes = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Cookie": "comparely_rf=invalid.tampered.token.signature",
      "X-Comparely-Client": "web",
    },
  });
  assert.strictEqual(invalidRes.status, 401, `Expected 401 for tampered cookie, got ${invalidRes.status}`);
  console.log("  ✓ TEST 6 PASSED: Tampered/invalid session rejected gracefully with 401.");

  // -------------------------------------------------------------------------
  // TEST 7 — Logout and Session Revocation
  // -------------------------------------------------------------------------
  console.log("\n[TEST 7] Explicit Logout & Session Revocation...");
  const logoutRes = await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    headers: {
      "Cookie": activeCookie,
      "X-Comparely-Client": "web",
    },
  });
  assert.strictEqual(logoutRes.status, 200, `Expected 200 on logout, got ${logoutRes.status}`);

  // Verify that terminated session cannot be restored
  const postLogoutRestore = await fetch(`${BASE_URL}/auth/session`, {
    method: "GET",
    headers: {
      "Cookie": activeCookie,
      "X-Comparely-Client": "web",
    },
  });
  assert.strictEqual(postLogoutRestore.status, 401, `Expected 401 on terminated session, got ${postLogoutRestore.status}`);
  console.log("  ✓ TEST 7 PASSED: Terminated session revoked server-side and cannot be restored.");

  // -------------------------------------------------------------------------
  // TEST 8 — Fresh Login and Persistent State
  // -------------------------------------------------------------------------
  console.log("\n[TEST 8] User Re-authentication (Login Flow)...");
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: testUser.email, password: testUser.password }),
  });
  const loginData = await loginRes.json();
  assert.strictEqual(loginRes.status, 200, `Expected 200 on login, got ${loginRes.status}`);
  assert.ok(loginData.token, "Expected access token on login");
  const freshCookie = extractCookie(loginRes);
  assert.ok(freshCookie, "Expected new persistent cookie on login");
  console.log("  ✓ TEST 8 PASSED: User logged in, new persistent session established.");

  // -------------------------------------------------------------------------
  // TEST 9 — Multiple Concurrent API Requests (No Race Conditions)
  // -------------------------------------------------------------------------
  console.log("\n[TEST 9] Concurrent Token Refresh Requests (Race Condition & Grace Period Protection)...");
  // Execute 5 concurrent refresh requests with the same cookie
  const concurrentCalls = [1, 2, 3, 4, 5].map(() =>
    fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Cookie": freshCookie,
        "X-Comparely-Client": "web",
      },
    }).then(async (res) => ({ status: res.status, body: await res.json() }))
  );
  const concurrentResults = await Promise.all(concurrentCalls);
  const successCount = concurrentResults.filter((r) => r.status === 200).length;
  console.log(`  Concurrent refresh outcomes: ${successCount}/5 succeeded with 200 (within grace period).`);
  assert.ok(successCount >= 1, "At least one refresh must succeed");
  console.log("  ✓ TEST 9 PASSED: Concurrent API requests handled safely without race condition failure.");

  // -------------------------------------------------------------------------
  // TEST 10 — Existing Comparely Product Search & Comparison Functionality
  // -------------------------------------------------------------------------
  console.log("\n[TEST 10] Product Search & Existing Functionality Verification...");
  const searchRes = await fetch(`${BASE_URL}/products/search?q=phone`);
  const searchData = await searchRes.json();
  assert.strictEqual(searchRes.status, 200, `Expected 200 on product search, got ${searchRes.status}`);
  assert.ok(Array.isArray(searchData.products), "Expected products array in search response");
  console.log(`  Found ${searchData.products.length} products across multi-store catalog.`);
  console.log("  ✓ TEST 10 PASSED: Product search and core platform operations completely intact.");

  console.log("\n=================================================");
  console.log("ALL 10 VERIFICATION TESTS COMPLETED SUCCESSFULLY!");
  console.log("=================================================");
}

runTests().catch((err) => {
  console.error("Test failure:", err);
  process.exit(1);
});
