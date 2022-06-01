import {trieCreate, trieGet, trieSetEntries} from '../main';

describe('trieSetEntries', () => {

  test('sets all values from entries', () => {
    const trie = trieCreate();
    trieSetEntries(trie, [['abc', 111], ['abd', 222]]);

    expect(trieGet(trie, 'abc')).toBe(trie.next![0]!.next![0]!.next![0]);
    expect(trieGet(trie, 'abd')).toBe(trie.next![0]!.next![0]!.next![1]);
  });
});
