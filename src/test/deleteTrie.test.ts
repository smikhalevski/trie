import {createTrie, deleteTrie, setTrie, Trie} from '../main';

describe('deleteTrie', () => {

  test('returns false if key is not found', () => {
    const trie = createTrie();
    setTrie(trie, 'abcd', 111);

    expect(deleteTrie(trie, 'abc')).toBe(false);
  });

  test('returns true if key was deleted', () => {
    const trie = createTrie();
    setTrie(trie, 'abc', 111);

    expect(deleteTrie(trie, 'abc')).toBe(true);
    expect(deleteTrie(trie, 'abc')).toBe(false);
  });

  test('deletes by an empty key', () => {
    const trie = createTrie();
    setTrie(trie, '', 111);
    deleteTrie(trie, '');

    expect(trie).toEqual(<Trie<number>>{
      prev: null,
      leafCharCodes: null,
      key: null,
      value: undefined,
      length: 0,
      isLeaf: false,
      nextCharCodes: null,
      next: null,
    });
  });

  test('flattens the tree after deleting an intermediate leaf', () => {
    const trie = createTrie<number>();
    setTrie(trie, 'ab', 111);
    setTrie(trie, 'abc', 222);
    deleteTrie(trie, 'ab');

    expect(trie).toEqual(<Trie<number>>{
      prev: null,
      key: 'abc',
      value: 222,
      leafCharCodes: [97, 98, 99],
      length: 3,
      isLeaf: true,
      nextCharCodes: null,
      next: null,
    });
  });

  test('deletes an intermediate leaf', () => {
    const trie = createTrie<number>();
    setTrie(trie, 'ab', 111);
    setTrie(trie, 'abc', 222);
    setTrie(trie, 'abd', 333);
    deleteTrie(trie, 'ab');

    const expectedTrie: Trie<number> = {
      prev: null,
      key: null,
      value: undefined,
      leafCharCodes: null,
      length: 0,
      isLeaf: false,
      nextCharCodes: [97],
      next: [
        {
          prev: null,
          key: null,
          value: undefined,
          leafCharCodes: null,
          length: 1,
          isLeaf: false,
          nextCharCodes: [98],
          next: [
            {
              prev: null,
              key: null, // 'ab' was here
              value: undefined,
              leafCharCodes: null,
              length: 2,
              isLeaf: false,
              nextCharCodes: [99, 100],
              next: [
                {
                  prev: null,
                  key: 'abc',
                  value: 222,
                  leafCharCodes: null,
                  length: 3,
                  isLeaf: true,
                  nextCharCodes: null,
                  next: null,
                },
                {
                  prev: null,
                  key: 'abd',
                  value: 333,
                  leafCharCodes: null,
                  length: 3,
                  isLeaf: true,
                  nextCharCodes: null,
                  next: null,
                },
              ],
            },
          ],
        },
      ],
    };

    expectedTrie.next![0].prev = trie;

    expectedTrie.next![0].next![0].prev = expectedTrie.next![0];

    expectedTrie.next![0].next![0].next![0].prev = expectedTrie.next![0].next![0];
    expectedTrie.next![0].next![0].next![1].prev = expectedTrie.next![0].next![0];

    expect(trie).toEqual(expectedTrie);
  });

  test('deletes a leaf that has siblings', () => {
    const trie = createTrie<number>();
    setTrie(trie, 'ab', 111);
    setTrie(trie, 'abc', 222);
    setTrie(trie, 'abd', 333);
    deleteTrie(trie, 'abd');

    const expectedTrie: Trie<number> = {
      prev: null,
      key: null,
      value: undefined,
      leafCharCodes: null,
      length: 0,
      isLeaf: false,
      nextCharCodes: [97],
      next: [
        {
          prev: null,
          key: null,
          value: undefined,
          leafCharCodes: null,
          length: 1,
          isLeaf: false,
          nextCharCodes: [98],
          next: [
            {
              prev: null,
              key: 'ab',
              value: 111,
              leafCharCodes: null,
              length: 2,
              isLeaf: true,
              nextCharCodes: [99],
              next: [
                {
                  prev: null,
                  key: 'abc',
                  value: 222,
                  leafCharCodes: null,
                  length: 3,
                  isLeaf: true,
                  nextCharCodes: null,
                  next: null,
                },
                // 'abd' was here
              ],
            },
          ],
        },
      ],
    };

    expectedTrie.next![0].prev = trie;

    expectedTrie.next![0].next![0].prev = expectedTrie.next![0];

    expectedTrie.next![0].next![0].next![0].prev = expectedTrie.next![0].next![0];

    expect(trie).toEqual(expectedTrie);
  });
});
