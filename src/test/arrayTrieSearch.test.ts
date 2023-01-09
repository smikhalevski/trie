import { arrayTrieEncode, arrayTrieSearch, Trie, trieCreate, trieSet } from '../main';
import dictionary from './dictionary.json';

describe('arrayTrieSearch', () => {
  let trie: Trie<any>;

  beforeEach(() => {
    trie = trieCreate();
  });

  test('finds a key for a root leaf', () => {
    trieSet(trie, '', 111);

    const arrayTrie = arrayTrieEncode(trie);

    expect(arrayTrieSearch(arrayTrie, '')).toEqual({ value: 111, lastIndex: 0 });
  });

  test('finds a key for a single leaf', () => {
    trieSet(trie, 'a', 111);

    const arrayTrie = arrayTrieEncode(trie);

    expect(arrayTrieSearch(arrayTrie, 'a')).toEqual({ value: 111, lastIndex: 1 });
  });

  test('finds a key for multiple values', () => {
    trieSet(trie, 'a', 111);
    trieSet(trie, 'b', 222);

    const arrayTrie = arrayTrieEncode(trie);

    expect(arrayTrieSearch(arrayTrie, 'a')).toEqual({ value: 111, lastIndex: 1 });
    expect(arrayTrieSearch(arrayTrie, 'b')).toEqual({ value: 222, lastIndex: 1 });
  });

  test('finds keys with common prefix', () => {
    trieSet(trie, 'aa', 111);
    trieSet(trie, 'ab', 222);

    const arrayTrie = arrayTrieEncode(trie);

    expect(arrayTrieSearch(arrayTrie, 'aa')).toEqual({ value: 111, lastIndex: 2 });
    expect(arrayTrieSearch(arrayTrie, 'ab')).toEqual({ value: 222, lastIndex: 2 });
  });

  test('finds a key with leaf chars', () => {
    trieSet(trie, 'aab', 111);

    const arrayTrie = arrayTrieEncode(trie);

    expect(arrayTrieSearch(arrayTrie, 'aab')).toEqual({ value: 111, lastIndex: 3 });
  });

  test('finds keys that fully intersect', () => {
    trieSet(trie, 'aa', 111);
    trieSet(trie, 'aab', 222);

    const arrayTrie = arrayTrieEncode(trie);

    expect(arrayTrieSearch(arrayTrie, 'aa')).toEqual({ value: 111, lastIndex: 2 });
    expect(arrayTrieSearch(arrayTrie, 'aac')).toEqual({ value: 111, lastIndex: 2 });
    expect(arrayTrieSearch(arrayTrie, 'aab')).toEqual({ value: 222, lastIndex: 3 });
    expect(arrayTrieSearch(arrayTrie, 'aabd')).toEqual({ value: 222, lastIndex: 3 });
  });

  test('finds keys with common prefix and siblings', () => {
    trieSet(trie, 'a', 111);
    trieSet(trie, 'ab', 222);
    trieSet(trie, 'ac', 333);

    const arrayTrie = arrayTrieEncode(trie);

    expect(arrayTrieSearch(arrayTrie, 'a')).toEqual({ value: 111, lastIndex: 1 });
    expect(arrayTrieSearch(arrayTrie, 'ab')).toEqual({ value: 222, lastIndex: 2 });
    expect(arrayTrieSearch(arrayTrie, 'ac')).toEqual({ value: 333, lastIndex: 2 });
  });

  test('works with a huge dictionary', () => {
    dictionary.forEach(key => {
      trieSet(trie, key, key);
    });

    const arrayTrie = arrayTrieEncode(trie);

    dictionary.forEach(key => {
      expect(arrayTrieSearch(arrayTrie, key)).toEqual({ value: key, lastIndex: key.length });
    });
  });
});
