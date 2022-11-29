import path from 'path'
import { defineConfig } from 'rollup'
import { terser } from 'rollup-plugin-terser'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import nodeResolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import postcss from 'rollup-plugin-postcss'
import { babel } from '@rollup/plugin-babel'
import pkg from './package.json' assert { type: 'json' }

const deps = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})]
const globals = {
  'react': 'React',
  'react-dom': 'ReactDOM',
  'socket.io-client': 'io',
}

const moduleName = pkg.name.replace(/^@.*\//, '')
const inputFileName = 'src/index.tsx'
const author = pkg.author
const banner = `
  /**
   * @license
   * author: ${author}
   * ${moduleName}.js v${pkg.version}
   * Released under the ${pkg.license} license.
   */
`

export default defineConfig({
  input: inputFileName,
  onwarn(warning, warn) {
    if (warning.code === 'THIS_IS_UNDEFINED') return
    warn(warning)
  },
  output: [
    {
      name: 'RevealSocialPresence',
      file: pkg.browser,
      format: 'iife',
      sourcemap: 'inline',
      extend: true,
      banner,
      globals,
    },
    {
      name: 'RevealSocialPresence',
      file: pkg.browser.replace('.js', '.min.js'),
      format: 'iife',
      sourcemap: 'inline',
      banner,
      extend: true,
      globals,
      plugins: [terser()],
    },
  ],
  external: [...deps],
  plugins: [
    typescript(),
    commonjs({
      extensions: ['.js', '.ts'],
    }),
    json({
      compact: true,
    }),
    babel({
      babelHelpers: 'bundled',
      configFile: path.resolve(__dirname, '.babelrc.js'),
    }),
    nodeResolve({
      browser: true,
    }),
    replace({
      preventAssignment: true,
      values: {
        'process.env.NODE_ENV': JSON.stringify('production'),
        '__VERSION__': pkg.version,
      },
    }),
    postcss({
      minimize: true,
      modules: false,
      extract: true,
    }),
  ],
})
