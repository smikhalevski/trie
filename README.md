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
const trie = trieCreate();
// → {key: null, value: null, …}
```

### `trieSet(trie, key, value)` and `trieSetEntries(key, entries)`

Populates a trie by setting an individual key-value or by setting a bulk list of entries.

```ts
trieSet(trie, 'foo', 123);

trieSetEntries(trie, new Map([['bar', 456], ['baz', 789]]));
```

### `trieGet(trie, key)`

Retrieve a trie leaf that was associated with a particular key.

```ts
trieGet(trie, 'foo'); // → {key: 'foo', value: 123, …}

trieGet(trie, 'woopsie'); // → undefined
```

### `trieDelete(trie, key)`

Deletes the key and its corresponding value from the trie. Returns `true` if the key was deleted and `false` if there's
no such key in the trie.

```ts
trieSet('foo', 123);

trieDelete(trie, 'foo'); // → true

trieDelete(trie, 'foo'); // → false
```

### `trieSearch(trie, input, startIndex?, endIndex?)`

Finds a trie leaf with the key that matches the longest substring from `input` starting at `startIndex`.

```ts
trieSet(trie, 'foo', 123);
trieSet(trie, 'foobar', 456);

trieSearch(trie, '___foobar___', 3);
// → {key: 'foobar', value: 456, length: 6, …}

trieSearch(trie, '___fooba___', 3);
// → {key: 'foo', value: 123, length: 3, …}
```

You can provide the `endIndex` to limit the searched key length:

```ts
trieSearch(trie, '___foobar___', 3, 4);
// → {key: 'foo', value: 123, length: 3, …}
```

### `trieSuggest(trie, input, startIndex?, endIndex?)`

Returns the list of trie leafs that have keys that start with `input.substring(startIndex, endIndex)`.

```ts
trieSet(trie, 'hotdog', 123);
trieSet(trie, 'hotter', 456);
trieSet(trie, 'hottest', 456);

trieSuggest(trie, 'hot'); 
// → [{key: 'hotdog', …}, {key: 'hotter', …}, {key: 'hottest', …}]

trieSuggest(trie, 'hott'); 
// → [{key: 'hotter', …}, {key: 'hottest', …}]
```

# Performance

Clone this repo and use `npm ci && npm run perf` to run the performance testsuite.

## Search performance

![Search performance chart](https://github.com/smikhalevski/trie/raw/master/images/perf-search.svg)
