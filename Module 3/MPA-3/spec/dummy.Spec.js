const { listPosts } = require('../index');

function ids(result) {
  return result.map((p) => p.id);
}

describe('Post Listing: Filtering & Sorting', () => {
  
  // Test 1: Default sort by score descending
  it('sorts by score descending by default (highest first)', () => {
    const result = listPosts({});
    expect(ids(result)).toEqual([1, 5, 3, 4, 6, 2]);
    // scores: 95, 90, 80, 75, 60, 50
  });

  // Test 2: Filter by author alice
  it('filters by author (alice)', () => {
    const result = listPosts({ author: 'alice' });
    expect(ids(result).length).toBe(3);
    expect(result.every((p) => p.author === 'alice')).toBe(true);
  });

  // Test 3: Filter by author bob
  it('filters by author (bob)', () => {
    const result = listPosts({ author: 'bob' });
    expect(ids(result).length).toBe(2);
    expect(ids(result).sort()).toEqual([2, 5]);
    expect(result.every((p) => p.author === 'bob')).toBe(true);
  });

  // Test 4: Filter by status published
  it('filters by status (published)', () => {
    const result = listPosts({ status: 'published' });
    expect(ids(result).length).toBe(4);
    expect(ids(result).sort()).toEqual([1, 3, 4, 5]);
    expect(result.every((p) => p.status === 'published')).toBe(true);
  });

  // Test 5: Filter by status draft
  it('filters by status (draft)', () => {
    const result = listPosts({ status: 'draft' });
    expect(ids(result).length).toBe(2);
    expect(ids(result).sort()).toEqual([2, 6]);
    expect(result.every((p) => p.status === 'draft')).toBe(true);
  });

  // Test 6: Filter by both author and status (AND logic)
  it('filters by author AND status together', () => {
    const result = listPosts({ author: 'alice', status: 'published' });
    expect(ids(result).length).toBe(2);
    expect(ids(result).sort()).toEqual([1, 3]);
    expect(result.every((p) => p.author === 'alice' && p.status === 'published')).toBe(true);
  });

  // Test 7: Sort by score ascending
  it('sorts by score ascending (lowest first)', () => {
    const result = listPosts({ sortBy: 'score', order: 'asc' });
    const scores = result.map((p) => p.score);
    expect(scores).toEqual([50, 60, 75, 80, 90, 95]);
  });

  // Test 8: Sort by createdAt descending
  it('sorts by createdAt descending (newest first)', () => {
    const result = listPosts({ sortBy: 'createdAt', order: 'desc' });
    expect(ids(result)).toEqual([6, 5, 4, 3, 2, 1]);
    // createdAt: 600, 500, 400, 300, 200, 100
  });

  // Test 9: Invalid sortBy field throws error
  it('throws error for invalid sortBy field', () => {
    expect(() => {
      listPosts({ sortBy: 'password' });
    }).toThrowError('Invalid sortBy field');
  });

  // Test 10: Complex query - filter + sort
  it('filters by author and status, then sorts by createdAt ascending', () => {
    const result = listPosts({
      author: 'alice',
      status: 'published',
      sortBy: 'createdAt',
      order: 'asc'
    });
    expect(ids(result)).toEqual([1, 3]);
    const times = result.map((p) => p.createdAt);
    expect(times).toEqual([100, 300]);
  });
});
