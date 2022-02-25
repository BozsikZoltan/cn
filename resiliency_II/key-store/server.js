const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const rateLimit = require("express-rate-limit");

const limit = rateLimit({
    windowMs: process.env.WINDOW_SIZE_IN_MINUTE * 60 * 1000, // WINDOW_SIZE_IN_MINUTE minutes
    max: process.env.REQUEST_PER_WINDOW, // Limit each IP to REQUEST_PER_WINDOW requests per `window` (here, per WINDOW_SIZE_IN_MINUTE minutes). If it's 1 then its debounce
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

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

// Apply the rate limiting middleware to all requests
app.use(limit);

/**
 * Storage
 * */
const map = new Map();

/**
 * Get method
 * */
app.get('/get', (req, res) => {
    res.end(JSON.stringify(Array.from(map.entries())));
});

/**
 * Set method
 * */
app.post('/set', function (req, res) {
    const key = req.body.key;
    const value = req.body.value;
    let previous;

    if (key === null || value === null) {
        res.end(mapEntriesToString());
    }

    if (map.has(key)) {
        previous = map.get(key);
    }

    map.set(key, value);

    console.log("(" + key + ") key set: " + previous + "-->" + map.get(key));
    res.end(mapEntriesToString());
});

/**
 * Delete method
 * */
app.post('/delete', function (req, res) {
    const key = req.body.key;
    let previous;

    if (map.has(key)) {
        previous = map.get(key);
        map.delete(key)
        console.log("(" + key + ") key delete: " + previous);
    }

    res.end();
});

/**
 * Converts map to Array
 * */
function mapEntriesToString() {
    return Array
        .from(map.entries(), ([k, v]) => `{${k}:${v}}`)
        .join(" ; ");
}

app.listen(process.env.PORT || 7480, () => {
    console.log("Node server started");
});