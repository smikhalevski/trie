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

    const leaf = trieSearch(trie, 'abd', 0);

    expect(leaf).toBe(trie.next![A]!.next![B]!.next![D]!);
  });

  test('finds the trie with the longest key', () => {
    const trie = trieCreate();
    trieSet(trie, 'abc', 111);
    trieSet(trie, 'abcdef', 222);

    const leaf = trieSearch(trie, 'abcdef', 0);

    expect(leaf).toBe(trie.next![A]!.next![B]!.next![C]!.next![D]!);
  });

  test('finds a trie at startIndex', () => {
    const trie = trieCreate();
    trieSet(trie, 'abc', 111);
    trieSet(trie, 'abdef', 222);

    const leaf = trieSearch(trie, 'qqqabdef', 3);

    expect(leaf).toBe(trie.next![A]!.next![B]!.next![D]!);
  });

  test('finds the trie with the shortest matched key', () => {
    const trie = trieCreate();
    trieSet(trie, 'abc', 111);
    trieSet(trie, 'abcdef', 222);

    const leaf = trieSearch(trie, 'abcdeZZZ', 0);

    expect(leaf).toBe(trie.next![A]!.next![B]!.next![C]!);
  });

  test('finds the trie with the shortest key on string end', () => {
    const trie = trieCreate();
    trieSet(trie, 'abc', 111);
    trieSet(trie, 'abcdef', 222);

    const leaf = trieSearch(trie, 'abcde', 0);

    expect(leaf).toBe(trie.next![A]!.next![B]!.next![C]!);
  });

  test('returns undefined if no trie was found', () => {
    const trie = trieCreate();
    trieSet(trie, 'abc', 111);
    trieSet(trie, 'abdef', 222);

    const leaf = trieSearch(trie, 'abe', 0);

    expect(leaf).toBe(undefined);
  });

  test('returns undefined for a non-matching leaf root', () => {
    const trie = trieCreate();
    trieSet(trie, 'abcd', 111);

    expect(trieSearch(trie, 'abc', 0)).toBe(undefined);
  });

  test('returns root for a matching leaf root', () => {
    const trie = trieCreate();
    trieSet(trie, 'abc', 111);

    expect(trieSearch(trie, 'abc', 0)).toBe(trie);
  });
});
