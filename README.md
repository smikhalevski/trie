# trie 🌲&ensp;[![build](https://github.com/smikhalevski/trie/actions/workflows/master.yml/badge.svg?branch=master&event=push)](https://github.com/smikhalevski/trie/actions/workflows/master.yml)

The [extremely fast](#performance) [compressed trie](https://en.wikipedia.org/wiki/Trie#Compressed_tries) implementation
in [1 kB gzipped](https://bundlephobia.com/result?p=@smikhalevski/trie).

```shell
npm install --save-prod @smikhalevski/trie
```

- [`trieCreate`](#triecreate)
- [`trieSet`](#trieset)
- [`trieGet`](#trieget)
- [`trieDelete`](#triedelete)
- [`trieSearch`](#triesearch)
- [`trieSuggest`](#triesuggest)

# Usage

[API documentation is available here.](https://smikhalevski.github.io/trie/)

### `trieCreate()`<a name="triecreate"></a>

Creates a blank [`Trie`](https://smikhalevski.github.io/trie/interfaces/Trie.html) instance. `Trie` is a plain object
that you pass as an argument to various functions that traverse and update the data structure.

```ts
const trie = trieCreate();
// → {key: null, value: null, …}
```

### `trieSet(trie, key, value)`<a name="trieset"></a>

Associates the `key` with the `value` in the `trie` and returns the leaf trie object that withholds the key-value pair.

The returned leaf trie instance has stable identity: this object would represent the associated key up to the moment it
is deleted. Setting new value, or adding other keys to the trie wouldn't change the object reference.

```ts
trieSet(trie, 'foo', 111);
// → {key: 'foo', value: 111, …}
```

### `trieGet(trie, key)`<a name="trieget"></a>

Returns a leaf associated with the `key`.

```ts
trieGet(trie, 'foo'); // → {key: 'foo', value: 111, …}

trieGet(trie, 'woopsie'); // → undefined
```

### `trieDelete(leaf)`<a name="triedelete"></a>

Deletes the `leaf` trie from its parent.

```ts
trieSet('foo', 111);

trieDelete(trieGet(trie, 'foo'));
```

You can delete all values with a particular prefix:

```ts
trieSuggest(trie, 'foo')?.forEach(trieDelete);
```

### `trieSearch(trie, input, startIndex?, endIndex?)`<a name="triesearch"></a>

Searches for a leaf with the key that matches the longest substring in `input` that starts at `startIndex` and ends at
`endIndex`.

```ts
trieSet(trie, 'foo', 111);
trieSet(trie, 'foobar', 222);

trieSearch(trie, '___foobar___', 3);
// → {key: 'foobar', value: 222, length: 6, …}

trieSearch(trie, '___fooba___', 3);
// → {key: 'foo', value: 111, length: 3, …}
```

You can provide the `endIndex` to limit the searched key length:

```ts
trieSearch(trie, '___foobar___', 3, 4);
// → {key: 'foo', value: 111, length: 3, …}
```

### `trieSuggest(trie, input, startIndex?, endIndex?)`<a name="triesuggest"></a>

Returns the cached readonly array of trie leafs that have keys starting with `input.substring(startIndex, endIndex)`.

```ts
trieSet(trie, 'hotdog', 111);
trieSet(trie, 'hotter', 222);
trieSet(trie, 'hottest', 333);

trieSuggest(trie, 'hot');
// → [{key: 'hotdog', …}, {key: 'hotter', …}, {key: 'hottest', …}]

trieSuggest(trie, 'hott');
// → [{key: 'hotter', …}, {key: 'hottest', …}]
```

# Performance

Clone this repo and use `npm ci && npm run perf` to run the performance testsuite.

## Search performance

![Search performance chart](https://github.com/smikhalevski/trie/raw/master/images/perf-search.svg)
