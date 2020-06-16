/**
 * Copyright 2018 Ambrosus Inc.
 * Email: tech@ambrosus.com
 */

import { getRequest, postRequest } from './request';
import utils from '../utils/index';
import Events from './events';
import { rejectResponse } from '../responseHandler';
import EventHandler from '../eventHandler';

/**
 * Assets Class
 *
 * @class
 * @classdesc Every Assets related methods
 */
class Assets {
    /**
   * Initializing the Assets class
   *
   * @param {ClassProperties} - Properties to initialize the class object
   */
    constructor(settings, service) {
        this._settings = settings;
        this.service = service;
        this.events = new Events(this._settings, this.service);
        this.eventHandler = new EventHandler();
    }

    /**
   * Find asset by Id.
   *
   * {@link https://ambrosus.docs.apiary.io/#reference/asset/assets/fetch-an-asset-by-id  Find asset by Id}
   * @param {string} assetId - Id of the asset to be searched.
   * @returns {Object} asset
   */
    getAsset(assetId) {
        return new Promise((resolve, reject) => {
            if (!assetId) {
                return reject(rejectResponse('Asset ID is missing.'));
            }
            if (assetId.assetId) {
                assetId = assetId.assetId;
            }
            getRequest(
                `${this._settings.apiEndpoint}/asset2/info/${encodeURIComponent(assetId)}`,
                this._settings.headers
            )
                .then(response => resolve(response))
                .catch(error => reject(error));
        });
    }

    /**
   * Get all assets with the matching params
   *
   * {@link https://ambrosus.docs.apiary.io/#reference/asset/assetsassetid/find-assets Find Assets}
   * @param {Object} params - Parameters to search assets.
   * @returns {Object} assets
   */
    getAssets(params = {}) {
        return new Promise((resolve, reject) => {
            getRequest(
                `${this._settings.apiEndpoint}/asset2/list?${utils.serializeParams(params)}`,
                this._settings.headers
            )
                .then(response => resolve(response))
                .catch(error => reject(error));
        });
    }

    /**
   * Creates a new Asset
   *
   * {@link https://ambrosus.docs.apiary.io/#reference/asset/assets/create-an-asset Create a new Asset}
   * @param {Object} asset - Parameters to create a new asset.
   * @params {Array} events - Events array
   * @returns {Object} assetResponse
   */
    createAsset(asset = {}, events = []) {
        let assetSequenceNumber = 0;
        return new Promise((resolve, reject) => {
            if (typeof asset !== 'object') {
                return reject(rejectResponse('asset should be a json object or empty'));
            } else if (!this._settings.headers['Authorization']) {
                return reject(
                    rejectResponse('Authorization header is required to create an asset')
                );
            }

            const idData = {
                timestamp: utils.checkTimeStamp(asset),
                sequenceNumber: (assetSequenceNumber =
          (assetSequenceNumber + 1) % 1000000),
                createdBy: this._settings.address
            };

            const params = {
                content: {
                    idData: idData,
                    signature: this.service.sign(idData, this._settings.secret)
                }
            };

            let assetId = utils.calculateHash(params.content);

            postRequest(
                `${this._settings.apiEndpoint}/asset2/create/${assetId}`,
                this._settings.headers,
                params
            )
                .then(async assetRes => {
                    if (events.length) {
                        const req = events.map(event => {
                            return this.events.createEvent(assetRes.data.assetId, event);
                        });
                        await Promise.all(req);
                        this.eventHandler.emit('asset:created');
                        resolve(assetRes);
                    } else {
                        this.eventHandler.emit('asset:created');
                        resolve(assetRes);
                    }
                })
                .catch(error => reject(error));
        });
    }
}

export default Assets;
