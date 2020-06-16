/**
 * Copyright 2018 Ambrosus Inc.
 * Email: tech@ambrosus.com
 */
import Web3 from 'web3';
import {
    rejectResponse
} from '../responseHandler';

const web3 = new Web3();

/**
 * Takes a number of wei and converts it to any other ether unit.
 *
 * Possible units are:
 *   SI Short   SI Full        Effigy       Other
 * - kwei       femtoether     babbage
 * - mwei       picoether      lovelace
 * - gwei       nanoether      shannon      nano
 * - --         microether     szabo        micro
 * - --         milliether     finney       milli
 * - ether      --             --
 * - kether                    --           grand
 * - mether
 * - gether
 * - tether
 *
 * @method fromWei
 *
 * @param {String|BN} number can be a BigNumber, number string or a HEX of a decimal
 * @param {String} unit the unit to convert to, default ether
 *
 * @returns {String} Returns a string
 */
export const fromWei = (value, unit = 'ether') => {
    return web3.utils.fromWei(value, unit);
};

/**
 * Takes a number of a unit and converts it to wei.
 *
 * Possible units are:
 *   SI Short   SI Full        Effigy       Other
 * - kwei       femtoether     babbage
 * - mwei       picoether      lovelace
 * - gwei       nanoether      shannon      nano
 * - --         microether     szabo        micro
 * - --         microether     szabo        micro
 * - --         milliether     finney       milli
 * - ether      --             --
 * - kether                    --           grand
 * - mether
 * - gether
 * - tether
 *
 * @method toWei
 *
 * @param {String|BN} number can be a number, number string or a HEX of a decimal
 * @param {String} unit the unit to convert from, default ether
 *
 * @returns {String|BN} When given a BN object it returns one as well, otherwise a string
 */
export const toWei = (value, unit = 'ether') => {
    return web3.utils.toWei(value, unit);
};

/**
 * Checks if the given string is an address
 *
 * @method isAddress
 *
 * @param {String} address the given HEX address
 *
 * @returns {Boolean}
 */
export const isAddress = (address) => {
    return web3.utils.isAddress(address);
};

/**
 * Will create a random bytes HEX string
 *
 * @function randomHex
 * @param {Number} bytes
 * @returns {String}
 */
export const randomHex = (bytes) => {
    return web3.utils.randomHex(bytes);
};

/**
 * Auto converts any given value into it's hex representation.
 * And even stringifys objects before.
 *
 * @method toHex
 *
 * @param {String|Number|BN|Object} value
 * @param {Boolean} returnType
 *
 * @returns {String}
 */
export const toHex = (value) => {
    return web3.utils.toHex(value);
};

/**
 * Calculate the hash value of the given data
 *
 * @param {Object} data - Can be object, array or a string
 * @returns {string} Hashed Message
 */
export const calculateHash = (data) => {
    if (!data) {
        return rejectResponse('Please provide some data');
    }
    return hashMessage(serializeForHashing(data));
};

/**
 * Hashes the given message passed
 * The data will be UTF-8 HEX decoded and enveloped as follows:
 * "\x19Ethereum Signed Message:\n" + message.length + message and hashed using keccak256.
 *
 * @param {String} data A message to hash, if its HEX it will be UTF8 decoded before.
 * @returns {String} Hashed Message
 */
export const hashMessage = (message) => {
    return web3.eth.accounts.hashMessage(message);
};

/**
 * Serialize Object
 *
 * @function serializeForHashing
 * @param {Object | Array | string} object
 * @returns {string} serializedString
 */
export const serializeForHashing = (object) => {
    const isDict = (subject) => typeof subject === 'object' && !Array.isArray(subject);
    const isString = (subject) => typeof subject === 'string';
    const isArray = (subject) => Array.isArray(subject);

    if (isDict(object)) {
        const content = Object.keys(object).sort().map((key) => `"${key}":${serializeForHashing(object[key])}`).join(',');

        return `{${content}}`;
    } else if (isArray(object)) {
        const content = object.map((item) => serializeForHashing(item)).join(',');

        return `[${content}]`;
    } else if (isString(object)) {
        return `"${object}"`;
    }
    return object.toString();
};
