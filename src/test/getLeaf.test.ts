import { createTrie, getLeaf, setValue, Trie } from '../main';

describe('getLeaf', () => {
  let trie: Trie;

  beforeEach(() => {
    trie = createTrie();
  });

  test('returns the leaf by key', () => {
    const leaf = setValue(trie, 'abc', 111);

    expect(getLeaf(trie, 'abc')).toBe(leaf);
  });

  test('returns null if key does not exist in the trie', () => {
    expect(getLeaf(trie, 'abc')).toBe(null);
  });
});
