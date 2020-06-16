import eslint from 'rollup-plugin-eslint';
import buble from 'rollup-plugin-buble';
import sourceMaps from 'rollup-plugin-sourcemaps';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';

const pkg = require('./package.json');

export default {
    input: 'src/index.js',
    external: ['web3'],
    output: [{
        file: 'lib/ambrosus.cjs.js',
        format: 'cjs',
        banner: '/* Ambrosus Javascript SDK v' + pkg.version + ' */',
        sourcemap: true,
        globals: {
            web3: 'Web3'
        }
    },
    {
        file: 'lib/ambrosus.js',
        format: 'iife',
        name: 'AmbrosusSDK',
        banner: '/* Ambrosus Javascript SDK v' + pkg.version + ' */',
        sourcemap: true,
        globals: {
            web3: 'Web3'
        }
    }],
    watch: {
        chokidar: true,
        exclude: ['node_modules/**']
    },
    plugins: [eslint({
        fix: true
    }), json(), resolve({
        modulesOnly: true
    }), buble({ include: [/node_modules/] }), sourceMaps()]
};
