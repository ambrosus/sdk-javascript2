/**
 * Copyright 2018 Ambrosus Inc.
 * Email: tech@ambrosus.com
 */

import * as tokenUtils from './token-utils';
import * as file from './file';
import {
    checkAccessLevel,
    getName,
    getImage,
    getLocation,
    sortEventsByTimestamp,
    parseEvent,
    parseAsset,
    parseTimelineEvents,
    isLatest,
    findEvent,
    checkTimeStamp,
    parseEvents
} from './events-utils';

import {
    timeSince,
    validTimestamp
} from './time-utils';

/**
 * Check if the passed parameter is a valid object
 *
 * @param {any} value
 * @returns {boolean}
 */
function isObject(value) {
    return value !== null && typeof value === 'object' && value instanceof Object && !(value instanceof Array);
}

/**
 * Get the name from the URL
 *
 * @function getUrlName
 * @param {string} url
 * @returns {string} name
 */
const getUrlName = (url) => {
    let name = url.split('/');
    name = name[name.length - 1];
    return name;
};

/**
 * Seralize object into query params
 *
 * Creates a query params string by taking a params object.
 *
 * @function serializeParams
 * @param {Object} params properties to be passed as query params.
 * @returns {string} queryParams
 */
const serializeParams = params => {
    let serializeParams = '';

    for (let key in params) {
        if (serializeParams !== '') {
            serializeParams += '&';
        }
        serializeParams += key + '=' + encodeURIComponent(params[key]);
    }
    return serializeParams;
};

/**
 * Private method for UTF - 8 encoding
 *
 * @function utf8Encode
 * @param {string} string
 * @returns {string} encodedText
 */
const utf8Encode = (string) => {
    string = string.replace(/\r\n/g, '\n');
    let utftext = '';

    for (let n = 0; n < string.length; n++) {
        let c = string.charCodeAt(n);

        if (c < 128) {
            utftext += String.fromCharCode(c);
        } else if ((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        } else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }
    }

    return utftext;
};

/**
 * Base 64 encode
 *
 * @function base64url
 * @param {string} input
 * r@returns {string} encodedString
 */
const base64url = (input) => {
    const _keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output = '';
    let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    let i = 0;

    input = utf8Encode(input);

    while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output = output +
            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
    }
    return output;
};

export default {
    isObject,
    validTimestamp,
    checkTimeStamp,
    parseEvents,
    serializeParams,
    utf8Encode,
    base64url,
    checkAccessLevel,
    getImage,
    getLocation,
    getName,
    getUrlName,
    sortEventsByTimestamp,
    parseAsset,
    parseEvent,
    isLatest,
    findEvent,
    parseTimelineEvents,
    timeSince,
    isAddress: tokenUtils.isAddress,
    fromWei: tokenUtils.fromWei,
    toWei: tokenUtils.toWei,
    toHex: tokenUtils.toHex,
    randomHex: tokenUtils.randomHex,
    hashMessage: tokenUtils.hashMessage,
    calculateHash: tokenUtils.calculateHash,
    serializeForHashing: tokenUtils.serializeForHashing,
    readFile: file.readFile
};
