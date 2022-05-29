import {createTrie, setTrie, Trie} from '../main';

describe('setTrie', () => {

  test('preserves ascending order of char codes in next*', () => {
    const trie = createTrie<number>();
    setTrie(trie, 'b', 222);
    setTrie(trie, 'c', 333);
    setTrie(trie, 'a', 111);
    setTrie(trie, 'd', 444);

    expect(trie.nextCharCodes).toEqual([97, 98, 99, 100]);
  });

  test('sets an empty word to a trie', () => {
    const trie = createTrie();
    setTrie(trie, '', 111);

    expect(trie).toEqual(<Trie<number>>{
      prev: null,
      leafCharCodes: null,
      word: '',
      value: 111,
      length: 0,
      isLeaf: true,
      nextCharCodes: null,
      next: null,
    });
  });

  test('sets an empty word and a non-empty word to a trie', () => {
    const trie = createTrie<number>();
    setTrie(trie, '', 111);
    setTrie(trie, 'a', 222);

    const expectedTrie: Trie<number> = {
      prev: null,
      leafCharCodes: null,
      word: '',
      value: 111,
      length: 0,
      isLeaf: true,
      nextCharCodes: [97],
      next: [
        {
          prev: null,
          leafCharCodes: null,
          word: 'a',
          value: 222,
          length: 1,
          isLeaf: true,
          nextCharCodes: null,
          next: null,
        }
      ],
    };

    expectedTrie.next![0].prev = trie;

    expect(trie).toEqual(expectedTrie);
  });

  test('sets the value to an empty trie', () => {
    const trie = createTrie();
    setTrie(trie, 'abc', 111);

    expect(trie).toEqual(<Trie<number>>{
      prev: null,
      leafCharCodes: [97, 98, 99],
      word: 'abc',
      value: 111,
      length: 3,
      isLeaf: true,
      nextCharCodes: null,
      next: null,
    });
  });

  test('sets the value to an non-empty trie', () => {
    const trie = createTrie<number>();
    setTrie(trie, 'abc', 111);
    setTrie(trie, 'ade', 222);

    const expectedTrie: Trie<number> = {
      prev: null,
      word: null,
      value: undefined,
      leafCharCodes: null,
      length: 0,
      isLeaf: false,
      nextCharCodes: [97],
      next: [
        {
          prev: null,
          word: null,
          value: undefined,
          leafCharCodes: null,
          length: 1,
          isLeaf: false,
          nextCharCodes: [98, 100],
          next: [
            {
              prev: null,
              leafCharCodes: [99],
              word: 'abc',
              value: 111,
              length: 3,
              isLeaf: true,
              nextCharCodes: null,
              next: null,
            },
            {
              prev: null,
              leafCharCodes: [101],
              word: 'ade',
              value: 222,
              length: 3,
              isLeaf: true,
              nextCharCodes: null,
              next: null,
            }
          ],
        }
      ],
    };

    expectedTrie.next![0].prev = trie;

    expectedTrie.next![0].next![0].prev = expectedTrie.next![0];
    expectedTrie.next![0].next![1].prev = expectedTrie.next![0];

    expect(trie).toEqual(expectedTrie);
  });

  test('sets the value to a deep trie trie', () => {
    const trie = createTrie<number>();
    setTrie(trie, 'abc', 111);
    setTrie(trie, 'ade', 222);
    setTrie(trie, 'abf', 333);

    const expectedTrie: Trie<number> = {
      prev: null,
      leafCharCodes: null,
      word: null,
      value: undefined,
      length: 0,
      isLeaf: false,
      nextCharCodes: [97],
      next: [
        {
          prev: null,
          leafCharCodes: null,
          word: null,
          value: undefined,
          length: 1,
          isLeaf: false,
          nextCharCodes: [98, 100],
          next: [
            {
              prev: null,
              leafCharCodes: null,
              word: null,
              value: undefined,
              length: 2,
              isLeaf: false,
              nextCharCodes: [99, 102],
              next: [
                {
                  prev: null,
                  leafCharCodes: null,
                  word: 'abc',
                  value: 111,
                  length: 3,
                  isLeaf: true,
                  nextCharCodes: null,
                  next: null,
                },
                {
                  prev: null,
                  leafCharCodes: null,
                  word: 'abf',
                  value: 333,
                  length: 3,
                  isLeaf: true,
                  nextCharCodes: null,
                  next: null,
                }
              ],
            },
            {
              prev: null,
              leafCharCodes: [101],
              word: 'ade',
              value: 222,
              length: 3,
              isLeaf: true,
              nextCharCodes: null,
              next: null,
            }
          ],
        }
      ],
    };

    expectedTrie.next![0].prev = trie;

    expectedTrie.next![0].next![0].prev = expectedTrie.next![0];
    expectedTrie.next![0].next![1].prev = expectedTrie.next![0];

    expectedTrie.next![0].next![0].next![0].prev = expectedTrie.next![0].next![0];
    expectedTrie.next![0].next![0].next![1].prev = expectedTrie.next![0].next![0];

    expect(trie).toEqual(expectedTrie);
  });

  test('preserves overlapping words', () => {
    const trie = createTrie<number>();
    setTrie(trie, 'abc', 111);
    setTrie(trie, 'abcdef', 222);

    const expectedTrie: Trie<number> = {
      prev: null,
      word: null,
      value: undefined,
      leafCharCodes: null,
      length: 0,
      isLeaf: false,
      nextCharCodes: [97],
      next: [
        {
          prev: null,
          word: null,
          value: undefined,
          leafCharCodes: null,
          length: 1,
          isLeaf: false,
          nextCharCodes: [98],
          next: [
            {
              prev: null,
              word: null,
              value: undefined,
              leafCharCodes: null,
              length: 2,
              isLeaf: false,
              nextCharCodes: [99],
              next: [
                {
                  prev: null,
                  word: 'abc',
                  value: 111,
                  leafCharCodes: null,
                  length: 3,
                  isLeaf: true,
                  nextCharCodes: [100],
                  next: [
                    {
                      prev: null,
                      word: 'abcdef',
                      value: 222,
                      leafCharCodes: [101, 102],
                      length: 6,
                      isLeaf: true,
                      nextCharCodes: null,
                      next: null,
                    }
                  ],
                }
              ],
            }
          ],
        }
      ],
    };

    expectedTrie.next![0].prev = trie;

    expectedTrie.next![0].next![0].prev = expectedTrie.next![0];

    expectedTrie.next![0].next![0].next![0].prev = expectedTrie.next![0].next![0];

    expectedTrie.next![0].next![0].next![0].next![0].prev = expectedTrie.next![0].next![0].next![0];

    expect(trie).toEqual(expectedTrie);
  });

  test('sets the shorter word after longer word', () => {
    const trie = createTrie<number>();
    setTrie(trie, 'abc', 111);
    setTrie(trie, 'abcdef', 222);
    setTrie(trie, 'abcde', 333);

    const expectedTrie: Trie<number> = {
      prev: null,
      word: null,
      value: undefined,
      length: 0,
      leafCharCodes: null,
      isLeaf: false,
      nextCharCodes: [97],
      next: [
        {
          prev: null,
          word: null,
          value: undefined,
          length: 1,
          leafCharCodes: null,
          isLeaf: false,
          nextCharCodes: [98],
          next: [
            {
              prev: null,
              word: null,
              value: undefined,
              length: 2,
              leafCharCodes: null,
              isLeaf: false,
              nextCharCodes: [99],
              next: [
                {
                  prev: null,
                  word: 'abc',
                  value: 111,
                  length: 3,
                  leafCharCodes: null,
                  isLeaf: true,
                  nextCharCodes: [100],
                  next: [
                    {
                      prev: null,
                      word: null,
                      value: undefined,
                      length: 4,
                      leafCharCodes: null,
                      isLeaf: false,
                      nextCharCodes: [101],
                      next: [
                        {
                          prev: null,
                          word: 'abcde',
                          value: 333,
                          length: 5,
                          leafCharCodes: null,
                          isLeaf: true,
                          nextCharCodes: [102],
                          next: [
                            {
                              prev: null,
                              word: 'abcdef',
                              value: 222,
                              length: 6,
                              leafCharCodes: null,
                              next: null,
                              nextCharCodes: null,
                              isLeaf: true,
                            }
                          ],
                        }
                      ],
                    }
                  ],
                }
              ],
            }
          ],
        }
      ],
    };

    expectedTrie.next![0].prev = trie;

    expectedTrie.next![0].next![0].prev = expectedTrie.next![0];

    expectedTrie.next![0].next![0].next![0].prev = expectedTrie.next![0].next![0];

    expectedTrie.next![0].next![0].next![0].next![0].prev = expectedTrie.next![0].next![0].next![0];

    expectedTrie.next![0].next![0].next![0].next![0].next![0].prev = expectedTrie.next![0].next![0].next![0].next![0];

    expectedTrie.next![0].next![0].next![0].next![0].next![0].next![0].prev = expectedTrie.next![0].next![0].next![0].next![0].next![0];

    expect(trie).toEqual(expectedTrie);
  });
});
