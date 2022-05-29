import {createTrie, setTrie, Trie} from '../main';

describe('setTrie', () => {

  test('preserves ascending order of char codes in next*', () => {
    const node = createTrie<number>();
    setTrie(node, 'b', 222);
    setTrie(node, 'c', 333);
    setTrie(node, 'a', 111);
    setTrie(node, 'd', 444);

    expect(node.nextCharCodes).toEqual([97, 98, 99, 100]);
  });

  test('sets an empty string to a trie', () => {
    const node = createTrie();
    setTrie(node, '', 111);

    expect(node).toEqual(<Trie<number>>{
      prev: null,
      leafCharCodes: null,
      key: '',
      value: 111,
      length: 0,
      isLeaf: true,
      next: null,
      nextCharCodes: null,
    });
  });

  test('sets the value to an empty trie', () => {
    const node = createTrie();
    setTrie(node, 'abc', 111);

    expect(node).toEqual(<Trie<number>>{
      prev: null,
      leafCharCodes: [97, 98, 99],
      key: 'abc',
      value: 111,
      length: 3,
      isLeaf: true,
      next: null,
      nextCharCodes: null,
    });
  });

  test('sets the value to an non-empty trie', () => {
    const node = createTrie<number>();
    setTrie(node, 'abc', 111);
    setTrie(node, 'ade', 222);

    const expectedNode: Trie<number> = {
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
          nextCharCodes: [98, 100],
          next: [
            {
              prev: null,
              leafCharCodes: [99],
              key: 'abc',
              value: 111,
              length: 3,
              isLeaf: true,
              nextCharCodes: null,
              next: null,
            },
            {
              prev: null,
              leafCharCodes: [101],
              key: 'ade',
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

    expectedNode.next![0].prev = node;

    expectedNode.next![0].next![0].prev = expectedNode.next![0];
    expectedNode.next![0].next![1].prev = expectedNode.next![0];

    expect(node).toEqual(expectedNode);
  });

  test('sets the value to a deep trie node', () => {
    const node = createTrie<number>();
    setTrie(node, 'abc', 111);
    setTrie(node, 'ade', 222);
    setTrie(node, 'abf', 333);

    const expectedNode: Trie<number> = {
      prev: null,
      leafCharCodes: null,
      key: null,
      value: undefined,
      length: 0,
      isLeaf: false,
      nextCharCodes: [97],
      next: [
        {
          prev: null,
          leafCharCodes: null,
          key: null,
          value: undefined,
          length: 1,
          isLeaf: false,
          nextCharCodes: [98, 100],
          next: [
            {
              prev: null,
              leafCharCodes: null,
              key: null,
              value: undefined,
              length: 2,
              isLeaf: false,
              nextCharCodes: [99, 102],
              next: [
                {
                  prev: null,
                  leafCharCodes: null,
                  key: 'abc',
                  value: 111,
                  length: 3,
                  isLeaf: true,
                  nextCharCodes: null,
                  next: null,
                },
                {
                  prev: null,
                  leafCharCodes: null,
                  key: 'abf',
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
              key: 'ade',
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

    expectedNode.next![0].prev = node;

    expectedNode.next![0].next![0].prev = expectedNode.next![0];
    expectedNode.next![0].next![1].prev = expectedNode.next![0];

    expectedNode.next![0].next![0].next![0].prev = expectedNode.next![0].next![0];
    expectedNode.next![0].next![0].next![1].prev = expectedNode.next![0].next![0];

    expect(node).toEqual(expectedNode);
  });

  test('preserves overlapping keys', () => {
    const node = createTrie<number>();
    setTrie(node, 'abc', 111);
    setTrie(node, 'abcdef', 222);

    const expectedNode: Trie<number> = {
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
              key: null,
              value: undefined,
              leafCharCodes: null,
              length: 2,
              isLeaf: false,
              nextCharCodes: [99],
              next: [
                {
                  prev: null,
                  key: 'abc',
                  value: 111,
                  leafCharCodes: null,
                  length: 3,
                  isLeaf: true,
                  nextCharCodes: [100],
                  next: [
                    {
                      prev: null,
                      key: 'abcdef',
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

    expectedNode.next![0].prev = node;

    expectedNode.next![0].next![0].prev = expectedNode.next![0];

    expectedNode.next![0].next![0].next![0].prev = expectedNode.next![0].next![0];

    expectedNode.next![0].next![0].next![0].next![0].prev = expectedNode.next![0].next![0].next![0];

    expect(node).toEqual(expectedNode);
  });

  test('sets the shorter key after longer key', () => {
    const node = createTrie<number>();
    setTrie(node, 'abc', 111);
    setTrie(node, 'abcdef', 222);
    setTrie(node, 'abcde', 333);

    const expectedNode: Trie<number> = {
      prev: null,
      key: null,
      value: undefined,
      length: 0,
      leafCharCodes: null,
      isLeaf: false,
      nextCharCodes: [97],
      next: [
        {
          prev: null,
          key: null,
          value: undefined,
          length: 1,
          leafCharCodes: null,
          isLeaf: false,
          nextCharCodes: [98],
          next: [
            {
              prev: null,
              key: null,
              value: undefined,
              length: 2,
              leafCharCodes: null,
              isLeaf: false,
              nextCharCodes: [99],
              next: [
                {
                  prev: null,
                  key: 'abc',
                  value: 111,
                  length: 3,
                  leafCharCodes: null,
                  isLeaf: true,
                  nextCharCodes: [100],
                  next: [
                    {
                      prev: null,
                      key: null,
                      value: undefined,
                      length: 4,
                      leafCharCodes: null,
                      isLeaf: false,
                      nextCharCodes: [101],
                      next: [
                        {
                          prev: null,
                          key: 'abcde',
                          value: 333,
                          length: 5,
                          leafCharCodes: null,
                          isLeaf: true,
                          nextCharCodes: [102],
                          next: [
                            {
                              prev: null,
                              key: 'abcdef',
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

    expectedNode.next![0].prev = node;

    expectedNode.next![0].next![0].prev = expectedNode.next![0];

    expectedNode.next![0].next![0].next![0].prev = expectedNode.next![0].next![0];

    expectedNode.next![0].next![0].next![0].next![0].prev = expectedNode.next![0].next![0].next![0];

    expectedNode.next![0].next![0].next![0].next![0].next![0].prev = expectedNode.next![0].next![0].next![0].next![0];

    expectedNode.next![0].next![0].next![0].next![0].next![0].next![0].prev = expectedNode.next![0].next![0].next![0].next![0].next![0];

    expect(node).toEqual(expectedNode);
  });
});
