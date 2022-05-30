# trie 🌲&ensp;[![build](https://github.com/smikhalevski/trie/actions/workflows/master.yml/badge.svg?branch=master&event=push)](https://github.com/smikhalevski/trie/actions/workflows/master.yml)

The [compressed trie data structure](https://en.wikipedia.org/wiki/Trie#Compressed_tries).

```shell
npm install --save-prod @smikhalevski/trie
```

# Usage

[API documentation is available here.](https://smikhalevski.github.io/trie/)

[`Trie`](https://smikhalevski.github.io/trie/interfaces/Trie.html) instance is a plain object that you pass as an
argument to various functions that traverse and update the data structure.

```ts
const trie = createTrie();
// → {key: null, value: null, …}
```

### `setTrie(trie, key, value)` and `setTrieEntries(key, entries)`

Populates a trie by setting an individual key-value or by setting a bulk list of entries.

```ts
setTrie(trie, 'foo', 123);

setTrieEntries(trie, new Map([['bar', 456], ['baz', 789]]));
```

### `getTrie(trie, key)`

Retrieve a trie leaf that was associated with a particular key.

```ts
getTrie(trie, 'foo'); // → {key: 'foo', value: 123, …}

getTrie(trie, 'woopsie'); // → undefined
```

### `deleteTrie(trie, key)`

Deletes the key and its corresponding value from the trie. Returns `true` if the key was deleted and `false` if there's
no such key in the trie.

```ts
setTrie('foo', 123);

deleteTrie(trie, 'foo'); // → true

deleteTrie(trie, 'foo'); // → false
```

### `searchTrie(trie, input, startIndex?, endIndex?)`

Finds a trie leaf with the key that matches the longest substring from `input` starting at `startIndex`.

```ts
setTrie(trie, 'foo', 123);
setTrie(trie, 'foobar', 456);

searchTrie(trie, '___foobar___', 3);
// → {key: 'foobar', value: 456, length: 6, …}

searchTrie(trie, '___fooba___', 3);
// → {key: 'foo', value: 123, length: 3, …}
```

You can provide the `endIndex` to limit the searched key length:

```ts
searchTrie(trie, '___foobar___', 3, 4);
// → {key: 'foo', value: 123, length: 3, …}
```

### `suggestTries(trie, input, startIndex?, endIndex?, leafs?)`

Returns the list of trie leafs that have keys that start with `input.substring(startIndex, endIndex)`.

```ts
setTrie(trie, 'hotdog', 123);
setTrie(trie, 'hotter', 456);
setTrie(trie, 'hottest', 456);

suggestTries(trie, 'hot'); 
// → [{key: 'hotdog', …}, {key: 'hotter', …}, {key: 'hottest', …}]

suggestTries(trie, 'hott'); 
// → [{key: 'hotter', …}, {key: 'hottest', …}]
```

# Performance

Clone this repo and use `npm ci && npm run perf` to run the performance testsuite.

## Search performance

![Search performance chart](https://github.com/smikhalevski/trie/raw/master/images/perf-search.svg)
