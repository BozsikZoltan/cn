const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const routes = require('./routes/domain');

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
 * Entry point
 * */
app.use('/', routes);

app.listen(process.env.PORT || 8080, () => {
    console.log("Node server started");
});