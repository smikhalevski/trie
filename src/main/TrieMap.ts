import {createTrie, TrieNode, searchTrie, setTrie} from './trie-utils';

export namespace TrieMap {

  export type Entries<T> = [string, T][] | ArrayLike<[string, T]> | Iterable<[string, T]>;
}

export class TrieMap<T> {

  private _trie = createTrie<T>();

  constructor(entries?: TrieMap.Entries<T> | null) {
    if (entries != null) {
      this.setAll(entries);
    }
  }

  set(key: string, value: T): this {
    setTrie(this._trie, key, value);
    return this;
  }

  setAll(entries: TrieMap.Entries<T>): this {
    for (const [key, value] of Array.from(entries)) {
      setTrie(this._trie, key, value);
    }
    return this;
  }

  get(key: string): T | undefined {
    const trie = searchTrie(this._trie, key, 0);
    return trie !== undefined && trie.length === key.length ? trie.value : undefined;
  }

  search(input: string, offset?: number): TrieNode<T> | undefined {
    return searchTrie(this._trie, input, offset || 0);
  }
}
