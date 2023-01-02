import { Trie, trieCreate, arrayTrieCreate, arrayTrieSearch, trieSet } from '../main';

describe('arrayTrieSearch', () => {
  let trie: Trie<any>;

  beforeEach(() => {
    trie = trieCreate();
  });

  test('adds value', () => {
    trieSet(trie, 'a', 111);

    const encodedTrie = arrayTrieCreate(trie);

    expect(arrayTrieSearch(encodedTrie, 'a')).toEqual([111, 1]);
  });

  test('adds two values', () => {
    trieSet(trie, 'a', 111);
    trieSet(trie, 'b', 222);

    const encodedTrie = arrayTrieCreate(trie);

    expect(arrayTrieSearch(encodedTrie, 'a')).toEqual([111, 1]);
    expect(arrayTrieSearch(encodedTrie, 'b')).toEqual([222, 1]);
  });

  test('adds two values with common prefix', () => {
    trieSet(trie, 'aa', 111);
    trieSet(trie, 'ab', 222);

    const encodedTrie = arrayTrieCreate(trie);

    expect(arrayTrieSearch(encodedTrie, 'aa')).toEqual([111, 2]);
    expect(arrayTrieSearch(encodedTrie, 'ab')).toEqual([222, 2]);
  });

  test('adds short and long values', () => {
    trieSet(trie, 'aa', 111);
    trieSet(trie, 'aab', 222);

    const encodedTrie = arrayTrieCreate(trie);

    expect(arrayTrieSearch(encodedTrie, 'aa')).toEqual([111, 2]);
    expect(arrayTrieSearch(encodedTrie, 'aac')).toEqual([111, 2]);
    expect(arrayTrieSearch(encodedTrie, 'aab')).toEqual([222, 3]);
    expect(arrayTrieSearch(encodedTrie, 'aabd')).toEqual([222, 3]);
  });
});
