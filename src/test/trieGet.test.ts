import {trieCreate, trieGet, trieSet} from '../main';

const A = 'a'.charCodeAt(0);
const B = 'b'.charCodeAt(0);
const C = 'c'.charCodeAt(0);
const D = 'd'.charCodeAt(0);

describe('trieGet', () => {

  test('returns the leaf that matches the key exactly', () => {
    const trie = trieCreate();
    trieSet(trie, 'abc', 111);
    trieSet(trie, 'abdef', 222);

    expect(trieGet(trie, 'abc')).toBe(trie[A]![B]![C]);
    expect(trieGet(trie, 'abdef')).toBe(trie[A]![B]![D]);
  });

  test('returns undefined is the key not found', () => {
    const trie = trieCreate();
    trieSet(trie, 'abc', 111);
    trieSet(trie, 'abdef', 222);

    expect(trieGet(trie, 'abd')).toBe(undefined);
  });
});