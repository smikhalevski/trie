import {createTrie, searchTrie, setTrie} from '../main';

describe('searchTrie', () => {

  test('finds a trie with zero-length word', () => {
    const trie = createTrie();
    setTrie(trie, '', 111);

    expect(searchTrie(trie, '', 0)).toBe(trie);
  });

  test('finds a trie with one entry', () => {
    const trie = createTrie();
    setTrie(trie, 'abc', 111);

    expect(searchTrie(trie, 'abc', 0)).toBe(trie);
  });

  test('finds a trie with two leaf entries', () => {
    const trie = createTrie();
    setTrie(trie, 'abc', 111);
    setTrie(trie, 'abd', 222);

    const leaf = searchTrie(trie, 'abd', 0);

    expect(leaf).toBe(trie.next![0].next![0].next![1]);
  });

  test('finds a trie with deep char entries', () => {
    const trie = createTrie();
    setTrie(trie, 'abc', 111);
    setTrie(trie, 'abdef', 222);

    const leaf = searchTrie(trie, 'abdef', 0);

    expect(leaf).toBe(trie.next![0].next![0].next![1]);
  });

  test('finds a trie at startIndex', () => {
    const trie = createTrie();
    setTrie(trie, 'abc', 111);
    setTrie(trie, 'abdef', 222);

    const leaf = searchTrie(trie, 'qqqabdef', 3);

    expect(leaf).toBe(trie.next![0].next![0].next![1]);
  });

  test('finds a trie with length limited by endIndex', () => {
    const trie = createTrie();
    setTrie(trie, 'ab', 111);
    setTrie(trie, 'abc', 222);

    const leaf = searchTrie(trie, 'abc', 0, 2);

    expect(leaf).toBe(trie.next![0].next![0]);
  });

  test('finds the trie with the longest word', () => {
    const trie = createTrie();
    setTrie(trie, 'abc', 111);
    setTrie(trie, 'abcdef', 222);

    const leaf = searchTrie(trie, 'abcdef', 0);

    expect(leaf).toBe(trie.next![0].next![0].next![0].next![0]);
  });

  test('finds the trie with the shortest matched word', () => {
    const trie = createTrie();
    setTrie(trie, 'abc', 111);
    setTrie(trie, 'abcdef', 222);

    const leaf = searchTrie(trie, 'abcdeZZZ', 0);

    expect(leaf).toBe(trie.next![0].next![0].next![0]);
  });

  test('finds the trie with the shortest word on string end', () => {
    const trie = createTrie();
    setTrie(trie, 'abc', 111);
    setTrie(trie, 'abcdef', 222);

    const leaf = searchTrie(trie, 'abcde', 0);

    expect(leaf).toBe(trie.next![0].next![0].next![0]);
  });

  test('returns undefined if no trie was found', () => {
    const trie = createTrie();
    setTrie(trie, 'abc', 111);
    setTrie(trie, 'abdef', 222);

    const leaf = searchTrie(trie, 'abe', 0);

    expect(leaf).toBe(undefined);
  });

  test('returns undefined for a non-matching leaf root', () => {
    const trie = createTrie();
    setTrie(trie, 'abcd', 111);

    expect(searchTrie(trie, 'abc', 0)).toBe(undefined);
  });

  test('returns root for a matching leaf root', () => {
    const trie = createTrie();
    setTrie(trie, 'abc', 111);

    expect(searchTrie(trie, 'abc', 0)).toBe(trie);
  });
});
