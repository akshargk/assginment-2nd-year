"use strict";

// ─── YOUR FILE — implement this ───────────────────────────────────────────────
// Export handleWebhook(req, res), used by POST /webhooks in app.js.
// Also export _processedIds (your Set or Map) for test inspection/reset.
//
// Steps (in order):
//  1. Verify HMAC-SHA256 signature
//     - Signature header: req.headers['x-webhook-signature'] → 'sha256=<hex>'
//     - Compute: crypto.createHmac('sha256', WEBHOOK_SECRET).update(req.body).digest('hex')
//     - Compare: crypto.timingSafeEqual(Buffer.from(expected,'hex'), Buffer.from(received,'hex'))
//     - Mismatch or missing → res.status(401).json({ error: 'Invalid signature' })
//
//  2. Parse body: const event = JSON.parse(req.body)
//
//  3. Idempotency: if _processedIds.has(event.id) → res.status(200).json({ status: 'already_processed' })
//
//  4. Mark: _processedIds.add(event.id)
//
//  5. Acknowledge: res.status(200).json({ status: 'received' })
//     Then call handleEvent(event) inside setImmediate(() => { ... })

const crypto = require("crypto");
const { handleEvent } = require("./eventHandlers");

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

const _processedIds = new Set();

async function handleWebhook(req, res) {
  // Step 1: Verify signature
  const signature = req.headers["x-webhook-signature"];

  if (!signature || !signature.startsWith("sha256=")) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  const received = signature.slice(7);

  const expected = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(req.body)
    .digest("hex");

  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(received, "hex");

  if (
    expectedBuffer.length !== receivedBuffer.length ||
    !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  ) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  // Step 2: Parse body
  let event;

  try {
    event = JSON.parse(req.body);
  } catch (error) {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  // Step 3: Idempotency
  if (_processedIds.has(event.id)) {
    return res.status(200).json({ status: "already_processed" });
  }

  // Step 4: Mark
  _processedIds.add(event.id);

  // Step 5: Acknowledge
  res.status(200).json({ status: "received" });

  setImmediate(() => {
    handleEvent(event);
  });
}

module.exports = { handleWebhook, _processedIds };
