import {createTrie, setTrie, Trie} from '../main';

const A = 'a'.charCodeAt(0);
const B = 'b'.charCodeAt(0);
const C = 'c'.charCodeAt(0);
const D = 'd'.charCodeAt(0);
const E = 'e'.charCodeAt(0);
const F = 'f'.charCodeAt(0);

describe('setTrie', () => {

  test('sets an empty key to a trie', () => {
    const trie = createTrie();
    setTrie(trie, '', 111);

    const expectedTrie: Trie<number> = {
      prev: null,
      leafCharCodes: null,
      key: '',
      value: 111,
      length: 0,
      isLeaf: true,
      next: null,
    };

    expect(trie).toEqual(expectedTrie);
  });

  test('sets an empty key and a non-empty key to a trie', () => {
    const trie = createTrie<number>();
    setTrie(trie, '', 111);
    setTrie(trie, 'a', 222);

    const expectedTrie: Trie<number> = {
      prev: null,
      leafCharCodes: null,
      key: '',
      value: 111,
      length: 0,
      isLeaf: true,
      next: {
        [A]: {
          prev: null,
          leafCharCodes: null,
          key: 'a',
          value: 222,
          length: 1,
          isLeaf: true,
          next: null,
        },
      },
    };

    expectedTrie.next![A]!.prev = trie;

    expect(trie).toEqual(expectedTrie);
  });

  test('sets the value to an empty trie', () => {
    const trie = createTrie();
    setTrie(trie, 'abc', 111);

    const expectedTrie: Trie<number> = {
      prev: null,
      leafCharCodes: [A, B, C],
      key: 'abc',
      value: 111,
      length: 3,
      isLeaf: true,
      next: null,
    };

    expect(trie).toEqual(expectedTrie);
  });

  test('sets the value to an non-empty trie', () => {
    const trie = createTrie<number>();
    setTrie(trie, 'abc', 111);
    setTrie(trie, 'ade', 222);

    const expectedTrie: Trie<number> = {
      prev: null,
      key: null,
      value: undefined,
      leafCharCodes: null,
      length: 0,
      isLeaf: false,
      next: {
        [A]: {
          prev: null,
          key: null,
          value: undefined,
          leafCharCodes: null,
          length: 1,
          isLeaf: false,
          next: {
            [B]: {
              prev: null,
              leafCharCodes: [C],
              key: 'abc',
              value: 111,
              length: 3,
              isLeaf: true,
              next: null,
            },
            [D]: {
              prev: null,
              leafCharCodes: [E],
              key: 'ade',
              value: 222,
              length: 3,
              isLeaf: true,
              next: null,
            }
          },
        },
      },
    };

    expectedTrie.next![A]!.prev = trie;

    expectedTrie.next![A]!.next![B]!.prev = expectedTrie.next![A]!;
    expectedTrie.next![A]!.next![D]!.prev = expectedTrie.next![A]!;

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
      key: null,
      value: undefined,
      length: 0,
      isLeaf: false,
      next: {
        [A]: {
          prev: null,
          leafCharCodes: null,
          key: null,
          value: undefined,
          length: 1,
          isLeaf: false,
          next: {
            [B]: {
              prev: null,
              leafCharCodes: null,
              key: null,
              value: undefined,
              length: 2,
              isLeaf: false,
              next: {
                [C]: {
                  prev: null,
                  leafCharCodes: null,
                  key: 'abc',
                  value: 111,
                  length: 3,
                  isLeaf: true,
                  next: null,
                },
                [F]: {
                  prev: null,
                  leafCharCodes: null,
                  key: 'abf',
                  value: 333,
                  length: 3,
                  isLeaf: true,
                  next: null,
                }
              },
            },
            [D]: {
              prev: null,
              leafCharCodes: [E],
              key: 'ade',
              value: 222,
              length: 3,
              isLeaf: true,
              next: null,
            },
          },
        },
      },
    };

    expectedTrie.next![A]!.prev = trie;

    expectedTrie.next![A]!.next![B]!.prev = expectedTrie.next![A]!;
    expectedTrie.next![A]!.next![D]!.prev = expectedTrie.next![A]!;

    expectedTrie.next![A]!.next![B]!.next![C]!.prev = expectedTrie.next![A]!.next![B]!;
    expectedTrie.next![A]!.next![B]!.next![F]!.prev = expectedTrie.next![A]!.next![B]!;

    expect(trie).toEqual(expectedTrie);
  });

  test('preserves overlapping keys', () => {
    const trie = createTrie<number>();
    setTrie(trie, 'abc', 111);
    setTrie(trie, 'abcdef', 222);

    const expectedTrie: Trie<number> = {
      prev: null,
      key: null,
      value: undefined,
      leafCharCodes: null,
      length: 0,
      isLeaf: false,
      next: {
        [A]: {
          prev: null,
          key: null,
          value: undefined,
          leafCharCodes: null,
          length: 1,
          isLeaf: false,
          next: {
            [B]: {
              prev: null,
              key: null,
              value: undefined,
              leafCharCodes: null,
              length: 2,
              isLeaf: false,
              next: {
                [C]: {
                  prev: null,
                  key: 'abc',
                  value: 111,
                  leafCharCodes: null,
                  length: 3,
                  isLeaf: true,
                  next: {
                    [D]: {
                      prev: null,
                      key: 'abcdef',
                      value: 222,
                      leafCharCodes: [E, F],
                      length: 6,
                      isLeaf: true,
                      next: null,
                    },
                  },
                },
              },
            },
          },
        },
      },
    };

    expectedTrie.next![A]!.prev = trie;

    expectedTrie.next![A]!.next![B]!.prev = expectedTrie.next![A]!;

    expectedTrie.next![A]!.next![B]!.next![C]!.prev = expectedTrie.next![A]!.next![B]!;

    expectedTrie.next![A]!.next![B]!.next![C]!.next![D]!.prev = expectedTrie.next![A]!.next![B]!.next![C]!;

    expect(trie).toEqual(expectedTrie);
  });

  test('sets the shorter key after longer key', () => {
    const trie = createTrie<number>();
    setTrie(trie, 'abc', 111);
    setTrie(trie, 'abcdef', 222);
    setTrie(trie, 'abcde', 333);

    const expectedTrie: Trie<number> = {
      prev: null,
      key: null,
      value: undefined,
      length: 0,
      leafCharCodes: null,
      isLeaf: false,
      next: {
        [A]: {
          prev: null,
          key: null,
          value: undefined,
          length: 1,
          leafCharCodes: null,
          isLeaf: false,
          next: {
            [B]: {
              prev: null,
              key: null,
              value: undefined,
              length: 2,
              leafCharCodes: null,
              isLeaf: false,
              next: {
                [C]: {
                  prev: null,
                  key: 'abc',
                  value: 111,
                  length: 3,
                  leafCharCodes: null,
                  isLeaf: true,
                  next: {
                    [D]: {
                      prev: null,
                      key: null,
                      value: undefined,
                      length: 4,
                      leafCharCodes: null,
                      isLeaf: false,
                      next: {
                        [E]: {
                          prev: null,
                          key: 'abcde',
                          value: 333,
                          length: 5,
                          leafCharCodes: null,
                          isLeaf: true,
                          next: {
                            [F]: {
                              prev: null,
                              key: 'abcdef',
                              value: 222,
                              length: 6,
                              leafCharCodes: null,
                              next: null,
                              isLeaf: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    };

    expectedTrie.next![A]!.prev = trie;

    expectedTrie.next![A]!.next![B]!.prev = expectedTrie.next![A]!;

    expectedTrie.next![A]!.next![B]!.next![C]!.prev = expectedTrie.next![A]!.next![B]!;

    expectedTrie.next![A]!.next![B]!.next![C]!.next![D]!.prev = expectedTrie.next![A]!.next![B]!.next![C]!;

    expectedTrie.next![A]!.next![B]!.next![C]!.next![D]!.next![E]!.prev = expectedTrie.next![A]!.next![B]!.next![C]!.next![D]!;

    expectedTrie.next![A]!.next![B]!.next![C]!.next![D]!.next![E]!.next![F]!.prev = expectedTrie.next![A]!.next![B]!.next![C]!.next![D]!.next![E]!;

    expect(trie).toEqual(expectedTrie);
  });
});
