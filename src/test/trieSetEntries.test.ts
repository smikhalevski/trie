import {trieCreate, trieGet, trieSetEntries} from '../main';

const A = 'a'.charCodeAt(0);
const B = 'b'.charCodeAt(0);
const C = 'c'.charCodeAt(0);
const D = 'd'.charCodeAt(0);

describe('trieSetEntries', () => {

  test('sets all values from entries', () => {
    const trie = trieCreate();
    trieSetEntries(trie, [
      ['abc', 111],
      ['abd', 222],
    ]);

    expect(trieGet(trie, 'abc')).toBe(trie.next![A]!.next![B]!.next![C]);
    expect(trieGet(trie, 'abd')).toBe(trie.next![A]!.next![B]!.next![D]);
  });
});
