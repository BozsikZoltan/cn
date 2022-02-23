const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const axios = require('axios');
const client = axios.create({
    baseURL: 'http://' + process.env.KEY_VALUE_STORE_HOST + ':' + process.env.KEY_VALUE_STORE_PORT
    //baseURL: 'http://localhost' + ':' + 7480
});

app.set('view engine', 'html');

app.engine('html', require('ejs').renderFile);

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({
    extended: true
}));

/**
 * Get method
 * */
app.get('/', async function (req, res) {
    res.render('index', {items: mapEntriesToString(await withExponentialBackoff(getMap))});
});

/**
 * Set method
 * */
app.post('/set', async function (req, res) {
    await withExponentialBackoff(setValue, 1, req.body.set_text_key, req.body.set_text_value);

    return res.redirect('/');
});

/**
 * Increment method
 * */
app.post('/delete', async function (req, res) {
    const key = req.body.delete_text_key;
    const map = await withExponentialBackoff(getMap);

    if (map.has(key)) {
        const previous = map.get(key);

        await withExponentialBackoff(deleteKey, 1, key);
        console.log("(" + key + ") key deleted: " + previous);
    }

    return res.redirect('/');
});

/**
 * Async function to get the map form the key-store
 * */
function getMap() {
    return client.get('/get')
        .then(response => {
            const result = new Map(response.data);
            console.log(result);
            return result;
        });
}

/**
 * Async function to set key in the key-store
 * */
async function setValue(key, value) {
    console.log('Set value invoked!');
    await client.post('/set', {
        "key": key,
        "value": value
    }).then(response => console.log(response.data));
}

/**
 * Async function to set key in the key-store
 * */
async function deleteKey(key) {
    console.log('Delete key invoked!')
    await client.post('/delete', {
        "key": key
    }).then(response => console.log(response.data))
}

/**
 * Generic method for calling with exponential backoff strategy
 *
 * @param func: the method what we want to invoke
 * @param backoffTime: initial time (default 1[sec])
 * @param args: the parameters for the func
 * */
async function withExponentialBackoff(func, backoffTime = 1, ...args) {
    return await func(...args)
        .then()
        .catch(() => {
            const nextBackoffTime = backoffTime * 2;
            console.error(nextBackoffTime);

            return new Promise((resolve) =>
                setTimeout(() => resolve(withExponentialBackoff(func, nextBackoffTime, ...args)), nextBackoffTime * 1000));
        });
}

/**
 * Converts map to Array
 * */
function mapEntriesToString(data) {
    if (data === null || data === undefined) {
        return;
    }

    return Array
        .from(data.entries(), ([k, v]) => `{${k}:${v}}`)
        .join(" ; ");
}

app.listen(process.env.PORT || 8080, () => {
    console.log("Node server started");
});