import {createTrie, searchTrie, setTrie} from '../main';

const A = 'a'.charCodeAt(0);
const B = 'b'.charCodeAt(0);
const C = 'c'.charCodeAt(0);
const D = 'd'.charCodeAt(0);

describe('searchTrie', () => {

  test('finds a trie with zero-length key', () => {
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

    expect(leaf).toBe(trie.next![A]!.next![B]!.next![D]!);
  });

  test('finds the trie with the longest key', () => {
    const trie = createTrie();
    setTrie(trie, 'abc', 111);
    setTrie(trie, 'abcdef', 222);

    const leaf = searchTrie(trie, 'abcdef', 0);

    expect(leaf).toBe(trie.next![A]!.next![B]!.next![C]!.next![D]!);
  });

  test('finds a trie at startIndex', () => {
    const trie = createTrie();
    setTrie(trie, 'abc', 111);
    setTrie(trie, 'abdef', 222);

    const leaf = searchTrie(trie, 'qqqabdef', 3);

    expect(leaf).toBe(trie.next![A]!.next![B]!.next![D]!);
  });

  test('finds the trie with the shortest matched key', () => {
    const trie = createTrie();
    setTrie(trie, 'abc', 111);
    setTrie(trie, 'abcdef', 222);

    const leaf = searchTrie(trie, 'abcdeZZZ', 0);

    expect(leaf).toBe(trie.next![A]!.next![B]!.next![C]!);
  });

  test('finds the trie with the shortest key on string end', () => {
    const trie = createTrie();
    setTrie(trie, 'abc', 111);
    setTrie(trie, 'abcdef', 222);

    const leaf = searchTrie(trie, 'abcde', 0);

    expect(leaf).toBe(trie.next![A]!.next![B]!.next![C]!);
  });

  test('returns null if no trie was found', () => {
    const trie = createTrie();
    setTrie(trie, 'abc', 111);
    setTrie(trie, 'abdef', 222);

    const leaf = searchTrie(trie, 'abe', 0);

    expect(leaf).toBe(null);
  });

  test('returns null for a non-matching leaf root', () => {
    const trie = createTrie();
    setTrie(trie, 'abcd', 111);

    expect(searchTrie(trie, 'abc', 0)).toBe(null);
  });

  test('returns root for a matching leaf root', () => {
    const trie = createTrie();
    setTrie(trie, 'abc', 111);

    expect(searchTrie(trie, 'abc', 0)).toBe(trie);
  });
});
