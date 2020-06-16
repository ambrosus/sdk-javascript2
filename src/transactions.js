/**
 * Copyright 2018 Ambrosus Inc.
 * Email: tech@ambrosus.com
 */

import {
    rejectResponse
} from './responseHandler';

/**
 * Class with all the transaction related methods.
 *
 * @class
 */
class Transactions {
    /**
     *
     * @param {ExtendedSettings} ExtendedSettings - Setting object
     * @param {Web3} web3 - A Web3 Object
     */
    constructor(settings, service, web3) {
        this._settings = settings;
        this.web3 = web3;
        this.service = service;
    }

    /**
     * Returns the balance of the account on the Network
     *
     * @returns {Promise} balance
     */
    getBalance(address = null) {
        return new Promise((resolve, reject) => {
            const userAddress = address || this._settings.address;
            if (!this._settings.rpcURL) {
                return reject(rejectResponse('RPC URL is required to get the balance'));
            }
            if (!userAddress) {
                return reject(rejectResponse('Address is required to get the balance'));
            }
            this.web3.eth.getBalance(userAddress).then(balance => resolve(balance))
                .catch(err => reject(err));
        });
    }

    /**
     * Returns a transaction matching the given transaction hash.
     *
     * @param {string} transactionHash
     * @returns {Promise<object> }- A transaction object
     */
    getTransaction(transactionHash) {
        return new Promise((resolve, reject) => {
            if (!this._settings.rpcURL) {
                return reject(rejectResponse('RPC URL is required'));
            }
            if (!transactionHash) {
                return reject(rejectResponse('Transaction hash is required'));
            }
            return this.web3.eth.getTransaction(transactionHash).then(transaction => resolve(transaction))
                .catch(err => reject(err));
        });
    }

    /**
     * Returns the transaction recepit.
     * The receipt is not available for pending transactions and returns null.
     *
     * @param {string} transactionHash
     * @returns {Promise<object>} A transaction receipt object, or null when no receipt was found:
     */
    getTransactionRecepit(transactionHash) {
        return new Promise((resolve, reject) => {
            if (!this._settings.rpcURL) {
                return reject(rejectResponse('RPC URL is required'));
            }
            if (!transactionHash) {
                return reject(rejectResponse('Transaction hash is required'));
            }
            return this.web3.eth.getTransactionReceipt(transactionHash).then(receipt => resolve(receipt))
                .catch(err => reject(err));
        });
    }

    /**
     * Get the numbers of transactions sent from this address.
     *
     * @param {string} address
     * @returns {Promise<number>} - The number of transactions sent from the given address.
     */
    getTransactionCount(address = null) {
        return new Promise((resolve, reject) => {
            const userAddress = address || this._settings.address;
            if (!this._settings.rpcURL) {
                return reject(rejectResponse('RPC URL is required'));
            }
            if (!userAddress) {
                return reject(rejectResponse('Address is required to get the transaction count'));
            }
            return this.web3.eth.getTransactionCount(userAddress).then(count => resolve(count))
                .catch(err => reject(err));
        });
    }

    /**
     * Signs and sends the transaction to the network
     *
     * @param {string} address Address of the receiving person
     * @param {number} value Total number of token to be sent
     * @returns {Promise} transactionResponse
     */
    sendTransaction(address, value, data = null) {
        return new Promise((resolve, reject) => {
            if (!this._settings.secret && !this._settings.rpcURL) {
                return reject(rejectResponse('Secret key and RPC URL is required to make a transaction'));
            }
            const txObject = {
                to: address,
                from: this._settings.address,
                value: this.web3.utils.toHex(this.web3.utils.toWei(value, 'ether')),
                gas: this.web3.utils.toHex(21000),
                gasPrice: this.web3.utils.toHex(this.web3.utils.toWei('10', 'gwei'))
            };
            if (data) {
                txObject.data = data;
            }
            const account = this.service.getAccount(this._settings.secret);
            const signedTx = account.signTransaction(txObject);
            signedTx.then(value => {
                this.web3.eth.sendSignedTransaction(value.rawTransaction).then(receipt => resolve(receipt))
                    .catch(err => reject(err));
            }).catch((err) => {
                reject(err);
            });
        });
    }
}

export default Transactions;
