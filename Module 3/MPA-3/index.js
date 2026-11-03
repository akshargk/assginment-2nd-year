/**
 * Post Listing API: Simple Filtering & Sorting
 *
 * You have an in-memory store of 6 posts. Build `listPosts(options)` that:
 *   1. Filters by author (if provided)
 *   2. Filters by status (if provided)
 *   3. Sorts by score OR createdAt (if provided)
 *   4. Returns the filtered + sorted array
 *
 * That's it. No pagination. No cursor. Just filter and sort.
 */

// ── THE STORE ── DO NOT MODIFY.
const POSTS = [
  {
    id: 1,
    title: "Node Basics",
    author: "alice",
    status: "published",
    score: 95,
    createdAt: 100,
  },
  {
    id: 2,
    title: "Express Routes",
    author: "bob",
    status: "draft",
    score: 50,
    createdAt: 200,
  },
  {
    id: 3,
    title: "Middleware",
    author: "alice",
    status: "published",
    score: 80,
    createdAt: 300,
  },
  {
    id: 4,
    title: "Database Design",
    author: "carol",
    status: "published",
    score: 75,
    createdAt: 400,
  },
  {
    id: 5,
    title: "REST APIs",
    author: "bob",
    status: "published",
    score: 90,
    createdAt: 500,
  },
  {
    id: 6,
    title: "Auth Patterns",
    author: "alice",
    status: "draft",
    score: 60,
    createdAt: 600,
  },
];

/**
 * Filter and sort posts.
 *
 * @param {object} options - { author?, status?, sortBy?, order? }
 *   - author: string (optional) — filter by this author name
 *   - status: string (optional) — filter by this status ('published' or 'draft')
 *   - sortBy: string (optional) — 'score' or 'createdAt' (default: 'score')
 *   - order: string (optional) — 'asc' or 'desc' (default: 'desc')
 *
 * @returns {array} — filtered and sorted posts
 *
 * Rules:
 *   - If author is given, only return posts by that author
 *   - If status is given, only return posts with that status
 *   - If both author AND status are given, both filters apply (AND logic)
 *   - Sort by the given field in the given direction
 *   - If sortBy is invalid (not 'score' or 'createdAt'), throw an Error with message: "Invalid sortBy field"
 *   - Default sort: by 'score' descending (highest first)
 */
function listPosts(options = {}) {
  // TODO 1: Filter by author
  let result = POSTS.slice();

  if (options.author !== undefined) {
    result = result.filter((post) => post.author === options.author);
  }

  // TODO 2: Filter by status
  if (options.status !== undefined) {
    result = result.filter((post) => post.status === options.status);
  }

  // TODO 3: Validate the sorting field
  const sortBy = options.sortBy || "score";
  const order = options.order || "desc";

  if (sortBy !== "score" && sortBy !== "createdAt") {
    throw new Error("Invalid sortBy field");
  }

  // Sort ascending or descending
  result.sort((a, b) => {
    if (order === "asc") {
      return a[sortBy] - b[sortBy];
    }

    return b[sortBy] - a[sortBy];
  });

  // TODO 4: Return filtered and sorted posts
  return result;
}

module.exports = {
  listPosts,
  POSTS,
};
