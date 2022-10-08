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

app.use(bodyParser.json())

/**
 * Storage
 * *///https://www.sitepoint.com/implement-task-queue-node-js/
const frontendQueue = [];
const backendQueue = [];

/**
 * Get method
 * */
app.get('/getFromBackendQueue', (req, res) => {
    console.log("Removing value from backend queue");
    res.send(backendQueue.shift());
});
/**
 * Get method
 * */
app.get('/getFromFrontendQueue', (req, res) => {
    console.log("Removing value from frontend queue");
    res.send(frontendQueue.shift());
});

/**
 * Set method
 * */
app.post('/pushToBackendQueue', function (req) {
    console.log("Adding value: " + req.body.toString() + " to backend queue");
    backendQueue.push(req.body);
});
/**
 * Set method
 * */
app.post('/pushToFrontendQueue', function (req) {
    console.log("Adding value: " + req.body.toString() + " to frontend queue");
    frontendQueue.push(req.body);
});


app.listen(process.env.PORT || 7280, () => {
    console.log("Node server started");
});