/**
 * Copyright 2018 Ambrosus Inc.
 * Email: tech@ambrosus.com
 */

import {
    rejectResponse
} from './responseHandler';
const DEFAULT_GAS = 4700000;

/**
 * Class with all the smart contracts related methods.
 *
 * @class
 */
class Contracts {
    /**
     *
     * @param {ExtendedSettings} ExtendedSettings - Setting object
     * @param {Web3} web3 - A Web3 Object
     */
    constructor(settings, web3) {
        this._settings = settings;
        this.web3 = web3;
    }

    /**
     * Loads a contract from the network.
     *
     * @param {Object} abi
     * @param {string} address
     * @returns {Object} contract.
     */
    loadContract(abi, address) {
        if (!this._settings.rpcURL) {
            return rejectResponse('RPC URL is required');
        }
        return this.web3.eth.Contract(abi, address, {
            gas: DEFAULT_GAS,
            gasPrice: this.web3.utils.toWei('5', 'gwei')
        });
    }
}

export default Contracts;
