import {trieCreate, trieSearch, trieSet} from '../main';

const A = 'a'.charCodeAt(0);
const B = 'b'.charCodeAt(0);
const C = 'c'.charCodeAt(0);
const D = 'd'.charCodeAt(0);

describe('trieSearch', () => {

  test('finds a trie with zero-length key', () => {
    const trie = trieCreate();
    trieSet(trie, '', 111);

    expect(trieSearch(trie, '', 0)).toBe(trie);
  });

  test('finds a trie with one entry', () => {
    const trie = trieCreate();
    trieSet(trie, 'abc', 111);

    expect(trieSearch(trie, 'abc', 0)).toBe(trie);
  });

  test('finds a trie with two leaf entries', () => {
    const trie = trieCreate();
    trieSet(trie, 'abc', 111);
    trieSet(trie, 'abd', 222);

    expect(trieSearch(trie, 'abd', 0)).toBe(trie[A]![B]![D]!);
  });

  test('finds the trie with the longest key', () => {
    const trie = trieCreate();
    trieSet(trie, 'abc', 111);
    trieSet(trie, 'abcdef', 222);

    expect(trieSearch(trie, 'abcdef', 0)).toBe(trie[A]![B]![C]![D]!);
  });

  test('finds a trie at startIndex', () => {
    const trie = trieCreate();
    trieSet(trie, 'abc', 111);
    trieSet(trie, 'abdef', 222);

    expect(trieSearch(trie, 'qqqabdef', 3)).toBe(trie[A]![B]![D]!);
  });

  test('finds the trie with the shortest matched key', () => {
    const trie = trieCreate();
    trieSet(trie, 'abc', 111);
    trieSet(trie, 'abcdef', 222);

    expect(trieSearch(trie, 'abcdeZZZ', 0)).toBe(trie[A]![B]![C]!);
  });

  test('finds the trie with the shortest key on string end', () => {
    const trie = trieCreate();
    trieSet(trie, 'abc', 111);
    trieSet(trie, 'abcdef', 222);

    expect(trieSearch(trie, 'abcde', 0)).toBe(trie[A]![B]![C]!);
  });

  test('returns null when searching for an empty key in an empty trie', () => {
    const trie = trieCreate();

    expect(trieSearch(trie, '', 0)).toBe(null);
  });

  test('returns null if no trie was found', () => {
    const trie = trieCreate();
    trieSet(trie, 'abc', 111);
    trieSet(trie, 'abdef', 222);

    expect(trieSearch(trie, 'abe', 0)).toBe(null);
  });

  test('returns null for a non-matching leaf root', () => {
    const trie = trieCreate();
    trieSet(trie, 'abcd', 111);

    expect(trieSearch(trie, 'abc', 0)).toBe(null);
  });
});
