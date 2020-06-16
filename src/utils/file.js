/*
Copyright: Ambrosus Inc.
Email: tech@ambrosus.com

This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

This Source Code Form is “Incompatible With Secondary Licenses”, as defined by the Mozilla Public License, v. 2.0.
*/

// tslint:disable-next-line:no-var-requires
const fs = require('fs');
const path = require('path');

export const writeFile = (filepath, data, opts = {}) =>
  new Promise((resolve, reject) => {
    fs.mkdir(path.dirname(filepath), {recursive: true}, (err) => {
      if (err) {
        throw new Error(`can't create dir for ${filepath}: ${err}`);
      }
    });

    fs.writeFile(filepath, data, opts, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

export const readFile = (filepath) =>
  new Promise((resolve, reject) => {
    fs.readFile(filepath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

export const removeFile = (filepath) =>
  new Promise((resolve, reject) => {
    fs.unlink(filepath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

export const checkFileExists = (filepath) =>
  new Promise((resolve) => {
    fs.access(filepath, (err) => {
      resolve(!err);
    });
  });

export const listDirectory = (filepath) =>
  new Promise((resolve, reject) => {
    fs.readdir(filepath, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });

export const removeDirectory = (filepath) =>
  new Promise((resolve, reject) => {
    fs.rmdir(filepath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

export const makeDirectory = (filepath) =>
  new Promise((resolve, reject) => {
    fs.mkdir(filepath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

export const getfilepath = (filepath) =>
  new Promise((resolve, reject) => {
    fs.lstat(filepath, (err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve(stats);
      }
    });
  });