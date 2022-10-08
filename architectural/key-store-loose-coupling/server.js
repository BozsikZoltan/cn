const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const schedule = require('node-schedule');
const axios = require('axios');
const client = axios.create({
    //baseURL: 'http://' + process.env.KEY_VALUE_STORE_HOST + ':' + process.env.KEY_VALUE_STORE_PORT
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

app.use(bodyParser.json())

/**
 * Storage
 * */
const map = new Map();

/**
 * Action router
 * */
function performAction(res) {
    const key = res.key;
    const value = res.value;
    const action = res.action;

    if (action === "set") {
        actionSet(key, value);
    } else if (action === "get") {
        actionGet();
    } else if (action === "delete") {
        actionDelete(key);
    }
}

/**
 * Function for get action
 * */
function actionGet() {
    console.log("Get invoked!")
    sendTo(mapEntriesToString());
}

/**
 * Function for set action
 * */
function actionSet(key, value) {
    console.log("Set invoked!")
    if (key === null || value === null) {
        return;
    }
    let previous;

    if (map.has(key)) {
        previous = map.get(key);
    }

    map.set(key, value);

    console.log("(" + key + ") key set: " + previous + "-->" + map.get(key));
}

/**
 * Function for delete action
 * */
function actionDelete(key) {
    console.log("Delete invoked!")
    let previous;

    if (map.has(key)) {
        previous = map.get(key);
        map.delete(key);
        console.log("(" + key + ") key delete: " + previous);
    }
}

/**
 * Converts map to Array
 * */
function mapEntriesToString() {
    return Array
        .from(map.entries(), ([k, v]) => `{${k}:${v}}`)
        .join(" ; ");
}

/**
 * Push message to frontend queue
 * */
async function sendTo(data) {
    await client.post('/pushToFrontendQueue', {"data": data}
    ).catch(error => {
        console.error(error.message);
    })
}

/**
 * Get message from backend queue
 * */
async function getFromFrontendQueue() {
    let res;
    await client.get('/getFromBackendQueue'
    ).then(response => res = response.data
    ).catch(error => {
        console.error(error.message);
        res = null;
    })

    return res;
}

/**
 * Async method to check tasks
 * */
schedule.scheduleJob('*/1 * * * * *', async function () {
    let res = await getFromFrontendQueue();

    if (res !== undefined && res !== "" && res !== null) {
        performAction(res);
    }
});

app.listen(process.env.PORT || 7480, () => {
    console.log("Node server started");
});