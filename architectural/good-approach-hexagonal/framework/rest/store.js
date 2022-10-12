const axios = require('axios');
const client = axios.create({
    baseURL: 'http://' + process.env.KEY_VALUE_STORE_HOST + ':' + process.env.KEY_VALUE_STORE_PORT
    //baseURL: 'http://localhost' + ':' + 7480
});
const logger = require('../../framework/grcp/logger');
const {promiseCallback} = require("async/internal/promiseCallback");

/**
 * Get all keys for Rest call
 * */
exports.getKeys = async () => {
    return await client.get('/get').then(
        response => {
            return response.data;
        }
    ).catch(error => {
        logger.runLogError("GetKeys error: " + error.message, promiseCallback());
    })
};

/**
 * Set a key-value pair for Rest call
 * */
exports.setKey = async (key, value) => {
    await client.post('/set', {
        "key": key,
        "value": value
    }).then(
        response => {
            return response.data;
        }
    ).catch(error => {
        logger.runLogError("SetKey error: " + error.message, promiseCallback());
        return {};
    });
};

/**
 * Delete a key-value pair for Rest call
 * */
exports.deleteKey = async (key) => {
    await client.post('/delete', {
        "key": key
    }).then(
        response => {
            return response.data;
        }
    ).catch(error => {
        logger.runLogError("DeleteKey error: " + error.message, promiseCallback());
    });
};