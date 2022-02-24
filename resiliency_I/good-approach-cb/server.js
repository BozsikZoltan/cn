"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const circuit_breaker_1 = require("./circuit-breaker");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const axios = require('axios');
const client = axios.create({
    baseURL: 'http://' + process.env.KEY_VALUE_STORE_HOST + ':' + process.env.KEY_VALUE_STORE_PORT
    //baseURL: 'http://localhost' + ':' + 7480
});
const breaker = new circuit_breaker_1.CircuitBreaker({ minFailedRequestThreshold: 2 });
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
app.get('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.render('index', { items: mapEntriesToString(yield getMap()) });
    });
});
/**
 * Set method
 * */
app.post('/set', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield withCircuitBreaker(setValue, req.body.set_text_key, req.body.set_text_value);
        return res.redirect('/');
    });
});
/**
 * Increment method
 * */
app.post('/delete', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const key = req.body.delete_text_key;
        const map = yield getMap();
        if (map.has(key)) {
            const previous = map.get(key);
            yield withCircuitBreaker(deleteKey, key);
            console.log("(" + key + ") key deleted: " + previous);
        }
        return res.redirect('/');
    });
});
/**
 * Async function to get the map form the key-store
 * */
function getMap() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield withCircuitBreaker(getFunction);
        if (result === null || result === undefined) {
            return new Map();
        }
        // @ts-ignore
        const map = new Map(result.data);
        console.log(map);
        return map;
    });
}
/**
 * Async function to get the map form the key-store
 * */
function getFunction() {
    return client.get('/get')
        .then();
}
/**
 * Async function to set key in the key-store
 * */
function setValue(key, value) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Set value invoked! key: ' + key + '; value: ' + value);
        yield client.post('/set', {
            "key": key,
            "value": value
        }).then();
    });
}
/**
 * Async function to set key in the key-store
 * */
function deleteKey(key) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Delete key invoked! ' + key);
        yield client.post('/delete', {
            "key": key
        }).then();
    });
}
/**
 * Generic method for calling with circuit breaker strategy
 *
 * @param func: the method what we want to invoke
 * @param args: the parameters for the func
 * */
function withCircuitBreaker(func, ...args) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield breaker.fire(func, ...args).then().catch(null);
    });
}
/**
 * Converts map to Array
 * */
function mapEntriesToString(data) {
    if (data === null || data === undefined) {
        return;
    }
    return Array
        .from(data.entries(), ([k, v]) => `{${k}:${v}}`)
        .join(" ; ");
}
app.listen(process.env.PORT || 8080, () => {
    console.log("Node server started");
});
