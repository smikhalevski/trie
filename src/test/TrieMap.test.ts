import {TrieMap} from '../main';

describe('TrieMap', () => {

  test('gets value by key', () => {
    const map = new TrieMap([['aaa', 'bbb']]);

    expect(map.get('aaa')).toBe('bbb')
  });

  test('does not get value by key if key is not fully matched', () => {
    const map = new TrieMap([['aaa', 'bbb']]);

    expect(map.get('aaaaaa')).toBeUndefined();
  })
});
