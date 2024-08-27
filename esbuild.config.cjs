const esbuild = require('esbuild')

esbuild
  .build({
    entryPoints: ['./server.ts'],
    bundle: true,
    platform: 'node',
    target: 'es6',
    sourcemap: 'inline',
    outfile: './tmp/app-bundle.cjs',
  })
  .catch((e) => console.error(e))
