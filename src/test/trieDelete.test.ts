import {Trie, trieCreate, trieDelete, trieGet, trieSet} from '../main';
import dictionary from './dictionary.json';

const A = 'a'.charCodeAt(0);
const B = 'b'.charCodeAt(0);
const C = 'c'.charCodeAt(0);
const D = 'd'.charCodeAt(0);

describe('trieDelete', () => {

  test('deletes by an empty key', () => {
    const trie = trieCreate();

    trieSet(trie, '', 111);
    trieDelete(trieGet(trie, ''));

    const result: Trie<number> = {
      charCode: -1,
      parent: null,
      prev: null,
      next: null,
      last: null,
      key: null,
      value: undefined,
      isLeaf: false,
      leafCharCodes: null,
      suggestions: null,
    };

    expect(trie).toEqual(result);
  });

  test('deletes an intermediate leaf with merging', () => {
    const trie = trieCreate<number>();

    trieSet(trie, 'ab', 111);
    trieSet(trie, 'abc', 222);
    trieDelete(trieGet(trie, 'ab'));

    const result: Trie<number> = {
      charCode: -1,
      parent: null,
      prev: null,
      next: null,
      last: null,
      key: null,
      value: undefined,
      isLeaf: false,
      leafCharCodes: null,
      suggestions: null,
      [A]: {
        charCode: A,
        parent: null,
        prev: null,
        next: null,
        last: null,
        key: 'abc',
        value: 222,
        isLeaf: true,
        leafCharCodes: [B, C],
        suggestions: null,
      },
    };

    result.next = result[A]!;
    result.last = result[A]!;

    result[A]!.parent = result;
    result[A]!.prev = result;

    expect(trie).toEqual(result);
  });

  test('deletes an intermediate leaf without merging', () => {
    const trie = trieCreate<number>();

    trieSet(trie, 'ab', 111);
    trieSet(trie, 'abc', 222);
    trieSet(trie, 'abd', 333);
    trieDelete(trieGet(trie, 'ab'));

    const result: Trie<number> = {
      charCode: -1,
      parent: null,
      prev: null,
      next: null,
      last: null,
      key: null,
      value: undefined,
      isLeaf: false,
      leafCharCodes: null,
      suggestions: null,
      [A]: {
        charCode: A,
        parent: null,
        prev: null,
        next: null,
        last: null,
        key: null,
        value: undefined,
        leafCharCodes: null,
        isLeaf: false,
        suggestions: null,
        [B]: {
          charCode: B,
          parent: null,
          prev: null,
          next: null,
          last: null,
          key: null,
          value: undefined,
          isLeaf: false,
          leafCharCodes: null,
          suggestions: null,
          [C]: {
            charCode: C,
            parent: null,
            prev: null,
            next: null,
            last: null,
            key: 'abc',
            value: 222,
            isLeaf: true,
            leafCharCodes: null,
            suggestions: null,
          },
          [D]: {
            charCode: D,
            parent: null,
            prev: null,
            next: null,
            last: null,
            key: 'abd',
            value: 333,
            isLeaf: true,
            leafCharCodes: null,
            suggestions: null,
          },
        },
      },
    };

    result.next = result[A]!;
    result.last = result[A]!;

    result[A]!.parent = result;
    result[A]!.prev = result;
    result[A]!.next = result[A]![B]!;
    result[A]!.last = result[A]![B]!;

    result[A]![B]!.parent = result[A]!;
    result[A]![B]!.prev = result[A]!;
    result[A]![B]!.next = result[A]![B]![C]!;
    result[A]![B]!.last = result[A]![B]![D]!;

    result[A]![B]![C]!.parent = result[A]![B]!;
    result[A]![B]![C]!.prev = result[A]![B]!;
    result[A]![B]![C]!.next = result[A]![B]![D]!;

    result[A]![B]![D]!.parent = result[A]![B]!;
    result[A]![B]![D]!.prev = result[A]![B]![C]!;

    expect(trie).toEqual(result);
  });

  test('deletes a leaf that has siblings', () => {
    const trie = trieCreate<number>();

    trieSet(trie, 'ab', 111);
    trieSet(trie, 'abc', 222);
    trieSet(trie, 'abd', 333);
    trieDelete(trieGet(trie, 'abd'));

    const result: Trie<number> = {
      charCode: -1,
      parent: null,
      prev: null,
      next: null,
      last: null,
      key: null,
      value: undefined,
      isLeaf: false,
      leafCharCodes: null,
      suggestions: null,
      [A]: {
        charCode: A,
        parent: null,
        prev: null,
        next: null,
        last: null,
        key: null,
        value: undefined,
        isLeaf: false,
        leafCharCodes: null,
        suggestions: null,
        [B]: {
          charCode: B,
          parent: null,
          prev: null,
          next: null,
          last: null,
          key: 'ab',
          value: 111,
          isLeaf: true,
          leafCharCodes: null,
          suggestions: null,
          [C]: {
            charCode: C,
            parent: null,
            prev: null,
            next: null,
            last: null,
            key: 'abc',
            value: 222,
            isLeaf: true,
            leafCharCodes: null,
            suggestions: null,
          },
          [D]: undefined,
        },
      },
    };

    result.next = result[A]!;
    result.last = result[A]!;

    result[A]!.parent = result;
    result[A]!.prev = result;
    result[A]!.next = result[A]![B]!;
    result[A]!.last = result[A]![B]!;

    result[A]![B]!.parent = result[A]!;
    result[A]![B]!.prev = result[A]!;
    result[A]![B]!.next = result[A]![B]![C]!;
    result[A]![B]!.last = result[A]![B]![C]!;

    result[A]![B]![C]!.parent = result[A]![B]!;
    result[A]![B]![C]!.prev = result[A]![B]!;

    expect(trie).toEqual(result);
  });

  test('perf', () => {
    const trie = trieCreate();

    dictionary.forEach((word) => {
      trieSet(trie, word, word);
    });

    dictionary.forEach((word) => {
      trieDelete(trieGet(trie, word));
    });

    const result: Trie<string> = {
      charCode: -1,
      parent: null,
      prev: null,
      next: null,
      last: null,
      key: null,
      value: undefined,
      isLeaf: false,
      leafCharCodes: null,
      suggestions: null,
    };

    expect(trie).toEqual(result);
  });
});
