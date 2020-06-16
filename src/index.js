/**
 * Copyright 2018 Ambrosus Inc.
 * Email: tech@ambrosus.com
 */

/**
 * Object Property for request.
 * @typedef {Object} ExtendedSettings
 * @property {string} [secret] - Private key of the user
 * @property {string} [rpcURL] - RPC URL for the this.web3 instance
 * @property {string} [apiEndpoint] - API Endpoint.
 * @property {Object} [headers] - Header object for the request
 */

/**
 * Object for initializing all classes.
 * @typedef {Object} ClassProperties
 * @property {ExtendedSettings} settings - Properties to initialize the object.
 * @property {Object} [this.web3] - Transaction class object
 */

import Assets from './api/assets';
import Events from './api/events';
import Accounts from './api/accounts';
import Bundles from './api/bundles';
import Utils from './utils/index';
import Transactions from './transactions';
import Service from './service';
import Blocks from './blocks';
import {
    rejectResponse
} from './responseHandler';
import Web3 from 'web3';
import Contracts from './contracts';

/**
 * Main Class for initializing the SDK
 *
 * @class
 * @classdesc Entry point for the SDK.
 */
class AmbrosusSDK {
    /**
     * @type {Object}
     */
    static get utils() {
        return Utils;
    }

    /**
     * Creating a SDK and initializing all the default variables.
     *
     * @param {ExtendedSettings} [extendSettings] - Properties to initialize the object.
     */
    constructor(extendSettings = {}) {
        this.web3 = new Web3();

        /**
         * Contains the properties for the SDK.
         * @type {Object}
         * @property {string} secret Private key of the user
         * @property {string} rpcURL RPC URL for the this.web3 instance
         * @property {apiEndpoint} apiEndpoint Endpoint of the hermes
         * @property {headers} headers Header object for the request
         */
        this._settings = {
            headers: {}
        };

        if (Utils.isObject(extendSettings)) {
            Object.keys(extendSettings).map(key => {
                this._settings[key] = extendSettings[key];
            });
            if (this._settings.rpcURL) {
                this.web3 = new Web3(new Web3.providers.HttpProvider((this._settings.rpcURL)));
            }

            /**
             * Object of class Service
             * @type {Object}
             */
            this.service = new Service(this._settings, this.web3);

            if (this._settings.secret) {
                this._settings.address = this.service.getAddress(this._settings.secret);
                const token = this.getApiToken(this._settings.secret);
                if (token.status !== 400) {
                    this._settings.token = token;
                }
            }

            if ((!this._settings['headers'] || !this._settings.headers.Authorization) && this._settings.token) {
                this._settings.headers = Object.assign({}, this._settings.headers, {
                    'Authorization': `AMB_TOKEN ${this._settings.token}`
                });
            }

            this.service = new Service(this._settings, this.web3);

            /**
             * Object of class Assets
             * @type {Object}
             */
            this.assets = new Assets(this._settings, this.service);

            /**
             * Object of class Events
             * @type {Object}
             */
            this.events = new Events(this._settings, this.service);

            /**
             * Object of class BLocks
             * @type {Object}
             */
            this.bundles = new Bundles(this._settings);

            /**
             * Object of class Accounts
             * @type {Object}
             */
            this.accounts = new Accounts(this._settings);

            /**
             * Object of class Contracts
             * @type {Object}
             */
            this.contracts = new Contracts(this._settings, this.web3);

            /**
             * Object of class Transaction
             * @type {Object}
             */
            this.transactions = new Transactions(this._settings, this.service, this.web3);

            /**
             * Object of class Blocks
             * @type {Object}
             */
            this.blocks = new Blocks(this._settings, this.web3);

            /**
             * Object of class Utils
             * @type {Object}
             */
            this.utils = Utils;
        } else {
            return rejectResponse('SDK Init parameters should be an object');
        }
    }

    /**
     * Generate the token which is used in API request.
     *
     * @param {string} secret - Private Key which is used to perform the signing of token
     * @param {number} timestamp - Validity of the token
     * @returns {Object} Rejected Response or encoded Data
     */
    getApiToken(secret = null, timestamp) {
        if (!secret && !this._settings.secret) {
            return rejectResponse('Secret key is required generate the token');
        }

        const secretKey = secret || this._settings.secret;
        /* istanbul ignore next */
        const idData = {
            createdBy: this.service.getAddress(secretKey),
            validUntil: timestamp || Math.floor(Date.now() / 1000) + 300
        };

        /* istanbul ignore next */
        return Utils.base64url(Utils.serializeForHashing({
            signature: this.service.sign(idData, secretKey),
            idData
        }));
    }
}

export default AmbrosusSDK;
