const TrieSearch = require('trie-search');
const dictionary = require('./dictionary.json');
const {trieSet, trieCreate, trieDelete, trieSearch, trieGet, trieSuggest} = require('../../lib/index-cjs');

const startHeapUsed1 = process.memoryUsage().heapUsed
const libTrieSearch = new TrieSearch();
dictionary.forEach((word) => {
  libTrieSearch.map(word, word);
});
console.log('trie-search', (process.memoryUsage().heapUsed - startHeapUsed1) / 1024 / 1024);


const startHeapUsed2 = process.memoryUsage().heapUsed
const trie = trieCreate();
dictionary.forEach((word) => {
  trieSet(trie, word, word);
});
// eval("%CollectGarbage('all')");

console.log('trie', (process.memoryUsage().heapUsed - startHeapUsed2) / 1024 / 1024);

// console.log(%HaveSameMap( trie[97], trie[98] ))

const startHeapUsed3 = process.memoryUsage().heapUsed
const libMap = new Map();
dictionary.forEach((word) => {
  libMap.set(word, word);
});
console.log('Map', (process.memoryUsage().heapUsed - startHeapUsed3) / 1024 / 1024);


// test('', () => {
// })