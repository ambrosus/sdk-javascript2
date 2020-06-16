/**
 * Copyright 2018 Ambrosus Inc.
 * Email: tech@ambrosus.com
 */

import utils from './utils/index';
import {
    rejectResponse
} from './responseHandler';
import Web3 from 'web3';
import Events from './api/events';

/**
 * Class with different service methods.
 *
 * @class
 */
class Service {
    /**
     *
     * @param {ExtendedSettings} ExtendedSettings - Setting object which includes headers and privateKey
     * @param {Web3} web3 - A Web3 Object
     */
    constructor(settings, web3, events) {
        this._settings = settings;
        this.web3 = web3;
        this.events = events;
        this.events = new Events(this._settings);
    }

    /**
     * Creates an account object from a private key.
     *
     * @param {string} secret - Private Key which is used to create account.
     * @returns {Object} Account
     */
    getAccount(secret = null) {
        const secretKey = secret || this._settings.secret;
        if (!secretKey) {
            return rejectResponse('Secret key is required generate the account');
        }

        /* istanbul ignore next */
        return this.web3.eth.accounts.privateKeyToAccount(secretKey);
    }

    /**
     * Returns the address
     *
     * @param {string | null} secret - Private Key which is used to extract the address.
     * @returns {Object | string} Rejected Response or address
     */
    getAddress(secret = null) {
        const secretKey = secret || this._settings.secret;
        if (!secretKey) {
            return rejectResponse('Secret key is required generate the address');
        }
        /* istanbul ignore next */
        return this.web3.eth.accounts.privateKeyToAccount(secretKey).address;
    }

    /**
     * Retruns the signed value of the Object provided.
     *
     * @param {Object} data - Object which is to be signed.
     * @param {string} secret - Private key to sign the object.
     * @returns {Object | string} Rejected Response or Signed data
     */
    sign(data = {}, secret = null) {
        const secretKey = secret || this._settings.secret;
        if (!secretKey) {
            return rejectResponse('Secret key is required to perform signature');
        }
        /* istanbul ignore next */
        return this.web3.eth.accounts.sign(utils.serializeForHashing(data), secretKey).signature;
    }

    /**
     * Returns object consisting of address & privateKey
     *
     * @returns {{address, privateKey}}
     */
    getPkPair() {
        return this.web3.eth.accounts.create(this.web3.utils.randomHex(32));
    }

    /**
     * Encrypt the data with the provided privateKey
     *
     * @param {string} secret
     * @param {any} token
     * @returns {string} encryptedData
     */
    encryptPrivateKey(token, secret = null) {
        const secretKey = secret || this._settings.secret;
        if (!secretKey) {
            return rejectResponse('Secret key is required generate a signature');
        } else if (!token) {
            return rejectResponse('Token is required to encrypt the data');
        }
        return this.web3.eth.accounts.encrypt(secretKey, token);
    }

    /**
     * Decrypt the encrypted privateKey
     *
     * @param {string} token
     * @param {string} password
     * @returns {Object}
     */
    decryptPrivateKey(token, password) {
        try {
            const {
                address,
                privateKey
            } = this.web3.eth.accounts.decrypt(token, password);
            return [address, privateKey];
        } catch (e) {
            return [null];
        }
    }

    verifyEvents(assetId) {
        return new Promise((resolve, reject) => {
            if (!assetId) {
                return reject(rejectResponse('Asset ID is required'));
            }
            this.events.getAssetEvents(assetId).then(response => {
                console.log(`verifyEvents: assetId ${assetId}, events ${response.data.data.length}`);

                for (let i = 0; i < response.data.data.length; i++) {
                    const {
                        idData,
                        signature,
                        data
                    } = response.data.data[i].content;

                    resolve(this.verify(idData, signature, data, response.data.data[i].eventId));
                }
            }).catch(error => {
                reject(error);
            });
        });
    }

    verify(idData, signature, data, eventId) {
        let flag = true;
        const verified = {
            hash: true,
            createdBy: true,
            eventId: true
        };

        // Check Data Hash;
        const web3DataHash = utils.calculateHash(data);
        if (idData.dataHash !== web3DataHash) {
            flag = false;
            verifyObject.hash = false;
        }

        // Check createdBy
        const web3CreatedBy = this.web3.eth.accounts.recover(utils.serializeForHashing(idData), signature);
        if (idData.createdBy !== web3CreatedBy) {
            flag = false;
            verifyObject.createdBy = false;
        }

        // Check content of eventId
        const web3EventId = utils.calculateHash({
            idData,
            data,
            signature
        });
        if (eventId !== web3EventId) {
            flag = false;
            verifyObject.eventId = false;
        }
        return {
            flag,
            verified
        };
    }

    /**
     * Checks if the provided RPC URL is valid
     * @param {string} url
     * @returns {boolean}
     */
    isRPCValid(url) {
        const web3 = new Web3(url);
        return web3.eth.net.isListening().then(() => {
            return true;
        }).catch(() => {
            return false;
        });
    }
}

export default Service;
