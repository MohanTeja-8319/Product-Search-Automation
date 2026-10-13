const mongoose = require("mongoose");

function isValidObjectId(value) {
  if (value === null || value === undefined) return false;
  const stringValue = String(value);
  return mongoose.Types.ObjectId.isValid(stringValue);
}

module.exports = {
  isValidObjectId,
};
