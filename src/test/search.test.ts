import { createSearch, createTrie, search, setValue, Trie } from '../main';

const A = 'a'.charCodeAt(0);
const B = 'b'.charCodeAt(0);
const C = 'c'.charCodeAt(0);
const D = 'd'.charCodeAt(0);

describe('search', () => {
  let trie: Trie<any>;

  beforeEach(() => {
    trie = createTrie();
  });

  test('finds a trie with zero-length key', () => {
    setValue(trie, '', 111);

    expect(search(trie, '', 0)).toBe(trie);
  });

  test('finds a trie using a char code getter', () => {
    setValue(trie, 'abc', 111);

    const search = createSearch((str, index) => str.toLowerCase().charCodeAt(index));

    expect(search(trie, 'ABC', 0, 3)).toBe(trie[A]);
  });

  test('finds a trie with one entry', () => {
    setValue(trie, 'abc', 111);

    expect(search(trie, 'abc', 0)).toBe(trie[A]);
  });

  test('finds a trie with two leaf entries', () => {
    setValue(trie, 'abc', 111);
    setValue(trie, 'abd', 222);

    expect(search(trie, 'abd', 0)).toBe(trie[A]![B]![D]!);
  });

  test('finds the trie with the longest key', () => {
    setValue(trie, 'abc', 111);
    setValue(trie, 'abcdef', 222);

    expect(search(trie, 'abcdef', 0)).toBe(trie[A]![B]![C]![D]!);
  });

  test('finds a trie at startIndex', () => {
    setValue(trie, 'abc', 111);
    setValue(trie, 'abdef', 222);

    expect(search(trie, 'qqqabdef', 3)).toBe(trie[A]![B]![D]!);
  });

  test('finds the trie with the shortest matched key', () => {
    setValue(trie, 'abc', 111);
    setValue(trie, 'abcdef', 222);

    expect(search(trie, 'abcdeZZZ', 0)).toBe(trie[A]![B]![C]!);
  });

  test('finds the trie with the shortest key on string end', () => {
    setValue(trie, 'abc', 111);
    setValue(trie, 'abcdef', 222);

    expect(search(trie, 'abcde', 0)).toBe(trie[A]![B]![C]!);
  });

  test('returns null when searching for an empty key in an empty trie', () => {
    expect(search(trie, '', 0)).toBe(null);
  });

  test('returns null if no trie was found', () => {
    setValue(trie, 'abc', 111);
    setValue(trie, 'abdef', 222);

    expect(search(trie, 'abe', 0)).toBe(null);
  });

  test('returns null for a non-matching leaf root', () => {
    setValue(trie, 'abcd', 111);

    expect(search(trie, 'abc', 0)).toBe(null);
  });
});
