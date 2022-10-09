const store = require('../../framework/store');

/**
 * Business function to get keys
 * */
exports.getKeys = async () => {
    return {items: mapEntriesToString(await store.getKeys())};
};

/**
 * Business function to set key
 * */
exports.setKey = async (req) => {
    await store.setKey(req.body.set_text_key, req.body.set_text_value);
};

/**
 * Business function to delete key
 * */
exports.deleteKey = async (req) => {
    await store.deleteKey(req.body.delete_text_key);
};

/**
 * Converts map to Array
 * */
function mapEntriesToString(data) {
    if (data === null || data === undefined) {
        return;
    }
    let map = new Map(data);

    return Array
        .from(map.entries(), ([k, v]) => `{${k}:${v}}`)
        .join(" ; ");
}
