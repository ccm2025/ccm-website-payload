// Load environment variables for testing
import 'dotenv/config'

// Polyfill for Cloudflare environment when testing
if (!global.TextEncoder) {
  global.TextEncoder = require('util').TextEncoder
}
if (!global.TextDecoder) {
  global.TextDecoder = require('util').TextDecoder
}

// Conditional crypto polyfill
if (!global.crypto) {
  global.crypto = require('crypto').webcrypto
}
