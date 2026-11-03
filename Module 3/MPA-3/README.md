# Post Listing API: Filtering & Sorting

## Problem Statement

You are building a **post listing endpoint** for a blog platform. The API should let users filter posts by author or status, and sort by score or creation date.

Your task: implement `listPosts(options)` that takes a query object and returns filtered, sorted posts.

---

## File to Edit

* `index.js`: Implement the `listPosts()` function with 4 TODOs.

---

## What listPosts() Should Do

1. **Filter by author** — if `options.author` is provided, only include posts by that author
2. **Filter by status** — if `options.status` is provided, only include posts with that status
3. **Apply both filters** — if both are provided, both must match (AND logic)
4. **Sort** — sort by `options.sortBy` ('score' or 'createdAt') in `options.order` direction ('asc' or 'desc')
5. **Validate sort field** — if `sortBy` is not 'score' or 'createdAt', throw an Error with message "Invalid sortBy field"
6. **Default sort** — if no sortBy given, sort by 'score' descending (highest first)

---

## Input Examples

```javascript
// All posts, sorted by score desc (default)
listPosts({})
// → [ id: 1 (score 95), id: 5 (score 90), id: 3 (score 80), ... ]

// Only alice's posts
listPosts({ author: 'alice' })
// → [ id: 1, id: 3, id: 6 ] (in score order by default)

// Only published posts
listPosts({ status: 'published' })
// → [ id: 1, id: 3, id: 4, id: 5 ] (sorted by score desc)

// Alice's published posts, sorted by creation date
listPosts({ author: 'alice', status: 'published', sortBy: 'createdAt', order: 'asc' })
// → [ id: 1 (createdAt 100), id: 3 (createdAt 300) ]

// Invalid sort field
listPosts({ sortBy: 'password' })
// → throws Error("Invalid sortBy field")
```

---

## Test Cases (10 tests × 2 marks = 20 marks)

| # | Test | What It Checks |
|---|------|----------------|
| 1 | Default sort (no options) | Sorts by score descending (highest first) |
| 2 | Filter by author 'alice' | Returns only alice's posts |
| 3 | Filter by author 'bob' | Returns only bob's posts |
| 4 | Filter by status 'published' | Returns only published posts |
| 5 | Filter by status 'draft' | Returns only draft posts |
| 6 | Filter author + status | Both filters apply (AND logic) |
| 7 | Sort by score ascending | Sorts score low-to-high |
| 8 | Sort by createdAt descending | Sorts createdAt high-to-low (newest first) |
| 9 | Invalid sortBy field | Throws Error("Invalid sortBy field") |
| 10 | Complex query: filter + sort | alice's published posts sorted by createdAt asc |

---

## The Store (DO NOT EDIT)

```javascript
[
  { id: 1, title: 'Node Basics',     author: 'alice', status: 'published', score: 95, createdAt: 100 },
  { id: 2, title: 'Express Routes',  author: 'bob',   status: 'draft',     score: 50, createdAt: 200 },
  { id: 3, title: 'Middleware',      author: 'alice', status: 'published', score: 80, createdAt: 300 },
  { id: 4, title: 'Database Design', author: 'carol', status: 'published', score: 75, createdAt: 400 },
  { id: 5, title: 'REST APIs',       author: 'bob',   status: 'published', score: 90, createdAt: 500 },
  { id: 6, title: 'Auth Patterns',   author: 'alice', status: 'draft',     score: 60, createdAt: 600 },
]
```

---

## Tips

- **Filter first, then sort.** Start with `POSTS.slice()`, then apply filters, then sort.
- **Validate sort field early.** If `sortBy` is not in the whitelist, throw before doing any work.
- **Use a comparator function.** JavaScript's `.sort((a, b) => { ... })` is your friend.
- **Handle missing options.** `options` might be `{}` or `undefined` — have defaults.
- **AND logic for filters.** If both author and status are given, both conditions must be true.

---

## How to Test

```bash
npm install
npm test
```

All 10 tests run via Jasmine. Read the output to see which test failed and why.
