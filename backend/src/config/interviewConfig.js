/**
 * Interview Configuration Constants
 * Easily configure question counts, limits, and supported options.
 */
const QUESTION_COUNT_BY_DURATION = {
  15: 5,
  30: 8,
  45: 12,
};

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
];

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

module.exports = {
  QUESTION_COUNT_BY_DURATION,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
};

