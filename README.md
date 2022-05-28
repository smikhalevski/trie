# trie 🌲&ensp;[![build](https://github.com/smikhalevski/trie/actions/workflows/master.yml/badge.svg?branch=master&event=push)](https://github.com/smikhalevski/trie/actions/workflows/master.yml)

The [compressed trie data structure](https://en.wikipedia.org/wiki/Trie#Compressed_tries).

```shell
npm install --save-prod @smikhalevski/trie
```

# Usage

[API documentation is available here.](https://smikhalevski.github.io/trie/)

This library is tree-shakeable, so you pay only for what you use:

```ts
import {createTrie, setTrie, searchTrie} from '@smikhalevski/trie';
```

Trie is a plain object that you pass as an argument to various trie manipulation functions:

```ts
const trie = createTrie();
```

Populate a trie by setting an individual key-value or by bulk setting from any iterable, like `Map` or `Array`.

```ts
setTrie(trie, 'foo', 123);

setAllTrie(trie, new Map([['bar', 456], ['baz', 789]]));
```

You can retrieve a sub-trie that was associated with a particular value:

```ts
getTrie(trie, 'foo'); // → {key: 'foo', value: 123, …}

getTrie(trie, 'woopsie'); // → undefined
```

You can search for a leaf trie that has the key equal to the longest substring.

```ts
const trie = createTrie();

setTrie(trie, 'foo', 123);
setTrie(trie, 'foozie', 456);

searchTrie(trie, '___foozie___', 3);
// → {key: 'foozie', value: 123, length: 6, …}
```

# Performance

Clone this repo and use `npm ci && npm run perf` to run the performance testsuite.

## Search performance

![Search performance chart](https://github.com/smikhalevski/trie/raw/master/images/perf-search.svg)
