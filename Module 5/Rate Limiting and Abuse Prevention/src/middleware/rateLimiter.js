"use strict";
// middleware/rateLimiter.js
//
// YOUR TASK: replace this pass-through with a real rate limiter.
//
// Right now this middleware lets EVERY request through, so the login route can be
// brute-forced without limit. Build a strict limiter with `express-rate-limit`
// (already in package.json) that is exported as the middleware used by the three
// auth routes in src/routes/auth.js.
//
// Requirements (checked by the tests):
//   - windowMs: 15 minutes
//   - max: 5 attempts per window per IP
//   - after the limit, respond with 429 and a `Retry-After` header
//   - standardHeaders: true, legacyHeaders: false
//   - (recommended) skipSuccessfulRequests: true so only FAILED attempts count
//
// Also add a COMMENT explaining how a Redis-backed store (rate-limit-redis) would
// replace the default in-memory store in a multi-instance deployment, and why the
// in-memory store is not enough when several instances run behind a load balancer.
//
// Hint: express-rate-limit returns a middleware function — export it directly:
//   const rateLimit = require('express-rate-limit');
//   module.exports = rateLimit({ ...options });

module.exports = (req, res, next) => next(); // TODO: replace this stub

("use strict");
// middleware/rateLimiter.js
//
// YOUR TASK: replace this pass-through with a real rate limiter.
//
// Right now this middleware lets EVERY request through, so the login route can be
// brute-forced without limit. Build a strict limiter with `express-rate-limit`
// (already in package.json) that is exported as the middleware used by the three
// auth routes in src/routes/auth.js.
//
// Requirements (checked by the tests):
//   - windowMs: 15 minutes
//   - max: 5 attempts per window per IP
//   - after the limit, respond with 429 and a `Retry-After` header
//   - standardHeaders: true, legacyHeaders: false
//   - (recommended) skipSuccessfulRequests: true so only FAILED attempts count
//
// Also add a COMMENT explaining how a Redis-backed store (rate-limit-redis) would
// replace the default in-memory store in a multi-instance deployment, and why the
// in-memory store is not enough when several instances run behind a load balancer.
//
// Hint: express-rate-limit returns a middleware function — export it directly:
//   const rateLimit = require('express-rate-limit');
//   module.exports = rateLimit({ ...options });

// In a multi-instance deployment, use rate-limit-redis with a shared Redis
// connection as the store. Each application instance then shares the same rate
// limit counters. The default in-memory store keeps counters separately per
// instance, so requests distributed by a load balancer could bypass the intended
// limit by reaching different instances.

const rateLimit = require("express-rate-limit");
const authLimiter = rateLimit({
  windowMs: 15601000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: true,
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    const resetMs =
      req.rateLimit && req.rateLimit.resetTime
        ? req.rateLimit.resetTime.getTime() - Date.now()
        : 15601000;
    res.set("Retry-After", String(Math.max(1, Math.ceil(resetMs / 1000))));
    res
      .status(429)
      .json({
        error: {
          code: "RATE_LIMITED",
          message: "Too many attempts,please try again",
        },
      });
  },
});
module.exports = authLimiter;
