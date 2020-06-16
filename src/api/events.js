/**
 * Copyright 2018 Ambrosus Inc.
 * Email: tech@ambrosus.com
 */

import { getRequest, postRequest } from './request';
import utils from '../utils/index';
import { rejectResponse, successResponse } from '../responseHandler';
import EventHandler from '../eventHandler';

/**
 * Events Class
 *
 * @class
 * @classdesc Every Events related methods
 */
class Events {
    /**
   * Initializing the Events class
   *
   * @param {ClassProperties} - Properties to initialize the class object
   */
    constructor(settings, service) {
        this._settings = settings;
        this.service = service;
        this.eventHandler = new EventHandler();
    }

   /**
   * Find Events by AssetId
   *
   * @param {string} assetId - Id of the asset
   * @returns {Object} events
   */
    getAssetEvents(assetId) {
        return new Promise((resolve, reject) => {
            if (!assetId) {
                return reject(rejectResponse('Asset ID is missing.'));
            }

            getRequest(
                `${this._settings.apiEndpoint}/event2/list/?assteId=${encodeURIComponent(assetId)}`,
                this._settings.headers
            )
                .then(response => resolve(response))
                .catch(error => reject(error));
        });
    }

    /**
   * Get all Events with the matching params
   *
   * {@link https://ambrosus.docs.apiary.io/#reference/events/eventsassetidfromtimestamptotimestampperpagepagecreatedbydata/find-events Find Events}
   * @param {Object} params - Properties of the events
   * @returns {Object} events
   */
    getEvents(params) {
        return new Promise((resolve, reject) => {
            getRequest(
                `${this._settings.apiEndpoint}/event2/list?${utils.serializeParams(params)}`,
                this._settings.headers
            )
                .then(response => resolve(response))
                .catch(error => reject(error));
        });
    }

    /**
   * Create a new event.
   *
   * {@link https://ambrosus.docs.apiary.io/#reference/events/assetsassetidevents/create-an-event Create a new Event}
   * @param {string} assetId - Corresponding asset Id to the event
   * @param {Object} params - Properties of the event
   * @returns {Promise<Object>} Promise
   */
    createSingleEvent(assetId, eventId, params) {
        console.log(`createSingleEvent.eventId: ${eventId}`);

        return new Promise((resolve, reject) => {
            postRequest(
                `${this._settings.apiEndpoint}/event2/create/${eventId}`,
                this._settings.headers,
                params
            )
                .then(response => resolve(response))
                .catch(error => reject(error));
        });
    }

    /**
   * Creates a new Event.
   *
   * {@link https://ambrosus.docs.apiary.io/#reference/events/assetsassetidevents/create-an-event Create a new Event}
   * @param {string} assetId - Corresponding asset Id to the event
   * @param {Object} event - Properties of the events
   * @returns {Object} eventResponse
   */
    createEvent(assetId, event) {
        return new Promise((resolve, reject) => {
            if (typeof event !== 'object') {
                return reject(rejectResponse('event should be a json object'));
            } else if (!this._settings.headers['Authorization']) {
                return reject(
                    rejectResponse('Authorization header is required to create an event')
                );
            }

            if (!assetId) {
                return reject(rejectResponse('Asset ID is missing.'));
            }

            if (!event) {
                return reject(rejectResponse('Event data is missing.'));
            }

            let params = {};

            if (event.content && event.content.data) {
                const idData = {
                    assetId: assetId,
                    timestamp: utils.checkTimeStamp(event),
                    accessLevel: utils.checkAccessLevel(event),
                    createdBy: this._settings.address,
                    dataHash: utils.calculateHash(event.content.data)
                };

                params = {
                    content: {
                        idData: idData,
                        signature: this.service.sign(idData, this._settings.secret),
                        data: event.content.data
                    }
                };
            } else {
                return reject(
                    rejectResponse('Invalid data: No content found at content.data.')
                );
            }

            let eventId = utils.calculateHash(params.content);

            return this.createSingleEvent(assetId, eventId, params)
                .then(response => {
                    this.eventHandler.emit('event:created');
                    resolve(response);
                })
                .catch(error => reject(error));
        });
    }

    /**
   * Parse the provided events
   *
   * @param {Object} eventsArray - Array of events which is to be parsed
   * @returns {Object} Reject Response or Success Response with parsed events
   */
    parseEvents(eventsArray) {
        return new Promise((resolve, reject) => {
            if (eventsArray && eventsArray.results) {
                return resolve(successResponse(utils.parseEvents(eventsArray)));
            }
            return reject(rejectResponse('Results array is missing.'));
        });
    }
}

export default Events;
