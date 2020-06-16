/**
 * Copyright 2018 Ambrosus Inc.
 * Email: tech@ambrosus.com
 */

/**
 * Handle the response
 *
 * @function handleResponse
 * @param {Object} request
 * @returns {Object} response
 */
export const handleResponse = request => {
    return new Promise((resolve, reject) => {
	//console.log(`request.response ${request.response}`);

        const response = {
            status: request.status,
            data: null,
            message: JSON.parse(request.response).reason
        };

        if (request.status === 200 || request.status === 201) {
            response.data = JSON.parse(request.response);
            response.message = 'success';
            resolve(response);
        }
        reject(response);
    });
};

/**
 * Reject the response
 *
 * @function rejectResponse
 * @param {any} message
 * @returns {{status: number, data: null, message: any}} rejectData
 */
export const rejectResponse = message => {
    return {
        status: 400,
        data: null,
        message: message
    };
};

/**
 * Send a success response
 *
 * @function successResponse
 * @param {any} data
 * @returns {{status: 200, data: any, message: 'success'}} successData
 */
export const successResponse = data => {
    return {
        status: 200,
        data: data,
        message: 'success'
    };
};
