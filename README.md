# trie 🌲

The [extremely fast](#performance) [compressed trie](https://en.wikipedia.org/wiki/Trie#Compressed_tries) implementation
in [2 kB gzipped](https://bundlephobia.com/result?p=@smikhalevski/trie) and tree-shakeable.

🔎 [API documentation is available here.](https://smikhalevski.github.io/trie/)

```shell
npm install --save-prod @smikhalevski/trie
```

# Usage

Create a trie object:

```ts
import { createTrie } from '@smikhalevski/trie';

const trie = createTrie();
// ⮕ Trie { key: null, value: undefined }
```

[`Trie`](https://smikhalevski.github.io/trie/interfaces/Trie.html) is a plain object that you pass as an argument to
various functions that traverse and update the data structure.

To associate a key with the value in the trie, use
[`setValue`](https://smikhalevski.github.io/trie/functions/setValue.html):

```ts
const fooLeaf = setValue(trie, 'foo', 111);
// ⮕ Trie { key: 'foo', value: 111 }
```

[`setValue`](https://smikhalevski.github.io/trie/functions/setValue.html) returns the leaf trie object that withholds
the key-value pair. The returned leaf trie instance has stable identity: this object would represent this very key up to
the moment it is deleted. So, if you set a new value for the key, or add/delete other keys in the trie, the returned
leaf object would still correspond to the original key.

```ts
setValue(trie, 'foo', 222);
// ⮕ fooLeaf
```

To retrieve a value from the trie, use [`getValue`](https://smikhalevski.github.io/trie/functions/getValue.html):

```ts
getValue(trie, 'foo');
// ⮕ 111

getValue(trie, 'bar');
// ⮕ undefined
```

Or you can retrieve the whole leaf that withholds the key-value pair:

```ts
getLeaf(trie, 'foo');
// ⮕ Trie { key: 'foo', value: 111 }

getLeaf(trie, 'bar');
// ⮕ null
```

You can delete a key from the trie:

```ts
const leaf = setValue(trie, 'foo', 111);

deleteLeaf(leaf);
```

Or you can retrieve a leaf and then delete it:

```ts
deleteLeaf(getLeaf(trie, 'foo'));
```

# Search

Trie can be searched for a key that matches the longest substring in `input` that starts at `startIndex` and ends at
`endIndex`.

```ts
const trie = createTrie();

setValue(trie, 'foo', 111);
setValue(trie, 'foobar', 222);

search(trie, '___foobar___', 3);
// ⮕ Trie { key: 'foobar', value: 222, length: 6 }

search(trie, '___fooba___', 3);
// ⮕ Trie { key: 'foo', value: 111, length: 3 }
```

You can provide the `endIndex` to limit the searched key length:

```ts
search(trie, '___foobar___', 3, 7);
// ⮕ Trie { key: 'foo', value: 111, length: 3 }
```

[`search`](https://smikhalevski.github.io/trie/functions/search.html) is a powerful tool since it allow to search for
keys in strings without the need to create substrings.

# Suggestions

Trie can provide an array of values that are associated with keys that share the same prefix:

```ts
const trie = createTrie();

setValue(trie, 'hotdog', 111);
setValue(trie, 'hotter', 222);
setValue(trie, 'hottest', 333);

suggestValues(trie, 'hot');
// ⮕ [111, 222, 333]

suggestValues(trie, 'hott');
// ⮕ [222, 333]

suggestValues(trie, 'cold');
// ⮕ []
```

Or you can retrieve all leaf tries that withhold key-value pairs:

```ts
suggestLeafs(trie, 'hot');
// ⮕ [Trie { key: 'hotdog' }, Trie { key: 'hotter' }, Trie { key: 'hottest' }]

suggestLeafs(trie, 'hott');
// ⮕ [Trie { key: 'hotter' }, Trie { key: 'hottest' }]

// 🟡 null is returned if there are no matching leafs
suggestLeafs(trie, 'cold');
// ⮕ null
```

Using suggestions, you can delete all values with a particular prefix:

```ts
suggestLeafs(trie, 'hott')?.forEach(deleteLeaf);
```

# Encoded tries

Each leaf in the trie is an object. So storing _a lot_ of key-value pairs in a trie may require a significant amount of
memory. Encoded tries reduce the amount of required memory, and can also be easily serialized.

[`EncodedTrie`](https://smikhalevski.github.io/trie/interfaces/EncodedTrie.html) is backed by an array of indices
instead of a multitude of objects, that's why it has a tiny memory footprint. For example, encoded trie requires
400&times; less memory than [`Trie`](https://smikhalevski.github.io/trie/interfaces/Trie.html) to store 60K key-value
pairs.

_Encoded tries are read-only._

To create an [`EncodedTrie`](https://smikhalevski.github.io/trie/interfaces/EncodedTrie.html), we first need to create
a [`Trie`](https://smikhalevski.github.io/trie/interfaces/Trie.html) and then encode it. Usually you may want to encode
a trie at build time, serialize it, write to a JSON file and then import it at runtime.

```ts
const trie = createTrie();

setValue(trie, 'foo', 111);

const encodedTrie = encodeTrie(trie);

getEncodedValue(encodedTrie, 'foo');
// ⮕ 111
```

You can search an encoded trie for a key that matches the longest substring in `input` that starts at `startIndex` and
ends at `endIndex`:

```ts
const trie = createTrie();

setValue(trie, 'foo', 111);
setValue(trie, 'foobar', 222);

const encodedTrie = encodeTrie(trie);

searchEncoded(encodedTrie, '___foobar___', 3);
// ⮕ Match { value: 222, lastIndex: 9 }

searchEncoded(encodedTrie, '___fooba___', 3);
// ⮕ Match { value: 111, lastIndex: 6 }
```

You can provide the `endIndex` to limit the searched key length:

```ts
searchEncoded(encodedTrie, '___foobar___', 3, 7);
// ⮕ { value: 111, lastIndex: 6 }
```

# Performance

The chart below showcases the performance comparison of this library and its peers, in terms of millions of operations
per second (greater is better).

<img src="./images/perf.svg" alt="Performance">

Tests were conducted using [TooFast](https://github.com/smikhalevski/toofast#readme) on Apple M1 with Node.js v20.4.0.

To reproduce [the performance test suite](./src/test/perf.js) results, clone this repo and run:

```shell
npm ci
npm run build
npm run perf
```
