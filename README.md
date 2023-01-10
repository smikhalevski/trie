# trie 🌲&ensp;[![build](https://github.com/smikhalevski/trie/actions/workflows/master.yml/badge.svg?branch=master&event=push)](https://github.com/smikhalevski/trie/actions/workflows/master.yml)

The [extremely fast](#performance) [compressed trie](https://en.wikipedia.org/wiki/Trie#Compressed_tries) implementation
in [2 kB gzipped](https://bundlephobia.com/result?p=@smikhalevski/trie).

```shell
npm install --save-prod @smikhalevski/trie
```

- Object-backed trie
  - [`trieCreate`](#triecreate)
  - [`trieSet`](#trieset)
  - [`trieGet`](#trieget)
  - [`trieSearch`](#triesearch)
  - [`trieSuggest`](#triesuggest)
  - [`trieDelete`](#triedelete)

- Array-backed trie
  - [`arrayTrieEncode`](#arraytrieencode)
  - [`arrayTrieGet`](#arraytrieget)
  - [`arrayTrieSearch`](#arraytriesearch)

# Usage

🔎 [API documentation is available here.](https://smikhalevski.github.io/trie/)

### `trieCreate()`<a name="triecreate"></a>

Creates a blank [`Trie`](https://smikhalevski.github.io/trie/interfaces/Trie.html) instance. `Trie` is a plain object
that you pass as an argument to various functions that traverse and update the data structure.

```ts
const trie = trieCreate();
// ⮕ { key: null, value: undefined, … }
```

### `trieSet(trie, key, value)`<a name="trieset"></a>

Associates the `key` with the `value` in the `trie` and returns the leaf trie object that withholds the key-value pair.

```ts
const trie = trieCreate();

trieSet(trie, 'foo', 111);
// ⮕ { key: 'foo', value: 111, … }
```

The returned leaf trie instance has stable identity: this object would represent the associated key up to the moment
[the key is deleted](#delete). So, if you set a new value for the key, or add/delete other keys in the trie, the
returned leaf object would still correspond to the original key.

```ts
const leaf1 = trieSet(trie, 'foo', 111);
const leaf2 = trieSet(trie, 'foo', 222);

leaf1 === leaf2 // ⮕ true
```

### `trieGet(trie, key)`<a name="trieget"></a>

Returns a leaf associated with the `key`.

```ts
const trie = trieCreate();

trieSet(trie, 'foo', 111);

trieGet(trie, 'foo');
// ⮕ { key: 'foo', value: 111, … }

trieGet(trie, 'wow');
// ⮕ null
```

### `trieSearch(trie, input, startIndex?, endIndex?)`<a name="triesearch"></a>

Searches for a key that matches the longest substring in `input` that starts at `startIndex` and ends at `endIndex`, and
returns the corresponding leaf.

```ts
const trie = trieCreate();

trieSet(trie, 'foo', 111);
trieSet(trie, 'foobar', 222);

trieSearch(trie, '___foobar___', 3);
// ⮕ { key: 'foobar', value: 222, length: 6, … }

trieSearch(trie, '___fooba___', 3);
// ⮕ { key: 'foo', value: 111, length: 3, … }
```

You can provide the `endIndex` to limit the searched key length:

```ts
trieSearch(trie, '___foobar___', 3, 7);
// ⮕ { key: 'foo', value: 111, length: 3, … }
```

### `trieSuggest(trie, input, startIndex?, endIndex?)`<a name="triesuggest"></a>

Returns the cached readonly array of trie leafs that have keys starting with `input.substring(startIndex, endIndex)`.

```ts
const trie = trieCreate();

trieSet(trie, 'hotdog', 111);
trieSet(trie, 'hotter', 222);
trieSet(trie, 'hottest', 333);

trieSuggest(trie, 'hot');
// ⮕ [{ key: 'hotdog', … }, { key: 'hotter', … }, { key: 'hottest', … }]

trieSuggest(trie, 'hott');
// ⮕ [{ key: 'hotter', … }, { key: 'hottest', … }]

trieSuggest(trie, 'wow');
// ⮕ null
```

### `trieDelete(leaf)`<a name="triedelete"></a>

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

### `arrayTrieEncode(trie)`<a name="arraytrieencode"></a>

Converts [`Trie`](https://smikhalevski.github.io/trie/interfaces/Trie.html) into an
[`ArrayTrie`](https://smikhalevski.github.io/trie/interfaces/ArrayTrie.html).

`Trie` is comprised of multiple objects that represent branches and leafs. `ArrayTrie` withholds all the data from the
`Trie` instance in just 3 objects regardless the number of key-value pairs in the original `Trie` instance.

```ts
const trie = trieCreate();

trieSet(trie, 'foo', 111);

const arrayTrie = arrayTrieEncode(trie);

arrayTrieGet(arrayTrie, 'foo');
// ⮕ 111
```

`ArrayTrie` is backed by an array of indices instead of a tree of objects, it has a tiny memory footprint. It requires
400&times; less memory than the `Trie` instance with the same set of key-value pairs.

### `arrayTrieGet(arrayTrie, key)`<a name="arraytrieget"></a>

Returns a value associated with the `key`.

```ts
const trie = trieCreate();

trieSet(trie, 'foo', 111);
trieSet(trie, 'bar', 222);

const arrayTrie = arrayTrieEncode(trie);

arrayTrieGet(arrayTrie, 'bar');
// ⮕ 222

arrayTrieGet(arrayTrie, 'wow');
// ⮕ null
```

### `arrayTrieSearch(trie, input, startIndex?, endIndex?)`<a name="arraytriesearch"></a>

Searches for a key that matches the longest substring in `input` that starts at `startIndex` and ends at `endIndex`, and
returns the corresponding value.

```ts
const trie = trieCreate();

trieSet(trie, 'foo', 111);
trieSet(trie, 'foobar', 222);

const arrayTrie = arrayTrieEncode(trie);

arrayTrieSearch(arrayTrie, '___foobar___', 3);
// ⮕ { value: 222, lastIndex: 9 }

arrayTrieSearch(arrayTrie, '___fooba___', 3);
// ⮕ { value: 111, lastIndex: 6 }
```

You can provide the `endIndex` to limit the searched key length:

```ts
arrayTrieSearch(arrayTrie, '___foobar___', 3, 7);
// ⮕ { value: 111, lastIndex: 6 }
```

# Performance

Clone this repo and use `npm ci && npm run perf` to run the performance testsuite.

### Search / Get

![Get performance chart](https://github.com/smikhalevski/trie/raw/master/images/perf-get.svg)

### Add a new key

![Add a new key performance chart](https://github.com/smikhalevski/trie/raw/master/images/perf-add.svg)

### Update an existing key

![Update an existing key performance chart](https://github.com/smikhalevski/trie/raw/master/images/perf-update.svg)
