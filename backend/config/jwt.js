const DEFAULT_JWT_SECRET = "comparely-default-jwt-secret-key";

function getJwtSecret() {
  return process.env.JWT_SECRET || DEFAULT_JWT_SECRET;
}

function getRefreshJwtSecret() {
  return process.env.JWT_REFRESH_SECRET || (getJwtSecret() + "_refresh_secure_v1");
}

function getAccessTokenExpiry() {
  return process.env.JWT_ACCESS_EXPIRES_IN || "15m";
}

function getRefreshTokenExpiry() {
  return process.env.JWT_REFRESH_EXPIRES_IN || "30d";
}

module.exports = {
  DEFAULT_JWT_SECRET,
  getJwtSecret,
  getRefreshJwtSecret,
  getAccessTokenExpiry,
  getRefreshTokenExpiry,
};

