import {trieCreate, trieDelete, trieSet, Trie} from '../main';

describe('deleteTrie', () => {

  test('returns false if key is not found', () => {
  //   const trie = trieCreate();
  //   trieSet(trie, 'abcd', 111);
  //
  //   expect(trieDelete(trie, 'abc')).toBe(false);
  // });
  //
  // test('returns true if key was deleted', () => {
  //   const trie = trieCreate();
  //   trieSet(trie, 'abc', 111);
  //
  //   expect(trieDelete(trie, 'abc')).toBe(true);
  //   expect(trieDelete(trie, 'abc')).toBe(false);
  // });
  //
  // test('deletes by an empty key', () => {
  //   const trie = trieCreate();
  //   trieSet(trie, '', 111);
  //   trieDelete(trie, '');
  //
  //   expect(trie).toEqual(<Trie<number>>{
  //     prev: null,
  //     leafCharCodes: null,
  //     key: null,
  //     value: undefined,
  //     length: 0,
  //     isLeaf: false,
  //     nextCharCodes: null,
  //     next: null,
  //   });
  // });
  //
  // test('flattens the tree after deleting an intermediate leaf', () => {
  //   const trie = trieCreate<number>();
  //   trieSet(trie, 'ab', 111);
  //   trieSet(trie, 'abc', 222);
  //   trieDelete(trie, 'ab');
  //
  //   expect(trie).toEqual(<Trie<number>>{
  //     prev: null,
  //     key: 'abc',
  //     value: 222,
  //     leafCharCodes: [97, 98, 99],
  //     length: 3,
  //     isLeaf: true,
  //     nextCharCodes: null,
  //     next: null,
  //   });
  // });
  //
  // test('deletes an intermediate leaf', () => {
  //   const trie = trieCreate<number>();
  //   trieSet(trie, 'ab', 111);
  //   trieSet(trie, 'abc', 222);
  //   trieSet(trie, 'abd', 333);
  //   trieDelete(trie, 'ab');
  //
  //   const result: Trie<number> = {
  //     prev: null,
  //     key: null,
  //     value: undefined,
  //     leafCharCodes: null,
  //     length: 0,
  //     isLeaf: false,
  //     nextCharCodes: [97],
  //     next: [
  //       {
  //         prev: null,
  //         key: null,
  //         value: undefined,
  //         leafCharCodes: null,
  //         length: 1,
  //         isLeaf: false,
  //         nextCharCodes: [98],
  //         next: [
  //           {
  //             prev: null,
  //             key: null, // 'ab' was here
  //             value: undefined,
  //             leafCharCodes: null,
  //             length: 2,
  //             isLeaf: false,
  //             nextCharCodes: [99, 100],
  //             next: [
  //               {
  //                 prev: null,
  //                 key: 'abc',
  //                 value: 222,
  //                 leafCharCodes: null,
  //                 length: 3,
  //                 isLeaf: true,
  //                 nextCharCodes: null,
  //                 next: null,
  //               },
  //               {
  //                 prev: null,
  //                 key: 'abd',
  //                 value: 333,
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
  //   result.next![0].prev = trie;
  //
  //   result.next![0].next![0].prev = result.next![0];
  //
  //   result.next![0].next![0].next![0].prev = result.next![0].next![0];
  //   result.next![0].next![0].next![1].prev = result.next![0].next![0];
  //
  //   expect(trie).toEqual(result);
  // });
  //
  // test('deletes a leaf that has siblings', () => {
  //   const trie = trieCreate<number>();
  //   trieSet(trie, 'ab', 111);
  //   trieSet(trie, 'abc', 222);
  //   trieSet(trie, 'abd', 333);
  //   trieDelete(trie, 'abd');
  //
  //   const result: Trie<number> = {
  //     prev: null,
  //     key: null,
  //     value: undefined,
  //     leafCharCodes: null,
  //     length: 0,
  //     isLeaf: false,
  //     nextCharCodes: [97],
  //     next: [
  //       {
  //         prev: null,
  //         key: null,
  //         value: undefined,
  //         leafCharCodes: null,
  //         length: 1,
  //         isLeaf: false,
  //         nextCharCodes: [98],
  //         next: [
  //           {
  //             prev: null,
  //             key: 'ab',
  //             value: 111,
  //             leafCharCodes: null,
  //             length: 2,
  //             isLeaf: true,
  //             nextCharCodes: [99],
  //             next: [
  //               {
  //                 prev: null,
  //                 key: 'abc',
  //                 value: 222,
  //                 leafCharCodes: null,
  //                 length: 3,
  //                 isLeaf: true,
  //                 nextCharCodes: null,
  //                 next: null,
  //               },
  //               // 'abd' was here
  //             ],
  //           },
  //         ],
  //       },
  //     ],
  //   };
  //
  //   result.next![0].prev = trie;
  //
  //   result.next![0].next![0].prev = result.next![0];
  //
  //   result.next![0].next![0].next![0].prev = result.next![0].next![0];
  //
  //   expect(trie).toEqual(result);
  });
});
