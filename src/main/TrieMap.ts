import {createTrieNode, TrieNode, searchTrieNode, setTrieNode} from './trie-utils';

export namespace TrieMap {

  export type Entries<T> = [string, T][] | ArrayLike<[string, T]> | Iterable<[string, T]>;
}

export class TrieMap<T> {

  private _trie = createTrieNode<T>();

  constructor(entries?: TrieMap.Entries<T> | null) {
    if (entries != null) {
      this.setAll(entries);
    }
  }

  set(key: string, value: T): this {
    setTrieNode(this._trie, key, value);
    return this;
  }

  setAll(entries: TrieMap.Entries<T>): this {
    for (const [key, value] of Array.from(entries)) {
      setTrieNode(this._trie, key, value);
    }
    return this;
  }

  get(key: string): T | undefined {
    const trie = searchTrieNode(this._trie, key, 0);
    return trie !== undefined && trie.length === key.length ? trie.value : undefined;
  }

  search(input: string, offset?: number): TrieNode<T> | undefined {
    return searchTrieNode(this._trie, input, offset || 0);
  }
}
