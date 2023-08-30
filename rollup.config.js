const nodeResolve = require('@rollup/plugin-node-resolve');
const dts = require('rollup-plugin-dts');

module.exports = [
  {
    input: './gen/index.js',
    output: [
      { file: './lib/index.js', format: 'cjs' },
      { file: './lib/index.mjs', format: 'es' },
    ],
    plugins: [nodeResolve()],
  },
  {
    input: './gen/index.d.ts',
    output: { file: './lib/index.d.ts', format: 'es' },
    plugins: [dts.default()],
  },
];
