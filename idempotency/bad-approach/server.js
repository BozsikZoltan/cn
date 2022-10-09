const express = require("express");
const bodyParser = require("body-parser");
const app = express();

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
 * Storage
 * */
const map = new Map();

/**
 * Set method
 * */
app.post('/set', function (req, res) {
    const key = req.body.set_text_key;
    let previous;

    if (map.has(key)) {
        previous = map.get(key);
    }
    map.set(key, generateBetween(0, 100));

    console.log("(" + key + ") key set: " + previous + "-->" + map.get(key));
    return res.redirect('/');
});

/**
 * Increment method
 * */
app.post('/increment', function (req, res) {
    const key = req.body.increment_text_key;

    if (map.has(key)) {
        const previous = map.get(key);

        map.set(key, map.get(key) + 1);
        console.log("(" + key + ") key incremented: " + previous + "-->" + map.get(key));
    }

    return res.redirect('/');
});

/**
 * Decrement method
 * */
app.post('/decrement', function (req, res) {
    const key = req.body.decrement_text_key;

    if (map.has(key)) {
        const previous = map.get(key);

        map.set(key, map.get(key) - 1);
        console.log("(" + key + ") key decremented: " + previous + "-->" + map.get(key));
    }

    return res.redirect('/');
});

/**
 * Generator method for the setter
 * */
function generateBetween(min, max) {
    return Math.floor(
        Math.random() * (max - min) + min);
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
 * Get method
 * */
app.get('/', (req, res) => {
    res.body = {items: mapEntriesToString()};
    res.render('index', {items: mapEntriesToString()});
});

app.listen(process.env.PORT || 8080, () => {
    console.log("Node server started");
});