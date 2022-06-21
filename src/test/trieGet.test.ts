import {Trie, trieCreate, trieGet, trieSet} from '../main';

describe('trieGet', () => {

  let trie: Trie<any>;

  beforeEach(() => {
    trie = trieCreate();
  });

  test('returns the leaf by key', () => {
    const leaf = trieSet(trie, 'abc', 111);

    expect(trieGet(trie, 'abc')).toBe(leaf);
  });

  test('returns null if key does not exist in the trie', () => {
    expect(trieGet(trie, 'abc')).toBe(null);
  });
});
