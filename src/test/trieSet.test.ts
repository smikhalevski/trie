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
      charCode: -1,
      left: null,
      leafCharCodes: null,
      key: '',
      value: 111,
      length: 0,
      isLeaf: true,
      hasContinuation: false,
    };

    expect(trie).toEqual(expectedTrie);
  });

  test('sets an empty key and a non-empty key to a trie', () => {
    const trie = trieCreate<number>();

    expect(trieSet(trie, '', 111)).toBe(trie);
    expect(trieSet(trie, 'a', 222)).toBe(trie[A]);

    const expectedTrie: Trie<number> = {
      charCode: -1,
      left: null,
      leafCharCodes: null,
      key: '',
      value: 111,
      length: 0,
      isLeaf: true,
      hasContinuation: true,
      [A]: {
        charCode: A,
        left: null,
        leafCharCodes: null,
        key: 'a',
        value: 222,
        length: 1,
        isLeaf: true,
        hasContinuation: false,
      },
    };

    expectedTrie[A]!.left = trie;

    expect(trie).toEqual(expectedTrie);
  });

  test('sets the value to an empty trie', () => {
    const trie = trieCreate();
    trieSet(trie, 'abc', 111);

    const expectedTrie: Trie<number> = {
      charCode: -1,
      left: null,
      leafCharCodes: [A, B, C],
      key: 'abc',
      value: 111,
      length: 3,
      isLeaf: true,
      hasContinuation: false,
    };

    expect(trie).toEqual(expectedTrie);
  });

  test('sets the value to an non-empty trie', () => {
    const trie = trieCreate<number>();

    expect(trieSet(trie, 'abc', 111)).toBe(trie);
    expect(trieSet(trie, 'ade', 222)).toBe(trie![A]![D]);

    const expectedTrie: Trie<number> = {
      charCode: -1,
      left: null,
      key: null,
      value: undefined,
      leafCharCodes: null,
      length: 0,
      isLeaf: false,
      hasContinuation: true,
      [A]: {
        charCode: A,
        left: null,
        key: null,
        value: undefined,
        leafCharCodes: null,
        length: 1,
        isLeaf: false,
        hasContinuation: true,
        [B]: {
          charCode: B,
          left: null,
          leafCharCodes: [C],
          key: 'abc',
          value: 111,
          length: 3,
          isLeaf: true,
          hasContinuation: false,
        },
        [D]: {
          charCode: D,
          left: null,
          leafCharCodes: [E],
          key: 'ade',
          value: 222,
          length: 3,
          isLeaf: true,
          hasContinuation: false,
        }
      },
    };

    expectedTrie[A]!.left = trie;

    expectedTrie[A]![B]!.left = expectedTrie[A]!;
    expectedTrie[A]![D]!.left = expectedTrie[A]!;

    expect(trie).toEqual(expectedTrie);
  });

  test('sets the value to a deep trie trie', () => {
    const trie = trieCreate<number>();
    trieSet(trie, 'abc', 111);
    trieSet(trie, 'ade', 222);
    trieSet(trie, 'abf', 333);

    const expectedTrie: Trie<number> = {
      charCode: -1,
      left: null,
      leafCharCodes: null,
      key: null,
      value: undefined,
      length: 0,
      isLeaf: false,
      hasContinuation: true,
      [A]: {
        charCode: A,
        left: null,
        leafCharCodes: null,
        key: null,
        value: undefined,
        length: 1,
        isLeaf: false,
        hasContinuation: true,
        [B]: {
          charCode: B,
          left: null,
          leafCharCodes: null,
          key: null,
          value: undefined,
          length: 2,
          isLeaf: false,
          hasContinuation: true,
          [C]: {
            charCode: C,
            left: null,
            leafCharCodes: null,
            key: 'abc',
            value: 111,
            length: 3,
            isLeaf: true,
            hasContinuation: false,
          },
          [F]: {
            charCode: F,
            left: null,
            leafCharCodes: null,
            key: 'abf',
            value: 333,
            length: 3,
            isLeaf: true,
            hasContinuation: false,
          }
        },
        [D]: {
          charCode: D,
          left: null,
          leafCharCodes: [E],
          key: 'ade',
          value: 222,
          length: 3,
          isLeaf: true,
          hasContinuation: false,
        },
      },
    };

    expectedTrie[A]!.left = trie;

    expectedTrie[A]![B]!.left = expectedTrie[A]!;
    expectedTrie[A]![D]!.left = expectedTrie[A]!;

    expectedTrie[A]![B]![C]!.left = expectedTrie[A]![B]!;
    expectedTrie[A]![B]![F]!.left = expectedTrie[A]![B]!;

    expect(trie).toEqual(expectedTrie);
  });

  test('preserves overlapping keys', () => {
    const trie = trieCreate<number>();
    trieSet(trie, 'abc', 111);
    trieSet(trie, 'abcdef', 222);

    const expectedTrie: Trie<number> = {
      charCode: -1,
      left: null,
      key: null,
      value: undefined,
      leafCharCodes: null,
      length: 0,
      isLeaf: false,
      hasContinuation: true,
      [A]: {
        charCode: A,
        left: null,
        key: null,
        value: undefined,
        leafCharCodes: null,
        length: 1,
        isLeaf: false,
        hasContinuation: true,
        [B]: {
          charCode: B,
          left: null,
          key: null,
          value: undefined,
          leafCharCodes: null,
          length: 2,
          isLeaf: false,
          hasContinuation: true,
          [C]: {
            charCode: C,
            left: null,
            key: 'abc',
            value: 111,
            leafCharCodes: null,
            length: 3,
            isLeaf: true,
            hasContinuation: true,
            [D]: {
              charCode: D,
              left: null,
              key: 'abcdef',
              value: 222,
              leafCharCodes: [E, F],
              length: 6,
              isLeaf: true,
              hasContinuation: false,
            },
          },
        },
      },
    };

    expectedTrie[A]!.left = trie;

    expectedTrie[A]![B]!.left = expectedTrie[A]!;

    expectedTrie[A]![B]![C]!.left = expectedTrie[A]![B]!;

    expectedTrie[A]![B]![C]![D]!.left = expectedTrie[A]![B]![C]!;

    expect(trie).toEqual(expectedTrie);
  });

  test('sets the shorter key after longer key', () => {
    const trie = trieCreate<number>();
    trieSet(trie, 'abc', 111);
    trieSet(trie, 'abcdef', 222);
    trieSet(trie, 'abcde', 333);

    const expectedTrie: Trie<number> = {
      charCode: -1,
      left: null,
      key: null,
      value: undefined,
      length: 0,
      leafCharCodes: null,
      isLeaf: false,
      hasContinuation: true,
      [A]: {
        charCode: A,
        left: null,
        key: null,
        value: undefined,
        length: 1,
        leafCharCodes: null,
        isLeaf: false,
        hasContinuation: true,
        [B]: {
          charCode: B,
          left: null,
          key: null,
          value: undefined,
          length: 2,
          leafCharCodes: null,
          isLeaf: false,
          hasContinuation: true,
          [C]: {
            charCode: C,
            left: null,
            key: 'abc',
            value: 111,
            length: 3,
            leafCharCodes: null,
            isLeaf: true,
            hasContinuation: true,
            [D]: {
              charCode: D,
              left: null,
              key: null,
              value: undefined,
              length: 4,
              leafCharCodes: null,
              isLeaf: false,
              hasContinuation: true,
              [E]: {
                charCode: E,
                left: null,
                key: 'abcde',
                value: 333,
                length: 5,
                leafCharCodes: null,
                isLeaf: true,
                hasContinuation: true,
                [F]: {
                  charCode: F,
                  left: null,
                  key: 'abcdef',
                  value: 222,
                  length: 6,
                  leafCharCodes: null,
                  isLeaf: true,
                  hasContinuation: false,
                },
              },
            },
          },
        },
      },
    };

    expectedTrie[A]!.left = trie;

    expectedTrie[A]![B]!.left = expectedTrie[A]!;

    expectedTrie[A]![B]![C]!.left = expectedTrie[A]![B]!;

    expectedTrie[A]![B]![C]![D]!.left = expectedTrie[A]![B]![C]!;

    expectedTrie[A]![B]![C]![D]![E]!.left = expectedTrie[A]![B]![C]![D]!;

    expectedTrie[A]![B]![C]![D]![E]![F]!.left = expectedTrie[A]![B]![C]![D]![E]!;

    expect(trie).toEqual(expectedTrie);
  });
});
