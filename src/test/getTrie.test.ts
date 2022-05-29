import {createTrie, getTrie, setTrie} from '../main';

describe('getTrie', () => {

  test('returns the leaf that matches the key exactly', () => {
    const trie = createTrie();
    setTrie(trie, 'abc', 111);
    setTrie(trie, 'abdef', 222);

    expect(getTrie(trie, 'abc')).toBe(trie.next![0]!.next![0]!.next![0]);
    expect(getTrie(trie, 'abdef')).toBe(trie.next![0]!.next![0]!.next![1]);
    expect(getTrie(trie, 'abd')).toBeUndefined();
  });
});
