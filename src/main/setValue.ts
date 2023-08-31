import { Trie } from './types';
import { createTrie } from './createTrie';
import { getCharCodeAt } from './utils';

/**
 * Sets a new key-value pair to the trie.
 *
 * ```ts
 * const trie = createTrie();
 *
 * setValue(trie, 'foo', 111);
 * ```
 *
 * @param trie The trie root.
 * @param key The key of to add to the `trie`.
 * @param value The value to associate with the key.
 * @returns The leaf to which the value was set.
 * @template Value The value stored in a trie.
 */
export const setValue = createSetValue();

/**
 * Creates a function that produces suggestions from a trie and uses `charCodeAt` to read chars from the input string.
 *
 * @param charCodeAt Reads the char code at the given index.
 * @see {@link suggest}
 */
export function createSetValue(charCodeAt = getCharCodeAt) {
  return (
    /**
     * Sets a new key-value pair to the trie.
     *
     * @param trie The trie root.
     * @param key The key of to add to the `trie`.
     * @param value The value to associate with the key.
     * @returns The leaf to which the value was set.
     * @template Value The value stored in a trie.
     */
    <Value>(trie: Trie<Value>, key: string, value: Value): Trie<Value> => {
      const keyLength = key.length;

      let i = 0;

      // Find the trie with the longest common prefix
      while (i < keyLength) {
        trie.suggestions = null;

        const keyCharCode = charCodeAt(key, i++);
        const trieLast = trie.last;

        // Links between prev → leaf → prev.next would be established for the new leaf
        let prev = trie;

        if (trieLast !== null) {
          const child = trie[keyCharCode];
          if (child !== undefined) {
            const childLeafCharCodes = child.leafCharCodes;
            if (childLeafCharCodes === null) {
              trie = child;
              continue;
            }

            // Check that the child is the one that must be updated
            const childLeafCharCodesLength = childLeafCharCodes.length;
            if (i + childLeafCharCodesLength === keyLength) {
              let j = 0;
              let k = i;
              while (j < childLeafCharCodesLength && charCodeAt(key, k) === childLeafCharCodes[j]) {
                ++j;
                ++k;
              }
              // Child exactly matches the key
              if (j === childLeafCharCodesLength) {
                trie = child;
                break;
              }
            }

            // Child must be forked, so a new parent must be inserted, preserving the child identity.
            //
            // The insertion would result in (most properties are omitted for clarity):
            //
            // {A: <child>{leafCharCodes: [B, C]}}
            // ↓
            // {A: {B: <child>{leafCharCodes: [C]}}}

            // Child always has a prev since it has a parent
            const childPrev = child.prev!;
            const childCharCode = child.charCode;

            const charCode = childLeafCharCodes[0];

            const parent = createTrie<Value>();
            parent[charCode] = parent.next = parent.last = child;
            parent.charCode = childCharCode;
            parent.parent = trie;
            parent.prev = childPrev;

            child.charCode = charCode;
            trie[childCharCode] = childPrev.next = child.parent = child.prev = parent;

            if (trie.last === child) {
              trie.last = parent;
            }

            if (childLeafCharCodes.length === 1) {
              child.leafCharCodes = null;
            } else {
              childLeafCharCodes.shift();
            }

            trie = parent;
            continue;
          }

          // Find the latest trie child
          prev = trieLast;
          while (prev.last !== null) {
            prev = prev.last;
          }
        }

        const prevNext = prev.next;

        // Append the new leaf and establish links
        const leaf = createTrie<Value>();
        leaf.charCode = keyCharCode;
        leaf.parent = trie;
        leaf.prev = prev;
        leaf.next = prevNext;

        if (prevNext !== null) {
          prevNext.prev = leaf;
        }

        trie = trie[keyCharCode] = trie.last = prev.next = leaf;

        if (i < keyLength) {
          // noinspection JSMismatchedCollectionQueryUpdate
          const leafCharCodes: number[] = (trie.leafCharCodes = []);

          while (i < keyLength) {
            leafCharCodes.push(charCodeAt(key, i++));
          }
        }
        break;
      }

      trie.key = key;
      trie.value = value;
      trie.isLeaf = true;
      trie.suggestions = null;

      return trie;
    }
  );
}
