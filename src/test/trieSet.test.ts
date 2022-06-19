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

    const result: Trie<number> = {
      charCode: -1,
      parent: null,
      next: null,
      last: null,
      size: 0,
      value: 111,
      isLeaf: true,
      leafCharCodes: null,
      leafs: null,
    };

    expect(trie).toEqual(result);
  });

  test('sets an empty key and a non-empty key to a trie', () => {
    const trie = trieCreate<number>();

    expect(trieSet(trie, '', 111)).toBe(trie);
    expect(trieSet(trie, 'a', 222)).toBe(trie[A]);

    const result: Trie<number> = {
      charCode: -1,
      parent: null,
      next: null,
      last: null,
      size: 1,
      value: 111,
      isLeaf: true,
      leafCharCodes: null,
      leafs: null,
      [A]: {
        charCode: A,
        parent: null,
        next: null,
        last: null,
        size: 0,
        value: 222,
        isLeaf: true,
        leafCharCodes: null,
        leafs: null,
      },
    };

    result.next = result[A]!;
    result.last = result[A]!;

    result[A]!.parent = trie;

    expect(trie).toEqual(result);
  });

  test('sets the value to an empty trie', () => {
    const trie = trieCreate();
    trieSet(trie, 'abc', 111);

    const result: Trie<number> = {
      charCode: -1,
      parent: null,
      next: null,
      last: null,
      size: 0,
      value: 111,
      isLeaf: true,
      leafCharCodes: [A, B, C],
      leafs: null,
    };

    expect(trie).toEqual(result);
  });

  test('sets the value to an non-empty trie', () => {
    const trie = trieCreate<number>();

    expect(trieSet(trie, 'abc', 111)).toBe(trie);

    const q = trieSet(trie, 'ade', 222);

    expect(q).toBe(trie![A]![D]);

    const result: Trie<number> = {
      charCode: -1,
      parent: null,
      next: null,
      last: null,
      size: 1,
      value: undefined,
      isLeaf: false,
      leafCharCodes: null,
      leafs: null,
      [A]: {
        charCode: A,
        parent: null,
        next: null,
        last: null,
        size: 2,
        value: undefined,
        isLeaf: false,
        leafCharCodes: null,
        leafs: null,
        [B]: {
          charCode: B,
          parent: null,
          next: null,
          last: null,
          size: 0,
          value: 111,
          isLeaf: true,
          leafCharCodes: [C],
          leafs: null,
        },
        [D]: {
          charCode: D,
          parent: null,
          next: null,
          last: null,
          size: 0,
          value: 222,
          isLeaf: true,
          leafCharCodes: [E],
          leafs: null,
        }
      },
    };

    result.next = result[A]!;
    result.last = result[A]!;

    result[A]!.parent = trie;
    result[A]!.next = result[A]![B]!;
    result[A]!.last = result[A]![D]!;

    result[A]![B]!.parent = result[A]!;
    result[A]![B]!.next = result[A]![D]!;

    result[A]![D]!.parent = result[A]!;

    expect(trie).toEqual(result);
  });

  test('sets the value to a deep trie trie', () => {
    const trie = trieCreate<number>();
    trieSet(trie, 'abc', 111);
    trieSet(trie, 'ade', 222);
    trieSet(trie, 'abf', 333);

    const result: Trie<number> = {
      charCode: -1,
      parent: null,
      next: null,
      last: null,
      size: 1,
      value: undefined,
      isLeaf: false,
      leafCharCodes: null,
      leafs: null,
      [A]: {
        charCode: A,
        parent: null,
        next: null,
        last: null,
        size: 2,
        value: undefined,
        isLeaf: false,
        leafCharCodes: null,
        leafs: null,
        [B]: {
          charCode: B,
          parent: null,
          next: null,
          last: null,
          size: 2,
          value: undefined,
          isLeaf: false,
          leafCharCodes: null,
          leafs: null,
          [C]: {
            charCode: C,
            parent: null,
            next: null,
            last: null,
            size: 0,
            value: 111,
            isLeaf: true,
            leafCharCodes: null,
            leafs: null,
          },
          [F]: {
            charCode: F,
            parent: null,
            next: null,
            last: null,
            size: 0,
            value: 333,
            isLeaf: true,
            leafCharCodes: null,
            leafs: null,
          }
        },
        [D]: {
          charCode: D,
          parent: null,
          next: null,
          last: null,
          size: 0,
          value: 222,
          isLeaf: true,
          leafCharCodes: [E],
          leafs: null,
        },
      },
    };

    result.next = result[A]!;
    result.last = result[A]!;

    result[A]!.parent = trie;
    result[A]!.next = result[A]![B]!;
    result[A]!.last = result[A]![D]!;

    result[A]![B]!.parent = result[A]!;
    result[A]![B]!.next = result[A]![B]![C]!;
    result[A]![B]!.last = result[A]![B]![F]!;

    result[A]![B]![C]!.parent = result[A]![B]!;
    result[A]![B]![C]!.next = result[A]![B]![F]!;

    result[A]![B]![F]!.parent = result[A]![B]!;
    result[A]![B]![F]!.next = result[A]![D]!;

    result[A]![D]!.parent = result[A]!;

    expect(trie).toEqual(result);
  });

  test('preserves overlapping keys', () => {
    const trie = trieCreate<number>();
    trieSet(trie, 'abc', 111);
    trieSet(trie, 'abcdef', 222);

    const result: Trie<number> = {
      charCode: -1,
      parent: null,
      next: null,
      last: null,
      size: 1,
      value: undefined,
      isLeaf: false,
      leafCharCodes: null,
      leafs: null,
      [A]: {
        charCode: A,
        parent: null,
        next: null,
        last: null,
        size: 1,
        value: undefined,
        isLeaf: false,
        leafCharCodes: null,
        leafs: null,
        [B]: {
          charCode: B,
          parent: null,
          next: null,
          last: null,
          size: 1,
          value: undefined,
          isLeaf: false,
          leafCharCodes: null,
          leafs: null,
          [C]: {
            charCode: C,
            parent: null,
            next: null,
            last: null,
            size: 1,
            value: 111,
            isLeaf: true,
            leafCharCodes: null,
            leafs: null,
            [D]: {
              charCode: D,
              parent: null,
              next: null,
              last: null,
              size: 0,
              value: 222,
              isLeaf: true,
              leafCharCodes: [E, F],
              leafs: null,
            },
          },
        },
      },
    };

    result.next = result[A]!;
    result.last = result[A]!;

    result[A]!.parent = trie;
    result[A]!.next = result[A]![B]!;
    result[A]!.last = result[A]![B]!;

    result[A]![B]!.parent = result[A]!;
    result[A]![B]!.next = result[A]![B]![C]!;
    result[A]![B]!.last = result[A]![B]![C]!;

    result[A]![B]![C]!.parent = result[A]![B]!;
    result[A]![B]![C]!.next = result[A]![B]![C]![D]!;
    result[A]![B]![C]!.last = result[A]![B]![C]![D]!;

    result[A]![B]![C]![D]!.parent = result[A]![B]![C]!;

    expect(trie).toEqual(result);
  });

  test('sets the shorter key after longer key', () => {
    const trie = trieCreate<number>();
    trieSet(trie, 'abc', 111);
    trieSet(trie, 'abcdef', 222);
    trieSet(trie, 'abcde', 333);

    const result: Trie<number> = {
      charCode: -1,
      parent: null,
      next: null,
      last: null,
      size: 1,
      value: undefined,
      isLeaf: false,
      leafCharCodes: null,
      leafs: null,
      [A]: {
        charCode: A,
        parent: null,
        next: null,
        last: null,
        size: 1,
        value: undefined,
        isLeaf: false,
        leafCharCodes: null,
        leafs: null,
        [B]: {
          charCode: B,
          parent: null,
          next: null,
          last: null,
          size: 1,
          value: undefined,
          isLeaf: false,
          leafCharCodes: null,
          leafs: null,
          [C]: {
            charCode: C,
            parent: null,
            next: null,
            last: null,
            size: 1,
            value: 111,
            isLeaf: true,
            leafCharCodes: null,
            leafs: null,
            [D]: {
              charCode: D,
              parent: null,
              next: null,
              last: null,
              size: 1,
              value: undefined,
              isLeaf: false,
              leafCharCodes: null,
              leafs: null,
              [E]: {
                charCode: E,
                parent: null,
                next: null,
                last: null,
                size: 1,
                value: 333,
                isLeaf: true,
                leafCharCodes: null,
                leafs: null,
                [F]: {
                  charCode: F,
                  parent: null,
                  next: null,
                  last: null,
                  size: 0,
                  value: 222,
                  isLeaf: true,
                  leafCharCodes: null,
                  leafs: null,
                },
              },
            },
          },
        },
      },
    };

    result.next = result[A]!;
    result.last = result[A]!;

    result[A]!.parent = trie;
    result[A]!.next = result[A]![B]!;
    result[A]!.last = result[A]![B]!;

    result[A]![B]!.parent = result[A]!;
    result[A]![B]!.next = result[A]![B]![C]!;
    result[A]![B]!.last = result[A]![B]![C]!;

    result[A]![B]![C]!.parent = result[A]![B]!;
    result[A]![B]![C]!.next = result[A]![B]![C]![D]!;
    result[A]![B]![C]!.last = result[A]![B]![C]![D]!;

    result[A]![B]![C]![D]!.parent = result[A]![B]![C]!;
    result[A]![B]![C]![D]!.next = result[A]![B]![C]![D]![E]!;
    result[A]![B]![C]![D]!.last = result[A]![B]![C]![D]![E]!;

    result[A]![B]![C]![D]![E]!.parent = result[A]![B]![C]![D]!;
    result[A]![B]![C]![D]![E]!.next = result[A]![B]![C]![D]![E]![F]!;
    result[A]![B]![C]![D]![E]!.last = result[A]![B]![C]![D]![E]![F]!;

    result[A]![B]![C]![D]![E]![F]!.parent = result[A]![B]![C]![D]![E]!;

    expect(trie).toEqual(result);
  });

  test('correctly infers next for distant keys', () => {
    const trie = trieCreate<number>();

    trieSet(trie, 'abcd', 111);
    trieSet(trie, 'abc', 222);
    trieSet(trie, 'abef', 333);
    trieSet(trie, 'a', 444);

    const result: Trie<number> = {
      charCode: -1,
      parent: null,
      next: null,
      last: null,
      size: 1,
      value: undefined,
      isLeaf: false,
      leafCharCodes: null,
      leafs: null,
      [A]: {
        charCode: A,
        parent: null,
        next: null,
        last: null,
        size: 1,
        value: 444,
        isLeaf: true,
        leafCharCodes: null,
        leafs: null,
        [B]: {
          charCode: B,
          parent: null,
          next: null,
          last: null,
          size: 2,
          value: undefined,
          isLeaf: false,
          leafCharCodes: null,
          leafs: null,
          [C]: {
            charCode: C,
            parent: null,
            next: null,
            last: null,
            size: 1,
            value: 222,
            isLeaf: true,
            leafCharCodes: null,
            leafs: null,
            [D]: {
              charCode: D,
              parent: null,
              next: null,
              last: null,
              size: 0,
              value: 111,
              isLeaf: true,
              leafCharCodes: null,
              leafs: null,
            },
          },
          [E]: {
            charCode: E,
            parent: null,
            next: null,
            last: null,
            size: 0,
            value: 333,
            isLeaf: true,
            leafCharCodes: [F],
            leafs: null,
          }
        },
      },
    };

    result.next = result[A]!;
    result.last = result[A]!;

    result[A]!.parent = trie;
    result[A]!.next = result[A]![B]!;
    result[A]!.last = result[A]![B]!;

    result[A]![B]!.parent = result[A]!;
    result[A]![B]!.next = result[A]![B]![C]!;
    result[A]![B]!.last = result[A]![B]![E]!;

    result[A]![B]![C]!.parent = result[A]![B]!;
    result[A]![B]![C]!.next = result[A]![B]![C]![D]!;
    result[A]![B]![C]!.last = result[A]![B]![C]![D]!;

    result[A]![B]![C]![D]!.parent = result[A]![B]![C]!;
    result[A]![B]![C]![D]!.next = result[A]![B]![E]!;

    result[A]![B]![E]!.parent = result[A]![B]!;

    expect(trie).toEqual(result);
  });
});
