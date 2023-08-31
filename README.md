# trie 🌲&ensp;[![build](https://github.com/smikhalevski/trie/actions/workflows/master.yml/badge.svg?branch=master&event=push)](https://github.com/smikhalevski/trie/actions/workflows/master.yml)

The [extremely fast](#performance) [compressed trie](https://en.wikipedia.org/wiki/Trie#Compressed_tries) implementation
in [2 kB gzipped](https://bundlephobia.com/result?p=@smikhalevski/trie).

```shell
npm install --save-prod @smikhalevski/trie
```

- Object-backed trie
  - [`createTrie`](#triecreate)
  - [`setValue`](#trieset)
  - [`getLeaf`](#trieget)
  - [`search`](#triesearch)
  - [`suggest`](#triesuggest)
  - [`deleteLeaf`](#triedelete)

- Array-backed trie
  - [`encodeTrie`](#arraytrieencode)
  - [`getEncodedValue`](#arraytrieget)
  - [`searchEncoded`](#arraytriesearch)

# Usage

🔎 [API documentation is available here.](https://smikhalevski.github.io/trie/)

### `createTrie()`<a name="triecreate"></a>

Creates a blank [`Trie`](https://smikhalevski.github.io/trie/interfaces/Trie.html) instance. `Trie` is a plain object
that you pass as an argument to various functions that traverse and update the data structure.

```ts
const trie = createTrie();
// ⮕ { key: null, value: undefined, … }
```

### `setValue(trie, key, value)`<a name="trieset"></a>

Associates the `key` with the `value` in the `trie` and returns the leaf trie object that withholds the key-value pair.

```ts
const trie = createTrie();

setValue(trie, 'foo', 111);
// ⮕ { key: 'foo', value: 111, … }
```

The returned leaf trie instance has stable identity: this object would represent the associated key up to the moment
[the key is deleted](#triedelete). So, if you set a new value for the key, or add/delete other keys in the trie, the
returned leaf object would still correspond to the original key.

```ts
const leaf1 = setValue(trie, 'foo', 111);
const leaf2 = setValue(trie, 'foo', 222);

leaf1 === leaf2 // ⮕ true
```

### `getLeaf(trie, key)`<a name="trieget"></a>

Returns a leaf associated with the `key`.

```ts
const trie = createTrie();

setValue(trie, 'foo', 111);

getLeaf(trie, 'foo');
// ⮕ { key: 'foo', value: 111, … }

getLeaf(trie, 'wow');
// ⮕ null
```

### `search(trie, input, startIndex?, endIndex?)`<a name="triesearch"></a>

Searches for a key that matches the longest substring in `input` that starts at `startIndex` and ends at `endIndex`, and
returns the corresponding leaf.

```ts
const trie = createTrie();

setValue(trie, 'foo', 111);
setValue(trie, 'foobar', 222);

search(trie, '___foobar___', 3);
// ⮕ { key: 'foobar', value: 222, length: 6, … }

search(trie, '___fooba___', 3);
// ⮕ { key: 'foo', value: 111, length: 3, … }
```

You can provide the `endIndex` to limit the searched key length:

```ts
search(trie, '___foobar___', 3, 7);
// ⮕ { key: 'foo', value: 111, length: 3, … }
```

### `suggestLeafs(trie, input, startIndex?, endIndex?)`<a name="triesuggest"></a>

Returns the cached readonly array of trie leafs that have keys starting with `input.substring(startIndex, endIndex)`.

```ts
const trie = createTrie();

setValue(trie, 'hotdog', 111);
setValue(trie, 'hotter', 222);
setValue(trie, 'hottest', 333);

suggestLeafs(trie, 'hot');
// ⮕ [{ key: 'hotdog', … }, { key: 'hotter', … }, { key: 'hottest', … }]

suggestLeafs(trie, 'hott');
// ⮕ [{ key: 'hotter', … }, { key: 'hottest', … }]

suggestLeafs(trie, 'wow');
// ⮕ null
```

### `deleteLeaf(leaf)`<a name="triedelete"></a>

Deletes the `leaf` trie from its parent.

```ts
const trie = createTrie();

const leaf = setValue(trie, 'foo', 111);

deleteLeaf(leaf);
```

Or you can combine it with `getLeaf`:

```ts
deleteLeaf(getLeaf(trie, 'foo'));
```

You can delete all values with a particular prefix:

```ts
suggestLeafs(trie, 'foo')?.forEach(deleteLeaf);
```

### `encodeTrie(trie)`<a name="arraytrieencode"></a>

Converts [`Trie`](https://smikhalevski.github.io/trie/interfaces/Trie.html) into an
[`ArrayTrie`](https://smikhalevski.github.io/trie/interfaces/ArrayTrie.html).

`Trie` is comprised of multiple objects that represent branches and leafs. `ArrayTrie` withholds all the data from the
`Trie` instance in just 3 objects regardless the number of key-value pairs in the original `Trie` instance.

```ts
const trie = createTrie();

setValue(trie, 'foo', 111);

const encodedTrie = encodeTrie(trie);

getEncodedValue(encodedTrie, 'foo');
// ⮕ 111
```

`ArrayTrie` is backed by an array of indices instead of a tree of objects, it has a tiny memory footprint. It requires
400&times; less memory than the `Trie` instance with the same set of key-value pairs.

### `getEncodedValue(encodedTrie, key)`<a name="arraytrieget"></a>

Returns a value associated with the `key`.

```ts
const trie = createTrie();

setValue(trie, 'foo', 111);
setValue(trie, 'bar', 222);

const encodedTrie = encodeTrie(trie);

getEncodedValue(encodedTrie, 'bar');
// ⮕ 222

getEncodedValue(encodedTrie, 'wow');
// ⮕ null
```

### `searchEncoded(encodedTrie, input, startIndex?, endIndex?)`<a name="arraytriesearch"></a>

Searches for a key that matches the longest substring in `input` that starts at `startIndex` and ends at `endIndex`, and
returns the corresponding value.

```ts
const trie = createTrie();

setValue(trie, 'foo', 111);
setValue(trie, 'foobar', 222);

const encodedTrie = encodeTrie(trie);

searchEncoded(encodedTrie, '___foobar___', 3);
// ⮕ { value: 222, lastIndex: 9 }

searchEncoded(encodedTrie, '___fooba___', 3);
// ⮕ { value: 111, lastIndex: 6 }
```

You can provide the `endIndex` to limit the searched key length:

```ts
searchEncoded(encodedTrie, '___foobar___', 3, 7);
// ⮕ { value: 111, lastIndex: 6 }
```

# Performance

Clone this repo and use `npm ci && npm run perf` to run the performance testsuite.

### Search / Get

![Get performance chart](./images/perf-get.svg)

### Add a new key

![Add a new key performance chart](./images/perf-add.svg)

### Update an existing key

![Update an existing key performance chart](./images/perf-update.svg)
