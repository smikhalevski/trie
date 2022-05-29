import {createTrie, searchTrie, setAllTrie} from '../main';

describe('setAllTrie', () => {

  test('sets all values from entries', () => {
    const trie = createTrie();
    setAllTrie(trie, [['abc', 111], ['abd', 222]]);

    expect(searchTrie(trie, 'abc', 0)).toBe(trie.next![0]!.next![0]!.next![0]);
    expect(searchTrie(trie, 'abd', 0)).toBe(trie.next![0]!.next![0]!.next![1]);
  });
});
