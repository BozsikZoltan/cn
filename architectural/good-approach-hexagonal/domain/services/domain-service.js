const store = require('../../framework/rest/store');
const logger = require('../../framework/grcp/logger');
const {promiseCallback} = require("async/internal/promiseCallback");

/**
 * Business function to get keys
 * */
exports.getKeys = async () => {
    let items = await store.getKeys();
    logger.runLogInfo("GetKeys returns: " + items, promiseCallback());

    return {items: items};
};

/**
 * Business function to set key
 * */
exports.setKey = async (req) => {
    logger.runLogInfo("SetKey returns: " + await store.setKey(req.body.set_text_key, req.body.set_text_value), promiseCallback());
};

/**
 * Business function to delete key
 * */
exports.deleteKey = async (req) => {
    logger.runLogInfo("DeleteKey returns: " + await store.deleteKey(req.body.delete_text_key), promiseCallback());
};
