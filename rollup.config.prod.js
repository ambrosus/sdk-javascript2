import resolve from 'rollup-plugin-node-resolve';
import buble from 'rollup-plugin-buble';

import minify from 'rollup-plugin-babel-minify';
import sourceMaps from 'rollup-plugin-sourcemaps';
import json from 'rollup-plugin-json';

import gzip from 'rollup-plugin-gzip';
import filesize from 'rollup-plugin-filesize';

import del from 'rollup-plugin-delete';

const path = require('path');
const license = require('rollup-plugin-license');

const pkg = require('./package.json');

export default {
    input: 'src/index.js',
    external: ['web3'],
    output: [{
        file: pkg.main,
        format: 'cjs',
        banner: '/* Ambrosus Javascript SDK v' + pkg.version + ' */',
        sourcemap: true,
        globals: {
            web3: 'Web3'
        }
    },
    {
        file: pkg.module,
        format: 'umd',
        banner: '/* Ambrosus Javascript SDK v' + pkg.version + ' */',
        name: 'AmbrosusSDK',
        sourcemap: true,
        globals: {
            web3: 'Web3'
        }
    }],
    plugins: [
        del({
            targets: 'lib/*'
        }),
        json(),
        resolve({
            modulesOnly: true
        }),
        buble({ include: [/node_modules/] }),
        minify({
            comments: false
        }),
        sourceMaps(),
        gzip({
            gzipOptions: {
                level: 9
            },
            minSize: 1000,
            additionalFilesDelay: 5000
        }),
        filesize({
            showGzippedSize: true
        }),
        license({
            banner: {
                sourceMap: true,
                file: path.join(__dirname, 'LICENSE')
            }
        })
    ]
};
