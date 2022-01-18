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
    map.set(key, req.body.set_text_value);

    console.log("(" + key + ") key set: " + previous + "-->" + map.get(key));
    return res.redirect('/');
});

/**
 * Abs method
 * */
app.post('/abs', function (req, res) {
    const key = req.body.abs_text_key;
    let previous;

    if (map.has(key)) {
        previous = map.get(key);
        map.set(key, Math.abs(map.get(key)));
    }

    console.log("(" + key + ") key abs: " + previous + "-->" + map.get(key));
    return res.redirect('/');
});

/**
 * Delete method
 * */
app.post('/delete', function (req, res) {
    const key = req.body.delete_text_key;
    let previous;

    if (map.has(key)) {
        previous = map.get(key);
        map.delete(key);
    }

    console.log("(" + key + ") key deleted: " + previous);
    return res.redirect('/');
});

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