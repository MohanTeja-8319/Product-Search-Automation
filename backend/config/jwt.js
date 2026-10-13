const DEFAULT_JWT_SECRET = "comparely-default-jwt-secret-key";

function getJwtSecret() {
  return process.env.JWT_SECRET || DEFAULT_JWT_SECRET;
}

module.exports = {
  DEFAULT_JWT_SECRET,
  getJwtSecret,
};
