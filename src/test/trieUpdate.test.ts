import { Trie, trieCreate, trieSet, trieUpdate } from '../main';

describe('trieUpdate', () => {
  let trie: Trie<any>;

  beforeEach(() => {
    trie = trieCreate();
  });

  test('updates the existing leaf', () => {
    const leaf = trieSet(trie, 'abc', 111);

    expect(trieUpdate(trie, 'abc', 222)).toBe(leaf);
    expect(leaf.value).toBe(222);
  });

  test('returns null if leaf does not exist', () => {
    expect(trieUpdate(trie, 'abc', 222)).toBe(null);
  });
});
