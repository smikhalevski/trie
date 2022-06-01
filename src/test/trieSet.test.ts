import {Trie, trieCreate, trieSet} from '../main';

const A = 'a'.charCodeAt(0);
const B = 'b'.charCodeAt(0);
const C = 'c'.charCodeAt(0);
const D = 'd'.charCodeAt(0);
const E = 'e'.charCodeAt(0);
const F = 'f'.charCodeAt(0);

describe('trieSet', () => {

  test('sets an empty key to a trie', () => {
    const trie = trieCreate();

    expect(trieSet(trie, '', 111)).toBe(trie);

    const expectedTrie: Trie<number> = {
      prev: null,
      leafCharCodes: null,
      key: '',
      value: 111,
      length: 0,
      isLeaf: true,
      nextCharCodes: null,
    };

    expect(trie).toEqual(expectedTrie);
  });

  test('sets an empty key and a non-empty key to a trie', () => {
    const trie = trieCreate<number>();

    expect(trieSet(trie, '', 111)).toBe(trie);
    expect(trieSet(trie, 'a', 222)).toBe(trie[A]);

    const expectedTrie: Trie<number> = {
      prev: null,
      leafCharCodes: null,
      key: '',
      value: 111,
      length: 0,
      isLeaf: true,
      nextCharCodes: [A],
      [A]: {
        prev: null,
        leafCharCodes: null,
        key: 'a',
        value: 222,
        length: 1,
        isLeaf: true,
        nextCharCodes: null,
      },
    };

    expectedTrie[A]!.prev = trie;

    expect(trie).toEqual(expectedTrie);
  });

  test('sets the value to an empty trie', () => {
    const trie = trieCreate();
    trieSet(trie, 'abc', 111);

    const expectedTrie: Trie<number> = {
      prev: null,
      leafCharCodes: [A, B, C],
      key: 'abc',
      value: 111,
      length: 3,
      isLeaf: true,
      nextCharCodes: null,
    };

    expect(trie).toEqual(expectedTrie);
  });

  test('sets the value to an non-empty trie', () => {
    const trie = trieCreate<number>();

    expect(trieSet(trie, 'abc', 111)).toBe(trie);
    expect(trieSet(trie, 'ade', 222)).toBe(trie![A]![D]);

    const expectedTrie: Trie<number> = {
      prev: null,
      key: null,
      value: undefined,
      leafCharCodes: null,
      length: 0,
      isLeaf: false,
      nextCharCodes: [A],
      [A]: {
        prev: null,
        key: null,
        value: undefined,
        leafCharCodes: null,
        length: 1,
        isLeaf: false,
        nextCharCodes: [B, D],
        [B]: {
          prev: null,
          leafCharCodes: [C],
          key: 'abc',
          value: 111,
          length: 3,
          isLeaf: true,
          nextCharCodes: null,
        },
        [D]: {
          prev: null,
          leafCharCodes: [E],
          key: 'ade',
          value: 222,
          length: 3,
          isLeaf: true,
          nextCharCodes: null,
        }
      },
    };

    expectedTrie[A]!.prev = trie;

    expectedTrie[A]![B]!.prev = expectedTrie[A]!;
    expectedTrie[A]![D]!.prev = expectedTrie[A]!;

    expect(trie).toEqual(expectedTrie);
  });

  test('sets the value to a deep trie trie', () => {
    const trie = trieCreate<number>();
    trieSet(trie, 'abc', 111);
    trieSet(trie, 'ade', 222);
    trieSet(trie, 'abf', 333);

    const expectedTrie: Trie<number> = {
      prev: null,
      leafCharCodes: null,
      key: null,
      value: undefined,
      length: 0,
      isLeaf: false,
      nextCharCodes: [A],
      [A]: {
        prev: null,
        leafCharCodes: null,
        key: null,
        value: undefined,
        length: 1,
        isLeaf: false,
        nextCharCodes: [B, D],
        [B]: {
          prev: null,
          leafCharCodes: null,
          key: null,
          value: undefined,
          length: 2,
          isLeaf: false,
          nextCharCodes: [C, F],
          [C]: {
            prev: null,
            leafCharCodes: null,
            key: 'abc',
            value: 111,
            length: 3,
            isLeaf: true,
            nextCharCodes: null,
          },
          [F]: {
            prev: null,
            leafCharCodes: null,
            key: 'abf',
            value: 333,
            length: 3,
            isLeaf: true,
            nextCharCodes: null,
          }
        },
        [D]: {
          prev: null,
          leafCharCodes: [E],
          key: 'ade',
          value: 222,
          length: 3,
          isLeaf: true,
          nextCharCodes: null,
        },
      },
    };

    expectedTrie[A]!.prev = trie;

    expectedTrie[A]![B]!.prev = expectedTrie[A]!;
    expectedTrie[A]![D]!.prev = expectedTrie[A]!;

    expectedTrie[A]![B]![C]!.prev = expectedTrie[A]![B]!;
    expectedTrie[A]![B]![F]!.prev = expectedTrie[A]![B]!;

    expect(trie).toEqual(expectedTrie);
  });

  test('preserves overlapping keys', () => {
    const trie = trieCreate<number>();
    trieSet(trie, 'abc', 111);
    trieSet(trie, 'abcdef', 222);

    const expectedTrie: Trie<number> = {
      prev: null,
      key: null,
      value: undefined,
      leafCharCodes: null,
      length: 0,
      isLeaf: false,
      nextCharCodes: [A],
      [A]: {
        prev: null,
        key: null,
        value: undefined,
        leafCharCodes: null,
        length: 1,
        isLeaf: false,
        nextCharCodes: [B],
        [B]: {
          prev: null,
          key: null,
          value: undefined,
          leafCharCodes: null,
          length: 2,
          isLeaf: false,
          nextCharCodes: [C],
          [C]: {
            prev: null,
            key: 'abc',
            value: 111,
            leafCharCodes: null,
            length: 3,
            isLeaf: true,
            nextCharCodes: [D],
            [D]: {
              prev: null,
              key: 'abcdef',
              value: 222,
              leafCharCodes: [E, F],
              length: 6,
              isLeaf: true,
              nextCharCodes: null,
            },
          },
        },
      },
    };

    expectedTrie[A]!.prev = trie;

    expectedTrie[A]![B]!.prev = expectedTrie[A]!;

    expectedTrie[A]![B]![C]!.prev = expectedTrie[A]![B]!;

    expectedTrie[A]![B]![C]![D]!.prev = expectedTrie[A]![B]![C]!;

    expect(trie).toEqual(expectedTrie);
  });

  test('sets the shorter key after longer key', () => {
    const trie = trieCreate<number>();
    trieSet(trie, 'abc', 111);
    trieSet(trie, 'abcdef', 222);
    trieSet(trie, 'abcde', 333);

    const expectedTrie: Trie<number> = {
      prev: null,
      key: null,
      value: undefined,
      length: 0,
      leafCharCodes: null,
      isLeaf: false,
      nextCharCodes: [A],
      [A]: {
        prev: null,
        key: null,
        value: undefined,
        length: 1,
        leafCharCodes: null,
        isLeaf: false,
        nextCharCodes: [B],
        [B]: {
          prev: null,
          key: null,
          value: undefined,
          length: 2,
          leafCharCodes: null,
          isLeaf: false,
          nextCharCodes: [C],
          [C]: {
            prev: null,
            key: 'abc',
            value: 111,
            length: 3,
            leafCharCodes: null,
            isLeaf: true,
            nextCharCodes: [D],
            [D]: {
              prev: null,
              key: null,
              value: undefined,
              length: 4,
              leafCharCodes: null,
              isLeaf: false,
              nextCharCodes: [E],
              [E]: {
                prev: null,
                key: 'abcde',
                value: 333,
                length: 5,
                leafCharCodes: null,
                isLeaf: true,
                nextCharCodes: [F],
                [F]: {
                  prev: null,
                  key: 'abcdef',
                  value: 222,
                  length: 6,
                  leafCharCodes: null,
                  isLeaf: true,
                  nextCharCodes: null,
                },
              },
            },
          },
        },
      },
    };

    expectedTrie[A]!.prev = trie;

    expectedTrie[A]![B]!.prev = expectedTrie[A]!;

    expectedTrie[A]![B]![C]!.prev = expectedTrie[A]![B]!;

    expectedTrie[A]![B]![C]![D]!.prev = expectedTrie[A]![B]![C]!;

    expectedTrie[A]![B]![C]![D]![E]!.prev = expectedTrie[A]![B]![C]![D]!;

    expectedTrie[A]![B]![C]![D]![E]![F]!.prev = expectedTrie[A]![B]![C]![D]![E]!;

    expect(trie).toEqual(expectedTrie);
  });
});
