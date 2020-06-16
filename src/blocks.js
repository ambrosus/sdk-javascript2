/**
 * Copyright 2018 Ambrosus Inc.
 * Email: tech@ambrosus.com
 */

import {
    rejectResponse
} from './responseHandler';

/**
 * Class with all the blocks related methods.
 *
 * @class
 */
class Blocks {
    /**
     *
     * @param {ExtendedSettings} ExtendedSettings - Setting object which includes headers and privateKey
     * @param {Web3} web3 - A Web3 Object
     */
    constructor(settings, web3) {
        this._settings = settings;
        this.web3 = web3;
    }

    /**
     * Returns a block matching the block number or block hash.
     *
     * @param {string | number} hashOrNumber
     * @returns {Promise<object>} - The block object
     */
    getBlock(hashOrNumber) {
        return new Promise((resolve, reject) => {
            if (!this._settings.rpcURL) {
                return reject(rejectResponse('RPC URL is required'));
            }
            if (!hashOrNumber) {
                return reject(rejectResponse('Block Number is required'));
            }
            return this.web3.eth.getBlock(hashOrNumber).then(block => resolve(block))
                .catch(err => reject(err));
        });
    }

    /**
     * Returns the latest block.
     *
     * @returns {Promise<Object>} - The latest block data.
     */
    getLatestBlock() {
        return new Promise((resolve, reject) => {
            if (!this._settings.rpcURL) {
                return reject(rejectResponse('RPC URL is required'));
            }
            this.web3.eth.getBlockNumber().then(number => {
                return this.web3.eth.getBlock(number).then(block => resolve(block))
                    .catch(err => reject(err));
            }).catch(err => reject(err));
        });
    }
}

export default Blocks;
