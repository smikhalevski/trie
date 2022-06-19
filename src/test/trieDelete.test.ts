import {trieCreate, trieDelete, trieSet, Trie} from '../main';

const A = 'a'.charCodeAt(0);
const B = 'b'.charCodeAt(0);
const C = 'c'.charCodeAt(0);
const D = 'd'.charCodeAt(0);

describe('deleteTrie', () => {

  test('returns false if key is not found', () => {
    const trie = trieCreate();
    trieSet(trie, 'abcd', 111);

    expect(trieDelete(trie, 'abc')).toBe(false);
  });

  test('returns true if key was deleted', () => {
    const trie = trieCreate();
    trieSet(trie, 'abc', 111);

    expect(trieDelete(trie, 'abc')).toBe(true);
    expect(trieDelete(trie, 'abc')).toBe(false);
  });

  test('deletes by an empty key', () => {
    const trie = trieCreate();
    trieSet(trie, '', 111);
    trieDelete(trie, '');

    const result: Trie<number> = {
      charCode: -1,
      parent: null,
      next: null,
      last: null,
      key: null,
      value: undefined,
      isLeaf: false,
      leafCharCodes: null,
      leafs: null,
    };

    expect(trie).toEqual(result);
  });

  test('flattens the tree after deleting an intermediate leaf', () => {
    const trie = trieCreate<number>();
    trieSet(trie, 'ab', 111);
    trieSet(trie, 'abc', 222);
    trieDelete(trie, 'ab');

    const result: Trie<number> = {
      [A]: undefined,
      charCode: -1,
      parent: null,
      next: null,
      last: null,
      key: 'abc',
      value: 222,
      isLeaf: true,
      leafCharCodes: [A, B, C],
      leafs: null,
    };

    expect(trie).toEqual(result);
  });

  test('deletes an intermediate leaf', () => {
    const trie = trieCreate<number>();
    trieSet(trie, 'ab', 111);
    trieSet(trie, 'abc', 222);
    trieSet(trie, 'abd', 333);
    trieDelete(trie, 'ab');

    const result: Trie<number> = {
      charCode: -1,
      parent: null,
      next: null,
      last: null,
      key: null,
      value: undefined,
      isLeaf: false,
      leafCharCodes: null,
      leafs: null,
      [A]: {
        charCode: A,
        parent: null,
        next: null,
        last: null,
        key: null,
        value: undefined,
        leafCharCodes: null,
        isLeaf: false,
        leafs: null,
        [B]: {
          charCode: B,
          parent: null,
          next: null,
          last: null,
          key: null,
          value: undefined,
          isLeaf: false,
          leafCharCodes: null,
          leafs: null,
          [C]: {
            charCode: C,
            parent: null,
            next: null,
            last: null,
            key: 'abc',
            value: 222,
            isLeaf: true,
            leafCharCodes: null,
            leafs: null,
          },
          [D]: {
            charCode: D,
            parent: null,
            next: null,
            last: null,
            key: 'abd',
            value: 333,
            isLeaf: true,
            leafCharCodes: null,
            leafs: null,
          },
        },
      },
    };

    result.next = result[A]!;
    result.last = result[A]!;

    result[A]!.parent = result;
    result[A]!.next = result[A]![B]!;
    result[A]!.last = result[A]![B]!;

    result[A]![B]!.parent = result[A]!;
    result[A]![B]!.next = result[A]![B]![C]!;
    result[A]![B]!.last = result[A]![B]![D]!;

    result[A]![B]![C]!.parent = result[A]![B]!;
    result[A]![B]![C]!.next = result[A]![B]![D]!;

    result[A]![B]![D]!.parent = result[A]![B]!;

    expect(trie).toEqual(result);
  });

  test('deletes a leaf that has siblings', () => {
    const trie = trieCreate<number>();
    trieSet(trie, 'ab', 111);
    trieSet(trie, 'abc', 222);
    trieSet(trie, 'abd', 333);
    trieDelete(trie, 'abd');

    const result: Trie<number> = {
      charCode: -1,
      parent: null,
      next: null,
      last: null,
      key: null,
      value: undefined,
      isLeaf: false,
      leafCharCodes: null,
      leafs: null,
      [A]: {
        charCode: A,
        parent: null,
        next: null,
        last: null,
        key: null,
        value: undefined,
        isLeaf: false,
        leafCharCodes: null,
        leafs: null,
        [B]: {
          charCode: B,
          parent: null,
          next: null,
          last: null,
          key: 'ab',
          value: 111,
          isLeaf: true,
          leafCharCodes: null,
          leafs: null,
          [C]: {
            charCode: C,
            parent: null,
            next: null,
            last: null,
            key: 'abc',
            value: 222,
            isLeaf: true,
            leafCharCodes: null,
            leafs: null,
          },
          [D]: undefined,
        },
      },
    };

    result.next = result[A]!;
    result.last = result[A]!;

    result[A]!.parent = result;
    result[A]!.next = result[A]![B]!;
    result[A]!.last = result[A]![B]!;

    result[A]![B]!.parent = result[A]!;
    result[A]![B]!.next = result[A]![B]![C]!;
    result[A]![B]!.last = result[A]![B]![C]!;

    result[A]![B]![C]!.parent = result[A]![B]!;

    expect(trie).toEqual(result);
  });
});
