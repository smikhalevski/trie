import { arrayTrieEncode, arrayTrieGet, Trie, trieCreate, trieSet } from '../main';

describe('arrayTrieGet', () => {
  let trie: Trie<any>;

  beforeEach(() => {
    trie = trieCreate();
  });

  test('finds a key for a root leaf', () => {
    trieSet(trie, '', 111);

    const arrayTrie = arrayTrieEncode(trie);

    expect(arrayTrieGet(arrayTrie, '')).toBe(111);
  });

  test('finds a key for a single leaf', () => {
    trieSet(trie, 'a', 111);

    const arrayTrie = arrayTrieEncode(trie);

    expect(arrayTrieGet(arrayTrie, 'a')).toBe(111);
  });

  test('finds a key for multiple values', () => {
    trieSet(trie, 'a', 111);
    trieSet(trie, 'b', 222);

    const arrayTrie = arrayTrieEncode(trie);

    expect(arrayTrieGet(arrayTrie, 'a')).toBe(111);
    expect(arrayTrieGet(arrayTrie, 'b')).toBe(222);
  });

  test('finds keys with common prefix', () => {
    trieSet(trie, 'aa', 111);
    trieSet(trie, 'ab', 222);

    const arrayTrie = arrayTrieEncode(trie);

    expect(arrayTrieGet(arrayTrie, 'aa')).toBe(111);
    expect(arrayTrieGet(arrayTrie, 'ab')).toBe(222);
  });

  test('finds a key with leaf chars', () => {
    trieSet(trie, 'aab', 111);

    const arrayTrie = arrayTrieEncode(trie);

    expect(arrayTrieGet(arrayTrie, 'aab')).toBe(111);
  });

  test('finds keys that fully intersect', () => {
    trieSet(trie, 'aa', 111);
    trieSet(trie, 'aab', 222);

    const arrayTrie = arrayTrieEncode(trie);

    expect(arrayTrieGet(arrayTrie, 'aa')).toBe(111);
    expect(arrayTrieGet(arrayTrie, 'aac')).toBe(null);
    expect(arrayTrieGet(arrayTrie, 'aab')).toBe(222);
    expect(arrayTrieGet(arrayTrie, 'aabd')).toBe(null);
  });

  test('finds keys with common prefix and siblings', () => {
    trieSet(trie, 'a', 111);
    trieSet(trie, 'ab', 222);
    trieSet(trie, 'ac', 333);

    const arrayTrie = arrayTrieEncode(trie);

    expect(arrayTrieGet(arrayTrie, 'a')).toBe(111);
    expect(arrayTrieGet(arrayTrie, 'ab')).toBe(222);
    expect(arrayTrieGet(arrayTrie, 'ac')).toBe(333);
  });
});
