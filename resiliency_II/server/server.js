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
 * Delete method
 * */
app.post('/delete', async function (req, res) {
    const key = req.body.delete_text_key;
    const map = await getMap();

    if (map.has(key)) {
        const previous = map.get(key);

        await deleteKey(key);
        console.log("(" + key + ") key deleted: " + previous);
    }

    return res.redirect('/');
});

/**
 * Async function to get the map form the key-store
 * */
async function getMap() {
    return await client.get('/get').then(response => {
            const result = new Map(response.data)
            console.log(result)
            return result;
        }
    ).catch(error => {
        console.error(error.message);
        return null;
    })
}

/**
 * Async function to set key in the key-store
 * */
async function setValue(key, value) {
    await client.post('/set', {
        "key": key,
        "value": value
    }).then(response => console.log(response.data)
    ).catch(error => {
        console.error(error.message);
    });
}

/**
 * Async function to set key in the key-store
 * */
async function deleteKey(key) {
    await client.post('/delete', {
        "key": key
    }).then(response => console.log(response.data)
    ).catch(error => {
        console.error(error.message);
    });
}

/**
 * Converts map to Array
 * */
function mapEntriesToString(data) {
    if (data === null) {
        return;
    }

    return Array
        .from(data.entries(), ([k, v]) => `{${k}:${v}}`)
        .join(" ; ");
}

app.listen(process.env.PORT || 8080, () => {
    console.log("Node server started");
});