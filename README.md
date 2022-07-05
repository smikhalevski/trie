# trie 🌲&ensp;[![build](https://github.com/smikhalevski/trie/actions/workflows/master.yml/badge.svg?branch=master&event=push)](https://github.com/smikhalevski/trie/actions/workflows/master.yml)

The [extremely fast](#performance) [compressed trie](https://en.wikipedia.org/wiki/Trie#Compressed_tries) implementation
in [1 kB gzipped](https://bundlephobia.com/result?p=@smikhalevski/trie).

```shell
npm install --save-prod @smikhalevski/trie
```

- [`trieCreate`](#create)
- [`trieSet`](#set)
- [`trieGet`](#get)
- [`trieSearch`](#search)
- [`trieSuggest`](#suggest)
- [`trieDelete`](#delete)

# Usage

🔎 [API documentation is available here.](https://smikhalevski.github.io/trie/)

### `trieCreate()`<a name="create"></a>

Creates a blank [`Trie`](https://smikhalevski.github.io/trie/interfaces/Trie.html) instance. `Trie` is a plain object
that you pass as an argument to various functions that traverse and update the data structure.

```ts
const trie = trieCreate();
// → {key: null, value: undefined, …}
```

### `trieSet(trie, key, value)`<a name="set"></a>

Associates the `key` with the `value` in the `trie` and returns the leaf trie object that withholds the key-value pair.

```ts
const trie = trieCreate();

trieSet(trie, 'foo', 111);
// → {key: 'foo', value: 111, …}
```

The returned leaf trie instance has stable identity: this object would represent the associated key up to the moment
[the key is deleted](#delete). So, if you set a new value for the key, or add/delete other keys in the trie, the
returned leaf object would still correspond to the original key.

```ts
const leaf1 = trieSet(trie, 'foo', 111);
const leaf2 = trieSet(trie, 'foo', 222);

leaf1 === leaf2 // → true
```

### `trieGet(trie, key)`<a name="get"></a>

Returns a leaf associated with the `key`.

```ts
const trie = trieCreate();

trieSet(trie, 'foo', 111);

trieGet(trie, 'foo');
// → {key: 'foo', value: 111, …}

trieGet(trie, 'woopsie');
// → null
```

### `trieSearch(trie, input, startIndex?, endIndex?)`<a name="search"></a>

Searches for a leaf with the key that matches the longest substring in `input` that starts at `startIndex` and ends at
`endIndex`.

```ts
const trie = trieCreate();

trieSet(trie, 'foo', 111);
trieSet(trie, 'foobar', 222);

trieSearch(trie, '___foobar___', 3);
// → {key: 'foobar', value: 222, length: 6, …}

trieSearch(trie, '___fooba___', 3);
// → {key: 'foo', value: 111, length: 3, …}
```

You can provide the `endIndex` to limit the searched key length:

```ts
trieSearch(trie, '___foobar___', 3, 7);
// → {key: 'foo', value: 111, length: 3, …}
```

### `trieSuggest(trie, input, startIndex?, endIndex?)`<a name="suggest"></a>

Returns the cached readonly array of trie leafs that have keys starting with `input.substring(startIndex, endIndex)`.

```ts
const trie = trieCreate();

trieSet(trie, 'hotdog', 111);
trieSet(trie, 'hotter', 222);
trieSet(trie, 'hottest', 333);

trieSuggest(trie, 'hot');
// → [{key: 'hotdog', …}, {key: 'hotter', …}, {key: 'hottest', …}]

trieSuggest(trie, 'hott');
// → [{key: 'hotter', …}, {key: 'hottest', …}]

trieSuggest(trie, 'wow');
// → null
```

### `trieDelete(leaf)`<a name="delete"></a>

Deletes the `leaf` trie from its parent.

```ts
const trie = trieCreate();

const leaf = trieSet(trie, 'foo', 111);

trieDelete(leaf);
```

Or you can combine it with `trieGet`:

```ts
trieDelete(trieGet(trie, 'foo'));
```

You can delete all values with a particular prefix:

```ts
trieSuggest(trie, 'foo')?.forEach(trieDelete);
```

# Performance

Clone this repo and use `npm ci && npm run perf` to run the performance testsuite.

### Search / Get
![Get performance chart](https://github.com/smikhalevski/trie/raw/master/images/perf-get.svg)

### Add a new key
![Add a new key performance chart](https://github.com/smikhalevski/trie/raw/master/images/perf-add.svg)

### Update an existing key
![Update an existing key performance chart](https://github.com/smikhalevski/trie/raw/master/images/perf-update.svg)
