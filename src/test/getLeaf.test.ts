import { createTrie, getNode, setValue, Node } from '../main';

describe('getNode', () => {
  let trie: Node;

  beforeEach(() => {
    trie = createTrie();
  });

  test('returns the leaf by key', () => {
    const leaf = setValue(trie, 'abc', 111);

    expect(getNode(trie, 'abc')).toBe(leaf);
  });

  test('returns null if key does not exist in the trie', () => {
    expect(getNode(trie, 'abc')).toBe(null);
  });
});
