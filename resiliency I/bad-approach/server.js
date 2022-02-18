const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const axios = require('axios');
const keyStoreBaseUrl = process.env.KEY_VALUE_STORE_HOST + ':' + process.env.KEY_VALUE_STORE_PORT;
//const keyStoreBaseUrl = 'http://localhost' + ':' + 7480;
const keyStoreGetUrl = keyStoreBaseUrl + '/get';
const keyStoreSetUrl = keyStoreBaseUrl + '/set';

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
    res.render('index', {items: mapEntriesToString(await getMap())});
});

/**
 * Set method
 * */
app.post('/set', async function (req, res) {
    await setValue(req.body.set_text_key, req.body.set_text_value);

    return res.redirect('/');
});

/**
 * Increment method
 * */
app.post('/increment', async function (req, res) {
    const key = req.body.increment_text_key;
    const map = await getMap();

    if (map.has(key)) {
        const previous = map.get(key);

        await setValue(key, Number(map.get(key)) + 1);
        console.log("(" + key + ") key incremented: " + previous + "-->" + (Number(previous) + 1));
    }

    return res.redirect('/');
});

/**
 * Decrement method
 * */
app.post('/decrement', async function (req, res) {
    const key = req.body.decrement_text_key;
    const map = await getMap();

    if (map.has(key)) {
        const previous = map.get(key);

        await setValue(key, Number(map.get(key)) - 1);
        console.log("(" + key + ") key decremented: " + previous + "-->" + (Number(previous) - 1));
    }

    return res.redirect('/');
});

/**
 * Async function to get the map form the key-store
 * */
async function getMap() {
    let res;
    await axios
        .get(keyStoreGetUrl, {}).then(response => res = new Map(response.data)
        ).catch(error => {
            console.error(error);
            res = null;
        })

    console.log(res);

    return res;
}

/**
 * Async function to set key in the key-store
 * */
async function setValue(key, value) {
    await axios
        .post(keyStoreSetUrl, {
            "key": key,
            "value": value
        }).then(response => console.log(response.data)
        ).catch(error => console.error(error))
}

/**
 * Converts map to Array
 * */
function mapEntriesToString(data) {
    return Array
        .from(data.entries(), ([k, v]) => `{${k}:${v}}`)
        .join(" ; ");
}

app.listen(process.env.PORT || 8080, () => {
    console.log("Node server started");
});