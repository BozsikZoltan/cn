const express = require("express");
const bodyParser = require("body-parser");
const redis = require("redis");
const app = express();
const redisPort = 6379
const client = redis.createClient(redisPort);

app.set('view engine', 'html');

app.engine('html', require('ejs').renderFile);

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({
    extended: true
}));

client.on("error", (err) => {
    console.log(err);
})

/**
 * Delete method
 * */
/*client.del('cloud-native:immutability', function(err, reply) {
    console.log(reply); // if deleted --> 1 else 0
});*/

/**
 * Add method
 * */
app.post('/', function (req, res) {
    client.rpush(['cloud-native:immutability', req.body.random_text], function (err, reply) {
        console.log(reply); //Logs the array size
    });
    return res.redirect('/')
});

/**
 * Get method
 * */
app.get('/', (req, res) => {
    client.lrange('cloud-native:immutability', 0, -1, function (err, reply) {
        res.render('index', {items: reply});
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Node server started");
});