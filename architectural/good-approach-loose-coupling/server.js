const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const axios = require('axios');
const client = axios.create({
    //baseURL: 'http://' + process.env.KEY_VALUE_STORE_HOST + ':' + process.env.KEY_VALUE_STORE_PORT
    //baseURL: 'http://localhost' + ':' + 7480 //key-value store
    baseURL: 'http://localhost' + ':' + 7280   //queue
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
    res.render('index', {items: await getValues()});
});

/**
 * Set method
 * */
app.post('/set', async function (req, res) {
    await sendTo("set", req.body.set_text_key, req.body.set_text_value);

    return res.redirect('/');
});

/**
 * Delete method
 * */
app.post('/delete', async function (req, res) {
    await sendTo("delete", req.body.delete_text_key, null);

    return res.redirect('/');
});

/**
 * Getter flow
 * */
async function getValues() {
    await sendTo("get", null, null);
    await sleep(2500);
    return await getGetFromFrontendQueue();
}

/**
 * To wait for sync - it could be solved with websocket or many other features.
 * */
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

/**
 * Get message from frontend queue
 * */
async function getGetFromFrontendQueue() {
    let res;
    await client.get('/getFromFrontendQueue'
    ).then(response => res = response.data
    ).catch(error => {
        console.error(error.message);
        res = null;
    })

    return res.data;
}

/**
 * Push message to backend queue
 * */
function sendTo(action, key, value) {
    client.post('/pushToBackendQueue', {
        "action": action,
        "key": key,
        "value": value
    }).catch(error => {
        console.error(error.message);
    })
}

app.listen(process.env.PORT || 8080, () => {
    console.log("Node server started");
});