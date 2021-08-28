import path from 'path';

import { babel } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import { preserveShebangs } from 'rollup-plugin-preserve-shebangs';

import pkg from './package.json';

const input = './src/index.ts';
const cli = './src/cli/cli.ts';

const external = (id) => {
   return id.startsWith('.') === false && path.isAbsolute(id) === false;
};

const extensions = ['.tsx', '.ts', '.js', '.jsx', '.es6', '.es', '.mjs'];

const babelOptions = {
   babelHelpers: 'runtime',
   extensions,
   include: ['src/**/*'],
   presets: ['@babel/preset-typescript'],
   plugins: ['@babel/plugin-transform-runtime'],
   exclude: ['babel.config.js'],
};

export default [
   {
      input: cli,
      external,
      plugins: [
         // Allows node_modules resolution
         resolve({ extensions }),

         // Allow bundling cjs modules. Rollup doesn't understand cjs
         commonjs(),

         babel(babelOptions),
         replace({
            preventAssignment: true,
         }),

         terser(),
         preserveShebangs(),
      ],
      output: [
         {
            file: 'build/cli.cjs.js',
            format: 'cjs',
         },
      ],
   },
   {
      input,
      external,
      plugins: [
         // Allows node_modules resolution
         resolve({ extensions }),

         // Allow bundling cjs modules. Rollup doesn't understand cjs
         commonjs(),

         babel(babelOptions),
         replace({
            preventAssignment: true,
         }),

         terser(),
      ],
      output: [
         {
            file: pkg.main,
            format: 'cjs',
         },
      ],
   },
];
