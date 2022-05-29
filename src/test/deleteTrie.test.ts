import {createTrie, setTrie, Trie} from '../main';
import {deleteTrie} from '../main/deleteTrie';

describe('deleteTrie', () => {

  test('returns false if word is not found', () => {
    const trie = createTrie();
    setTrie(trie, 'abcd', 111);
    expect(deleteTrie(trie, 'abc')).toBe(false);
  });

  test('deletes an empty word', () => {
    const trie = createTrie();
    setTrie(trie, '', 111);
    deleteTrie(trie, '');

    expect(trie).toEqual(<Trie<number>>{
      prev: null,
      leafCharCodes: null,
      word: null,
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
      word: 'abc',
      value: 222,
      leafCharCodes: [97, 98, 99],
      length: 3,
      isLeaf: true,
      nextCharCodes: null,
      next: null,
    });
  });

  // test('deletes an intermediate word', () => {
  //   const trie = createTrie<number>();
  //   setTrie(trie, 'ab', 111);
  //   setTrie(trie, 'abc', 222);
  //   deleteTrie(trie, 'ab');
  //
  //   const expectedTrie: Trie<number> = {
  //     prev: null,
  //     word: 'abc',
  //     value: 222,
  //     leafCharCodes: null,
  //     length: 0,
  //     isLeaf: false,
  //     nextCharCodes: [97, 98, 99],
  //     next: [
  //       {
  //         prev: null,
  //         word: null,
  //         value: undefined,
  //         leafCharCodes: null,
  //         length: 1,
  //         isLeaf: false,
  //         nextCharCodes: [98],
  //         next: [
  //           {
  //             prev: null,
  //             word: 'ab',
  //             value: 111,
  //             leafCharCodes: null,
  //             length: 2,
  //             isLeaf: true,
  //             nextCharCodes: [99],
  //             next: [
  //               {
  //                 prev: null,
  //                 word: 'abc',
  //                 value: 222,
  //                 leafCharCodes: null,
  //                 length: 3,
  //                 isLeaf: true,
  //                 nextCharCodes: null,
  //                 next: null,
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //     ],
  //   };
  //
  //   expectedTrie.next![0].prev = trie;
  //
  //   expectedTrie.next![0].next![0].prev = expectedTrie.next![0];
  //
  //   expectedTrie.next![0].next![0].next![0].prev = expectedTrie.next![0].next![0];
  //
  //   expect(trie).toEqual(expectedTrie);
  // });
});
