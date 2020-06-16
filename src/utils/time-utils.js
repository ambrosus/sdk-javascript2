/**
 * Get time since from the provided Date.
 *
 * @function timeSince
 * @param {Date} date date object
 * @returns {string} formatted date
 */
export const timeSince = date => {
    try {
        let seconds = Math.floor((+new Date() - date) / 1000);
        let interval = Math.floor(seconds / 31536000);
        /* istanbul ignore next */
        if (interval >= 1) {
            return interval + ' year' + (interval > 1 ? 's' : '');
        }
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) {
            return interval + ' month' + (interval > 1 ? 's' : '');
        }
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
            return interval + ' day' + (interval > 1 ? 's' : '');
        }
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
            return interval + ' hour' + (interval > 1 ? 's' : '');
        }
        interval = Math.floor(seconds / 60);
        if (interval >= 1) {
            return interval + ' minute' + (interval > 1 ? 's' : '');
        }

        seconds = seconds < 1 ? 1 : seconds;

        return Math.floor(seconds) + ' second' + (seconds !== 1 ? 's' : '');
    } catch (error) {
        return '';
    }
};

/**
 * Is timestamp valid.
 *
 * @function validTimestamp
 * @param {string} timestamp
 * @returns {boolean} isValid
 */
export const validTimestamp = timestamp => {
    return new Date(timestamp).getTime() > 0;
};
