/**
 * Copyright 2018 Ambrosus Inc.
 * Email: tech@ambrosus.com
 */

import { handleResponse } from './../responseHandler';
import utils from '../utils/index';

/**
 * Create a GET request
 *
 * @param {string} path
 * @param {Object} headers
 * @param {Object} params
 */
export function getRequest(path, headers, params) {
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('GET', `${path}${utils.serializeParams(params)}`, true);
        if (headers) {
            for (const key in headers) {
                request.setRequestHeader(`${key}`, `${headers[key]}`);
            }
        }
        request.onload = () => {
            handleResponse(request)
                .then(response => resolve(response))
                .catch(error => reject(error));
        };
        request.send();
    });
}

/**
 * Create a POST Request
 *
 * @param {string} path
 * @param {Object} headers
 * @param {Object} params
 */
export function postRequest(path, headers, params) {
    /* istanbul ignore next */
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('POST', path, true);

//console.log(`postRequest.URL ${path}`);
//console.log(`postRequest.headers ${JSON.stringify(headers)}`);
//console.log(`postRequest.params ${JSON.stringify(params)}`);

        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        if (headers) {
            for (const key in headers) {
                request.setRequestHeader(`${key}`, `${headers[key]}`);
            }
        }
        request.onload = () => {
            handleResponse(request)
                .then(response => resolve(response))
                .catch(error => reject(error));
        };
        request.send(JSON.stringify(params));
    });
}
