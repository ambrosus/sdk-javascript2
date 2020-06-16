/**
 * Copyright 2018 Ambrosus Inc.
 * Email: tech@ambrosus.com
 */

import { postRequest } from './request';
import { rejectResponse } from '../responseHandler';
/**
 * Accounts Class
 *
 * @class
 * @classdesc Every Accounts related methods
 */
class Accounts {
    /**
   * Initializing the Accounts class
   *
   * @param {ClassProperties} - Properties to initialize the class object
   */
    constructor (settings) {
        this._settings = settings;
    }

    /**
      * Adds a new account
      *
      * {@link https://ambrosus.docs.apiary.io/#reference/account/accounts/add-account Add a new account}
      * @param {Object} params Parameters to create a new Account
      * @returns {Object} accountResponse
      */
    addAccount (params) {
        return new Promise((resolve, reject) => {
            if (!this._settings.headers['Authorization']) {
                return reject(rejectResponse('Authorization header is required to create an account'));
            } else if (!params) {
                return reject(rejectResponse('Create account params are required to create an account.'));
            }
            postRequest(`${this._settings.apiEndpoint}/accounts`, this._settings.headers, params)
                .then(response => resolve(response))
                .catch(error => reject(error));
        });
    }
}

export default Accounts;
