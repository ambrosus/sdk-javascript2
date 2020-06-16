import { timeSince, validTimestamp } from './time-utils';
/**
 * Check the accessLevel of the asset
 *
 * @function checkAccessLevel
 * @param {Object} event
 * @returns {number} accessLevel
 */
export const checkAccessLevel = event => {
    try {
        return event.content.idData.accessLevel;
    } catch (error) {
        return 0;
    }
};

/**
 * Get the Title
 *
 * @function getName
 * @param {Object} obj
 * @param {string} alternative
 * @returns {Object} name
 */
export const getName = (obj, alternative = 'No title') => {
    try {
        const name = obj.name;
        let type = obj.type.split('.');
        type = type[type.length - 1];
        return [name, type].find(i => i);
    } catch (e) {
        return alternative;
    }
};

/**
 * Get image URL from the object
 *
 * @function getImage
 * @param {Object} obj
 * @returns {string} Image URL
 */
export const getImage = (obj) => {
    try {
        return obj.images.default.url;
    } catch (e) {
        return '';
    }
};

/**
 * Get location from the Object
 *
 * @function getLocation
 * @param {Object} event
 * @returns {Object} Location
 */
export const getLocation = (event) => {
    const location = event.location || event;
    const {
        city,
        country,
        name
    } = location;
    return (
        [city, country, name].filter(item => !!item).join(', ') || 'No place attached'
    );
};

/**
 * Sorts the Event by descending order based on the timestamp
 *
 * @function sortEventsByTimestamp
 * @param {Object} objectA Object which contains timestamp property
 * @param {Object} objectB Object which contains timestamp property
 * @returns {Object} Object sorted by descending order based on timestamp
 */
export const sortEventsByTimestamp = (a, b) => {
    if (a.timestamp > b.timestamp) {
        return -1;
    }
    if (a.timestamp < b.timestamp) {
        return 1;
    }
    return 0;
};

/**
 * Parse the Event and create groups/properties array
 *
 * @function parseEvent
 * @param {Object}  event
 * @returns {Object} event
 */
export const parseEvent = (event) => {
    event.info = {};
    event.info['groups'] = [];
    event.info['properties'] = [];

    // Extract event objects
    if (event.content.data && Array.isArray(event.content.data)) {
        event.content.data.map((obj) => {
            const type = obj.type.split('.');
            obj.type = type[type.length - 1].toLowerCase();

            if (obj.type === 'location' || obj.type === 'identifiers') {
                event.info[obj.type] = obj;
            } else {
                event.info.name = obj.name || obj.type;

                Object.keys(obj).map((key) => {
                    if (['images', 'documents', 'description'].indexOf(key) > -1) {
                        event.info[key] = obj[key];
                    }

                    if (
                        [
                            'type',
                            'name',
                            'assetType',
                            'eventId',
                            'createdBy',
                            'timestamp',
                            'location',
                            'images',
                            'documents',
                            'description',
                            'identifiers',
                            'groups',
                            'properties'
                        ].indexOf(key) === -1
                    ) {
                        const property = {
                            key,
                            value: obj[key]
                        };
                        event.info[typeof property.value === 'string' || Array.isArray(property.value) ? 'properties' : 'groups'].push(property);
                    }
                });
            }
            return obj;
        });
    }
    return event;
};

/**
 * Parse the Asset and create groups/properties Array
 *
 * @function parseAsset
 * @param {Object} asset
 * @returns {Object} asset
 */
export const parseAsset = (asset) => {
    if (!asset.info) {
        asset.info = {};
    }
    asset.info['groups'] = [];
    asset.info['properties'] = [];

    Object.keys(asset.info).map((key) => {
        if (key === 'location' || key === 'identifiers') {
            asset[key] = asset.info[key];
        } else {
            if (
                [
                    'type',
                    'name',
                    'assetType',
                    'images',
                    'eventId',
                    'createdBy',
                    'timestamp',
                    'groups',
                    'properties'
                ].indexOf(key) === -1
            ) {
                const property = {
                    key,
                    value: asset.info[key]
                };
                asset.info[typeof property.value === 'string' || Array.isArray(property.value) ? 'properties' : 'groups'].push(property);
            }
        }
    });
};

/**
 * Parse the timeline events based on Date
 *
 * @function parseTimelineEvents
 * @param {Object} e
 * @returns {Object} parsedEvents.
 */
export const parseTimelineEvents = (e) => {
    const events = e.reduce((_events, {
        content,
        eventId
    }) => {
        const timestamp = content.idData.timestamp;
        const createdBy = content.idData.createdBy;

        if (content && content.data) {
            content.data.map(obj => {
                const parts = obj.type.split('.');
                const type = parts[parts.length - 1];
                const category = parts[parts.length - 2] || 'asset';
                const ago = timeSince(timestamp * 1000);

                obj.timestamp = timestamp;
                obj.createdBy = createdBy;
                obj.name = obj.name || type;
                obj.type = type;
                obj.eventId = eventId;
                obj.ago = ago;

                if (obj.type === 'location' && category === 'event') {
                    content.data.reduce((location, _event) => {
                        if (_event.type !== 'location') {
                            _event.location = location;
                        }
                    }, obj);
                }

                const notInclude = ['location', 'identifier', 'identifiers'];
                if (notInclude.indexOf(obj.type) === -1) {
                    _events.push(obj);
                }

                return obj;
            });
        }
        return _events;
    }, []);
    events.sort(sortEventsByTimestamp);
    return events;
};

/**
 * Check whether the event is latest
 *
 * @function isLatest
 * @param {string} type
 * @returns {boolean}
 */
export const isLatest = (type) => {
    return (['info', 'redirection', 'identifiers', 'branding', 'location'].indexOf(type) === -1);
};

/**
 * Finds a signle event from the events object
 *
 * @function findEvent
 * @param {string} eventType
 * @param {Object} events
 * @returns {Object} event
 */
export const findEvent = (eventType, events) => {
    let e = false;
    events.map(event => {
        if (event.content.data) {
            event.content.data.map(obj => {
                const type = obj.type.split('.');
                obj.type = type[type.length - 1];
                obj.type = obj.type.toLowerCase();

                if (obj.type === 'location' || obj.type === 'identifiers') {
                    event.content.data.map(_obj => {
                        if (['location', 'identifiers'].indexOf(_obj.type) === -1) {
                            _obj[obj.type === 'location' ? 'location' : 'identifiers'] = obj;
                        }
                    });
                }
                switch (eventType) {
                    case 'latest':
                        if (isLatest(obj.type)) {
                            e = obj;
                        }
                        break;
                    default:
                        if (obj.type === eventType) {
                            e = obj;
                        }
                }
                return obj;
            });
        }

        return event;
    });

    return e;
};

/**
 * Check if timestamp exists
 *
 * @function checkTimeStamp
 * @param {Object} event
 * @returns {number} timestamp
 */
export const checkTimeStamp = event => {
    let timestamp = Math.floor(Date.now() / 1000);

    return event.content && event.content.idData && event.content.idData.timestamp && validTimestamp(event.content.idData.timestamp) ? event.content.idData.timestamp : timestamp;
};

/**
 * Parse all events
 *
 * @function parseEvents
 * @param {Array.<Object>} eventsArray
 * @returns {Object} events
 */
export const parseEvents = eventsArray => {
    return eventsArray.results.reduce(
        (asset, {
            content,
            eventId
        }) => {
            const timestamp = content.idData.timestamp;
            const author = content.idData.createdBy;

            if (content && content.data) {
                content.data
                    .filter(obj => {
                        const parts = obj.type.split('.');
                        const type = parts[parts.length - 1];
                        const category = parts[parts.length - 2] || 'asset';
                        obj.timestamp = timestamp;
                        obj.author = author;
                        obj.name = obj.name || type;
                        obj.action = type;
                        obj.type = type;
                        obj.eventId = eventId;

                        if ((obj.type === 'location' || obj.type === 'identifiers') && category === 'event') {
                            content.data.reduce((_obj, _event) => {
                                if (obj.type === 'location' && _event.type !== 'location') {
                                    _event.location = _obj;
                                }
                                if (obj.type === 'identifiers' && _event.type !== 'identifiers') {
                                    _event.identifiers = _obj;
                                }
                                return _obj;
                            }, obj);
                        } else {
                            return obj;
                        }
                    })
                    .map(event => {
                        if (['info', 'redirection', 'identifiers', 'branding'].indexOf(event.type) > -1) {
                            if (!asset[event.type] || asset[event.type].timestamp < event.timestamp) {
                                asset[event.type] = event;
                            }
                        } else {
                            asset.events.push(event);
                        }
                    });
            }
            return asset;
        }, {
            events: []
        }
    );
};
