/**
 * Copyright 2018 Ambrosus Inc.
 * Email: tech@ambrosus.com
 */

import { getRequest } from './request';
import { rejectResponse } from '../responseHandler';

/**
 * Events Class
 *
 * @class
 * @classdesc Every Events related methods
 */
class Bundles {
    /**
     * Initializing the Events class
     *
     * @param {ClassProperties} - Properties to initialize the class object
     */
    constructor(settings) {
        this._settings = settings;
    }
    /**
     * Returns this bundle with respect to id
     *
     * @param {string} bundleId - Id of the bundle
     * @returns {Object} bundle
     */
    getBundle(bundleId) {
        return new Promise((resolve, reject) => {
            if (!bundleId) {
                return reject(rejectResponse('Bundle ID is missing.'));
            }
            if (bundleId.bundleId) {
                bundleId = bundleId.bundleId;
            }
            getRequest(`${this._settings.apiEndpoint}/bundle2/info/${encodeURIComponent(bundleId)}`, this._settings.headers)
                .then(response => resolve(response))
                .catch(error => reject(error));
        });
    }
}

export default Bundles;
